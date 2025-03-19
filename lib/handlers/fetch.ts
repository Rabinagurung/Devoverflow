import { RequestError } from "../http-error";
import handleError from "./error";
import logger from "../logger";

interface FetchOptions extends RequestInit {
  timeOut?: number;
}

function isError(error: unknown): error is Error {
  return error instanceof Error;
}

export async function fetchHandler<T>(
  url: string,
  options: FetchOptions = {},
): Promise<ActionResponse<T>> {
  const {
    timeOut = 5000,
    headers: customHeaders = {},
    ...restOptions
  } = options;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeOut);

  const defaultHeaders: HeadersInit = {
    "Content-type": "application/json",
    Accept: "application/json",
  };

  const headers: HeadersInit = { ...defaultHeaders, ...customHeaders };

  const config: RequestInit = {
    signal: controller.signal,
    headers,
    ...restOptions,
  };

  try {
    const response = await fetch(url, config);
    clearTimeout(id);

    if (!response.ok) {
      throw new RequestError(response.status, `HTTP ERROR: ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    const error = isError(err) ? err : new Error("Unknown error occcured");

    if (error.name === "AbortError") {
      logger.warn(`Request to ${url} timed out `);
    } else {
      logger.error(`Error fetching ${url}: ${error.message} `);
    }

    return handleError(error) as ActionResponse<T>;
  }
}

// client side
