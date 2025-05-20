import Link from "next/link";
import React from "react";

import ROUTES from "@/constants/routes";
import { getTimeStamp } from "@/lib/utils";

import Preview from "../Editor/Preview";
import UserAvatar from "../UserAvatar";

const AnswerCard = ({ content, author, createdAt }: Answer) => {
  return (
    <article className="border-b py-10">
      {/* <span id={`answer-${_id}`} className="bg-purple-300 hash-span" /> */}
      <div className="flex flex-col-reverse mb-6 justify-between gap-5 sm:items-center sm:flex-row sm:gap-2">
        <div className="flex flex-1 items-start  gap-1 sm:items-center ">
          <UserAvatar
            id={author._id}
            name={author.name}
            imageUrl={author.image}
            className="size-5 rounded-full object-cover max-sm:mt-2"
          />
          <Link
            href={ROUTES.PROFILE(author._id)}
            className="flex flex-col max-sm:ml-1 sm:flex-row sm:items-center"
          >
            <p className="body-semibold text-dark300_light700">
              {author.name ?? "Anonymous"}
            </p>
            <p className="small-regular text-light400_light500 ml-0.5 max-sm:mt-0.5 line-clamp-1">
              <span className="max-sm:hidden"> • </span> answered{" "}
              {getTimeStamp(new Date(createdAt))}
            </p>
          </Link>
        </div>
        <div className="flex justify-end">Votes</div>
      </div>
      <Preview content={content} />
    </article>
  );
};

export default AnswerCard;
