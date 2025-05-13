"use server";

import mongoose, { FilterQuery } from "mongoose";
import { revalidatePath } from "next/cache";

import ROUTES from "@/constants/routes";
import Question, { IQuestionDoc } from "@/database/question.model";
import TagQuestion from "@/database/tag-question.model";
import Tag, { ITagDoc } from "@/database/tag.model";

import action from "../handlers/action";
import handleError from "../handlers/error";
import { NotFoundError, UnauthorizedError } from "../http-error";
import {
  AskAQuestionSchema,
  EditQuestionSchema,
  GetQuestionSchema,
  IncrementViewsSchema,
  PaginatedSearchParamsSchema,
} from "../validations";

export async function createQuestion(
  params: CreateQuestionParams,
): Promise<ActionResponse<Question>> {
  const validationResult = await action({
    params,
    schema: AskAQuestionSchema,
    authorize: true,
  });

  if (validationResult instanceof Error)
    return handleError(validationResult) as ErrorResponse;

  const { title, content, tags } = validationResult.params!;

  console.log(tags);

  const userId = validationResult.session?.user?.id;

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

      if (existingTag) {
        tagsIds.push(existingTag._id);
        tagQuestionsDocs.push({
          tag: existingTag._id,
          question: question._id,
        });
      }
    }

    await TagQuestion.insertMany(tagQuestionsDocs, { session });

    await Question.findByIdAndUpdate(
      question._id,
      {
        $push: { tags: { $each: tagsIds } },
      },
      { session },
    );

    await session.commitTransaction();

    console.log("Create quesiton: ", { question });

    return { success: true, data: JSON.parse(JSON.stringify(question)) };
  } catch (error) {
    await session.abortTransaction();

    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}

export async function editQuestion(
  params: EditQuestionParams,
): Promise<ActionResponse<IQuestionDoc>> {
  const validationResult = await action({
    params,
    schema: EditQuestionSchema,
    authorize: true,
  });

  if (validationResult instanceof Error)
    return handleError(validationResult) as ErrorResponse;

  const { questionId, title, content, tags } = validationResult.params!;

  const userId = validationResult.session?.user?.id;

  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    const question = await Question.findById(questionId).populate("tags");

    console.log(question);

    if (!question) throw new NotFoundError("Question");

    if (question.author.toString() !== userId) throw new UnauthorizedError();

    if (question.title !== title || question.content !== content) {
      question.title = title;
      question.content = content;

      await question.save({ session });
    }

    const newTagQuestionDocs = [];

    const tagsToAdd = tags.filter(
      (tag) =>
        !question.tags.some((t: ITagDoc) =>
          t.name.toLowerCase().includes(tag.toLowerCase()),
        ),
    );

    //const tagsToAdd2 = tags.filter((tag) => question.tags.every((t: ITagDoc) => t.name.toLowerCase().includes(tag.toLowerCase())))

    const tagsToRemove = question.tags.filter((tag: ITagDoc) =>
      tags.every((t) => t.toLowerCase() !== tag.name.toLowerCase()),
    );

    console.log(tagsToRemove);

    //const tagsToRemove2 = question.tags.filter((tag: ITagDoc) => tags.every((t) => t.toLowerCase() !== tag.name.toLowerCase()));

    if (tagsToAdd.length > 0) {
      for (const tag of tagsToAdd) {
        const existingTag = await Tag.findOneAndUpdate(
          { name: { $regex: `^${tag}$`, $options: "i" } },
          {
            $setOnInsert: { name: tag },
            $inc: { question: 1 },
          },
          { upsert: true, new: true, session },
        );

        if (existingTag) {
          newTagQuestionDocs.push({
            tag: existingTag._id,
            question: questionId,
          });
          question.tags.push(existingTag._id);
        }
      }
    }

    if (tagsToRemove.length > 0) {
      const tagIdsToRemove = tagsToRemove.map((tag: ITagDoc) => tag._id);

      await Tag.updateMany(
        { _id: { $in: tagIdsToRemove } },
        { $inc: { questions: -1 } },
        { session },
      );

      await TagQuestion.deleteMany(
        { tag: { $in: tagIdsToRemove }, question: questionId },
        { session },
      );

      question.tags = question.tags.filter((tag: mongoose.Types.ObjectId) =>
        tagIdsToRemove.every(
          (id: mongoose.Types.ObjectId) => !id.equals(tag._id),
        ),
      );
    }

    if (newTagQuestionDocs.length > 0) {
      await TagQuestion.insertMany(newTagQuestionDocs, { session });
    }

    await question.save({ session });
    await session.commitTransaction();

    return { success: true, data: JSON.parse(JSON.stringify(question)) };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}

export async function getQuestion(
  params: GetQuestionParams,
): Promise<ActionResponse<Question>> {
  const validationResult = await action({
    params,
    schema: GetQuestionSchema,
    authorize: true,
  });

  if (validationResult instanceof Error)
    return handleError(validationResult) as ErrorResponse;

  const { questionId } = validationResult.params!;

  try {
    const question = await Question.findById(questionId)
      .populate("tags")
      .populate("author", "_id name image");

    if (!question) throw new Error("Question Not Found");

    return { success: true, data: JSON.parse(JSON.stringify(question)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getQuestions(
  params: PaginatedSearchParams,
): Promise<ActionResponse<{ questions: Question[]; isNext: boolean }>> {
  const valdiatedResult = await action({
    params,
    schema: PaginatedSearchParamsSchema,
  });

  if (valdiatedResult instanceof Error)
    return handleError(valdiatedResult) as ErrorResponse;

  const { page = 1, pageSize = 10, query, filter } = params;

  const skip = (Number(page) - 1) * pageSize;

  const filterQuery: FilterQuery<typeof Question> = {};

  if (filter === "recommended")
    return { success: true, data: { questions: [], isNext: false } };

  if (query) {
    filterQuery.$or = [
      { title: { $regex: `^${query}$`, $options: "i" } },
      { content: { $regex: `^${query}$`, $options: "i" } },
    ];
  }

  let sortCriteria = {};

  switch (filter) {
    case "newest":
      sortCriteria = { createdAt: -1 };
      break;

    case "unanswered":
      filterQuery.answers = 0;
      console.log("2", { filterQuery });
      sortCriteria = { createdAt: -1 };
      break;

    case "popular":
      sortCriteria = { upvotes: -1 };
      break;

    default:
      sortCriteria = { createdAt: -1 };
      break;
  }

  try {
    // throw new Error("Checking error")
    const totalQuestions = await Question.countDocuments(filterQuery);
    console.log({ totalQuestions });
    const questions = await Question.find(filterQuery)
      .populate("tags", "name")
      .populate("author", "name image")
      .lean()
      .skip(skip)
      .sort(sortCriteria)
      .limit(Number(pageSize));

    console.log({ questions });

    const isNext = totalQuestions > skip + questions.length;

    console.log({ isNext });

    return {
      success: true,
      data: { questions: JSON.parse(JSON.stringify(questions)), isNext },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function incrementViews(
  params: IncrementViewsParams,
): Promise<ActionResponse<{ views: string }>> {
  const validationResult = await action({
    params,
    schema: IncrementViewsSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { questionId } = validationResult.params!;

  try {
    const question = await Question.findById(questionId);

    if (!question) {
      throw new Error("Question not found");
    }

    question.views += 1;

    await question.save();

    revalidatePath(ROUTES.QUESTIONS(questionId));

    return { success: true, data: JSON.parse(JSON.stringify(question.views)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
