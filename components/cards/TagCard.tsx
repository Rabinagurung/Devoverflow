import Image from "next/image";
import Link from "next/link";
import React, { MouseEvent } from "react";

import ROUTES from "@/constants/routes";
import { cn, getDevIconClassName, getTechDescription } from "@/lib/utils";

import { Badge } from "../ui/badge";

interface TagCardProps {
  _id: string;
  name: string;
  questions?: number;
  showCount?: boolean;
  compact?: boolean;
  isButton?: boolean;
  remove?: boolean;
  onDelete?: () => void;
}

const TagCard = ({
  _id,
  name,
  questions,
  showCount,
  isButton,
  onDelete,
  remove,
  compact,
}: TagCardProps) => {

  console.log({name})
  const iconClass = getDevIconClassName(name);
  const iconDescription = getTechDescription(name);

  const handleButtonClick = (e: MouseEvent) => {
    e.preventDefault();
  };

  const tagContent = (
    <>
      <Badge className="subtle-medium background-light800_dark300 text-light400_light500 flex gap-2 rounded-md border-none px-4 py-2 uppercase">
        <div className="flex-center space-x-2">
          <i className={`${iconClass} text-sm`}></i>
          <span>{name}</span>
        </div>
        {remove && (
          <Image
            src="/icons/close.svg"
            height={12}
            width={12}
            alt="close icon"
            onClick={onDelete}
            className="cursor-pointer object-contain invert-0 dark:invert"
          />
        )}
      </Badge>

      {showCount && (
        <p className="small-medium text-dark500_light700 font-inter">
          {questions}+
        </p>
      )}
    </>
  );

  if (compact) {
    if (isButton) {
      return (
        <button onClick={handleButtonClick} className="">
          {tagContent}
        </button>
      );
    } else {
      return (
        <Link
          href={ROUTES.TAG(_id)}
          className="flex items-center justify-between"
        >
          {tagContent}
        </Link>
      );
    }
  }

  return (
    <Link href={ROUTES.TAG(_id)} className="shadow-light100_darknone">
      <article
        className="flex flex-col w-full py-10 px-[30px] border rounded-lg light-border 
      background-light900_dark200 sm:w-[260px]"
      >
        <div className="flex items-center justify-between gap-3">
          <div
            className="py-1.5 px-5 border-1 rounded-sm border-light-800 dark:border-none 
        background-light800_dark400 w-fit"
          >
            <p className="text-dark300_light900 paragraph-semibold">{name}</p>
          </div>
          <i className={cn(iconClass, "text-2xl")} aria-hidden="true" />
        </div>

        <p className="small-regular text-dark500_light700 mt-5  w-full line-clamp-3">
         {iconDescription}
        </p>

        <p className="text-dark400_light500 small-medium mt-3.5">
          <span className="body-semibold primary-text-gradient mr-2.5">
            {questions}+
          </span>
          Questions
        </p>
      </article>
    </Link>
  );
};

export default TagCard;
