"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { LookupMap } from "@/components/car-card";
import {
  FilterPanel,
  type FilterState,
  type LookupItem,
  type Manufacturer,
} from "@/components/filter-panel";
import { ListingsPage, type SortOption } from "@/components/listings-page";
import { useGetCars } from "@/hooks/use-get-cars";
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

  // Fetch cars data
  const { data, isLoading } = useGetCars(queryParams);

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
      <header className="border-[var(--color-border)] border-b bg-[var(--color-surface)]/80 backdrop-blur-xl">
        <div className="mx-auto max-w-[1800px] px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src="/images/pricedrop-logo.png"
                alt="Pricedrop"
                width={100}
                height={100}
              />
            </div>
            <p className="text-[var(--color-text-muted)] text-sm">
              Find your perfect car deal
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-[1800px] px-4 py-6 sm:px-6 lg:px-8">
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
          />

          {/* Listings */}
          <div className="flex-1">
            <ListingsPage
              items={cars}
              total={total}
              page={currentPage}
              pageSize={PAGE_SIZE}
              totalPages={totalPages}
              loading={isLoading}
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
