"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";

export type DropdownOption<T extends string = string> = {
  value: T;
  label: string;
};

export type DropdownProps<T extends string = string> = {
  options: DropdownOption<T>[];
  value: T;
  onChange: (value: T) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  className?: string;
};

function ChevronIcon({
  className,
  open,
}: {
  className?: string;
  open?: boolean;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(
        "h-4 w-4 transition-transform duration-200",
        open && "rotate-180",
        className,
      )}
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function Dropdown<T extends string = string>({
  options,
  value,
  onChange,
  placeholder = "Select...",
  icon,
  className,
}: DropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = useCallback(
    (optionValue: T) => {
      onChange(optionValue);
      setIsOpen(false);
    },
    [onChange],
  );

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={cn(
          "flex w-full items-center gap-3",
          "rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]",
          "px-4 py-2.5",
          "text-left text-sm",
          "transition-all duration-200",
          "hover:border-[var(--color-border-strong)]",
          "focus:border-[var(--color-accent-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]/20",
          isOpen &&
            "border-[var(--color-accent-primary)] ring-2 ring-[var(--color-accent-primary)]/20",
        )}
      >
        {icon && (
          <span className="text-[var(--color-accent-primary)]">{icon}</span>
        )}
        <span className="flex-1 text-[var(--color-text-primary)]">
          {selectedOption?.label ?? placeholder}
        </span>
        <ChevronIcon open={isOpen} className="text-[var(--color-text-muted)]" />
      </button>

      {isOpen && (
        <div
          className={cn(
            "absolute z-50 mt-2 w-full",
            "rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]",
            "max-h-60 overflow-auto py-1.5 shadow-lg",
          )}
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={cn(
                "w-full cursor-pointer px-4 py-2.5 text-left text-sm",
                "transition-colors duration-100",
                option.value === value
                  ? "bg-[var(--color-accent-primary)]/10 font-medium text-[var(--color-accent-primary)]"
                  : "text-[var(--color-text-primary)]",
                "hover:bg-[var(--color-bg-secondary)]",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
