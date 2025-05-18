import Link from "next/link";
import { redirect } from "next/navigation";
import { after } from "next/server";
import React from "react";

import TagCard from "@/components/cards/TagCard";
import Preview from "@/components/Editor/Preview";
import AnswerForm from "@/components/forms/AnswerForm";
import Metric from "@/components/Metric";
import UserAvatar from "@/components/UserAvatar";
import ROUTES from "@/constants/routes";
import { getAnswers } from "@/lib/actions/answer.action";
import { getQuestion, incrementViews } from "@/lib/actions/question.action";
import { getFormattedNumber, getTimeStamp } from "@/lib/utils";

const QuestionDetails = async ({ params }: RouteParams) => {
  const { id } = await params;

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
    page: 1,
    pageSize: 10,
    filter: "latest",
  });

  const { title, content, createdAt, tags, author, views, answers } = question;

  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between">
          <div className="flex items-center justify-start gap-1">
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
          <div className="flex items-center justify-end gap-4">Votes</div>
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

      <section className="my-5">
        <AnswerForm questionId={question._id} />
      </section>
    </>
  );
};

export default QuestionDetails;
