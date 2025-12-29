"use client";

import { cn } from "@/utils/cn";

export type ToggleProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
};

export function Toggle({ checked, onChange, label, description }: ToggleProps) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground-200 focus-visible:ring-offset-2",
          checked ? "bg-foreground-200" : "bg-gray-200",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform",
            checked && "translate-x-5",
          )}
        />
      </button>
      <div className="flex-1">
        <span className="block font-medium text-foreground-100 text-sm">
          {label}
        </span>
        {description && (
          <span className="block text-gray-500 text-xs">{description}</span>
        )}
      </div>
    </label>
  );
}
