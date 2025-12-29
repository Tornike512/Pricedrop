import { cn } from "@/utils/cn";

type SkeletonProps = {
  className?: string;
};

function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-shimmer rounded-lg bg-[var(--color-bg-tertiary)]",
        className,
      )}
      aria-hidden="true"
    />
  );
}

export function CarCardSkeleton() {
  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-[20px] bg-[var(--color-surface)]",
        "shadow-[var(--shadow-sm)]",
      )}
    >
      {/* Image Placeholder */}
      <div className="relative aspect-[16/10] w-full animate-shimmer bg-[var(--color-bg-tertiary)]">
        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          <Skeleton className="h-6 w-14 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
        {/* Favorite button */}
        <Skeleton className="absolute top-4 right-4 h-10 w-10 rounded-full" />
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Year */}
        <Skeleton className="mb-2 h-3 w-12" />

        {/* Title */}
        <Skeleton className="mb-1 h-6 w-3/4" />

        {/* Price */}
        <Skeleton className="mt-3 mb-5 h-9 w-1/2" />

        {/* Specs Grid */}
        <div className="mb-5 grid grid-cols-2 gap-3">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-18" />
          <Skeleton className="h-5 w-20" />
        </div>

        {/* Divider */}
        <div className="mb-4 h-px bg-[var(--color-border)]" />

        {/* Footer */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-9 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function CarCardListSkeleton() {
  return (
    <div
      className={cn(
        "flex gap-6 rounded-[20px] bg-[var(--color-surface)] p-6",
        "border border-[var(--color-border)] shadow-[var(--shadow-sm)]",
      )}
    >
      {/* Left section */}
      <div className="flex flex-1 flex-col">
        {/* Badges */}
        <div className="mb-3 flex gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>

        {/* Title */}
        <Skeleton className="mb-2 h-6 w-2/3" />

        {/* Specs */}
        <div className="mt-2 flex gap-4">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-14" />
          <Skeleton className="h-5 w-18" />
        </div>
      </div>

      {/* Right section */}
      <div className="flex flex-col items-end justify-between">
        <Skeleton className="h-9 w-28" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: skeletons are stateless placeholders
        <CarCardSkeleton key={`skeleton-${i}`} />
      ))}
    </div>
  );
}

export function SkeletonList({ count = 6 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: count }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: skeletons are stateless placeholders
        <CarCardListSkeleton key={`skeleton-${i}`} />
      ))}
    </div>
  );
}
