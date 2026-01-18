"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { LookupMap } from "@/components/car-card";
import {
  FilterPanel,
  type FilterState,
  type LookupItem,
  type Manufacturer,
} from "@/components/filter-panel";
import { ListingsPage, type SortOption } from "@/components/listings-page";
import { useCountdown } from "@/hooks/use-countdown";
import {
  POLLING_INTERVAL_FAST,
  POLLING_INTERVAL_SLOW,
  useGetCars,
} from "@/hooks/use-get-cars";
import {
  useGetManufacturers,
  useGetModels,
} from "@/hooks/use-get-manufacturers";

// Parse URL params to filter state
function parseFiltersFromUrl(searchParams: URLSearchParams): FilterState {
  const parseNumber = (key: string): number | null => {
    const value = searchParams.get(key);
    if (value === null) return null;
    const num = Number(value);
    return Number.isNaN(num) ? null : num;
  };

  const parseNumberArray = (key: string): number[] => {
    const value = searchParams.get(key);
    if (!value) return [];
    return value
      .split(",")
      .map(Number)
      .filter((n) => !Number.isNaN(n));
  };

  return {
    priceMin: parseNumber("price_min"),
    priceMax: parseNumber("price_max"),
    manufacturerId: parseNumber("man_id"),
    modelId: parseNumber("model_id"),
    yearMin: parseNumber("year_min"),
    yearMax: parseNumber("year_max"),
    mileageMax: parseNumber("mileage_max"),
    engineVolumeMin: parseNumber("engine_min"),
    engineVolumeMax: parseNumber("engine_max"),
    fuelTypeIds: parseNumberArray("fuel_types"),
    gearTypeIds: parseNumberArray("gear_types"),
    dealsOnly: searchParams.get("deals_only") === "true",
  };
}

// Build URL params from filter state
function buildUrlParams(
  filters: FilterState,
  page: number,
  sortBy: SortOption,
): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.priceMin !== null)
    params.set("price_min", String(filters.priceMin));
  if (filters.priceMax !== null)
    params.set("price_max", String(filters.priceMax));
  if (filters.manufacturerId !== null)
    params.set("man_id", String(filters.manufacturerId));
  if (filters.modelId !== null) params.set("model_id", String(filters.modelId));
  if (filters.yearMin !== null) params.set("year_min", String(filters.yearMin));
  if (filters.yearMax !== null) params.set("year_max", String(filters.yearMax));
  if (filters.mileageMax !== null)
    params.set("mileage_max", String(filters.mileageMax));
  if (filters.engineVolumeMin !== null)
    params.set("engine_min", String(filters.engineVolumeMin));
  if (filters.engineVolumeMax !== null)
    params.set("engine_max", String(filters.engineVolumeMax));
  if (filters.fuelTypeIds.length > 0)
    params.set("fuel_types", filters.fuelTypeIds.join(","));
  if (filters.gearTypeIds.length > 0)
    params.set("gear_types", filters.gearTypeIds.join(","));
  if (filters.dealsOnly) params.set("deals_only", "true");
  if (page > 1) params.set("page", String(page));
  if (sortBy !== "newest") params.set("sort", sortBy);

  return params;
}

// Default lookup labels for fuel and gear types
const FUEL_TYPE_LABELS: Record<number, string> = {
  1: "Petrol",
  2: "Diesel",
  3: "Hybrid",
  4: "Electric",
  5: "LPG",
  6: "CNG",
};

const GEAR_TYPE_LABELS: Record<number, string> = {
  1: "Manual",
  2: "Automatic",
  3: "Tiptronic",
  4: "CVT",
};

const PAGE_SIZE = 16;

function HamburgerIcon({ className }: { className?: string }) {
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
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function RefreshIcon({ className }: { className?: string }) {
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
      <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
    </svg>
  );
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins > 0) {
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }
  return `${secs}s`;
}

