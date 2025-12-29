"use client";

import { CarCard } from "@/components/car-card";
import { CarCardList } from "./car-card-list";
import { EmptyState } from "./empty-state";
import { Pagination } from "./pagination";
import { SkeletonGrid, SkeletonList } from "./skeleton";
import { SortSelect } from "./sort-select";
import type { ListingsPageProps, SortOption, ViewMode } from "./types";
import { ViewToggle } from "./view-toggle";

export function ListingsPage({
  items,
  total,
  page,
  pageSize,
  totalPages,
  loading = false,
  lookup,
  sortBy = "newest",
  viewMode = "grid",
  favorites = new Set(),
  onSortChange,
  onPageChange,
  onViewChange,
  onFavoriteToggle,
}: ListingsPageProps) {
  const handleSortChange = (sort: SortOption) => {
    onSortChange?.(sort);
  };

  const handleViewChange = (view: ViewMode) => {
    onViewChange?.(view);
  };

  const handlePageChange = (newPage: number) => {
    onPageChange?.(newPage);
  };

  const handleFavoriteToggle = (carId: number, isFavorite: boolean) => {
    onFavoriteToggle?.(carId, isFavorite);
  };

  // Calculate showing range
  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, total);

  return (
    <div className="flex flex-col gap-6">
      {/* Results Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Results Count */}
        <div className="flex flex-col">
          <h2 className="font-semibold text-foreground-100 text-xl">
            {loading ? (
              <span className="inline-block h-7 w-32 animate-pulse rounded bg-gray-200" />
            ) : (
              `${total.toLocaleString()} cars found`
            )}
          </h2>
          {!loading && total > 0 && (
            <p className="text-gray-500 text-sm">
              Showing {startItem}-{endItem} of {total.toLocaleString()}
            </p>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <SortSelect value={sortBy} onChange={handleSortChange} />
          <ViewToggle value={viewMode} onChange={handleViewChange} />
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        // Loading State
        viewMode === "grid" ? (
          <SkeletonGrid count={pageSize} />
        ) : (
          <SkeletonList count={pageSize} />
        )
      ) : items.length === 0 ? (
        // Empty State
        <EmptyState />
      ) : (
        // Results
        <>
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((car) => (
                <CarCard
                  key={car.car_id}
                  car={car}
                  lookup={lookup}
                  isFavorite={favorites.has(car.car_id)}
                  onFavoriteToggle={handleFavoriteToggle}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {items.map((car) => (
                <CarCardList
                  key={car.car_id}
                  car={car}
                  lookup={lookup}
                  isFavorite={favorites.has(car.car_id)}
                  onFavoriteToggle={handleFavoriteToggle}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
