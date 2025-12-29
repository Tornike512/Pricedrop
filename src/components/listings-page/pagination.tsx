"use client";

import { useMemo } from "react";
import { cn } from "@/utils/cn";
import type { PaginationProps } from "./types";

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

type PageItem =
  | { type: "page"; value: number }
  | { type: "ellipsis"; key: string };

function getPageNumbers(currentPage: number, totalPages: number): PageItem[] {
  const pages: PageItem[] = [];

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push({ type: "page", value: i });
    }
    return pages;
  }

  pages.push({ type: "page", value: 1 });

  if (currentPage > 3) {
    pages.push({ type: "ellipsis", key: "ellipsis-start" });
  }

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  for (let i = start; i <= end; i++) {
    pages.push({ type: "page", value: i });
  }

  if (currentPage < totalPages - 2) {
    pages.push({ type: "ellipsis", key: "ellipsis-end" });
  }

  if (totalPages > 1) {
    pages.push({ type: "page", value: totalPages });
  }

  return pages;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pageNumbers = useMemo(
    () => getPageNumbers(currentPage, totalPages),
    [currentPage, totalPages],
  );

  if (totalPages <= 1) return null;

  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <nav
      className={cn(
        "inline-flex items-center gap-1",
        "rounded-2xl bg-[var(--color-surface)] p-2",
        "border border-[var(--color-border)]",
        "shadow-[var(--shadow-sm)]",
      )}
      aria-label="Pagination"
    >
      {/* Previous Button */}
      <button
        type="button"
        onClick={() => canGoPrev && onPageChange(currentPage - 1)}
        disabled={!canGoPrev}
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-xl",
          "transition-all duration-200",
          canGoPrev
            ? "text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] active:scale-95"
            : "cursor-not-allowed text-[var(--color-text-muted)] opacity-40",
        )}
        aria-label="Go to previous page"
      >
        <ChevronLeftIcon className="h-5 w-5" />
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1 px-1">
        {pageNumbers.map((item) => {
          if (item.type === "ellipsis") {
            return (
              <span
                key={item.key}
                className="flex h-10 w-10 items-center justify-center text-[var(--color-text-muted)]"
                aria-hidden="true"
              >
                ...
              </span>
            );
          }

          const isActive = item.value === currentPage;

          return (
            <button
              key={item.value}
              type="button"
              onClick={() => onPageChange(item.value)}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl",
                "font-medium text-sm transition-all duration-200",
                isActive
                  ? "bg-gradient-to-r from-[var(--color-accent-secondary)] to-[var(--color-accent-primary)] text-[var(--color-text-inverse)] shadow-[var(--shadow-sm)]"
                  : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text-primary)]",
              )}
              aria-label={`Go to page ${item.value}`}
              aria-current={isActive ? "page" : undefined}
            >
              {item.value}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        type="button"
        onClick={() => canGoNext && onPageChange(currentPage + 1)}
        disabled={!canGoNext}
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-xl",
          "transition-all duration-200",
          canGoNext
            ? "text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] active:scale-95"
            : "cursor-not-allowed text-[var(--color-text-muted)] opacity-40",
        )}
        aria-label="Go to next page"
      >
        <ChevronRightIcon className="h-5 w-5" />
      </button>
    </nav>
  );
}
