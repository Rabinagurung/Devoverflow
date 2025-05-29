"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import React, { use, useState } from "react";

import { toast } from "@/hooks/use-toast";
import { toggleSaveQuestion } from "@/lib/actions/collection.action";

interface SaveQuestionProps {
  questionId: string;
  hasSavedQuestionPromise: Promise<ActionResponse<{ hasSaved: boolean }>>;
}

const SaveQuestion = ({
  questionId,
  hasSavedQuestionPromise,
}: SaveQuestionProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const session = useSession();
  const userId = session.data?.user?.id;

  const { data } = use(hasSavedQuestionPromise);

  const { hasSaved } = data || {};

  const handleSave = async () => {
    if (isLoading) return;
    if (!userId)
      return toast({
        title: "You need to be logged in to save a question",
        variant: "destructive",
      });

    setIsLoading(true);

    try {
      const { success, data, error } = await toggleSaveQuestion({ questionId });

      if (!success)
        throw new Error(
          error?.message || "An error occured while saving question.",
        );

      toast({
        title: `Question ${data?.saved ? "saved" : "removed"} successfully.`,
      });
    } catch (error) {
      return toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "An error occured while saving question.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Image
      alt="Save Question"
      src={hasSaved ? "/icons/star-filled.svg" : "/icons/star-red.svg"}
      width={18}
      height={18}
      aria-label="Save question"
      onClick={handleSave}
      className={`cursor-pointer ${isLoading} && opacity-50`}
    />
  );
};

export default SaveQuestion;
