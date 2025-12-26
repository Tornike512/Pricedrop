import type { ErrorInfo } from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { Button } from "@/components/button";
import { logger } from "@/utils/logger";

const ErrorFallback: React.FC<FallbackProps> = ({
  error,
  resetErrorBoundary,
}) => (
  <div
    role="alert"
    className="flex h-full items-center justify-center rounded p-4 text-red-500"
  >
    <div className="grid place-items-center gap-2">
      <p>Something went wrong</p>
      <pre>{error.message}</pre>
      <Button type="button" onClick={resetErrorBoundary}>
        Try again
      </Button>
    </div>
  </div>
);

export const ErrorBoundaryProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const logError = async (error: Error, info: ErrorInfo) => {
    if (process.env.NODE_ENV !== "production") return;
    // In production, you might want to send this to a logging service
    // For now, we'll use console.error as it's acceptable for error logging
    // eslint-disable-next-line no-console
    logger.error("ErrorBoundary caught an error:", error, info);
  };

  const onReset = () => {};

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={onReset}
      onError={logError}
    >
      {children}
    </ErrorBoundary>
  );
};
