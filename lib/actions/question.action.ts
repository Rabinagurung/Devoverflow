"use server";

import Question from "@/database/question.model";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { AskAQuestionSchema } from "../validations";
import mongoose from "mongoose";
import Tag from "@/database/tag.mode";
import TagQuestion from "@/database/tag-question.model";

async function createQuestion(
  params: CreateQuestionParams,
): Promise<ActionResponse<Question>> {
  const validatesResult = await action({
    params,
    schema: AskAQuestionSchema,
    authorize: true,
  });

  if (validatesResult instanceof Error)
    return handleError(validatesResult) as ErrorResponse;

  const { title, content, tags } = validatesResult.params!;

  const userId = validatesResult.session?.user?.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [question] = await Question.create(
      [{ title, content, author: userId }],
      { session },
    );

    if (!question) throw new Error("Failed to create question");

    const tagsIds: mongoose.Types.ObjectId[] = [];
    const tagQuestionsDocs = [];

    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } },
        { $setOnInsert: { name: tag }, $inc: { questions: 1 } },
        { upsert: true, new: true, session },
      );

      tagsIds.push(existingTag._id);
      tagQuestionsDocs.push({
        tag: existingTag._id,
        question: question._id,
      });
    }

    await TagQuestion.insertMany(tagQuestionsDocs, { session });

    await Question.findByIdAndUpdate(
      question._id,
      {
        $push: { tag: { $$each: tagsIds } },
      },
      { session },
    );

    await session.commitTransaction();

    return { success: true, data: JSON.parse(JSON.stringify(question)) };
  } catch (error) {
    await session.abortTransaction();

    return handleError(error) as ErrorResponse;
  } finally {
    session.endSession();
  }
}

export default createQuestion;
