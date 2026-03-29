"use client";

import { useSearchParams, useRouter } from "next/navigation";

import { GlobalSearchFilters } from "@/constants/filters";
import { formUrlQuery } from "@/lib/url";

const GlobalFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const typeParams = searchParams.get("type");

  const handleTypeClick = (itemValue: string) => {
    const value = typeParams === itemValue ? null : itemValue;

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "type",
      value,
    });

    router.push(newUrl, { scroll: false });
  };

  return (
    <div className="flex items-center gap-5 px-5">
      <p className="text-dark400_light900 body-medium">Type:</p>
      <div className="flex gap-3">
        {GlobalSearchFilters.map((item) => (
          <button
            type="button"
            key={item.value}
            className={`light-border-2 small-medium rounded-2xl px-5 py-2 capitalize ${
              typeParams === item.value
                ? "bg-primary-500 text-light-900"
                : "background-light700_dark500 text-dark400_light800 hover:text-primary-500 "
            }`}
            onClick={() => handleTypeClick(item.value)}
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GlobalFilter;
