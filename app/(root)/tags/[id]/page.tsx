import React from "react";

import QuestionCard from "@/components/cards/QuestionCard";
import DataRenderer from "@/components/DataRenderer";
import LocalSearcBar from "@/components/search/LocalSearcBar";
import { EMPTY_QUESTIONS } from "@/constants/states";
import { getTagQuestion } from "@/lib/actions/tag.action";

const TagDetails = async ({ params, searchParams }: RouteParams) => {
  const { id } = await params;
  const { page, pageSize, query } = await searchParams;

  const { success, data, error } = await getTagQuestion({
    tagId: id,
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query,
  });

  const { questions } = data || {};

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Ask Questions</h1>

      <section className="mt-[30px] w-full">
        <LocalSearcBar
          route="/"
          imgSrc="/icons/search.svg"
          placeholder="Search for Questions Here..."
          otherClasses="flex-1"
        />
      </section>

      <DataRenderer
        success={success}
        data={questions}
        empty={EMPTY_QUESTIONS}
        error={error}
        render={(dataQuestions) =>
          dataQuestions.map((q) => (
            <div className="mt-10 flex w-full flex-col gap-6" key={q._id}>
              <QuestionCard question={q} />
            </div>
          ))
        }
      />
    </>
  );
};

export default TagDetails;
