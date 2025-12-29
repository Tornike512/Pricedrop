"use client";

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
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
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
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );
}

export function ViewToggle({ value, onChange }: ViewToggleProps) {
  return (
    // biome-ignore lint/a11y/useSemanticElements: role="group" is appropriate for toggle button groups
    <div
      className="flex rounded-md border border-gray-200 bg-white p-1"
      role="group"
      aria-label="View mode"
    >
      <button
        type="button"
        onClick={() => onChange("grid")}
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded transition-colors",
          value === "grid"
            ? "bg-foreground-200 text-white"
            : "text-gray-500 hover:bg-gray-100 hover:text-foreground-100",
        )}
        aria-label="Grid view"
        aria-pressed={value === "grid"}
      >
        <GridIcon className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => onChange("list")}
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded transition-colors",
          value === "list"
            ? "bg-foreground-200 text-white"
            : "text-gray-500 hover:bg-gray-100 hover:text-foreground-100",
        )}
        aria-label="List view"
        aria-pressed={value === "list"}
      >
        <ListIcon className="h-4 w-4" />
      </button>
    </div>
  );
}
