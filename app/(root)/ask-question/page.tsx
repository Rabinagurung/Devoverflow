import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

import { auth } from "@/auth";
import QuestionForm from "@/components/forms/QuestionForm";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";

const AskAQuestion = async () => {
  const session = await auth();

  if (!session) return redirect(ROUTES.SIGN_IN);

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Ask a public quesiton</h1>
      <div className="mt-9">
        {session.user?.isGuest ? (
          <div className="light-border background-light800_dark300 flex flex-col items-start gap-4 rounded-2 border p-6">
            <p className="paragraph-regular text-dark400_light700">
              Guests can browse questions but can&apos;t post new ones. Sign in
              or create a free account to ask your question.
            </p>
            <div className="flex gap-3">
              <Button
                className="primary-gradient paragraph-medium rounded-2 px-4 py-3 !text-light-900"
                asChild
              >
                <Link href={ROUTES.SIGN_IN}>Sign In</Link>
              </Button>
              <Button
                className="light-border-2 body-semibold text-dark400_light900 btn-tertiary rounded-2 border px-4 py-3"
                asChild
              >
                <Link href={ROUTES.SIGN_UP}>Create Account</Link>
              </Button>
            </div>
          </div>
        ) : (
          <QuestionForm />
        )}
      </div>
    </>
  );
};

export default AskAQuestion;
