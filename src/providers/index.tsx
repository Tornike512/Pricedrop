"use client";
import { ErrorBoundaryProvider } from "./error-boundary-provider";
import { TanstackQueryProvider } from "./tanstack-query-provider";

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ErrorBoundaryProvider>
      <TanstackQueryProvider>{children}</TanstackQueryProvider>
    </ErrorBoundaryProvider>
  );
};
