"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

import { removeKeysFromUrlParams, formUrlQuery } from "@/lib/url";
import { cn } from "@/lib/utils";

import { Button } from "../ui/button";

const filters = [
  { name: "Newest", value: "newest" },
  { name: "Popular", value: "popular" },
  { name: "Unanswered", value: "unanswered" },
  { name: "Recommended", value: "recommended" },
];

const HomeFilter = () => {
  const searchParams = useSearchParams();
  const filterParmas = searchParams.get("filter") || "";
  const router = useRouter();
  const [active, setActive] = useState(filterParmas);

  // Do we again need use effect to track the changes
  const handleButtonClick = (filter: string) => {
    let newUrl = "";
    if (filter === active) {
      setActive("");
      newUrl = removeKeysFromUrlParams({
        params: filterParmas.toString(),
        keysToRemove: ["filter"],
      });
    } else {
      setActive(filter);
      newUrl = formUrlQuery({
        params: filterParmas.toString(),
        key: "filter",
        value: filter,
      });
    }

    router.push(newUrl);
  };

  return (
    <div className="mt-10 hidden flex-wrap sm:flex gap-3">
      {filters.map((filter) => (
        <Button
          key={filter.name}
          onClick={() => handleButtonClick(filter.value)}
          className={cn(
            `body-medium rounded-lg shadow-none px-6 py-3 `,
            active === filter.value
              ? "text-primary-500 bg-primary-100 hover:bg-primary-100 dark:bg-dark-400 dark:text-primary-500 dark:hover:bg-dark-400"
              : "text-light500_light500 background-light800_dark300 hover:bg-light-800 dark:hover:bg-dark-300",
          )}
        >
          {filter.name}
        </Button>
      ))}
    </div>
  );
};

export default HomeFilter;
