import Image from "next/image";
import Link from "next/link";
import React from "react";

import { processJobTitle } from "@/lib/utils";

import Metric from "../Metric";

interface JobCardProps {
  job: Job;
}

interface JobLocationProps {
  job_city?: string;
  job_state?: string;
  job_country?: string;
}

const JobLocation = ({
  job_city,
  job_country,
  job_state,
}: JobLocationProps) => {
  return (
    <div className="flex items-center justify-end gap-2 rounded-2xl px-3 py-1.5 background-light800_dark400">
      <Image
        src={`https://flagsapi.com/${job_country}/flat/64.png`}
        alt="country symbol"
        width={16}
        height={16}
        className="rounded-full"
      />

      <p className="body-medium text-dark-400_light700">
        {job_city && `${job_city}, `}
        {job_state && `${job_state}, `}
        {job_country && `${job_country} `}
      </p>
    </div>
  );
};
const JobCard = ({ job }: JobCardProps) => {
  const {
    employer_logo,
    employer_website,
    job_employment_type,
    job_title,
    job_description,
    job_apply_link,
    job_city,
    job_state,
    job_country,
  } = job;

  return (
    <section className="flex flex-col items-start gap-6 rounded-lg p-6 sm:p-8 sm:flex-row light-border border background-light900_dark200 light-border shadow-light100_darknone">
      <div className="flex w-full justify-end sm:hidden">
        <JobLocation
          job_city={job_city}
          job_state={job_state}
          job_country={job_country}
        />
      </div>

      <div className="flex items-center gap-6">
        {employer_logo ? (
          <Link
            href={employer_website ?? "/jobs"}
            className="background-light800_dark400 relative size-16 rounded-xl "
          >
            <Image
              src={employer_logo}
              alt="company logo"
              fill
              className="size-full object-contain p-2"
            />
          </Link>
        ) : (
          <Image
            src="images/site-logo.svg"
            alt="default site logo"
            width={50}
            height={50}
            className="rounded-[10px]"
          />
        )}
      </div>

      <div className="w-full">
        <div className="flex-between flex-wrap gap-2">
          <p className="base-semibold text-dark200_light900">
            {processJobTitle(job_title)}
          </p>

          <div className="hidden sm:flex">
            <JobLocation
              job_country={job_country}
              job_city={job_city}
              job_state={job_state}
            />
          </div>
        </div>

        <p className="mt-2 line-clamp-2 body-regular text-dark500_light700 ">
          {job_description?.slice(0, 200)}
        </p>
        <div className="flex-between mt-8 flex-wrap gap-6">
          <div className="flex flex-wrap items-center gap-6 ">
            {job_employment_type && (
              <Metric
                imageUrl="/icons/clock-2.svg"
                value={job_employment_type}
                alt="Like"
                textStyles="body-medium text-light500_light500"
                iconSize={20}
              />
            )}

            <Metric
              imageUrl="/icons/currency-dollar-circle.svg"
              value="Not Disclosed"
              alt="Answer"
              textStyles="body-medium text-light500_light500"
              iconSize={20}
            />
          </div>

          <Link className="flex-center gap-2" href={job_apply_link ?? "/jobs"}>
            <p className="body-semibold primary-text-gradient">View job</p>
            <Image
              src={"/icons/arrow-up-right.svg"}
              alt="arrow up right"
              height={20}
              width={20}
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default JobCard;
