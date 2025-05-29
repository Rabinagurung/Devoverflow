import Link from "next/link";
import React from "react";

import ROUTES from "@/constants/routes";
import { getTimeStamp } from "@/lib/utils";

import TagCard from "./TagCard";
import Metric from "../Metric";

interface QuestionCardProps {
  question: Question;
}

const QuestionCard = ({
  question: { _id, title, tags, author, createdAt, upvotes, answers, views },
}: QuestionCardProps) => {
  return (
    <div className="card-wrapper rounded-[10px] p-9 sm:px-[45px]">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {getTimeStamp(new Date(createdAt))}
          </span>
          <Link href={ROUTES.QUESTION(_id)}>
            <h3 className="base-semibold sm:h3-semibold text-dark200_light900 line-clamp-1 flex-1">
              {title}
            </h3>
          </Link>
        </div>
      </div>

      <div className="mt-3.5 flex w-full flex-wrap gap-2">
        {tags.map((tag: Tag) => (
          <TagCard
            key={tag._id}
            _id={tag._id as string}
            name={tag.name}
            compact
          />
        ))}
      </div>

      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Metric
          imageUrl={author.image}
          alt={author.name}
          value={author.name}
          href={ROUTES.PROFILE(author._id)}
          textStyles="body-medium text-dark400_light700"
          title={`• asked ${getTimeStamp(createdAt)}`}
          titleStyles="max-sm:hidden"
          isAuthor
        />
        <div className="flex-center gap-3 max-sm:flex-wrap max-sm:justify-start">
          <Metric
            imageUrl="/icons/like.svg"
            value={upvotes}
            alt="Like"
            title="Votes"
            textStyles="small-medium text-dark400_light700"
          />
          <Metric
            imageUrl="/icons/message.svg"
            value={answers}
            alt="Answer"
            title="Answers"
            textStyles="small-medium text-dark400_light700"
          />
          <Metric
            imageUrl="/icons/eye.svg"
            value={views}
            alt="Like"
            title="Views"
            textStyles="small-medium text-dark400_light700"
          />
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;

/*
line-clamp-1 is a CSS utility class (often used in Tailwind CSS) 
to truncate text after one line with an ellipsis (...) if it overflows.

overflow: hidden;
display: -webkit-box;
-webkit-line-clamp: 1;  
-webkit-box-orient: vertical;


overflow: hidden; → Prevents text from overflowing.
display: -webkit-box; → Enables multi-line truncation.
-webkit-line-clamp: 1; → Limits text to 1 line.
-webkit-box-orient: vertical; → Ensures vertical stacking.

*/
