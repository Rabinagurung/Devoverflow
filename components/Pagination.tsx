"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

import { formUrlQuery } from "@/lib/url";
import { cn } from "@/lib/utils";

import { Button } from "./ui/button";

interface PaginationProps {
  page: string | number | undefined;
  isNext: boolean;
  containerClasses?: string;
}
const Pagination = ({
  page = 1,
  isNext,
  containerClasses,
}: PaginationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleNavigation = (type: "prev" | "next") => {
    const newPage = type === "prev" ? Number(page) - 1 : Number(page) + 1;

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "page",
      value: newPage.toString(),
    });

    router.push(newUrl);
  };

  return (
    <div className={cn("mt-5 w-full flex-center gap-2", containerClasses)}>
      {Number(page) > 1 && (
        <Button
          onClick={() => handleNavigation("prev")}
          className="btn light-border-2 flex-center min-h-[36px] gap-2 border "
        >
          <p className="body-medium text-dark200_light800">Prev</p>
        </Button>
      )}

      <div className="flex-center rounded-md bg-primary-500 px-3.5 py-2">
        <p className="body-semibold text-light-900">{page}</p>
      </div>

      {isNext && (
        <Button
          onClick={() => handleNavigation("next")}
          className="light-border-2 btn flex min-h-[36px] items-center justify-center gap-2 border"
        >
          <p className="body-medium text-dark200_light800">Next</p>
        </Button>
      )}
    </div>
  );
};

export default Pagination;
