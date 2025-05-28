import React from "react";

import UserCard from "@/components/cards/UserCard";
import DataRenderer from "@/components/DataRenderer";
import LocalSearchBar from "@/components/search/LocalSearcBar";
import ROUTES from "@/constants/routes";
import { EMPTY_USERS } from "@/constants/states";
import { getUsers } from "@/lib/actions/user.action";

const Community = async ({ searchParams }: RouteParams) => {
  const { page = 1, pageSize = 10, filter, query, sort } = await searchParams;

  const { success, data, error } = await getUsers({
    page: Number(page),
    pageSize: Number(pageSize),
    filter,
    query,
    sort,
  });

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">All Users</h1>
      <div className="mt-11 flex justify-between max-sm:flex-col sm:items-center gap-5">
        <LocalSearchBar
          iconPosition="left"
          imgSrc="/icons/search.svg"
          route={ROUTES.COMMUNITY}
          placeholder="Search by username or email"
          otherClasses="border light-border-3"
        />
        <div>Filter</div>
      </div>
      <DataRenderer
        data={data?.users}
        empty={EMPTY_USERS}
        error={error}
        success={success}
        render={(users) => (
          <div className="mt-12 flex flex-wrap gap-5">
            {users.map((user) => (
              <UserCard key={user._id} {...user} />
            ))}
          </div>
        )}
      />
    </>
  );
};

export default Community;
