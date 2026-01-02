"use client";

import Image from "next/image";
import type { Car } from "@/hooks/use-get-cars";
import { cn } from "@/utils/cn";

export type LookupMap = {
  fuelTypes: Record<number, string>;
  gearTypes: Record<number, string>;
  manufacturers?: Record<number, string>;
  models?: Record<number, string>;
};

export interface CarCardProps extends React.HTMLAttributes<HTMLDivElement> {
  car: Car;
  lookup: LookupMap;
  isFavorite?: boolean;
  onFavoriteToggle?: (carId: number, isFavorite: boolean) => void;
  animationDelay?: number;
}

type DealScore = "great" | "good" | "fair";

function getDealScore(car: Car): DealScore | null {
  if (
    !car.has_predicted_price ||
    car.predicted_price == null ||
    car.pred_min_price == null
  ) {
    return null;
  }

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
  if (km >= 1000) {
    return `${(km / 1000).toFixed(0)}k km`;
  }
  return `${km} km`;
}

function formatEngineVolume(volume: number): string {
  return `${(volume / 1000).toFixed(1)}L`;
}

const dealScoreConfig: Record<
  DealScore,
  { label: string; className: string; icon: string }
> = {
  great: {
    label: "Exceptional Value",
    className:
      "bg-[var(--color-success-soft)] text-[var(--color-success)] border border-[var(--color-success)]/20",
    icon: "sparkles",
  },
  good: {
    label: "Good Deal",
    className:
      "bg-[var(--color-warning-soft)] text-[var(--color-warning)] border border-[var(--color-warning)]/20",
    icon: "check",
  },
  fair: {
    label: "Fair Price",
    className:
      "bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)] border border-[var(--color-border)]",
    icon: "minus",
  },
};

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function EyeIcon({ className }: { className?: string }) {
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
      <path d="M2.062 12.348a1 1 0 010-.696 10.75 10.75 0 0119.876 0 1 1 0 010 .696 10.75 10.75 0 01-19.876 0" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function ArrowUpRightIcon({ className }: { className?: string }) {
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
      <path d="M7 17L17 7" />
      <path d="M7 7h10v10" />
    </svg>
  );
}

function GaugeIcon({ className }: { className?: string }) {
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
      <path d="M12 16.5V14" />
      <path d="M12 2a10 10 0 100 20 10 10 0 000-20z" />
      <path d="M12 6v2" />
      <path d="M16.24 7.76l-1.41 1.41" />
      <path d="M18 12h-2" />
      <path d="M7.76 7.76l1.41 1.41" />
      <path d="M6 12h2" />
    </svg>
  );
}

function FuelIcon({ className }: { className?: string }) {
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
      <path d="M3 22V5a2 2 0 012-2h8a2 2 0 012 2v17" />
      <path d="M15 22H3" />
      <path d="M15 13h2a2 2 0 012 2v4a2 2 0 002 2v0a2 2 0 002-2V9.83a2 2 0 00-.59-1.42L18 4" />
      <path d="M7 10h4" />
    </svg>
  );
}

function GearIcon({ className }: { className?: string }) {
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
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  );
}

function EngineIcon({ className }: { className?: string }) {
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
      <rect x="2" y="6" width="4" height="12" rx="1" />
      <rect x="18" y="6" width="4" height="12" rx="1" />
      <rect x="6" y="4" width="12" height="16" rx="2" />
      <line x1="10" y1="8" x2="10" y2="16" />
      <line x1="14" y1="8" x2="14" y2="16" />
    </svg>
  );
}

function CarSilhouette({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 60"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M10 45c0-1.1.9-2 2-2h8c0-4.4 3.6-8 8-8h4l8-12c1.3-2 3.5-3 5.8-3h28.4c2.3 0 4.5 1 5.8 3l8 12h4c4.4 0 8 3.6 8 8h8c1.1 0 2 .9 2 2v4c0 1.1-.9 2-2 2h-6c0 4.4-3.6 8-8 8s-8-3.6-8-8H36c0 4.4-3.6 8-8 8s-8-3.6-8-8h-8c-1.1 0-2-.9-2-2v-4z"
        opacity="0.15"
      />
      <circle cx="28" cy="51" r="6" opacity="0.2" />
      <circle cx="92" cy="51" r="6" opacity="0.2" />
    </svg>
  );
}

