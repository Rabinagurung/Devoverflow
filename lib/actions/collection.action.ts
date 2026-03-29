"use server";

import { PipelineStage } from "mongoose";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import ROUTES from "@/constants/routes";
import { Collection, Question } from "@/database";

import action from "../handlers/action";
import handleError from "../handlers/error";
import {
  CollectionBaseSchema,
  PaginatedSearchParamsSchema,
} from "../validations";

export async function toggleSaveQuestion(
  params: CollectionBaseParams,
): Promise<ActionResponse<{ saved: boolean }>> {
  const validationResult = await action({
    params,
    schema: CollectionBaseSchema,
    authorize: true,
  });

  if (validationResult instanceof Error)
    return handleError(validationResult) as ErrorResponse;

  const { questionId } = validationResult.params!;
  const userId = validationResult.session?.user?.id;

  try {
    const question = await Question.findById(questionId);
    if (!question) throw new Error("Question not found");

    const collection = await Collection.findOne({
      author: userId,
      question: questionId,
    });

    if (collection) {
      await Collection.findByIdAndDelete(collection._id);
      revalidatePath(ROUTES.QUESTION(questionId));

      return { success: true, data: { saved: false } };
    }

    await Collection.create({
      question: questionId,
      author: userId,
    });

    // after(async () => {
    //   await createInteraction({
    //     action: "bookmark",
    //     actionTarget: "question",
    //     actionId: questionId,
    //     authorId: userId as string,
    //   });
    // });

    revalidatePath(ROUTES.QUESTION(questionId));

    return { success: true, data: { saved: true } };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function hasSavedQuestion(
  params: CollectionBaseParams,
): Promise<ActionResponse<{ hasSaved: boolean }>> {
  const validationResult = await action({
    params,
    schema: CollectionBaseSchema,
    authorize: true,
  });

  if (validationResult instanceof Error)
    return handleError(validationResult) as ErrorResponse;

  const { questionId } = validationResult.params!;
  const userId = validationResult.session?.user?.id;

  try {
    const collection = await Collection.findOne({
      author: userId,
      question: questionId,
    });

    return { success: true, data: { hasSaved: !!collection } };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getAllSavedQuestions(
  params: PaginatedSearchParams,
): Promise<ActionResponse<{ collection: Collection[]; isNext: boolean }>> {
  const validationResult = await action({
    params,
    schema: PaginatedSearchParamsSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  if (!validationResult.session) {
    return {
      success: false,
      data: {
        collection: [],
        isNext: false,
      },
    };
  }
  const userId = validationResult.session?.user?.id;

  const { page = 1, pageSize = 10, query, filter } = params;

  const skip = (Number(page) - 1) * pageSize;

  const sortOptions: Record<string, Record<string, 1 | -1>> = {
    mostrecent: { "question.createdAt": -1 },
    oldest: { "question.createdAt": 1 },
    mostvoted: { "question.upvotes": -1 },
    mostviewed: { "question.views": -1 },
    mostanswered: { "question.answers": -1 },
  };

  const sortCriteria = sortOptions[filter as keyof typeof sortOptions] || {
    "question.createdAt": -1,
  };

  try {
    const basePipeline: PipelineStage[] = [
      { $match: { author: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "questions",
          localField: "question",
          foreignField: "_id",
          as: "question",
        },
      },
      { $unwind: "$question" },
      {
        $lookup: {
          from: "users",
          localField: "question.author",
          foreignField: "_id",
          as: "question.author",
        },
      },
      { $unwind: "$question.author" },
      {
        $lookup: {
          from: "tags",
          localField: "question.tags",
          foreignField: "_id",
          as: "question.tags",
        },
      },
    ];

    if (query) {
      const q = query.trim();
      basePipeline.push({
        $match: {
          $or: [
            { "question.title": { $regex: q, $options: "i" } },
            { "question.content": { $regex: q, $options: "i" } },
          ],
        },
      });
    }

    const docs = await Collection.aggregate([
      ...basePipeline,
      { $sort: sortCriteria },
      { $skip: skip },
      { $limit: pageSize },
      { $project: { question: 1, author: 1 } },
    ]);

    const [{ total = 0 } = {}] = await Collection.aggregate([
      ...basePipeline,
      { $count: "total" },
    ]);

    return {
      success: true,
      data: {
        collection: JSON.parse(JSON.stringify(docs as Collection[])),
        isNext: total > skip + docs.length,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
