"use client";

import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

import { formUrlQuery, removeKeysFromUrlParams } from "@/lib/url";

import { Input } from "../ui/input";

interface LocalSearchBarProps {
  route: string;
  placeholder: string;
  imgSrc: string;
  iconPosition?: "right" | "left";
  otherClasses: string;
}

const LocalSearchBar = ({
  route,
  placeholder,
  imgSrc,
  iconPosition = "left",
  otherClasses,
}: LocalSearchBarProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathName = usePathname();
  const query = searchParams.get("query") || "";

  const [searchQuery, setSearchQuery] = useState(query);

  useEffect(() => {
    const delayDebounceFun = setTimeout(() => {
      if (searchQuery) {
        const newURl = formUrlQuery({
          params: searchParams.toString(),
          key: "query",
          value: searchQuery,
        });

        router.push(newURl, { scroll: false });
      } else if (pathName === route) {
        const newUrl = removeKeysFromUrlParams({
          params: searchParams.toString(),
          keysToRemove: ["query"],
        });

        router.push(newUrl, { scroll: false });
      }
    }, 500);

    return () => clearTimeout(delayDebounceFun);
  }, [router, searchQuery, route, searchParams, pathName]);

  const renderIcon = (position: "left" | "right") => (
    <Image
      alt="Search"
      src={imgSrc}
      height={position === "left" ? 24 : 15}
      width={position === "left" ? 24 : 15}
      className="cursor-pointer"
    />
  );

  return (
    <div
      className={`flex items-center flex-1 background-light800_darkgradient min-h-[56px] grow gap-4 rounded-[10px] px-4 
    ${otherClasses}`}
    >
      {iconPosition === "left" && renderIcon("left")}
      <Input
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        aria-label="Search"
        className="line-clamp-1 text-light400_light500 no-focus paragraph-regular placeholder border-none shadow-none outline-none p-0"
      />
      {iconPosition === "right" && renderIcon("right")}
    </div>
  );
};

export default LocalSearchBar;
