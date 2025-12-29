"use client";

import { cn } from "@/utils/cn";
import { SORT_OPTIONS, type SortOption } from "./types";

type SortSelectProps = {
  value: SortOption;
  onChange: (value: SortOption) => void;
};

function SortIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="m3 16 4 4 4-4" />
      <path d="M7 20V4" />
      <path d="m21 8-4-4-4 4" />
      <path d="M17 4v16" />
    </svg>
  );
}

export function SortSelect({ value, onChange }: SortSelectProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3",
        "rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]",
        "px-4 py-2.5",
        "transition-all duration-200",
        "hover:border-[var(--color-border-strong)]",
        "focus-within:border-[var(--color-accent-primary)] focus-within:ring-2 focus-within:ring-[var(--color-accent-primary)]/20",
      )}
    >
      <SortIcon className="h-4 w-4 text-[var(--color-text-muted)]" />
      <label htmlFor="sort-select" className="sr-only">
        Sort by
      </label>
      <select
        id="sort-select"
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className={cn(
          "bg-transparent text-[var(--color-text-primary)] text-sm",
          "cursor-pointer appearance-none pr-6",
          "focus:outline-none",
        )}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%238A8A8A'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 0 center",
          backgroundSize: "16px",
        }}
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
