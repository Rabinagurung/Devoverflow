"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formUrlQuery } from "@/lib/url";
import { cn } from "@/lib/utils";

interface Filter {
  name: string;
  value: string;
}

interface CommonFilterProps {
  filters: Filter[];
  otherClasses?: string;
  containerClasses?: string;
}
const CommonFilter = ({
  filters,
  otherClasses = "",
  containerClasses = "",
}: CommonFilterProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filterParams = searchParams.get("filter");

  const handleUpdateFilter = (value: string) => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "filter", //location=India
      value,
    });

    router.push(newUrl, { scroll: false });
  };

  return (
    <div className={cn("relative ", containerClasses)}>
      <Select
        onValueChange={handleUpdateFilter}
        defaultValue={filterParams || undefined}
      >
        <SelectTrigger
          className={cn(
            "body-regular no-focus light-border background-light800_dark300 text-dark500_light700 border px-5 py-2.5",
            otherClasses,
          )}
        >
          <div className="line-clamp-1  flex-1 text-left ">
            <SelectValue placeholder="Select a filter" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {filters.map((filter) => (
              <SelectItem key={filter.value} value={filter.value}>
                {filter.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default CommonFilter;
