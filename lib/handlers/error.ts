import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { ValidationError } from "../http-error";
import logger from "../logger";

export type ResponseType = "api" | "server";

const formatResponse = (
  responseType: ResponseType,
  status: number,
  message: string,
  errors?: Record<string, string[]> | undefined,
) => {
  const responseContent = {
    success: false,
    error: {
      message,
      details: errors,
    },
  };

  return responseType === "api"
    ? NextResponse.json(responseContent, { status })
    : {
        status,
        ...responseContent,
      };
};

const handleError = (error: unknown, responseType: ResponseType = "server") => {
  // if (error instanceof RequestError) {
  //   logger.error(
  //     { err: error },
  //     `${responseType.toUpperCase()} ERROR: ${error.message}`,
  //   );

  //   return formatResponse(
  //     responseType,
  //     error.statusCode,
  //     error.message,
  //     error.errors,
  //   );
  // }
  if (error instanceof ValidationError) {
    const validationError = new ValidationError(error.errors!);
    return formatResponse(
      responseType,
      validationError.statusCode,
      validationError.message,
      validationError.errors,
    );
  }

  if (error instanceof ZodError) {
    logger.error({ err: error }, `Zod validation error: ${error}`);

    const validationError = new ValidationError(
      error.flatten().fieldErrors as Record<string, string[]>,
    );

    logger.error({ err: error }, `ValidationError: ${validationError.message}`);

    return formatResponse(
      responseType,
      validationError.statusCode,
      validationError.message,
      validationError.errors,
    );
  }

  if (error instanceof Error) {
    logger.error(`Instance of error, ${error}`);
    return formatResponse(responseType, 500, error.message);
  }

  logger.error({ err: error }, "An unexpected error has occured.");
  return formatResponse(responseType, 500, "An unexpected error occured.");
};

export default handleError;