export function CarsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Initialize state from URL params
  const [filters, setFilters] = useState<FilterState>(() =>
    parseFiltersFromUrl(searchParams),
  );
  const [currentPage, setCurrentPage] = useState(() => {
    const page = searchParams.get("page");
    return page ? Number(page) || 1 : 1;
  });
  const [sortBy, setSortBy] = useState<SortOption>(() => {
    const sort = searchParams.get("sort");
    return (sort as SortOption) || "newest";
  });
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [newCarsCount, setNewCarsCount] = useState(0);
  const [pollingInterval, setPollingInterval] = useState(POLLING_INTERVAL_FAST);
  const [showTimer, setShowTimer] = useState(false);
  const previousCarIdsRef = useRef<Set<number>>(new Set());

  // Countdown timer for next refresh (only active when showTimer is true)
  const { secondsRemaining, reset: resetCountdown } = useCountdown({
    duration: POLLING_INTERVAL_SLOW,
    enabled: showTimer,
  });

  // Count active filters for badge
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.priceMin !== null || filters.priceMax !== null) count++;
    if (filters.manufacturerId !== null) count++;
    if (filters.modelId !== null) count++;
    if (filters.yearMin !== null || filters.yearMax !== null) count++;
    if (filters.mileageMax !== null) count++;
    if (filters.engineVolumeMin !== null || filters.engineVolumeMax !== null)
      count++;
    if (filters.fuelTypeIds.length > 0) count++;
    if (filters.gearTypeIds.length > 0) count++;
    if (filters.dealsOnly) count++;
    return count;
  }, [filters]);

  // Sync state to URL
  useEffect(() => {
    const params = buildUrlParams(filters, currentPage, sortBy);
    const newUrl = params.toString()
      ? `?${params.toString()}`
      : window.location.pathname;
    router.replace(newUrl, { scroll: false });
  }, [filters, currentPage, sortBy, router]);

  // Build query params from filters
  const queryParams = useMemo(() => {
    return {
      man_id: filters.manufacturerId,
      model_id: filters.modelId,
      fuel_type_ids:
        filters.fuelTypeIds.length > 0 ? filters.fuelTypeIds : null,
      gear_type_ids:
        filters.gearTypeIds.length > 0 ? filters.gearTypeIds : null,
      prod_year_from: filters.yearMin,
      prod_year_to: filters.yearMax,
      price_from: filters.priceMin,
      price_to: filters.priceMax,
      mileage_max: filters.mileageMax,
      engine_volume_min: filters.engineVolumeMin,
      engine_volume_max: filters.engineVolumeMax,
      deals_only: filters.dealsOnly || null,
      sort: sortBy,
      page_size: PAGE_SIZE,
      page: currentPage,
    };
  }, [filters, currentPage, sortBy]);

  // Fetch cars data with polling
  const { data, isLoading, isFetching } = useGetCars(
    queryParams,
    pollingInterval,
  );

  // Detect new cars and manage polling/timer state
  useEffect(() => {
    if (!data?.items) return;

    const currentCarIds = new Set(data.items.map((car) => car.car_id));

    // Only check for new cars if we have previous data (not initial load)
    if (previousCarIdsRef.current.size > 0) {
      const newCars = data.items.filter(
        (car) => !previousCarIdsRef.current.has(car.car_id),
      );
      if (newCars.length > 0) {
        // New cars found!
        setNewCarsCount(newCars.length);
        // Switch to slow polling and show timer
        setPollingInterval(POLLING_INTERVAL_SLOW);
        setShowTimer(true);
        resetCountdown();
        // Clear the "new cars" indicator after 5 seconds (timer stays visible)
        setTimeout(() => setNewCarsCount(0), 5000);
      } else {
        // No new cars - go back to silent fast polling
        setPollingInterval(POLLING_INTERVAL_FAST);
        setShowTimer(false);
      }
    }

    previousCarIdsRef.current = currentCarIds;
  }, [data?.items, resetCountdown]);

  // Fetch manufacturers from API
  const { data: manufacturersData } = useGetManufacturers();

  // Fetch models for selected manufacturer
  const { data: modelsData } = useGetModels(filters.manufacturerId);

  // Sort manufacturers alphabetically
  const manufacturers = useMemo<Manufacturer[]>(() => {
    if (!manufacturersData) return [];
    return [...manufacturersData].sort((a, b) =>
      (a.manufacturer_name ?? "").localeCompare(b.manufacturer_name ?? ""),
    );
  }, [manufacturersData]);

  // Get cars from current page
  const cars = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.total_pages ?? 1;

  // Static fuel types list
  const fuelTypes = useMemo<LookupItem[]>(
    () =>
      Object.entries(FUEL_TYPE_LABELS)
        .map(([id, label]) => ({ id: Number(id), label }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [],
  );

  // Static gear types list
  const gearTypes = useMemo<LookupItem[]>(
    () =>
      Object.entries(GEAR_TYPE_LABELS)
        .map(([id, label]) => ({ id: Number(id), label }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [],
  );

  // Build lookup map for CarCard
  const lookupMap = useMemo<LookupMap>(() => {
    const manufacturerLookup: Record<number, string> = {};
    for (const m of manufacturersData ?? []) {
      manufacturerLookup[m.man_id] = m.manufacturer_name;
    }
    return {
      fuelTypes: FUEL_TYPE_LABELS,
      gearTypes: GEAR_TYPE_LABELS,
      manufacturers: manufacturerLookup,
    };
  }, [manufacturersData]);

  // All filtering and sorting is now done on the backend

  // Reset page when filters change
  const handleFilterChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);

  const handleSortChange = useCallback((sort: SortOption) => {
    setSortBy(sort);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleFavoriteToggle = useCallback(
    (carId: number, isFavorite: boolean) => {
      setFavorites((prev) => {
        const next = new Set(prev);
        if (isFavorite) {
          next.add(carId);
        } else {
          next.delete(carId);
        }
        return next;
      });
    },
    [],
  );

  return (
    <div className="min-h-screen bg-background-100">
      {/* Header */}
      <header className="sticky top-0 z-30 border-[var(--color-border)] border-b bg-[var(--color-surface)]">
        <div className="mx-auto max-w-[1800px] px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
          <div className="flex items-center justify-between gap-3">
            <div className="flex shrink-0 items-center gap-3">
              <Image
                src="/images/pricedrop-logo.png"
                alt="Pricedrop"
                width={100}
                height={100}
              />
            </div>

            {/* Refresh Timer & New Cars Indicator - Only shown after new cars are found */}
            <div className="flex flex-1 items-center justify-center gap-2">
              {newCarsCount > 0 ? (
                <div className="flex items-center gap-2 rounded-full bg-[var(--color-success-soft)] px-3 py-1.5 text-[var(--color-success)]">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-success)] opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-success)]" />
                  </span>
                  <span className="font-medium text-xs sm:text-sm">
                    +{newCarsCount} new cars added!
                  </span>
                </div>
              ) : showTimer ? (
                <div className="flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-3 py-1.5 text-[var(--color-text-muted)]">
                  <RefreshIcon className="h-3.5 w-3.5" />
                  <span className="text-xs sm:text-sm">
                    <span className="hidden sm:inline">New cars in </span>
                    <span className="font-medium font-mono text-[var(--color-text-primary)]">
                      {formatTime(secondsRemaining)}
                    </span>
                  </span>
                </div>
              ) : null}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsFilterOpen(true)}
                className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-bg-secondary)] lg:hidden"
                aria-label="Open filters"
              >
                <HamburgerIcon className="h-5 w-5" />
                {activeFilterCount > 0 && (
                  <span className="-top-1 -right-1 absolute flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-accent-primary)] font-semibold text-[var(--color-text-inverse)] text-xs">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-[1800px] overflow-hidden px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex gap-6">
          {/* Filter Panel */}
          <FilterPanel
            filters={filters}
            onFilterChange={handleFilterChange}
            manufacturers={manufacturers}
            models={modelsData ?? []}
            fuelTypes={fuelTypes}
            gearTypes={gearTypes}
            applyOnChange={true}
            isOpen={isFilterOpen}
            onOpenChange={setIsFilterOpen}
          />

          {/* Listings */}
          <div className="min-w-0 flex-1">
            <ListingsPage
              items={cars}
              total={total}
              page={currentPage}
              pageSize={PAGE_SIZE}
              totalPages={totalPages}
              loading={isLoading}
              refetching={isFetching && !isLoading}
              lookup={lookupMap}
              sortBy={sortBy}
              favorites={favorites}
              onSortChange={handleSortChange}
              onPageChange={handlePageChange}
              onFavoriteToggle={handleFavoriteToggle}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
