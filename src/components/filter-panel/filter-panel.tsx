"use client";

import { useCallback, useEffect, useId, useMemo, useState } from "react";
import { cn } from "@/utils/cn";
import { RangeSlider } from "./range-slider";
import { SearchableSelect } from "./searchable-select";
import { Toggle } from "./toggle";
import {
  DEFAULT_FILTERS,
  type FilterPanelProps,
  type FilterState,
} from "./types";

function SlidersIcon({ className }: { className?: string }) {
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
      <line x1="4" x2="4" y1="21" y2="14" />
      <line x1="4" x2="4" y1="10" y2="3" />
      <line x1="12" x2="12" y1="21" y2="12" />
      <line x1="12" x2="12" y1="8" y2="3" />
      <line x1="20" x2="20" y1="21" y2="16" />
      <line x1="20" x2="20" y1="12" y2="3" />
      <line x1="2" x2="6" y1="14" y2="14" />
      <line x1="10" x2="14" y1="8" y2="8" />
      <line x1="18" x2="22" y1="16" y2="16" />
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

type CheckboxGroupProps = {
  options: { id: number; label: string }[];
  selected: number[];
  onChange: (ids: number[]) => void;
  label: string;
};

function CheckboxGroup({
  options,
  selected,
  onChange,
  label,
}: CheckboxGroupProps) {
  const handleToggle = (id: number) => {
    if (selected.includes(id)) {
      onChange(selected.filter((i) => i !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <fieldset className="space-y-3">
      <legend className="font-medium text-[var(--color-text-primary)] text-sm">
        {label}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <label
            key={option.id}
            className={cn(
              "flex cursor-pointer items-center gap-2",
              "rounded-full border px-4 py-2 text-sm",
              "transition-all duration-200",
              selected.includes(option.id)
                ? "border-[var(--color-accent-primary)] bg-[var(--color-accent-tertiary)] font-medium text-[var(--color-accent-primary)]"
                : "border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)] hover:bg-[var(--color-bg-secondary)]",
            )}
          >
            <input
              type="checkbox"
              checked={selected.includes(option.id)}
              onChange={() => handleToggle(option.id)}
              className="sr-only"
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

type YearSelectProps = {
  value: number | null;
  onChange: (value: number | null) => void;
  min: number;
  max: number;
  label: string;
  placeholder: string;
};

function YearSelect({
  value,
  onChange,
  min,
  max,
  label,
  placeholder,
}: YearSelectProps) {
  const id = useId();
  const years = useMemo(() => {
    const result: number[] = [];
    for (let y = max; y >= min; y--) {
      result.push(y);
    }
    return result;
  }, [min, max]);

  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={id}
          className="block font-medium text-[var(--color-text-primary)] text-sm"
        >
          {label}
        </label>
      )}
      <select
        id={id}
        value={value ?? ""}
        onChange={(e) =>
          onChange(e.target.value ? Number(e.target.value) : null)
        }
        aria-label={!label ? placeholder : undefined}
        className={cn(
          "w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]",
          "appearance-none px-4 py-3 text-sm",
          "transition-all duration-200",
          "focus:border-[var(--color-accent-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]/20",
          "focus:bg-[var(--color-surface)]",
          !value
            ? "text-[var(--color-text-muted)]"
            : "text-[var(--color-text-primary)]",
        )}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%238A8A8A'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 12px center",
          backgroundSize: "16px",
        }}
      >
        <option value="">{placeholder}</option>
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
}

export function FilterPanel({
  filters,
  onFilterChange,
  manufacturers,
  models,
  fuelTypes,
  gearTypes,
  applyOnChange = true,
  priceRange = { min: 0, max: 200000 },
  yearRange = { min: 2000, max: new Date().getFullYear() },
  mileageRange = { min: 0, max: 500000 },
  engineVolumeRange = { min: 500, max: 6000 },
}: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const updateFilter = useCallback(
    <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
      const updated = { ...localFilters, [key]: value };

      if (key === "manufacturerId") {
        updated.modelId = null;
      }

      setLocalFilters(updated);
      if (applyOnChange) {
        onFilterChange(updated);
      }
    },
    [localFilters, applyOnChange, onFilterChange],
  );

  const handleClearAll = () => {
    setLocalFilters(DEFAULT_FILTERS);
    if (applyOnChange) {
      onFilterChange(DEFAULT_FILTERS);
    }
  };

  const handleApply = () => {
    onFilterChange(localFilters);
    setIsOpen(false);
  };

  const availableModels = useMemo(() => {
    if (!localFilters.manufacturerId) return [];
    return models.filter((m) => m.man_id === localFilters.manufacturerId);
  }, [models, localFilters.manufacturerId]);

  const hasActiveFilters = useMemo(() => {
    return (
      localFilters.priceMin !== null ||
      localFilters.priceMax !== null ||
      localFilters.manufacturerId !== null ||
      localFilters.modelId !== null ||
      localFilters.yearMin !== null ||
      localFilters.yearMax !== null ||
      localFilters.mileageMax !== null ||
      localFilters.engineVolumeMin !== null ||
      localFilters.engineVolumeMax !== null ||
      localFilters.fuelTypeIds.length > 0 ||
      localFilters.gearTypeIds.length > 0 ||
      localFilters.dealsOnly
    );
  }, [localFilters]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (localFilters.priceMin !== null || localFilters.priceMax !== null)
      count++;
    if (localFilters.manufacturerId !== null) count++;
    if (localFilters.modelId !== null) count++;
    if (localFilters.yearMin !== null || localFilters.yearMax !== null) count++;
    if (localFilters.mileageMax !== null) count++;
    if (
      localFilters.engineVolumeMin !== null ||
      localFilters.engineVolumeMax !== null
    )
      count++;
    if (localFilters.fuelTypeIds.length > 0) count++;
    if (localFilters.gearTypeIds.length > 0) count++;
    if (localFilters.dealsOnly) count++;
    return count;
  }, [localFilters]);

  const formatPrice = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);

  const formatMileage = (value: number) =>
    `${new Intl.NumberFormat("en-US").format(value)} km`;

  const formatEngineVolume = (value: number) => `${(value / 1000).toFixed(1)}L`;

  const panelContent = (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-[var(--color-divider)] border-b p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-[var(--color-accent-tertiary)] p-2">
            <SlidersIcon className="h-5 w-5 text-[var(--color-accent-primary)]" />
          </div>
          <div>
            <h2 className="font-display font-semibold text-[var(--color-text-primary)] text-xl">
              Filters
            </h2>
            {hasActiveFilters && (
              <p className="text-[var(--color-accent-primary)] text-xs">
                {activeFilterCount} active
              </p>
            )}
          </div>
        </div>

        {/* Mobile close button */}
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="rounded-full p-2 transition-colors hover:bg-[var(--color-bg-secondary)] lg:hidden"
          aria-label="Close filters"
        >
          <XIcon className="h-5 w-5 text-[var(--color-text-muted)]" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 space-y-8 overflow-y-auto p-6">
        {/* Deals Only Toggle - Featured */}
        <div className="rounded-2xl border border-[var(--color-success)]/20 bg-[var(--color-success-soft)] p-4">
          <Toggle
            label="Show Deals Only"
            description="Cars priced below predicted market value"
            checked={localFilters.dealsOnly}
            onChange={(v) => updateFilter("dealsOnly", v)}
          />
        </div>

        {/* Price Range */}
        <RangeSlider
          label="Price Range"
          min={priceRange.min}
          max={priceRange.max}
          step={1000}
          valueMin={localFilters.priceMin}
          valueMax={localFilters.priceMax}
          onChangeMin={(v) => updateFilter("priceMin", v)}
          onChangeMax={(v) => updateFilter("priceMax", v)}
          formatValue={formatPrice}
          formatInput={(v) => v.toString()}
          parseInput={(v) => {
            const num = Number.parseInt(v.replace(/[^0-9]/g, ""), 10);
            return Number.isNaN(num) ? null : num;
          }}
        />

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent" />

        {/* Manufacturer */}
        <SearchableSelect
          label="Manufacturer"
          options={manufacturers.map((m) => ({
            value: m.man_id,
            label: m.manufacturer_name,
          }))}
          value={localFilters.manufacturerId}
          onChange={(v) => updateFilter("manufacturerId", v)}
          placeholder="Any manufacturer"
        />

        {/* Model */}
        <SearchableSelect
          label="Model"
          options={availableModels.map((m) => ({
            value: m.model_id,
            label: m.model_name,
          }))}
          value={localFilters.modelId}
          onChange={(v) => updateFilter("modelId", v)}
          placeholder="Any model"
          disabled={!localFilters.manufacturerId}
          disabledMessage="Select manufacturer first"
        />

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent" />

        {/* Year Range */}
        <div className="space-y-3">
          <span className="block font-medium text-[var(--color-text-primary)] text-sm">
            Year Range
          </span>
          <div className="grid grid-cols-2 gap-4">
            <YearSelect
              label=""
              value={localFilters.yearMin}
              onChange={(v) => updateFilter("yearMin", v)}
              min={yearRange.min}
              max={localFilters.yearMax ?? yearRange.max}
              placeholder="From"
            />
            <YearSelect
              label=""
              value={localFilters.yearMax}
              onChange={(v) => updateFilter("yearMax", v)}
              min={localFilters.yearMin ?? yearRange.min}
              max={yearRange.max}
              placeholder="To"
            />
          </div>
        </div>

        {/* Mileage */}
        <div className="space-y-4">
          <label
            htmlFor="mileage-range"
            className="block font-medium text-[var(--color-text-primary)] text-sm"
          >
            Max Mileage
          </label>
          <input
            id="mileage-range"
            type="range"
            min={mileageRange.min}
            max={mileageRange.max}
            step={5000}
            value={localFilters.mileageMax ?? mileageRange.max}
            onChange={(e) => {
              const val = Number(e.target.value);
              updateFilter("mileageMax", val === mileageRange.max ? null : val);
            }}
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[var(--color-bg-tertiary)]"
            style={{
              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${
                ((localFilters.mileageMax ?? mileageRange.max) /
                  mileageRange.max) *
                100
              }%, #f1f5f9 ${
                ((localFilters.mileageMax ?? mileageRange.max) /
                  mileageRange.max) *
                100
              }%, #f1f5f9 100%)`,
            }}
          />
          <div className="flex justify-between text-[var(--color-text-muted)] text-xs">
            <span>{formatMileage(mileageRange.min)}</span>
            <span className="font-medium text-[var(--color-text-primary)] text-sm">
              {localFilters.mileageMax
                ? formatMileage(localFilters.mileageMax)
                : "Any"}
            </span>
            <span>{formatMileage(mileageRange.max)}</span>
          </div>
        </div>

        {/* Engine Volume */}
        <RangeSlider
          label="Engine Volume"
          min={engineVolumeRange.min}
          max={engineVolumeRange.max}
          step={100}
          valueMin={localFilters.engineVolumeMin}
          valueMax={localFilters.engineVolumeMax}
          onChangeMin={(v) => updateFilter("engineVolumeMin", v)}
          onChangeMax={(v) => updateFilter("engineVolumeMax", v)}
          formatValue={formatEngineVolume}
          formatInput={formatEngineVolume}
          parseInput={(v) => {
            const num = Number.parseFloat(v.replace(/[^0-9.]/g, ""));
            return Number.isNaN(num) ? null : Math.round(num * 1000);
          }}
          showInputs={false}
        />

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent" />

        {/* Fuel Type */}
        <CheckboxGroup
          label="Fuel Type"
          options={fuelTypes}
          selected={localFilters.fuelTypeIds}
          onChange={(ids) => updateFilter("fuelTypeIds", ids)}
        />

        {/* Transmission */}
        <CheckboxGroup
          label="Transmission"
          options={gearTypes}
          selected={localFilters.gearTypeIds}
          onChange={(ids) => updateFilter("gearTypeIds", ids)}
        />
      </div>

      {/* Footer */}
      <div className="border-[var(--color-divider)] border-t p-6">
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleClearAll}
            disabled={!hasActiveFilters}
            className={cn(
              "flex-1 rounded-xl border border-[var(--color-border)] px-4 py-3 font-medium text-sm",
              "transition-all duration-200",
              hasActiveFilters
                ? "text-[var(--color-text-primary)] hover:border-[var(--color-border-strong)] hover:bg-[var(--color-bg-secondary)]"
                : "cursor-not-allowed text-[var(--color-text-muted)] opacity-50",
            )}
          >
            Clear All
          </button>
          {!applyOnChange && (
            <button
              type="button"
              onClick={handleApply}
              className={cn(
                "flex-1 rounded-xl px-4 py-3 font-medium text-sm",
                "bg-[var(--color-accent-primary)]",
                "text-[var(--color-text-inverse)]",
                "transition-all duration-200",
                "hover:bg-[var(--color-accent-secondary)] hover:shadow-[var(--shadow-md)]",
                "active:scale-[0.98]",
              )}
            >
              Apply Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 left-6 z-40 flex items-center gap-3 rounded-full px-5 py-4 lg:hidden",
          "bg-[var(--color-accent-primary)]",
          "text-[var(--color-text-inverse)] shadow-[var(--shadow-lg)]",
          "transition-all duration-300",
          "hover:bg-[var(--color-accent-secondary)] hover:shadow-[var(--shadow-xl)]",
          "active:scale-95",
        )}
        aria-label="Open filters"
      >
        <SlidersIcon className="h-5 w-5" />
        <span className="font-medium text-sm">Filters</span>
        {hasActiveFilters && (
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-surface)] font-semibold text-[var(--color-accent-primary)] text-xs">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 animate-fade-in bg-[var(--color-text-primary)]/40 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Slide-in Panel */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-80 max-w-[85vw]",
          "bg-[var(--color-surface)] shadow-[var(--shadow-xl)]",
          "transition-transform duration-300 ease-out lg:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {panelContent}
      </aside>

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden h-fit w-80 overflow-hidden",
          "rounded-2xl bg-[var(--color-surface)] shadow-[var(--shadow-md)]",
          "border border-[var(--color-border)]",
          "lg:block",
        )}
      >
        {panelContent}
      </aside>
    </>
  );
}
