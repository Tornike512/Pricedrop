"use client";

import { Button } from "@/components/button/button";
import { cn } from "@/utils/cn";

export type ToggleProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
};

export function Toggle({ checked, onChange, label, description }: ToggleProps) {
  return (
    <div
      className={cn(
        "group -mx-4 flex items-start gap-4 p-4",
        "rounded-xl transition-colors duration-200",
        "hover:bg-[var(--color-bg-secondary)]",
      )}
    >
      <Button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative mt-0.5 h-7 w-12 shrink-0 cursor-pointer rounded-full",
          "transition-all duration-300 ease-out",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-primary)] focus-visible:ring-offset-2",
          checked
            ? "bg-[var(--color-accent-primary)]"
            : "bg-[var(--color-bg-tertiary)]",
        )}
      >
        <span
          className={cn(
            "absolute top-1 left-1 h-5 w-5 rounded-full",
            "bg-[var(--color-surface)] shadow-[var(--shadow-sm)]",
            "transition-all duration-300 ease-out",
            checked && "translate-x-5",
          )}
        />
      </Button>
      <div className="flex-1 pt-0.5">
        <span className="block font-medium text-[var(--color-text-primary)] text-sm">
          {label}
        </span>
        {description && (
          <span className="mt-0.5 block text-[var(--color-text-muted)] text-xs leading-relaxed">
            {description}
          </span>
        )}
      </div>
    </div>
  );
}
