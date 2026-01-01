"use client";

import Image from "next/image";
import { useCallback, useMemo, useState } from "react";
import type { LookupMap } from "@/components/car-card";
import {
  DEFAULT_FILTERS,
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
  // Filter state
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // UI state
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

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
      page_size: PAGE_SIZE,
      page: currentPage,
    };
  }, [filters, currentPage]);

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

  // Derive fuel types from car data
  const fuelTypes = useMemo<LookupItem[]>(() => {
    const ids = new Set<number>();
    for (const car of cars) {
      if (car.fuel_type_id != null) {
        ids.add(car.fuel_type_id);
      }
    }
    return Array.from(ids)
      .map((id) => ({
        id,
        label: FUEL_TYPE_LABELS[id] ?? `Fuel Type ${id}`,
      }))
      .sort((a, b) => (a.label ?? "").localeCompare(b.label ?? ""));
  }, [cars]);

  // Derive gear types from car data
  const gearTypes = useMemo<LookupItem[]>(() => {
    const ids = new Set<number>();
    for (const car of cars) {
      if (car.gear_type_id != null) {
        ids.add(car.gear_type_id);
      }
    }
    return Array.from(ids)
      .map((id) => ({
        id,
        label: GEAR_TYPE_LABELS[id] ?? `Gear Type ${id}`,
      }))
      .sort((a, b) => (a.label ?? "").localeCompare(b.label ?? ""));
  }, [cars]);

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

  // All filtering is now done on the backend
  const filteredCars = cars;

  // Apply sorting
  const sortedCars = useMemo(() => {
    const result = [...filteredCars];

    switch (sortBy) {
      case "newest":
        return result.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
      case "price_asc":
        return result.sort((a, b) => a.price_usd - b.price_usd);
      case "price_desc":
        return result.sort((a, b) => b.price_usd - a.price_usd);
      case "mileage_asc":
        return result.sort((a, b) => a.car_run_km - b.car_run_km);
      case "best_deals":
        return result
          .filter(
            (car) => car.has_predicted_price && car.predicted_price != null,
          )
          .sort((a, b) => {
            const ratioA = a.price_usd / (a.predicted_price ?? 1);
            const ratioB = b.price_usd / (b.predicted_price ?? 1);
            return ratioA - ratioB;
          });
      default:
        return result;
    }
  }, [filteredCars, sortBy]);

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
                width={140}
                height={140}
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
              items={sortedCars}
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
