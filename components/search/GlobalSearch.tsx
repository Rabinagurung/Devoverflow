"use client";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

import { formUrlQuery, removeKeysFromUrlParams } from "@/lib/url";

import GlobalResult from "../GlobalResult";
import { Input } from "../ui/input";

const GlobalSearch = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const query = searchParams.get("global");

  const [search, setSearch] = useState(query || "");
  const [isOpen, setIsOpen] = useState(query || false);
  const searchContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearch("");
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  useEffect(() => {
    const delayDeboundFn = setTimeout(() => {
      if (search) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "global",
          value: search,
        });

        router.push(newUrl, { scroll: false });
      } else if (query) {
        const newUrl = removeKeysFromUrlParams({
          params: searchParams.toString(),
          keysToRemove: ["global", "type"],
        });

        router.push(newUrl, { scroll: false });
      }
    }, 300);

    return () => clearTimeout(delayDeboundFn);
  }, [search, router, query, searchParams, pathname]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    setIsOpen(value !== "");
  };

  return (
    <div className="relative w-full max-w-[600px]" ref={searchContainerRef}>
      <div className="flex grow items-center px-4 border min-h-[56px] rounded-xl background-light800_darkgradient light-border-dark-none">
        <Image
          src="/icons/search.svg"
          width={24}
          height={24}
          alt="Search icon"
          className="cursor-pointer"
        />
        <Input
          type="text"
          value={search}
          placeholder="Search anything globally..."
          onChange={handleInputChange}
          className="border-none shadow-none outline-none no-focus placeholder text-dark400_light700"
        />
      </div>
      {isOpen && <GlobalResult />}
    </div>
  );
};

export default GlobalSearch;
