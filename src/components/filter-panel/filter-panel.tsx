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

function FilterIcon({ className }: { className?: string }) {
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
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
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
    <fieldset className="space-y-2">
      <legend className="font-medium text-foreground-100 text-sm">
        {label}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <label
            key={option.id}
            className={cn(
              "flex cursor-pointer items-center gap-2 rounded-md border px-3 py-1.5 text-sm transition-colors",
              selected.includes(option.id)
                ? "border-foreground-200 bg-foreground-200/10 text-foreground-200"
                : "border-gray-200 text-foreground-100 hover:border-gray-300",
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
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={id}
          className="block font-medium text-foreground-100 text-sm"
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
          "w-full rounded-md border border-gray-200 px-3 py-2 text-sm",
          "focus:border-foreground-200 focus:outline-none focus:ring-1 focus:ring-foreground-200",
          !value && "text-gray-400",
        )}
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

  // Sync local filters when external filters change
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const updateFilter = useCallback(
    <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
      const updated = { ...localFilters, [key]: value };

      // Clear model when manufacturer changes
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
      <div className="flex items-center justify-between border-gray-200 border-b p-4">
        <div className="flex items-center gap-2">
          <FilterIcon className="h-5 w-5 text-foreground-100" />
          <h2 className="font-semibold text-foreground-100 text-lg">Filters</h2>
          {hasActiveFilters && (
            <span className="rounded-full bg-foreground-200 px-2 py-0.5 font-medium text-white text-xs">
              Active
            </span>
          )}
        </div>

        {/* Mobile close button */}
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="rounded-md p-1 hover:bg-gray-100 lg:hidden"
          aria-label="Close filters"
        >
          <XIcon className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 space-y-6 overflow-y-auto p-4">
        {/* Price Range */}
        <RangeSlider
          label="Price (USD)"
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

        {/* Year Range */}
        <div className="space-y-1.5">
          <span className="block font-medium text-foreground-100 text-sm">
            Year Range
          </span>
          <div className="grid grid-cols-2 gap-3">
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
        <div className="space-y-3">
          <label className="block font-medium text-foreground-100 text-sm">
            <span className="mb-3 block">Max Mileage</span>
            <input
              type="range"
              min={mileageRange.min}
              max={mileageRange.max}
              step={5000}
              value={localFilters.mileageMax ?? mileageRange.max}
              onChange={(e) => {
                const val = Number(e.target.value);
                updateFilter(
                  "mileageMax",
                  val === mileageRange.max ? null : val,
                );
              }}
              className="w-full accent-foreground-200"
            />
          </label>
          <div className="flex justify-between text-gray-600 text-sm">
            <span>{formatMileage(mileageRange.min)}</span>
            <span className="font-medium text-foreground-100">
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

        {/* Deals Only Toggle */}
        <Toggle
          label="Deals Only"
          description="Show cars priced below market value"
          checked={localFilters.dealsOnly}
          onChange={(v) => updateFilter("dealsOnly", v)}
        />
      </div>

      {/* Footer */}
      <div className="border-gray-200 border-t p-4">
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleClearAll}
            disabled={!hasActiveFilters}
            className={cn(
              "flex-1 rounded-md border border-gray-200 px-4 py-2 font-medium text-sm transition-colors",
              hasActiveFilters
                ? "text-foreground-100 hover:bg-gray-50"
                : "cursor-not-allowed text-gray-300",
            )}
          >
            Clear All
          </button>
          {!applyOnChange && (
            <button
              type="button"
              onClick={handleApply}
              className="flex-1 rounded-md bg-foreground-200 px-4 py-2 font-medium text-sm text-white transition-colors hover:bg-foreground-200/90"
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
          "fixed bottom-4 left-4 z-40 flex items-center gap-2 rounded-full px-4 py-3 shadow-lg lg:hidden",
          "bg-foreground-200 text-white transition-transform hover:scale-105",
        )}
        aria-label="Open filters"
      >
        <FilterIcon className="h-5 w-5" />
        <span className="font-medium text-sm">Filters</span>
        {hasActiveFilters && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white font-semibold text-foreground-200 text-xs">
            !
          </span>
        )}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Slide-in Panel */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-80 max-w-[85vw] bg-white shadow-xl transition-transform duration-300 lg:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {panelContent}
      </aside>

      {/* Desktop Sticky Sidebar */}
      <aside className="sticky top-4 hidden h-fit max-h-[calc(100vh-2rem)] w-72 overflow-hidden rounded-xl bg-white shadow-md lg:block">
        {panelContent}
      </aside>
    </>
  );
}
