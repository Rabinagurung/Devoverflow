import React from "react";

import QuestionCard from "@/components/cards/QuestionCard";
import DataRenderer from "@/components/DataRenderer";
import CommonFilter from "@/components/filter/CommonFilter";
import LocalSearchBar from "@/components/search/LocalSearcBar";
import { CollectionFilters } from "@/constants/filters";
import ROUTES from "@/constants/routes";
import { EMPTY_QUESTIONS } from "@/constants/states";
import { getAllSavedQuestions } from "@/lib/actions/collection.action";

const Collections = async ({ searchParams }: RouteParams) => {
  const { page, pageSize, query, filter } = await searchParams;

  const { success, data, error } = await getAllSavedQuestions({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    filter: filter || "",
    query: query || "",
  });

  const { collection } = data || {};

  return (
    <>
      <h1 className="h1-bold"> Saved Questions</h1>
      <div className="mt-11 flex justify-center max-sm:flex-col sm:items-center gap-5">
        <LocalSearchBar
          route={ROUTES.COLLECTON}
          placeholder="Search questions..."
          imgSrc="/icons/search.svg"
          otherClasses="flex-1"
        />
        <CommonFilter
          filters={CollectionFilters}
          otherClasses="min-h-[56px] sm:min-h-[170px]"
        />
      </div>
      <DataRenderer
        success={success}
        error={error}
        data={collection}
        empty={EMPTY_QUESTIONS}
        render={(collection: Collection[]) => (
          <div className="mt-10 flex w-full flex-col gao-6">
            {collection.map((item) => (
              <QuestionCard key={item._id} question={item.question} />
            ))}
          </div>
        )}
      />
    </>
  );
};

export default Collections;
