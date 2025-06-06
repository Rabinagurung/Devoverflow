"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { MDXEditorMethods } from "@mdxeditor/editor";
import { ReloadIcon } from "@radix-ui/react-icons";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { toast } from "@/hooks/use-toast";
import { createAnswer } from "@/lib/actions/answer.action";
import { api } from "@/lib/handlers/api";
import { AnswerSchema } from "@/lib/validations";

import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";

const Editor = dynamic(() => import("@/components/editor"), {
  // Make sure we turn SSR off
  ssr: false,
});

interface AnswerFormProps {
  questionId: string;
  questionTitle: string;
  questionContent: string;
}

const AnswerForm = ({
  questionId,
  questionTitle,
  questionContent,
}: AnswerFormProps) => {
  const [isAnswering, startAnsweringTransition] = useTransition();

  const [isAISubmitting, setIsAISubmitting] = useState(false);

  const session = useSession();

  const editorRef = useRef<MDXEditorMethods>(null);

  const form = useForm<z.infer<typeof AnswerSchema>>({
    resolver: zodResolver(AnswerSchema),
    defaultValues: {
      content: "",
    },
  });

  async function onSubmitHandler(values: z.infer<typeof AnswerSchema>) {
    startAnsweringTransition(async () => {
      const { success, error } = await createAnswer({
        questionId,
        content: values.content,
      });

      if (success) {
        form.reset();

        editorRef.current?.setMarkdown("");

        toast({
          title: "Success",
          description: "Your answer has been posted successfully",
        });
      } else {
        toast({
          title: "Error",
          description: error?.message,
          variant: "destructive",
        });
      }
    });
  }

  const generateAIAnswer = async () => {
    if (session.status !== "authenticated") {
      return toast({
        title: "Please log in",
        description: "You need to be logged in to use this feature",
      });
    }

    setIsAISubmitting(true);

    const userAnswer = editorRef.current?.getMarkdown();

    try {
      const { success, data, error } = await api.ai.getAnswer(
        questionTitle,
        questionContent,
        userAnswer,
      );

      if (!success || !data) {
        return toast({
          title: "Error",
          description: error?.message,
          variant: "destructive",
        });
      }

      // const formattedAnswer = data.replace(/<br>/g, " ").toString().trim();

      const md = data
        .replace(/^```[^\n]*\n/, "") // remove the opening ```markdown
        .replace(/```$/, ""); // remove the very last ```

      if (editorRef.current) {
        editorRef.current.setMarkdown(md);

        form.setValue("content", md);
        form.trigger("content");
      }

      toast({
        title: "Success",
        description: "AI generated answer has been generated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "There was a problem with your request",
        variant: "destructive",
      });
    } finally {
      setIsAISubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
        <h4 className="paragraph-semibold text-dark400_light800">
          Write your answer here
        </h4>
        <Button
          disabled={isAISubmitting}
          onClick={generateAIAnswer}
          className="btn border rounded-md gap-1.5 light-border-2 px-4 py-2.5 text-primary-500 dark:text-primary-500 small-medium shadow-none"
        >
          {isAISubmitting ? (
            <>
              <ReloadIcon className="mr-2 size-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Image
                height={12}
                width={12}
                src="/icons/stars.svg"
                alt="Generate AI Answer"
                className="object-contain"
              />
              Generate AI Answer
            </>
          )}
        </Button>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmitHandler)}
          className="mt-6 flex w-full flex-col gap-10"
        >
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-3">
                <FormControl>
                  <Editor
                    value={field.value}
                    editorRef={editorRef}
                    fieldChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="mt-[30px] flex justify-end ">
            <Button
              type="submit"
              className="primary-gradient px-3 py-4  w-fit
               rounded-2 paragraph-semibold text-light-900 dark:text-light-900"
            >
              {isAnswering ? (
                <>
                  <ReloadIcon className="mr-2 size-4 animate-spin" />
                  Posting...
                </>
              ) : (
                "Post Answer"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AnswerForm;
