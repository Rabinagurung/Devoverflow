import { z } from "zod";

export const SignInSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email({ message: "Please provide a valid email address." }),

  password: z
    .string()
    .min(6, { message: "Paasoword must be six characters long." })
    .max(100, { message: "Password cannot exceed 100 characters." }),
});

export const SignUpSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters." })
    .max(30, { message: "Password cannot exceed 30 characters." })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers, and underscores.",
    }),

  name: z
    .string()
    .min(1, { message: "Name is required." })
    .max(50, { message: "Name cannot exceed 50 characters." })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Name can only contain letters and spaces.",
    }),

  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email({ message: "Please provide a valid email address." }),

  password: z
    .string()
    .min(6, { message: "Paasoword must be six characters long." })
    .max(100, { message: "Password cannot exceed 100 characters." })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter.",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password must contain at least one special character.",
    }),
});

export const AskAQuestionSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Title must be at least 5 characters." })
    .max(130, { message: "Title musn't be longer then 130 characters." }),

  content: z.string().min(1, { message: "Content is required" }),

  tags: z
    .array(
      z
        .string()
        .min(1, { message: "Tag is required. " })
        .max(15, { message: "Tag cannot exceed 15 characters." }),
    )
    .min(1, { message: "Add at least one tag." })
    .max(3, { message: "Maximum of 3 tags." }),
});

export const UserSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(50, { message: "Name cannot exceed 50 characters." })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Name can only contain letters and spaces.",
    }),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(30, { message: "Password cannot exceed 30 characters." })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers, and underscores.",
    }),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please provide a valid email address" }),

  bio: z.string().optional(),
  image: z.string().url({ message: "Please provide a valid URL." }).optional(),
  location: z.string().optional(),
  portfolio: z
    .string()
    .url({ message: "Please provide a valid URL." })
    .optional(),
  reputation: z.number().optional(),
});

export const AccountSchema = z.object({
  userId: z.string().min(1, { message: "User ID is requirex" }),
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(50, { message: "Name cannot exceed 50 characters." })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Name can only contain letters and spaces.",
    }),
  image: z.string().url({ message: "Please provide a valid URL." }).optional(),
  password: z
    .string()
    .min(6, { message: "Paasoword must be six characters long." })
    .max(100, { message: "Password cannot exceed 100 characters." })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter.",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password must contain at least one special character.",
    })
    .optional(),
  provider: z.string().min(1, { message: "Provider is required" }),
  providerAccountId: z
    .string()
    .min(1, { message: "Provider Account Id is required" }),
});

export const SignInWithAuthSchema = z.object({
  provider: z.string().min(1, { message: "Provider is required." }),
  providerAccountId: z
    .string()
    .min(1, { message: "ProvideAccountId is required." }),
  user: z.object({
    name: z.string().min(1, { message: "Name is required." }),
    username: z
      .string()
      .min(3, { message: "User name must be at least 3 characters long." }),
    email: z
      .string()
      .min(1, { message: "Email is required." })
      .email({ message: "Please provide a valid email address." }),
    image: z.string().url({ message: "Please provide a valid URL" }).optional(),
  }),
});

export const EditQuestionSchema = AskAQuestionSchema.extend({
  questionId: z.string().min(1, { message: "Question Id is required." }),
});

export const GetQuestionSchema = z.object({
  questionId: z.string().min(1, { message: "Question Id is required." }),
});

export const PaginatedSearchParamsSchema = z.object({
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().default(10),
  sort: z.string().optional(),
  filter: z.string().optional(),
  query: z.string().optional(),
});

export const GetTagQuestionSchema = PaginatedSearchParamsSchema.extend({
  tagId: z.string().min(1, { message: "Tag Id is required." }),
});

export const IncrementViewsSchema = z.object({
  questionId: z.string().min(1, { message: "Question Id is required" }),
});

export const AnswerSchema = z.object({
  content: z
    .string()
    .min(100, { message: "Answer must have minimum of 100 characters." }),
});

export const AnswerParamsSchema = AnswerSchema.extend({
  questionId: z.string().min(1, { message: "Question ID is required." }),
});

export const GetAnswersSchema = PaginatedSearchParamsSchema.extend({
  questionId: z.string().min(1, { message: "Question ID is required." }),
});

export const AIAnswersSchema = z.object({
  question: z
    .string()
    .min(5, { message: "Question title must be at least 5 characters." })
    .max(130, {
      message: "Question title musn't be longer then 130 characters.",
    }),

  content: z.string().min(100, {
    message: "Question description must have minimum of 100 characters.",
  }),

  userAnswer: z.string().optional(),
});

export const CreateVoteSchema = z.object({
  targetId: z.string().min(1, { message: "Target ID is required." }),
  targetType: z.enum(["question", "answer"], {
    message: "Invalid target type. Must be 'question' or 'answer'.",
  }),
  voteType: z.enum(["upvote", "downvote"], {
    message: "Invalid vote type. Must be 'upvote' or 'downvote'.",
  }),
});

export const UpdateVoteCountSchema = CreateVoteSchema.extend({
  change: z.number().int().min(-1).max(1),
});

export const HasVotedSchema = CreateVoteSchema.pick({
  targetId: true,
  targetType: true,
});

export const CollectionBaseSchema = z.object({
  questionId: z.string().min(1, { message: "Question Id is required." }),
});

export const GetUserSchema = z.object({
  userId: z.string().min(1, { message: "User Id is required." }),
});

export const GetUserQuestionsSchema = PaginatedSearchParamsSchema.extend({
  userId: z.string().min(1, { message: "User Id is required." }),
});

export const DeleteQuestionSchema = z.object({
  questionId: z.string().min(1, { message: "Question Id is required." }),
});

export const GetUserAnswersSchema = PaginatedSearchParamsSchema.extend({
  userId: z.string().min(1, { message: "User Id is required." }),
});

export const DeleteAnswerSchema = z.object({
  answerId: z.string().min(1, { message: "Answer Id is required." }),
});

export const GetUserTagsSchema = z.object({
  userId: z.string().min(1, { message: "User Id is required." }),
});
