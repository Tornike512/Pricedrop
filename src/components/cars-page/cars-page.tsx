"use client";

import { useCallback, useMemo, useState } from "react";
import type { LookupMap } from "@/components/car-card";
import {
  DEFAULT_FILTERS,
  FilterPanel,
  type FilterState,
  type LookupItem,
  type Manufacturer,
  type Model,
} from "@/components/filter-panel";
import {
  ListingsPage,
  type SortOption,
  type ViewMode,
} from "@/components/listings-page";
import { useGetCars } from "@/hooks/use-get-cars";

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

export function CarsPage() {
  // Filter state
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  // UI state
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
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
      page_size: 16,
    };
  }, [filters]);

  // Fetch cars data
  const { data, isLoading, fetchNextPage, hasNextPage } =
    useGetCars(queryParams);

  // Flatten paginated data
  const allCars = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page.items);
  }, [data]);

  // Derive manufacturers from car data
  const manufacturers = useMemo<Manufacturer[]>(() => {
    const map = new Map<number, string>();
    for (const car of allCars) {
      if (!map.has(car.man_id) && car.manufacturer_name) {
        map.set(car.man_id, car.manufacturer_name);
      }
    }
    return Array.from(map.entries())
      .map(([man_id, manufacturer_name]) => ({ man_id, manufacturer_name }))
      .sort((a, b) =>
        (a.manufacturer_name ?? "").localeCompare(b.manufacturer_name ?? ""),
      );
  }, [allCars]);

  // Derive models from car data
  const models = useMemo<Model[]>(() => {
    const map = new Map<number, { man_id: number; model_name: string }>();
    for (const car of allCars) {
      if (!map.has(car.model_id) && car.model_name) {
        map.set(car.model_id, {
          man_id: car.man_id,
          model_name: car.model_name,
        });
      }
    }
    return Array.from(map.entries())
      .map(([model_id, { man_id, model_name }]) => ({
        model_id,
        man_id,
        model_name,
      }))
      .sort((a, b) => (a.model_name ?? "").localeCompare(b.model_name ?? ""));
  }, [allCars]);

  // Derive fuel types from car data
  const fuelTypes = useMemo<LookupItem[]>(() => {
    const ids = new Set<number>();
    for (const car of allCars) {
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
  }, [allCars]);

  // Derive gear types from car data
  const gearTypes = useMemo<LookupItem[]>(() => {
    const ids = new Set<number>();
    for (const car of allCars) {
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
  }, [allCars]);

  // Build lookup map for CarCard
  const lookupMap = useMemo<LookupMap>(
    () => ({
      fuelTypes: FUEL_TYPE_LABELS,
      gearTypes: GEAR_TYPE_LABELS,
    }),
    [],
  );

  // Apply client-side filtering for multi-select filters and deals only
  const filteredCars = useMemo(() => {
    let cars = [...allCars];

    // Filter by multiple fuel types
    if (filters.fuelTypeIds.length > 1) {
      cars = cars.filter((car) =>
        filters.fuelTypeIds.includes(car.fuel_type_id),
      );
    }

    // Filter by multiple gear types
    if (filters.gearTypeIds.length > 1) {
      cars = cars.filter((car) =>
        filters.gearTypeIds.includes(car.gear_type_id),
      );
    }

    // Filter by mileage
    const maxMileage = filters.mileageMax;
    if (maxMileage !== null) {
      cars = cars.filter((car) => car.car_run_km <= maxMileage);
    }

    // Filter by engine volume
    const minEngine = filters.engineVolumeMin;
    const maxEngine = filters.engineVolumeMax;
    if (minEngine !== null) {
      cars = cars.filter((car) => car.engine_volume >= minEngine);
    }
    if (maxEngine !== null) {
      cars = cars.filter((car) => car.engine_volume <= maxEngine);
    }

    // Filter deals only
    if (filters.dealsOnly) {
      cars = cars.filter(
        (car) => car.has_predicted_price && car.price_usd < car.predicted_price,
      );
    }

    return cars;
  }, [allCars, filters]);

  // Apply sorting
  const sortedCars = useMemo(() => {
    const cars = [...filteredCars];

    switch (sortBy) {
      case "newest":
        return cars.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
      case "price_asc":
        return cars.sort((a, b) => a.price_usd - b.price_usd);
      case "price_desc":
        return cars.sort((a, b) => b.price_usd - a.price_usd);
      case "mileage_asc":
        return cars.sort((a, b) => a.car_run_km - b.car_run_km);
      case "best_deals":
        return cars
          .filter((car) => car.has_predicted_price)
          .sort((a, b) => {
            const ratioA = a.price_usd / a.predicted_price;
            const ratioB = b.price_usd / b.predicted_price;
            return ratioA - ratioB;
          });
      default:
        return cars;
    }
  }, [filteredCars, sortBy]);

  // Pagination state (client-side for now)
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 16;
  const totalPages = Math.ceil(sortedCars.length / pageSize);
  const paginatedCars = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedCars.slice(start, start + pageSize);
  }, [sortedCars, currentPage]);

  // Reset page when filters or sort change
  const handleFilterChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);

  const handleSortChange = useCallback((sort: SortOption) => {
    setSortBy(sort);
    setCurrentPage(1);
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

  // Load more when reaching last pages
  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);

      // If we're near the end and have more data, fetch it
      if (page >= totalPages - 1 && hasNextPage) {
        fetchNextPage();
      }
    },
    [totalPages, hasNextPage, fetchNextPage],
  );

  return (
    <div className="min-h-screen bg-background-100">
      {/* Header */}
      <header className="border-gray-200 border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="font-bold text-2xl text-foreground-100">
              Pricedrop
            </h1>
            <p className="text-gray-500 text-sm">Find your perfect car deal</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
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
              items={paginatedCars}
              total={sortedCars.length}
              page={currentPage}
              pageSize={pageSize}
              totalPages={totalPages}
              loading={isLoading}
              lookup={lookupMap}
              sortBy={sortBy}
              viewMode={viewMode}
              favorites={favorites}
              onSortChange={handleSortChange}
              onPageChange={handlePageChange}
              onViewChange={setViewMode}
              onFavoriteToggle={handleFavoriteToggle}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
