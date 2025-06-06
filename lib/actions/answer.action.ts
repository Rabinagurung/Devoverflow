"use server";

import { error } from "console";

import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import { after } from "next/server";

import ROUTES from "@/constants/routes";
import { Question, Vote } from "@/database";
import Answer, { IAnswerDoc } from "@/database/answer.model";

import action from "../handlers/action";
import handleError from "../handlers/error";
import {
  AnswerParamsSchema,
  DeleteAnswerSchema,
  GetAnswersSchema,
} from "../validations";
import { createInteraction } from "./interaction.action";

export async function createAnswer(
  params: CreateAnswerParams,
): Promise<ActionResponse<IAnswerDoc>> {
  const validationResult = await action({
    params,
    schema: AnswerParamsSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { questionId, content } = validationResult.params!;
  const userId = validationResult.session?.user?.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const question = await Question.findById(questionId);

    if (!question) throw new Error("Question Not Found");

    const [newAnswer] = await Answer.create(
      [
        {
          author: userId,
          question: question._id,
          content,
        },
      ],
      { session },
    );

    if (!newAnswer) throw new Error("Failed to create answer");

    question.answers += 1;

    await question.save({ session });

    after(async () => {
      await createInteraction({
        action: "post",
        actionTarget: "answer",
        actionId: newAnswer._id.toString(),
        authorId: userId as string,
      });
    });

    await session.commitTransaction();

    revalidatePath(ROUTES.QUESTION(question._id));

    return { success: true, data: JSON.parse(JSON.stringify(newAnswer)) };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}

export async function getAnswers(params: GetAnswersParmas): Promise<
  ActionResponse<{
    totalAnswers: number;
    isNext: boolean;
    answers: Answer[];
  }>
> {
  const validationResult = await action({ params, schema: GetAnswersSchema });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const {
    questionId,
    page = 1,
    pageSize = 10,
    filter,
  } = validationResult.params!;

  const skip = Number(page - 1) * pageSize;
  const limit = pageSize;

  let sortCriteria = {};

  switch (filter) {
    case "latest":
      sortCriteria = { createdAt: -1 };
      break;

    case "oldest":
      sortCriteria = { createdAt: 1 };
      break;

    case "popular":
      sortCriteria = { upvotes: -1 };
      break;

    default:
      sortCriteria = { createdAt: -1 };
      break;
  }

  try {
    const totalAnswers = await Answer.countDocuments({ question: questionId });

    const answers = await Answer.find({ question: questionId })
      .populate("author", "_id name image")
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);

    const isNext = totalAnswers > skip + answers.length;

    return {
      success: true,
      data: {
        totalAnswers,
        answers: JSON.parse(JSON.stringify(answers)),
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function deleteAnswer(
  params: DeleteAnswerParams,
): Promise<ActionResponse> {
  const validationResult = await action({
    params,
    schema: DeleteAnswerSchema,
    authorize: true,
  });

  if (validationResult instanceof Error)
    return handleError(error) as ErrorResponse;

  const { answerId } = params;

  const userId = validationResult.session?.user?.id;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const answer = await Answer.findById(answerId);
    if (!answer) throw new Error("Answer Not Found");

    if (answer.author.toString() !== userId) throw new Error("Unauthorized");

    // reduce the question answers count

    await Question.findByIdAndUpdate(
      answer.question,
      {
        $inc: { answers: -1 },
      },
      { new: true, session },
    );

    // delete votes associated with answer
    await Vote.deleteMany({ actionId: answerId, actionType: "answer" }).session(
      session,
    );

    // delete the answer
    await Answer.findByIdAndDelete(answerId).session(session);

    after(async () => {
      await createInteraction({
        action: "delete",
        actionTarget: "answer",
        actionId: answerId,
        authorId: userId as string,
      });
    });

    await session.commitTransaction();

    revalidatePath(`/profile/${userId}`);

    return { success: true };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    session.endSession();
  }
}
