"use client";

import React, { useEffect } from "react";
import ErrorState from "@/components/ErrorState";

export default function GlobalErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application Route Error:", error);
  }, [error]);

  return (
    <div className="pt-28 pb-16 min-h-[80vh] flex items-center justify-center px-4">
      <ErrorState
        title="Something Went Wrong While Loading This Page"
        message={
          error?.message ||
          "We encountered a temporary network or TMDB API error. Please click Try Again to reload."
        }
        onRetry={() => reset()}
      />
    </div>
  );
}
