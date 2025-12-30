"use client";

import Image from "next/image";
import { useCallback, useMemo, useState } from "react";
import type { LookupMap } from "@/components/car-card";
import {
  DEFAULT_FILTERS,
  FilterPanel,
  type FilterState,
  type LookupItem,
} from "@/components/filter-panel";
import { ListingsPage, type SortOption } from "@/components/listings-page";
import { MANUFACTURER_NAMES } from "@/constants/manufacturers";
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
      fuel_type_id:
        filters.fuelTypeIds.length === 1 ? filters.fuelTypeIds[0] : null,
      gear_type_id:
        filters.gearTypeIds.length === 1 ? filters.gearTypeIds[0] : null,
      prod_year_from: filters.yearMin,
      prod_year_to: filters.yearMax,
      price_from: filters.priceMin,
      price_to: filters.priceMax,
      page_size: PAGE_SIZE,
      page: currentPage,
    };
  }, [filters, currentPage]);

  // Fetch cars data
  const { data, isLoading } = useGetCars(queryParams);

  // Fetch manufacturers and models
  const { data: manufacturers = [] } = useGetManufacturers();
  const { data: models = [] } = useGetModels(filters.manufacturerId);

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
  const lookupMap = useMemo<LookupMap>(
    () => ({
      fuelTypes: FUEL_TYPE_LABELS,
      gearTypes: GEAR_TYPE_LABELS,
      manufacturers: MANUFACTURER_NAMES,
    }),
    [],
  );

  // Apply client-side filtering for multi-select filters and deals only
  const filteredCars = useMemo(() => {
    let result = [...cars];

    // Filter by multiple fuel types
    if (filters.fuelTypeIds.length > 1) {
      result = result.filter((car) =>
        filters.fuelTypeIds.includes(car.fuel_type_id),
      );
    }

    // Filter by multiple gear types
    if (filters.gearTypeIds.length > 1) {
      result = result.filter((car) =>
        filters.gearTypeIds.includes(car.gear_type_id),
      );
    }

    // Filter by mileage
    const maxMileage = filters.mileageMax;
    if (maxMileage !== null) {
      result = result.filter((car) => car.car_run_km <= maxMileage);
    }

    // Filter by engine volume
    const minEngine = filters.engineVolumeMin;
    const maxEngine = filters.engineVolumeMax;
    if (minEngine !== null) {
      result = result.filter((car) => car.engine_volume >= minEngine);
    }
    if (maxEngine !== null) {
      result = result.filter((car) => car.engine_volume <= maxEngine);
    }

    // Filter deals only
    if (filters.dealsOnly) {
      result = result.filter(
        (car) =>
          car.has_predicted_price &&
          car.predicted_price != null &&
          car.price_usd < car.predicted_price,
      );
    }

    return result;
  }, [cars, filters]);

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
            models={models}
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
