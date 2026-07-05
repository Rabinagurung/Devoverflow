"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import React, { use, useOptimistic, useTransition } from "react";

import { toast } from "@/hooks/use-toast";
import { createVote } from "@/lib/actions/vote.action";
import { getFormattedNumber } from "@/lib/utils";

interface VotesParams {
  targetId: string;
  targetType: "question" | "answer";
  upvotes: number;
  downvotes: number;
  hasVotedPromise: Promise<ActionResponse<HasVotedResponse>>;
}
const Votes = ({
  targetId,
  targetType,
  upvotes,
  downvotes,
  hasVotedPromise,
}: VotesParams) => {
  const [isLoading, startTransition] = useTransition();
  const session = useSession();
  const userId = session.data?.user?.id;

  const { data } = use(hasVotedPromise);

  const { hasUpvoted, hasDownvoted } = data || {};

  const [optimistic, setOptimistic] = useOptimistic(
    {
      upvotes,
      downvotes,
      hasUpvoted: !!hasUpvoted,
      hasDownvoted: !!hasDownvoted,
    },
    (state, voteType: "upvote" | "downvote") => {
      if (voteType === "upvote") {
        if (state.hasUpvoted) {
          return { ...state, upvotes: state.upvotes - 1, hasUpvoted: false };
        }
        return {
          upvotes: state.upvotes + 1,
          downvotes: state.hasDownvoted ? state.downvotes - 1 : state.downvotes,
          hasUpvoted: true,
          hasDownvoted: false,
        };
      } else {
        if (state.hasDownvoted) {
          return {
            ...state,
            downvotes: state.downvotes - 1,
            hasDownvoted: false,
          };
        }
        return {
          upvotes: state.hasUpvoted ? state.upvotes - 1 : state.upvotes,
          downvotes: state.downvotes + 1,
          hasUpvoted: false,
          hasDownvoted: true,
        };
      }
    },
  );

  const handleVote = (voteType: "upvote" | "downvote") => {
    if (!userId)
      return toast({
        title: "Please login to vote",
        description: "Only logged-in users can vote.",
      });

    startTransition(async () => {
      setOptimistic(voteType);

      try {
        const result = await createVote({ targetId, targetType, voteType });

        if (!result.success) {
          toast({
            title: "Failed to vote",
            description: result.error?.message,
            variant: "destructive",
          });
        }

        const successMessage =
          voteType === "upvote"
            ? `Upvote ${!optimistic.hasUpvoted ? "added" : "removed"} successfully`
            : `Downvote ${!optimistic.hasDownvoted ? "added" : "removed"} successfully`;

        toast({
          title: successMessage,
          description: "Your vote has been recorded",
        });
      } catch {
        toast({
          title: "Failed to vote",
          description:
            "An error occurred while voting. Please try again later.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div className="flex-center gap-2.5">
      <div className="flex-center gap-1.5">
        <Image
          src={
            optimistic.hasUpvoted ? "/icons/upvoted.svg" : "/icons/upvote.svg"
          }
          width={20}
          height={20}
          alt="upvote"
          className={`cursor-pointer ${isLoading && "opacity-50"}`}
          onClick={() => !isLoading && handleVote("upvote")}
        />

        <div className="flex-center min-w-5  p-1 rounded-sm background-light700_dark400">
          <p className="subtle-medium text_dark400_light900">
            {getFormattedNumber(optimistic.upvotes)}
          </p>
        </div>
      </div>

      <div className="flex-center gap-1.5">
        <Image
          src={
            optimistic.hasDownvoted
              ? "/icons/downvoted.svg"
              : "/icons/downvote.svg"
          }
          width={20}
          height={20}
          alt="downvote"
          className={`cursor-pointer ${isLoading && "opacity-50"}`}
          onClick={() => !isLoading && handleVote("downvote")}
        />
        <div className="flex-center min-w-5 p-1 rounded-sm background-light700_dark400">
          <p className="subtle-medium text_dark400_light900">
            {getFormattedNumber(optimistic.downvotes)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Votes;
