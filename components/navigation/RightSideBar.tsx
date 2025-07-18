import Image from "next/image";
import Link from "next/link";
import React from "react";

import ROUTES from "@/constants/routes";
import { getHotQuestons } from "@/lib/actions/question.action";
import { getTopTags } from "@/lib/actions/tag.action";

import TagCard from "../cards/TagCard";
import DataRenderer from "../DataRenderer";

const RightSideBar = async () => {
  const [
    {
      success: hotQuestionSuccess,
      data: hotQuestions,
      error: hotQuestionError,
    },
    { success: hotTagSuccess, data: hotTags, error: hotTagError },
  ] = await Promise.all([getHotQuestons(), getTopTags()]);

  return (
    <section className="pt-36 custom-scrollbar background-light900_dark200 light-border sticky right-0 top-0 flex h-screen w-[350px] flex-col gap-6 overflow-y-auto border-l p-6 shadow-light-300 dark:shadow-none max-xl:hidden">
      <div>
        <h3 className="h3-bold text-dark200_light900 font-inter">
          Top Questions
        </h3>
        <DataRenderer
          success={hotQuestionSuccess}
          empty={{
            title: "No questions found",
            message: "No questions have been asked yet.",
          }}
          data={hotQuestions}
          error={hotQuestionError}
          render={(hotQuestions) => (
            <div className="mt-7 flex w-full flex-col gap-[30px]">
              {hotQuestions.map(({ _id, title }) => (
                <Link
                  href={ROUTES.QUESTION(_id)}
                  key={_id}
                  className="flex cursor-pointer items-center justify-between gap-7 hover:underline"
                >
                  <p className="body-medium text-dark500_light700 line-clamp-2">
                    {title}
                  </p>
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
          )}
        />
      </div>

      <div className="mt-16">
        <h3 className="h3-bold text-dark200_light900">Popular Tags</h3>

        <DataRenderer
          success={hotTagSuccess}
          empty={{
            title: "No tags found",
            message: "No tags have been created yet.",
          }}
          data={hotTags}
          error={hotTagError}
          render={(hotTags) => (
            <div className="mt-7 flex flex-col gap-4">
              {hotTags.map((tag) => (
                <TagCard
                  key={tag._id}
                  _id={tag._id}
                  name={tag.name}
                  questions={tag.questions}
                  showCount
                  compact
                />
              ))}
            </div>
          )}
        />
      </div>
    </section>
  );
};

export default RightSideBar;
