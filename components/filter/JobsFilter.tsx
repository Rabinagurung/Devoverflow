"use client";

import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formUrlQuery } from "@/lib/url";

import LocalSearchBar from "../search/LocalSearcBar";

interface JobsFilterProps {
  countriesList: Country[];
}

const JobsFilter = ({ countriesList }: JobsFilterProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleUpdateParams = (value: string) => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "location",
      value,
    });

    router.push(newUrl, { scroll: false });
  };

  return (
    <div className="relative mt-11 flex justify-between w-full gap-5 max-sm:flex-col sm:items-center ">
      <LocalSearchBar
        iconPosition="left"
        imgSrc="/icons/job-search.svg"
        route={pathname}
        placeholder="Job Title, Company, or Keywords"
        otherClasses="flex-1 max-sm:w-full"
      />
      <Select onValueChange={handleUpdateParams}>
        <SelectTrigger className="flex items-center gap-3 border p-4 min-h-[54px] sm:max-w-[210px] body-regular light-border background-light800_dark300 text-dark500_light700">
          <Image
            src={"/icons/carbon-location.svg"}
            alt="df"
            height={18}
            width={18}
          />
          <div className="line-clamp-1 flex-1 text-left">
            <SelectValue placeholder="Select Loccation" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {Array.isArray(countriesList) && countriesList.length > 0 ? (
              countriesList.map((country: Country) => (
                <SelectItem
                  key={country.iso2}
                  value={country.name}
                  className="px-4 py-3"
                >
                  {country.name}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="No Results Found">No Results Found</SelectItem>
            )}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default JobsFilter;
