"use client";

import { Button } from "@/components/button/button";
import { cn } from "@/utils/cn";
import type { ViewMode } from "./types";

type ViewToggleProps = {
  value: ViewMode;
  onChange: (value: ViewMode) => void;
};

function GridIcon({ className }: { className?: string }) {
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
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function ListIcon({ className }: { className?: string }) {
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
      <rect x="3" y="4" width="18" height="4" rx="1" />
      <rect x="3" y="10" width="18" height="4" rx="1" />
      <rect x="3" y="16" width="18" height="4" rx="1" />
    </svg>
  );
}

export function ViewToggle({ value, onChange }: ViewToggleProps) {
  return (
    // biome-ignore lint/a11y/useSemanticElements: role="group" is appropriate for toggle button groups
    <div
      className={cn(
        "flex rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-1.5",
        "shadow-[var(--shadow-xs)]",
      )}
      role="group"
      aria-label="View mode"
    >
      <Button
        type="button"
        onClick={() => onChange("grid")}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-lg",
          "transition-all duration-200",
          value === "grid"
            ? "bg-gradient-to-r from-[var(--color-accent-secondary)] to-[var(--color-accent-primary)] text-[var(--color-text-inverse)] shadow-[var(--shadow-sm)]"
            : "text-[var(--color-text-muted)] hover:bg-[var(--color-accent-tertiary)] hover:text-[var(--color-accent-primary)]",
        )}
        aria-label="Grid view"
        aria-pressed={value === "grid"}
      >
        <GridIcon className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        onClick={() => onChange("list")}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-lg",
          "transition-all duration-200",
          value === "list"
            ? "bg-gradient-to-r from-[var(--color-accent-secondary)] to-[var(--color-accent-primary)] text-[var(--color-text-inverse)] shadow-[var(--shadow-sm)]"
            : "text-[var(--color-text-muted)] hover:bg-[var(--color-accent-tertiary)] hover:text-[var(--color-accent-primary)]",
        )}
        aria-label="List view"
        aria-pressed={value === "list"}
      >
        <ListIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}
