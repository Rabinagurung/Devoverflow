import { redirect } from "next/navigation";
import React from "react";

import { auth } from "@/auth";
import QuestionForm from "@/components/forms/QuestionForm";
import GuestAccessNotice from "@/components/GuestAccessNotice";
import ROUTES from "@/constants/routes";

const AskAQuestion = async () => {
  const session = await auth();

  if (!session) return redirect(ROUTES.SIGN_IN);

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Ask a public quesiton</h1>
      <div className="mt-9">
        {session.user?.isGuest ? (
          <GuestAccessNotice message="Guests can browse questions but can't post new ones. Sign in or create a free account to ask your question." />
        ) : (
          <QuestionForm />
        )}
      </div>
    </>
  );
};

export default AskAQuestion;
