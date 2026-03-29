"use client";

import { ReloadIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { globalSearch } from "@/lib/actions/general.action";

import GlobalFilter from "./filter/GlobalFilter";

type ItemType = "question" | "answer" | "tag" | "user";

interface GlobalSearchedItem {
  id: string;
  title: string;
  type: ItemType;
}

const GlobalResult = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("global");
  const type = (searchParams.get("type") as ItemType) || undefined;

  const [results, setResults] = useState<GlobalSearchedItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchResults = useCallback(async () => {
    if (!query) return;
    setIsLoading(true);

    try {
      const res = await globalSearch({ query, type });
      setResults(res.success ? res.data : []);
    } catch (error) {
      console.log(error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [query, type]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const renderLink = (item: GlobalSearchedItem) => {
    const base = {
      question: `/questions/${item.id}`,
      answer: `/questions/${item.id}`,
      user: `/profile/${item.id}`,
      tag: `tags/${item.id}`,
    } as Record<ItemType, string>;

    return base[item.type];
  };

  return (
    <div className="absolute top-full z-10 mt-3 w-full rounded-xl bg-light-800 py-5 shadow-sm dark:bg-dark-400">
      <GlobalFilter />
      <div className="my-5 h-[1px] bg-light-700/50 dark:bg-dark-500/50" />

      <div className="space-y-5">
        <p className="text-dark400_light900 paragraph-semibold px-5">
          Top Match
        </p>

        {isLoading ? (
          <div className="flex-center flex-col px-5">
            <ReloadIcon className="my-2 h-10 w-10 animate-spin text-primary-500" />
            <p className="text-dark200_light800 body-regular">
              Browsing the whole database..
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {results?.length > 0 ? (
              results?.map((item: GlobalSearchedItem, index) => (
                <Link
                  href={renderLink(item)}
                  key={`${item.type}-${item.id}-${index}`}
                  className="flex w-full cursor-pointer items-start gap-3 px-5 py-2.5 hover:bg-light-700/50 dark:hover:bg-dark-500/50"
                >
                  <Image
                    src="/icons/tag.svg"
                    alt="tags"
                    width={18}
                    height={18}
                    className="invert-colors mt-1 object-contain"
                  />

                  <div className="flex flex-col">
                    <p className="body-medium text-dark200_light800 line-clamp-1">
                      {item.title}
                    </p>
                    <p className="text-light400_light500 small-medium mt-1 font-bold capitalize">
                      {item.type}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="flex-center flex-col px-5">
                <p className="text-dark200_light800 body-regular px-5 py-2.5">
                  No results found
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalResult;
