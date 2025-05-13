"use client";

import { useEffect } from "react";

import { toast } from "@/hooks/use-toast";
import { incrementViews } from "@/lib/actions/question.action";

const View = ({ questionId }: { questionId: string }) => {
  useEffect(() => {
    const handleIncrement = async () => {
      const result = await incrementViews({ questionId });

      if (result.success) {
        return toast({
          title: "Success",
          description: "Views incremented successfully",
        });
      } else {
        return toast({
          title: "Error",
          description: result.error?.message,
          variant: "destructive",
        });
      }
    };

    handleIncrement();
  }, [questionId]);

  return null;
};

export default View;
