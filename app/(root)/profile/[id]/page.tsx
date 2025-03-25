import React from "react";

const ProfileDetails = async ({ params }: RouteParams) => {
  const { id } = await params;

  return <div>ProfileDetails ${id}</div>;
};

export default ProfileDetails;
