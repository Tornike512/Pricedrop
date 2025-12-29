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
        fill="#e5e7eb"
        stroke="#9ca3af"
        strokeWidth="2"
      />
      {/* Windows */}
      <path
        d="M42 50 L45 55 L75 55 L78 50 L60 48 Z"
        fill="#d1d5db"
        stroke="#9ca3af"
        strokeWidth="1"
      />
      {/* Wheels */}
      <circle
        cx="35"
        cy="80"
        r="10"
        fill="#6b7280"
        stroke="#4b5563"
        strokeWidth="2"
      />
      <circle cx="35" cy="80" r="4" fill="#9ca3af" />
      <circle
        cx="85"
        cy="80"
        r="10"
        fill="#6b7280"
        stroke="#4b5563"
        strokeWidth="2"
      />
      <circle cx="85" cy="80" r="4" fill="#9ca3af" />
      {/* Headlights */}
      <rect x="22" y="65" width="6" height="4" rx="1" fill="#fbbf24" />
      <rect x="92" y="65" width="6" height="4" rx="1" fill="#fbbf24" />
      {/* Search magnifier */}
      <circle
        cx="85"
        cy="35"
        r="18"
        fill="white"
        stroke="#9ca3af"
        strokeWidth="3"
      />
      <line
        x1="98"
        y1="48"
        x2="110"
        y2="60"
        stroke="#9ca3af"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* Question mark in magnifier */}
      <text
        x="85"
        y="42"
        textAnchor="middle"
        fill="#9ca3af"
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
    <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
      <CarSearchIcon className="mb-6 h-32 w-32" />

      <h3 className="mb-2 font-semibold text-foreground-100 text-xl">
        No cars found
      </h3>

      <p className="mb-6 max-w-md text-gray-500">
        We couldn&apos;t find any cars matching your criteria. Try adjusting
        your filters or search terms to see more results.
      </p>

      <div className="flex flex-col gap-2 text-gray-600 text-sm">
        <p>Suggestions:</p>
        <ul className="list-inside list-disc text-left">
          <li>Expand your price range</li>
          <li>Remove some filters</li>
          <li>Try a different manufacturer or model</li>
          <li>Increase the maximum mileage</li>
        </ul>
      </div>
    </div>
  );
}
