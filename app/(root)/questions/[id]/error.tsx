"use client";

import { useEffect } from "react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => console.error(error), [error]);
  return (
    <div>
      <h1>Uh oh, something went wrong loading this question.</h1>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
