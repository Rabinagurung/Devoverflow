import Link from "next/link";

import { auth } from "@/auth";
import QuestionCard from "@/components/cards/QuestionCard";
import DataRenderer from "@/components/DataRenderer";
import HomeFilter from "@/components/filter/HomeFilter";
import LocalSearcBar from "@/components/search/LocalSearcBar";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";
import { EMPTY_QUESTIONS } from "@/constants/states";
import { getQuestions } from "@/lib/actions/question.action";

const Home = async ({ searchParams }: RouteParams) => {
  // const session = await auth();

  const { page, pageSize, query = "", filter = "" } = await searchParams;

  const { success, data, error } = await getQuestions({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || "",
    filter: filter || "",
  });

  const { questions } = data || {};

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

      <section className="mt-[30px] w-full">
        <LocalSearcBar
          route="/"
          imgSrc="/icons/search.svg"
          placeholder="Search for Questions Here..."
          otherClasses="flex-1"
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
    </>
  );
};

export default Home;
