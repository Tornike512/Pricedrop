import { cn } from "@/utils/cn";

function CarSearchIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 120"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {/* Car body */}
      <path
        d="M20 70 L25 55 L40 45 L80 45 L95 55 L100 70 L100 80 L20 80 Z"
        fill="var(--color-bg-tertiary)"
        stroke="var(--color-accent-tertiary)"
        strokeWidth="2"
      />
      {/* Windows */}
      <path
        d="M42 50 L45 55 L75 55 L78 50 L60 48 Z"
        fill="var(--color-bg-secondary)"
        stroke="var(--color-accent-tertiary)"
        strokeWidth="1"
      />
      {/* Wheels */}
      <circle
        cx="35"
        cy="80"
        r="10"
        fill="var(--color-text-muted)"
        stroke="var(--color-text-secondary)"
        strokeWidth="2"
      />
      <circle cx="35" cy="80" r="4" fill="var(--color-bg-secondary)" />
      <circle
        cx="85"
        cy="80"
        r="10"
        fill="var(--color-text-muted)"
        stroke="var(--color-text-secondary)"
        strokeWidth="2"
      />
      <circle cx="85" cy="80" r="4" fill="var(--color-bg-secondary)" />
      {/* Headlights */}
      <rect
        x="22"
        y="65"
        width="6"
        height="4"
        rx="1"
        fill="var(--color-accent-primary)"
      />
      <rect
        x="92"
        y="65"
        width="6"
        height="4"
        rx="1"
        fill="var(--color-accent-primary)"
      />
      {/* Search magnifier */}
      <circle
        cx="85"
        cy="35"
        r="18"
        fill="var(--color-surface)"
        stroke="var(--color-accent-primary)"
        strokeWidth="3"
      />
      <line
        x1="98"
        y1="48"
        x2="110"
        y2="60"
        stroke="var(--color-accent-primary)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* Question mark in magnifier */}
      <text
        x="85"
        y="42"
        textAnchor="middle"
        fill="var(--color-accent-secondary)"
        fontSize="20"
        fontWeight="bold"
      >
        ?
      </text>
    </svg>
  );
}

export function EmptyState() {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-8 py-20 text-center",
        "rounded-2xl bg-[var(--color-surface)]",
        "border border-[var(--color-border)]",
        "shadow-[var(--shadow-sm)]",
      )}
    >
      <div className="mb-8 rounded-full bg-[var(--color-bg-secondary)] p-6">
        <CarSearchIcon className="h-24 w-24" />
      </div>

      <h3 className="mb-3 font-display font-semibold text-2xl text-[var(--color-text-primary)]">
        No cars found
      </h3>

      <p className="mb-8 max-w-md text-[var(--color-text-secondary)] leading-relaxed">
        We couldn&apos;t find any cars matching your criteria. Try adjusting
        your filters to discover more options.
      </p>

      <div
        className={cn(
          "rounded-xl bg-[var(--color-bg-secondary)] p-6",
          "border border-[var(--color-border)]",
        )}
      >
        <p className="mb-3 font-medium text-[var(--color-text-primary)] text-sm">
          Try these suggestions:
        </p>
        <ul className="space-y-2 text-left">
          {[
            "Expand your price range",
            "Remove some filters",
            "Try a different manufacturer",
            "Increase the maximum mileage",
          ].map((suggestion) => (
            <li
              key={suggestion}
              className="flex items-center gap-3 text-[var(--color-text-secondary)] text-sm"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent-primary)]" />
              {suggestion}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