export const CarCard = ({
  car,
  lookup,
  isFavorite: initialFavorite = false,
  onFavoriteToggle,
  animationDelay = 0,
  className,
  ...props
}: CarCardProps) => {
  const dealScore = getDealScore(car);
  const manufacturerName =
    car.manufacturer_name ?? lookup.manufacturers?.[car.man_id] ?? "Unknown";
  const modelName =
    car.model_name ?? lookup.models?.[car.model_id] ?? "Unknown";
  const title = `${car.prod_year} ${manufacturerName} ${modelName}`;
  const fuelType = lookup.fuelTypes[car.fuel_type_id] ?? "Unknown";
  const gearType = lookup.gearTypes[car.gear_type_id] ?? "Unknown";

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden",
        "rounded-[20px] bg-[var(--color-surface)]",
        "border border-[var(--color-border)]",
        "shadow-[var(--shadow-sm)]",
        "transition-all duration-[300ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
        "hover:-translate-y-1 hover:border-[var(--color-accent-primary)]/30 hover:shadow-[var(--shadow-lg)]",
        "animate-fade-in-up",
        className,
      )}
      style={{ animationDelay: `${animationDelay}ms` }}
      {...props}
    >
      {/* Image */}
      <div className="relative aspect-square w-full overflow-hidden bg-[var(--color-bg-tertiary)]">
        {car.image_url ? (
          <Image
            src={car.image_url}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <>
            {/* Fallback: Manufacturer Initial */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="select-none font-bold font-display text-[120px] text-[var(--color-border-strong)] leading-none">
                {manufacturerName.charAt(0)}
              </span>
            </div>
            {/* Fallback: Car Silhouette */}
            <div className="absolute inset-0 flex items-center justify-center">
              <CarSilhouette className="h-24 w-full max-w-[180px] text-[var(--color-text-muted)] opacity-30" />
            </div>
          </>
        )}

        {/* Badges Row */}
        <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2">
          {car.views <= 100 && (
            <span
              className={cn(
                "inline-flex items-center gap-1.5",
                "rounded-full px-3 py-1",
                "bg-[var(--color-accent-primary)] text-[var(--color-text-inverse)]",
                "font-medium text-xs uppercase tracking-wide",
                "shadow-[var(--shadow-sm)]",
              )}
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
              </span>
              New
            </span>
          )}
          {dealScore && dealScore !== "fair" && (
            <span
              className={cn(
                "inline-flex items-center gap-1.5",
                "rounded-full px-3 py-1",
                "font-medium text-xs tracking-wide",
                dealScoreConfig[dealScore].className,
              )}
            >
              {dealScore === "great" && <SparklesIcon className="h-3 w-3" />}
              {dealScoreConfig[dealScore].label}
            </span>
          )}
        </div>
      </div>

      {/* Content Container */}
      <div className="flex flex-1 flex-col justify-between p-5">
        {/* Year + Title Group */}
        <div>
          {/* Year Badge */}
          <span className="mb-2 font-medium text-[var(--color-accent-primary)] text-xs uppercase tracking-widest">
            {car.prod_year}
          </span>

          {/* Title */}
          <h3
            className={cn(
              "font-display font-semibold text-xl leading-tight",
              "text-[var(--color-text-primary)]",
              "mb-1 line-clamp-2",
            )}
          >
            {manufacturerName} {modelName}
          </h3>
        </div>

        {/* Price + Specs + Footer Group */}
        <div>
          {/* Price Section */}
          <div className="mt-3 mb-5">
            <p
              className={cn(
                "font-bold font-display text-3xl tracking-tight",
                "bg-gradient-to-r from-[var(--color-accent-primary)] to-[var(--color-accent-secondary)] bg-clip-text text-transparent",
              )}
            >
              {formatPrice(car.price_usd)}
            </p>
            {car.has_predicted_price &&
              car.predicted_price != null &&
              car.price_usd < car.predicted_price && (
                <p className="mt-1 text-[var(--color-text-muted)] text-sm">
                  <span className="line-through">
                    {formatPrice(car.predicted_price)}
                  </span>
                  <span className="ml-2 font-medium text-[var(--color-success)]">
                    Save {formatPrice(car.predicted_price - car.price_usd)}
                  </span>
                </p>
              )}
          </div>

          {/* Specs Grid */}
          <div className="mb-5 grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-[var(--color-text-secondary)] text-sm">
              <GaugeIcon className="h-4 w-4 text-[var(--color-accent-primary)]/60" />
              <span>{formatKilometers(car.car_run_km)}</span>
            </div>
            <div className="flex items-center gap-2 text-[var(--color-text-secondary)] text-sm">
              <EngineIcon className="h-4 w-4 text-[var(--color-accent-primary)]/60" />
              <span>{formatEngineVolume(car.engine_volume)}</span>
            </div>
            <div className="flex items-center gap-2 text-[var(--color-text-secondary)] text-sm">
              <FuelIcon className="h-4 w-4 text-[var(--color-accent-primary)]/60" />
              <span>{fuelType}</span>
            </div>
            <div className="flex items-center gap-2 text-[var(--color-text-secondary)] text-sm">
              <GearIcon className="h-4 w-4 text-[var(--color-accent-primary)]/60" />
              <span>{gearType}</span>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-[var(--color-accent-primary)]/20 to-transparent" />

          {/* Footer */}
          <div className="mt-4 flex items-center justify-between">
            {/* Views */}
            <div className="flex items-center gap-2 text-[var(--color-text-muted)] text-sm">
              <EyeIcon className="h-4 w-4 text-[var(--color-accent-primary)]/50" />
              <span>{car.views.toLocaleString()} views</span>
            </div>

            {/* View Listing Link */}
            <a
              href={car.link}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex items-center gap-1.5",
                "rounded-full px-4 py-2",
                "border border-[var(--color-accent-primary)]/20 bg-[var(--color-accent-tertiary)]",
                "font-medium text-[var(--color-accent-primary)] text-sm",
                "transition-all duration-200",
                "hover:bg-[var(--color-accent-primary)] hover:text-[var(--color-text-inverse)]",
                "group/link",
              )}
              aria-label={`View ${title} on original source`}
            >
              <span>View</span>
              <ArrowUpRightIcon
                className={cn(
                  "h-3.5 w-3.5",
                  "transition-transform duration-200",
                  "group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5",
                )}
              />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
};
