import { NextResponse } from "next/server";

declare global {
  interface Tag {
    _id: string;
    name: string;
    questions: number;
  }

  interface Author {
    _id: string;
    name: string;
    image: string;
  }

  interface Question {
    _id: string;
    title: string;
    content: string;
    tags: Tag[];
    author: Author;
    upvotes: number;
    downvotes: number;
    answers: number;
    views: number;
    createdAt: Date;
  }

  interface Answer {
    _id: string;
    author: Author;
    question: Question;
    content: string;
    upvotes: number;
    downvotes: number;
    createdAt: Date;
  }

  interface User {
    _id: string;
    name: string;
    username: string;
    email: string;
    bio?: string;
    image?: string;
    location?: string;
    portfolio?: string;
    reputation?: number;
    createdAt: Date;
  }

  interface Badges {
    BRONZE: number;
    SILVER: number;
    GOLD: number;
  }

  type ActionResponse<T = null> = {
    success: boolean;
    data?: T;
    error?: {
      message: string;
      details?: Record<string, string[]>;
    };
    status?: number;
  };

  type SuccessResponse<T = null> = ActionResponse<T> & { success: true };

  type ErrorResponse = ActionResponse<undefined> & { success: false };

  type ApiErrorResponse = NextResponse<ErrorResponse>;

  type APIResponse<T = null> = NextResponse<SuccessResponse<T> | ErrorResponse>;

  interface RouteParams {
    params: Promise<Record<string, string>>;
    searchParams: Promise<Record<string, string>>;
  }
}

export {};
