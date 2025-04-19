"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { MDXEditorMethods } from "@mdxeditor/editor";
import dynamic from "next/dynamic";
import React, { useRef, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { AskAQuestionSchema } from "@/lib/validations";

import TagCard from "../cards/TagCard";
import { Button } from "../ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { createQuestion, editQuestion } from "@/lib/actions/question.action";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import ROUTES from "@/constants/routes";
import { ReloadIcon } from "@radix-ui/react-icons";
import router from "next/router";

const Editor = dynamic(() => import("../Editor"), {
  // Make sure we turn SSR off
  ssr: false,
});

interface QuestionEditParams {
  question?: Question;
  isEdit?: boolean;
}

const QuestionForm = ({ question, isEdit = false }: QuestionEditParams) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const editorRef = useRef<MDXEditorMethods>(null);

  const form = useForm<z.infer<typeof AskAQuestionSchema>>({
    resolver: zodResolver(AskAQuestionSchema),
    defaultValues: {
      title: question?.title || "",
      content: question?.content || "",
      tags: question?.tags.map((t) => t.name) || [],
    },
  });

  const handleRemoveTag = (tag: string, field: { value: string[] }) => {
    const newTags = field.value.filter((t) => t !== tag);

    form.setValue("tags", newTags);

    if (newTags.length === 0) {
      form.setError("tags", { type: "manual", message: "Tags are required" });
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: { value: string[] },
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const tagInput = e.currentTarget.value.trim();

      if (tagInput && tagInput.length < 15 && !field.value.includes(tagInput)) {
        form.setValue("tags", [...field.value, tagInput]);
        e.currentTarget.value = "";

        form.clearErrors("tags");
      } else if (tagInput.length > 15) {
        form.setError("tags", {
          type: "manaul",
          message: "Tags cannot exceed more then 15 characters",
        });
      } else if (field.value.includes(tagInput)) {
        form.setError("tags", {
          type: "manual",
          message: "Tag is already included",
        });
      }
    }
  };

  const handleCreateQuestion = async (
    data: z.infer<typeof AskAQuestionSchema>,
  ) => {
    startTransition(async () => {
      console.log({ isEdit, question });
      if (isEdit && question) {
        const result = await editQuestion({
          questionId: question?._id,
          ...data,
        });

        console.log("Result", { result });

        if (result.success) {
          toast({
            title: "Success",
            description: "Question edited successfully.",
          });

          if (result.data)
            router.push(ROUTES.QUESTIONS(result.data?._id as string));
        } else {
          toast({
            title: `Error: ${result.status}`,
            description: result.error?.message || "Something went wrong",
            variant: "destructive",
          });
        }

        return;
      }

      const result = await createQuestion(data);

      if (result.success) {
        toast({
          title: "Success",
          description: "Question created successfully.",
        });

        if (result.data) router.push(ROUTES.QUESTIONS(result.data._id));
      } else {
        toast({
          title: `Error: ${result.status}`,
          description: `${result.error?.message}` || "Something went wrong",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleCreateQuestion)}
        className="flex w-full flex-col gap-10"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Question Title <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="paragraph-regular no-focus light-border-2 background-light800_dark300 text-dark300_light700 h-[53px] rounded-1.5 border px-6 py-4"
                />
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Be specific and imagine you’re asking a question to another
                person.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Detailed explanation of your problem{" "}
                <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Editor
                  editorRef={editorRef}
                  fieldChange={field.onChange}
                  value={field.value}
                />
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Introduce the problem and expand on what you put in the title.
                Minimum 20 characters.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Tags <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <div>
                  <Input
                    onKeyDown={(e) => handleKeyDown(e, field)}
                    className="paragraph-regular light-border-2 background-light800_dark300 no-focus text-dark300_light700 flex h-[53px] gap-3 rounded-1.5 border px-6 py-4"
                  />
                  <div className="flex-start mt-2.5 flex-wrap gap-2.5">
                    {field?.value?.map((tag: string) => (
                      <TagCard
                        key={tag}
                        id={tag}
                        name={tag}
                        isButton
                        onDelete={() => handleRemoveTag(tag, field)}
                        remove
                        compact
                      />
                    ))}
                  </div>
                </div>
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Add up to 3 tags to describe what your question is about. Start
                typing to see suggestions.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="mt-16 flex justify-end">
          <Button
            type="submit"
            className="primary-gradient paragraph-semibold w-fit rounded-2 px-4 py-3 !text-light-900"
          >
            {isPending ? (
              <>
                <ReloadIcon className="mr-2 size-4 animate-spin" />
                <span>Submitting</span>
              </>
            ) : (
              <>{isEdit ? "Edit" : "Ask a Question"}</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default QuestionForm;
