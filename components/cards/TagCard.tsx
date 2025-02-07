import Link from "next/link";
import React from "react";
import { Badge } from "../ui/badge";
import ROUTES from "@/constants/routes";
import { getDevIconClassName } from "@/lib/utils";

interface TagCardProps {
  id: string;
  name: string;
  questions?: number;
  showCount?: boolean;
  compact?: boolean;
}

const TagCard = ({ id, name, questions, showCount, compact }: TagCardProps) => {
  const iconName = getDevIconClassName(name);

  return (
    <Link href={ROUTES.TAGS(id)} className="flex items-center justify-between ">
      <Badge className="background-light800_dark300 flex-center gap-1 rounded-md border-none px-4 py-2">
        <i className={`${iconName} text-sm`}></i>
        <p className="subtle-medium font-inter uppercase text-light-400">
          {name}
        </p>
      </Badge>
      {showCount && (
        <p className="small-medium text-dark500_light700 font-inter">
          {questions}+
        </p>
      )}
    </Link>
  );
};

export default TagCard;
