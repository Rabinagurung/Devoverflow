import ROUTES from "@/constants/routes";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import TagCard from "../cards/TagCard";

const hotQuestions = [
  { _id: "1", title: "How to create a custom hook in React?" },
  { _id: "2", title: "How to use React Query?" },
  { _id: "3", title: "How to use Redux?" },
  { _id: "4", title: "How to use React Router?" },
  { _id: "5", title: "How to use React Context?" },
];

const popularTags = [
  { _id: "1", name: "react", questions: 100 },
  { _id: "2", name: "javascript", questions: 200 },
  { _id: "3", name: "typescript", questions: 150 },
  { _id: "4", name: "nextjs", questions: 50 },
  { _id: "5", name: "react-query", questions: 75 },
];

const RightSideBar = () => {
  return (
    <section
      className="flex flex-col max-xl:hidden background-light900_dark200 w-[350px] h-screen border-l light-border
     shadow-light-300 dark:shadow-none pt-36 p-6 custom-scrollbar sticky top-0 right-0 overflow-y-auto"
    >
      <div>
        <h3 className="h3-bold font-inter text-dark200_light900">
          Top Questions
        </h3>
        <div className="flex flex-col mt-7 gap-[30px] w-full">
          {hotQuestions.map(({ _id, title }) => (
            <Link
              href={ROUTES.QUESTIONS(_id)}
              key={_id}
              className="flex cursor-pointer hover:underline items-center justify-between gap-7"
            >
              <p className="body-medium text-dark500_light700">{title}</p>
              <Image
                src="/icons/chevron-right.svg"
                alt="chevron"
                width={20}
                height={20}
                className="invert-colors"
              />
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-16">
        <h3 className="h3-bold font-inter text-dark200_light900">
          Popular Tags
        </h3>
        <div className="flex flex-col mt-7 gap-4">
          {popularTags.map((tag) => (
            <TagCard
              key={tag._id}
              id={tag._id}
              name={tag.name}
              questions={tag.questions}
              showCount={true}
              compact={true}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RightSideBar;
