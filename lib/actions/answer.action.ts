"use server";

import mongoose from "mongoose";
import { revalidatePath } from "next/cache";

import ROUTES from "@/constants/routes";
import { Question } from "@/database";
import Answer, { IAnswerDoc } from "@/database/answer.model";
import { ErrorResponse } from "@/types/globales";

import action from "../handlers/action";
import handleError from "../handlers/error";
import { AnswerParamsSchema } from "../validations";

export async function createAnswer(
  params: CreateAnswerParams,
): Promise<ActionResponse<IAnswerDoc>> {
  const validationResult = await action({
    params,
    schema: AnswerParamsSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    console.log({ validationResult });
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

    await session.commitTransaction();

    revalidatePath(ROUTES.QUESTIONS(question._id));

    return { success: true, data: JSON.parse(JSON.stringify(newAnswer)) };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}
