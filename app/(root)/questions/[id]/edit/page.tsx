import { auth } from "@/auth";
import QuestionForm from "@/components/forms/QuestionForm";
import ROUTES from "@/constants/routes";
import { getQuestion } from "@/lib/actions/question.action";
import { notFound, redirect } from "next/navigation";
import React from "react";

const EditQuestion = async ({ params }: RouteParams) => {
  const { id } = await params;

  console.log({ id });
  if (!id) return notFound();

  const session = await auth();
  if (!session) return redirect(ROUTES.SIGN_IN);

  const { success, data: question } = await getQuestion({ questionId: id });
  console.log({ success, question });

  if (!success) return notFound();
  console.log({ question });

  if (question?.author._id.toString() !== session?.user?.id)
    return redirect(ROUTES.QUESTIONS(id));

  return (
    <main>
      <QuestionForm question={question} isEdit />
    </main>
  );
};

export default EditQuestion;
