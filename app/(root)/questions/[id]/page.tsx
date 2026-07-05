import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { after } from "next/server";
import React, { Suspense } from "react";

import AllAnswers from "@/components/answer/AllAnswers";
import TagCard from "@/components/cards/TagCard";
import Preview from "@/components/Editor/Preview";
import AnswerForm from "@/components/forms/AnswerForm";
import Metric from "@/components/Metric";
import SaveQuestion from "@/components/question/SaveQuestion";
import UserAvatar from "@/components/UserAvatar";
import Votes from "@/components/votes/Votes";
import ROUTES from "@/constants/routes";
import { getAnswers } from "@/lib/actions/answer.action";
import { hasSavedQuestion } from "@/lib/actions/collection.action";
import { getQuestion, incrementViews } from "@/lib/actions/question.action";
import { hasVoted } from "@/lib/actions/vote.action";
import { getFormattedNumber, getTimeStamp } from "@/lib/utils";

export async function generateMetadata({
  params,
}: RouteParams): Promise<Metadata> {
  const { id } = await params;

  const { success, data: question } = await getQuestion({ questionId: id });

  if (!success || !question) {
    return {
      title: "Question not found",
      description: "This question does not exists",
    };
  }

  return {
    title: question.title,
    description: question.content.slice(0, 100),
    twitter: {
      card: "summary_large_image",
      title: question.title,
      description: question.content.slice(0, 100),
    },
  };
}

const QuestionDetails = async ({ params, searchParams }: RouteParams) => {
  const { id } = await params;
  const { page, pagesize, filter } = await searchParams;

  const { success, data: question } = await getQuestion({ questionId: id });

  after(async () => {
    await incrementViews({ questionId: id });
  });

  if (!success || !question) return redirect("/404");

  const {
    success: areAnswersLoaded,
    data: answersResult,
    error: answersError,
  } = await getAnswers({
    questionId: id,
    page: Number(page) || 1,
    pageSize: Number(pagesize) || 10,
    filter,
  });

  const hasVotedPromise = hasVoted({
    targetId: question._id,
    targetType: "question",
  });

  const hasSavedQuestionPromise = hasSavedQuestion({
    questionId: question._id,
  });

  const {
    _id,
    title,
    content,
    createdAt,
    tags,
    author,
    views,
    answers,
    upvotes,
    downvotes,
  } = question;

  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between">
          <div className="flex items-center justify-start gap-1 ">
            <UserAvatar
              id={author._id}
              name={author.name}
              imageUrl={author.image}
              className="size-[22px]"
              fallbackClassName="text-[10px]"
            />
            <Link href={ROUTES.PROFILE(author._id)}>
              <p className="paragraph-semibold text-dark300_light700">
                {author.name}
              </p>
            </Link>
          </div>
          <div className="flex justify-end items-center gap-4 ">
            <Suspense fallback={<div>Loading votes....</div>}>
              <Votes
                targetId={question._id}
                upvotes={upvotes}
                downvotes={downvotes}
                targetType="question"
                hasVotedPromise={hasVotedPromise}
              />
            </Suspense>
            <Suspense fallback={<div>Loading saving....</div>}>
              <SaveQuestion
                questionId={question._id}
                hasSavedQuestionPromise={hasSavedQuestionPromise}
              />
            </Suspense>
          </div>
        </div>
        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full">
          {title}
        </h2>
      </div>
      <div className="flex flex-wrap gap-4 mb-8 mt-5 ">
        <Metric
          imageUrl="/icons/clock.svg"
          title=""
          alt="clock icon"
          value={`asked ${getTimeStamp(new Date(createdAt))}`}
          textStyles="small-regular text-dark400_light700"
        />

        <Metric
          imageUrl="/icons/message.svg"
          title=""
          alt="Message icon"
          value={answers}
          textStyles="small-regular text-dark400_light700"
        />

        <Metric
          imageUrl="/icons/eye.svg"
          title=""
          alt="Eye icon"
          value={getFormattedNumber(views)}
          textStyles="small-regular text-dark400_light700"
        />
      </div>
      <Preview content={content} />
      <div className="flex flex-wrap gap-2 mt-8">
        {tags.map((tag: Tag) => (
          <TagCard
            key={tag._id}
            _id={tag._id as string}
            name={tag.name}
            compact
          />
        ))}
      </div>
      <section className="my-5 ">
        <AllAnswers
          page={Number(page) || 1}
          isNext={answersResult?.isNext || false}
          success={areAnswersLoaded}
          data={answersResult?.answers}
          error={answersError}
          totalAnswers={answersResult?.totalAnswers || 0}
        />
      </section>
      <section className="my-5">
        <AnswerForm
          questionId={_id}
          questionTitle={title}
          questionContent={content}
        />
      </section>
    </>
  );
};

export default QuestionDetails;
