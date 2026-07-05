import { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

import QuestionCard from "@/components/cards/QuestionCard";
import DataRenderer from "@/components/DataRenderer";
import CommonFilter from "@/components/filter/CommonFilter";
import HomeFilter from "@/components/filter/HomeFilter";
import Pagination from "@/components/Pagination";
import LocalSearcBar from "@/components/search/LocalSearcBar";
import { Button } from "@/components/ui/button";
import { HomePageFilters } from "@/constants/filters";
import ROUTES from "@/constants/routes";
import { EMPTY_QUESTIONS } from "@/constants/states";
import { getQuestions } from "@/lib/actions/question.action";

export const metadata: Metadata = {
  title: "Dev Overflow | Home",
  description:
    "Discover different programming questions and answers with recommendations from the community.",
};

const Home = async ({ searchParams }: RouteParams) => {
  const { page, pageSize, query, filter } = await searchParams;

  const { success, data, error } = await getQuestions({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query,
    filter,
  });

  const { questions, isNext } = data || {};

  return (
    <>
      <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row">
        <h1 className="h1-bold text-dark100_light900">Ask Questions</h1>
        <Button
          className="primary-gradient paragraph-semibold min-h-[45px] rounded-2 px-4 py-3 !text-light-900 "
          asChild
        >
          <Link href={ROUTES.ASK_QUESTION}>Ask a Question</Link>
        </Button>
      </section>

      <section className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center ">
        <LocalSearcBar
          route="/"
          imgSrc="/icons/search.svg"
          placeholder="Search for Questions Here..."
          iconPosition="left"
          otherClasses="flex-1"
        />
        <CommonFilter
          filters={HomePageFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        />
      </section>
      <HomeFilter />
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
      <Pagination page={page} isNext={isNext || false} />
      <Script
        src="https://echo-web-eight-umber.vercel.app/embed.js"
        data-organization-id={process.env.NEXT_PUBLIC_ORG_ID || ""}
        data-primary-color="#FF7000"
        strategy="lazyOnload"
      />
    </>
  );
};

export default Home;
