import { cn } from "@/utils/cn";

type SkeletonProps = {
  className?: string;
};

function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded bg-gray-200", className)}
      aria-hidden="true"
    />
  );
}

export function CarCardSkeleton() {
  return (
    <div className="flex flex-col rounded-xl bg-white p-4 shadow-md">
      {/* Badges area */}
      <div className="mb-3 flex gap-2">
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>

      {/* Title */}
      <Skeleton className="mb-2 h-6 w-3/4" />

      {/* Price */}
      <Skeleton className="mb-4 h-8 w-1/2" />

      {/* Specs */}
      <div className="mb-4 flex gap-3">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-14" />
        <Skeleton className="h-4 w-16" />
      </div>

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between border-gray-100 border-t pt-3">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  );
}

export function CarCardListSkeleton() {
  return (
    <div className="flex gap-4 rounded-xl bg-white p-4 shadow-md">
      {/* Left section */}
      <div className="flex flex-1 flex-col">
        {/* Badges */}
        <div className="mb-2 flex gap-2">
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>

        {/* Title */}
        <Skeleton className="mb-2 h-6 w-2/3" />

        {/* Specs */}
        <div className="flex gap-3">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-14" />
          <Skeleton className="h-4 w-18" />
        </div>
      </div>

      {/* Right section */}
      <div className="flex flex-col items-end justify-between">
        <Skeleton className="h-8 w-24" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
