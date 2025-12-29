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
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <line x1="4" y1="6" x2="16" y2="6" />
      <line x1="4" y1="12" x2="12" y2="12" />
      <line x1="4" y1="18" x2="8" y2="18" />
      <polyline points="15 15 18 18 21 15" />
      <line x1="18" y1="12" x2="18" y2="18" />
    </svg>
  );
}

export function SortSelect({ value, onChange }: SortSelectProps) {
  return (
    <div className="flex items-center gap-2">
      <SortIcon className="h-4 w-4 text-gray-500" />
      <label htmlFor="sort-select" className="sr-only">
        Sort by
      </label>
      <select
        id="sort-select"
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className={cn(
          "rounded-md border border-gray-200 bg-white px-3 py-2 pr-8 text-sm",
          "focus:border-foreground-200 focus:outline-none focus:ring-1 focus:ring-foreground-200",
          "cursor-pointer appearance-none",
          "bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20xmlns%3d%22http%3a%2f%2fwww.w3.org%2f2000%2fsvg%22%20width%3d%2224%22%20height%3d%2224%22%20viewBox%3d%220%200%2024%2024%22%20fill%3d%22none%22%20stroke%3d%22%239ca3af%22%20stroke-width%3d%222%22%20stroke-linecap%3d%22round%22%20stroke-linejoin%3d%22round%22%3e%3cpolyline%20points%3d%226%209%2012%2015%2018%209%22%3e%3c%2fpolyline%3e%3c%2fsvg%3e')]",
          "bg-[length:16px] bg-[right_8px_center] bg-no-repeat",
        )}
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
