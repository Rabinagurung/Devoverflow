import Image from "next/image";
import Link from "next/link";
import React, { MouseEvent } from "react";

import ROUTES from "@/constants/routes";
import { getDevIconClassName } from "@/lib/utils";

import { Badge } from "../ui/badge";

interface TagCardProps {
  id: string;
  name: string;
  questions?: number;
  showCount?: boolean;
  compact?: boolean;
  isButton?: boolean;
  remove?: boolean;
  onDelete?: () => void;
}

const TagCard = ({
  id,
  name,
  questions,
  showCount,
  isButton,
  onDelete,
  remove,
  compact,
}: TagCardProps) => {
  const iconName = getDevIconClassName(name);

  const handleButtonClick = (e: MouseEvent) => {
    e.preventDefault();
  };

  const tagContent = (
    <>
      <Badge className="subtle-medium background-light800_dark300 text-light400_light500 flex gap-2 rounded-md border-none px-4 py-2 uppercase">
        <div className="flex-center space-x-2">
          <i className={`${iconName} text-sm`}></i>
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
          href={ROUTES.TAG(id)}
          className="flex items-center justify-between"
        >
          {tagContent}
        </Link>
      );
    }
  }
};

export default TagCard;
