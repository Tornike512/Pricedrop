"use client";

import { CarCard } from "@/components/car-card";
import { cn } from "@/utils/cn";
import { EmptyState } from "./empty-state";
import { Pagination } from "./pagination";
import { SkeletonGrid } from "./skeleton";
import { SortSelect } from "./sort-select";
import type { ListingsPageProps, SortOption } from "./types";

function CarIcon({ className }: { className?: string }) {
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
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
      <circle cx="7" cy="17" r="2" />
      <path d="M9 17h6" />
      <circle cx="17" cy="17" r="2" />
    </svg>
  );
}

export function ListingsPage({
  items,
  total,
  page,
  pageSize,
  totalPages,
  loading = false,
  lookup,
  sortBy = "newest",
  favorites = new Set(),
  onSortChange,
  onPageChange,
  onFavoriteToggle,
}: ListingsPageProps) {
  const handleSortChange = (sort: SortOption) => {
    onSortChange?.(sort);
  };

  const handlePageChange = (newPage: number) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    onPageChange?.(newPage);
  };

  const handleFavoriteToggle = (carId: number, isFavorite: boolean) => {
    onFavoriteToggle?.(carId, isFavorite);
  };

  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, total);

  return (
    <div className="flex flex-col gap-8">
      {/* Results Header */}
      <div
        className={cn(
          "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
          "rounded-2xl bg-[var(--color-surface)] p-4 sm:p-5",
          "border border-[var(--color-border)]",
          "shadow-[var(--shadow-sm)]",
        )}
      >
        {/* Results Count */}
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <div className="rounded-xl bg-[var(--color-accent-tertiary)] p-2.5">
            <CarIcon className="h-5 w-5 text-[var(--color-accent-primary)]" />
          </div>
          <div>
            {loading ? (
              <div className="h-7 w-32 animate-shimmer rounded-lg bg-[var(--color-bg-tertiary)]" />
            ) : (
              <>
                <h2 className="font-display font-semibold text-[var(--color-text-primary)] text-xl">
                  <span className="text-[var(--color-accent-primary)]">
                    {total.toLocaleString()}
                  </span>{" "}
                  cars
                </h2>
                {total > 0 && (
                  <p className="text-[var(--color-text-muted)] text-sm">
                    Showing {startItem}–{endItem}
                  </p>
                )}
              </>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <SortSelect value={sortBy} onChange={handleSortChange} />
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <SkeletonGrid count={pageSize} />
      ) : items.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((car, index) => (
              <CarCard
                key={car.car_id}
                car={car}
                lookup={lookup}
                isFavorite={favorites.has(car.car_id)}
                onFavoriteToggle={handleFavoriteToggle}
                animationDelay={index * 50}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-4 flex justify-center">
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
