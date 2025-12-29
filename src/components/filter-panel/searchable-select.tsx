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
    <div className="space-y-1.5">
      <span className="block font-medium text-foreground-100 text-sm">
        {label}
      </span>

      <div ref={containerRef} className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={cn(
            "flex w-full items-center justify-between rounded-md border px-3 py-2",
            "text-left text-sm transition-colors",
            disabled
              ? "cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400"
              : "border-gray-200 bg-white hover:border-gray-300",
            isOpen && "border-foreground-200 ring-1 ring-foreground-200",
          )}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span
            className={selectedOption ? "text-foreground-100" : "text-gray-400"}
          >
            {disabled && disabledMessage
              ? disabledMessage
              : selectedOption?.label || placeholder}
          </span>
          <div className="flex items-center gap-1">
            {value !== null && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="rounded p-0.5 hover:bg-gray-100"
                aria-label="Clear selection"
              >
                <XIcon className="h-3.5 w-3.5 text-gray-400" />
              </button>
            )}
            <ChevronDownIcon
              className={cn(
                "h-4 w-4 text-gray-400 transition-transform",
                isOpen && "rotate-180",
              )}
            />
          </div>
        </button>

        {isOpen && (
          <div
            className={cn(
              "absolute z-50 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg",
            )}
          >
            {/* Search Input */}
            <div className="border-gray-200 border-b p-2">
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search..."
                className={cn(
                  "w-full rounded border border-gray-200 px-2 py-1.5 text-sm",
                  "focus:border-foreground-200 focus:outline-none focus:ring-1 focus:ring-foreground-200",
                )}
              />
            </div>

            {/* Options List */}
            <div className="max-h-48 overflow-y-auto p-1">
              {filteredOptions.length === 0 ? (
                <div className="px-3 py-2 text-center text-gray-500 text-sm">
                  No options found
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className={cn(
                      "w-full cursor-pointer rounded px-3 py-2 text-left text-sm transition-colors",
                      option.value === value
                        ? "bg-foreground-200/10 text-foreground-200"
                        : "text-foreground-100 hover:bg-gray-100",
                    )}
                  >
                    {option.label}
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
