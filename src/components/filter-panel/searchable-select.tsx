"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/utils/cn";

export type SelectOption = {
  value: number;
  label: string;
};

export type SearchableSelectProps = {
  options: SelectOption[];
  value: number | null;
  onChange: (value: number | null) => void;
  placeholder?: string;
  label: string;
  disabled?: boolean;
  disabledMessage?: string;
};

function ChevronDownIcon({ className }: { className?: string }) {
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
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
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
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
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
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Select...",
  label,
  disabled = false,
  disabledMessage,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedOption = useMemo(
    () => options.find((opt) => opt.value === value),
    [options, value],
  );

  const filteredOptions = useMemo(() => {
    if (!search) return options;
    const searchLower = search.toLowerCase();
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(searchLower),
    );
  }, [options, search]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setSearch("");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (optionValue: number) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearch("");
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    setSearch("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      setSearch("");
    } else if (e.key === "Enter" && filteredOptions.length === 1) {
      handleSelect(filteredOptions[0].value);
    }
  };

  return (
    <div className="space-y-2">
      <span className="block font-medium text-[var(--color-text-primary)] text-sm">
        {label}
      </span>

      <div ref={containerRef} className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={cn(
            "flex w-full items-center justify-between rounded-xl border px-4 py-3",
            "text-left text-sm transition-all duration-200",
            disabled
              ? "cursor-not-allowed border-[var(--color-border)] bg-[var(--color-bg-tertiary)] text-[var(--color-text-muted)]"
              : "border-[var(--color-border)] bg-[var(--color-bg-secondary)] hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface)]",
            isOpen &&
              "border-[var(--color-accent-primary)] bg-[var(--color-surface)] ring-2 ring-[var(--color-accent-primary)]/20",
          )}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span
            className={
              selectedOption
                ? "text-[var(--color-text-primary)]"
                : "text-[var(--color-text-muted)]"
            }
          >
            {disabled && disabledMessage
              ? disabledMessage
              : selectedOption?.label || placeholder}
          </span>
          <div className="flex items-center gap-2">
            {value !== null && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="rounded-full p-1 transition-colors hover:bg-[var(--color-bg-tertiary)]"
                aria-label="Clear selection"
              >
                <XIcon className="h-3.5 w-3.5 text-[var(--color-text-muted)]" />
              </button>
            )}
            <ChevronDownIcon
              className={cn(
                "h-4 w-4 text-[var(--color-text-muted)] transition-transform duration-200",
                isOpen && "rotate-180",
              )}
            />
          </div>
        </button>

        {isOpen && (
          <div
            className={cn(
              "absolute z-50 mt-2 w-full",
              "rounded-xl border border-[var(--color-border)]",
              "bg-[var(--color-surface)] shadow-[var(--shadow-lg)]",
              "origin-top animate-scale-in",
            )}
          >
            {/* Search Input */}
            <div className="border-[var(--color-divider)] border-b p-3">
              <div className="relative">
                <SearchIcon className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-[var(--color-text-muted)]" />
                <input
                  ref={inputRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search..."
                  className={cn(
                    "w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)]",
                    "py-2.5 pr-3 pl-10 text-[var(--color-text-primary)] text-sm",
                    "placeholder:text-[var(--color-text-muted)]",
                    "transition-all duration-200",
                    "focus:border-[var(--color-accent-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]/20",
                    "focus:bg-[var(--color-surface)]",
                  )}
                />
              </div>
            </div>

            {/* Options List */}
            <div className="max-h-56 overflow-y-auto p-2">
              {filteredOptions.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <p className="text-[var(--color-text-muted)] text-sm">
                    No options found
                  </p>
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className={cn(
                      "flex w-full cursor-pointer items-center justify-between rounded-lg px-4 py-3 text-left text-sm",
                      "transition-all duration-150",
                      option.value === value
                        ? "bg-[var(--color-accent-tertiary)] text-[var(--color-accent-primary)]"
                        : "text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]",
                    )}
                  >
                    <span
                      className={option.value === value ? "font-medium" : ""}
                    >
                      {option.label}
                    </span>
                    {option.value === value && (
                      <CheckIcon className="h-4 w-4 text-[var(--color-accent-primary)]" />
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
