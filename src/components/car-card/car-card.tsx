"use client";

import { useState } from "react";
import type { Car } from "@/hooks/use-get-cars";
import { cn } from "@/utils/cn";

export type LookupMap = {
  fuelTypes: Record<number, string>;
  gearTypes: Record<number, string>;
};

export interface CarCardProps extends React.HTMLAttributes<HTMLDivElement> {
  car: Car;
  lookup: LookupMap;
  isFavorite?: boolean;
  onFavoriteToggle?: (carId: number, isFavorite: boolean) => void;
}

type DealScore = "great" | "good" | "fair";

function getDealScore(car: Car): DealScore | null {
  if (!car.has_predicted_price) return null;

  if (car.price_usd < car.pred_min_price) return "great";
  if (car.price_usd <= car.predicted_price) return "good";
  return "fair";
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

function formatKilometers(km: number): string {
  return `${new Intl.NumberFormat("en-US").format(km)} km`;
}

function formatEngineVolume(volume: number): string {
  return `${(volume / 1000).toFixed(1)}L`;
}

function isNew(createdAt: string): boolean {
  const created = new Date(createdAt);
  const now = new Date();
  const hoursDiff = (now.getTime() - created.getTime()) / (1000 * 60 * 60);
  return hoursDiff <= 24;
}

const dealScoreConfig: Record<DealScore, { label: string; className: string }> =
  {
    great: {
      label: "Great Deal",
      className: "bg-emerald-100 text-emerald-800",
    },
    good: {
      label: "Good Deal",
      className: "bg-amber-100 text-amber-800",
    },
    fair: {
      label: "Fair",
      className: "bg-gray-100 text-gray-600",
    },
  };

function EyeIcon({ className }: { className?: string }) {
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
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function ExternalLinkIcon({ className }: { className?: string }) {
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
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function HeartIcon({
  className,
  filled,
}: {
  className?: string;
  filled?: boolean;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

export const CarCard = ({
  car,
  lookup,
  isFavorite: initialFavorite = false,
  onFavoriteToggle,
  className,
  ...props
}: CarCardProps) => {
  const [isFavorite, setIsFavorite] = useState(initialFavorite);

  const dealScore = getDealScore(car);
  const isNewListing = isNew(car.created_at);
  const title = `${car.prod_year} ${car.manufacturer_name} ${car.model_name}`;
  const fuelType = lookup.fuelTypes[car.fuel_type_id] ?? "Unknown";
  const gearType = lookup.gearTypes[car.gear_type_id] ?? "Unknown";

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newValue = !isFavorite;
    setIsFavorite(newValue);
    onFavoriteToggle?.(car.car_id, newValue);
  };

  return (
    <article
      className={cn(
        "group relative flex flex-col rounded-xl bg-white shadow-md",
        "transition-all duration-200 ease-out",
        "hover:-translate-y-1 hover:shadow-lg",
        "focus-within:ring-2 focus-within:ring-foreground-200",
        className,
      )}
      {...props}
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-2">
        {isNewListing && (
          <span className="rounded-full bg-foreground-200 px-2.5 py-0.5 font-semibold text-white text-xs">
            New
          </span>
        )}
        {dealScore && (
          <span
            className={cn(
              "rounded-full px-2.5 py-0.5 font-semibold text-xs",
              dealScoreConfig[dealScore].className,
            )}
          >
            {dealScoreConfig[dealScore].label}
          </span>
        )}
      </div>

      {/* Favorite Button */}
      <button
        type="button"
        onClick={handleFavoriteClick}
        className={cn(
          "absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center",
          "rounded-full bg-white/80 backdrop-blur-sm",
          "transition-colors duration-150",
          "hover:bg-white",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground-200",
          isFavorite ? "text-red-500" : "text-gray-400 hover:text-red-400",
        )}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        aria-pressed={isFavorite}
      >
        <HeartIcon className="h-5 w-5" filled={isFavorite} />
      </button>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4 pt-12">
        {/* Title */}
        <h3 className="mb-2 line-clamp-2 font-semibold text-foreground-100 text-lg">
          {title}
        </h3>

        {/* Price */}
        <p className="mb-3 font-bold text-2xl text-foreground-200">
          {formatPrice(car.price_usd)}
        </p>

        {/* Specs Row */}
        <div className="mb-4 flex flex-wrap gap-x-3 gap-y-1 text-gray-600 text-sm">
          <span>{formatKilometers(car.car_run_km)}</span>
          <span className="text-gray-300">|</span>
          <span>{formatEngineVolume(car.engine_volume)}</span>
          <span className="text-gray-300">|</span>
          <span>{fuelType}</span>
          <span className="text-gray-300">|</span>
          <span>{gearType}</span>
        </div>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between border-gray-100 border-t pt-3">
          {/* Views */}
          <div className="flex items-center gap-1.5 text-gray-500 text-sm">
            <EyeIcon className="h-4 w-4" />
            <span>{car.views.toLocaleString()}</span>
          </div>

          {/* External Link */}
          <a
            href={car.link}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "flex items-center gap-1 text-foreground-200 text-sm",
              "transition-colors duration-150",
              "hover:underline",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground-200 focus-visible:ring-offset-2",
            )}
            aria-label={`View ${title} on original source (opens in new tab)`}
          >
            <span className="sr-only sm:not-sr-only">View listing</span>
            <ExternalLinkIcon className="h-4 w-4" />
          </a>
        </div>
      </div>
    </article>
  );
};
