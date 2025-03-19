"use server";

import { Session } from "next-auth";
import { ZodError, ZodSchema } from "zod";

import { auth } from "@/auth";

import { UnauthorizedError, ValidationError } from "../http-error";
import dbConnect from "../mongoose";

interface ActionOptions {
  params?: AuthCredentials;
  schema?: ZodSchema<AuthCredentials>;
  authorize?: boolean;
}

async function action({ params, schema, authorize = false }: ActionOptions) {
  if (params && schema) {
    try {
      schema.parse(params);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new ValidationError(
          error.flatten().fieldErrors as Record<string, string[]>,
        );
      } else {
        throw new Error("Schema validation failed");
      }
    }
  }

  let session: Session | null = null;

  if (authorize) {
    session = await auth();

    if (!session) throw new UnauthorizedError();
  }

  await dbConnect();

  return { params, session };
}

export default action;
