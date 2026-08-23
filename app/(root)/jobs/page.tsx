import React from "react";

import JobCard from "@/components/cards/JobCard";
import JobsFilter from "@/components/filter/JobsFilter";
import Pagination from "@/components/Pagination";
import {
  fetchCountries,
  fetchJobs,
  fetchLocation,
} from "@/lib/actions/job.action";

const Jobs = async ({ searchParams }: RouteParams) => {
  const { query, location, page } = await searchParams;

  const [searchQuery, countriesList] = await Promise.all([
    query
      ? Promise.resolve(`${query} ${location ? `, ${location}` : ""}`)
      : fetchLocation().then(
          (userLocation) => `Software Enginner in ${userLocation}`,
        ),
    fetchCountries(),
  ]);

  const jobs = await fetchJobs({
    query: searchQuery,
    page: page ?? 1,
  });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Jobs</h1>
      <div className="flex">
        <JobsFilter countriesList={countriesList} />
      </div>

      <section className="light-border mb-9 mt-11 flex flex-col gap-9 border-b pb-9 ">
        {jobs?.length > 0 ? (
          jobs
            .filter((job: Job) => job.job_title)
            .map((job: Job) => <JobCard key={job.job_id} job={job} />)
        ) : (
          <div className="paragraph-regular text-dark200_light800 w-full text-center">
            Oops! We couldn&apos;t find any jobs at the moment. Please try again
            later
          </div>
        )}
      </section>

      {jobs?.length > 0 && (
        <Pagination page={Number(page ?? 1)} isNext={jobs?.length === 10} />
      )}
    </>
  );
};

export default Jobs;
