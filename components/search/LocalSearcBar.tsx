"use client";
import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { deleteUrlQuery, formUrlQuery } from "@/lib/url";

interface Props {
  route: string;
  placeholder: string;
  imgSrc: string;
  otherClasses: string;
}

const LocalSearchBar = ({
  route,
  placeholder,
  imgSrc,
  otherClasses,
}: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathName = usePathname();
  const query = searchParams.get("query") || "";

  const [searchQuery, setSearchQuery] = useState(query);

  useEffect(() => {
    const delayDeboundFun = setTimeout(() => {
      if (searchQuery) {
        const newURl = formUrlQuery({
          params: searchParams.toString(),
          key: "query",
          value: searchQuery,
        });

        router.push(newURl, { scroll: false });
      } else {
        if (pathName === route) {
          const newUrl = deleteUrlQuery({
            params: searchParams.toString(),
            keysToRemove: ["query"],
          });

          router.push(newUrl, { scroll: false });
        }
      }
    }, 300);

    return () => clearTimeout(delayDeboundFun);
  }, [router, searchQuery, route, searchParams, pathName]);

  return (
    <div
      className={`flex-center background-light800_darkgradient h-[56px] w-full gap-4 rounded-[10px] border border-light-700 p-4 
    dark:border-none ${otherClasses}`}
    >
      <Image
        src={imgSrc}
        alt="Search"
        height={24}
        width={24}
        className="cursor-pointer"
      />
      <Input
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="text-light400_light500 no-focus paragraph-regular border-none p-0 shadow-none outline-none"
      />
    </div>
  );
};

export default LocalSearchBar;
