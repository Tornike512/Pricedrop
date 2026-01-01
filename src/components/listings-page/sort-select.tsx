"use client";

import { Dropdown } from "@/components/dropdown";
import { SORT_OPTIONS, type SortOption } from "./types";

type SortSelectProps = {
  value: SortOption;
  onChange: (value: SortOption) => void;
};

function SortIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
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
    <Dropdown
      options={SORT_OPTIONS}
      value={value}
      onChange={onChange}
      icon={<SortIcon />}
      className="min-w-[200px]"
    />
  );
}
