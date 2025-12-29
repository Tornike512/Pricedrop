"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";

export type RangeSliderProps = {
  min: number;
  max: number;
  step?: number;
  valueMin: number | null;
  valueMax: number | null;
  onChangeMin: (value: number | null) => void;
  onChangeMax: (value: number | null) => void;
  formatValue?: (value: number) => string;
  formatInput?: (value: number) => string;
  parseInput?: (value: string) => number | null;
  label: string;
  unit?: string;
  showInputs?: boolean;
};

export function RangeSlider({
  min,
  max,
  step = 1,
  valueMin,
  valueMax,
  onChangeMin,
  onChangeMax,
  formatValue = (v) => v.toString(),
  formatInput = (v) => v.toString(),
  parseInput = (v) => {
    const num = Number.parseFloat(v.replace(/[^0-9.-]/g, ""));
    return Number.isNaN(num) ? null : num;
  },
  label,
  unit,
  showInputs = true,
}: RangeSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<"min" | "max" | null>(null);

  const effectiveMin = valueMin ?? min;
  const effectiveMax = valueMax ?? max;

  const getPercent = useCallback(
    (value: number) => ((value - min) / (max - min)) * 100,
    [min, max],
  );

  const getValueFromPercent = useCallback(
    (percent: number) => {
      const raw = min + (percent / 100) * (max - min);
      const stepped = Math.round(raw / step) * step;
      return Math.max(min, Math.min(max, stepped));
    },
    [min, max, step],
  );

  const handleTrackClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const percent = ((e.clientX - rect.left) / rect.width) * 100;
      const value = getValueFromPercent(percent);

      const distToMin = Math.abs(value - effectiveMin);
      const distToMax = Math.abs(value - effectiveMax);

      if (distToMin <= distToMax) {
        onChangeMin(value);
      } else {
        onChangeMax(value);
      }
    },
    [effectiveMin, effectiveMax, getValueFromPercent, onChangeMin, onChangeMax],
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragging || !trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const percent = Math.max(
        0,
        Math.min(100, ((e.clientX - rect.left) / rect.width) * 100),
      );
      const value = getValueFromPercent(percent);

      if (dragging === "min") {
        onChangeMin(Math.min(value, effectiveMax));
      } else {
        onChangeMax(Math.max(value, effectiveMin));
      }
    },
    [
      dragging,
      effectiveMin,
      effectiveMax,
      getValueFromPercent,
      onChangeMin,
      onChangeMax,
    ],
  );

  const handleMouseUp = useCallback(() => {
    setDragging(null);
  }, []);

  useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [dragging, handleMouseMove, handleMouseUp]);

  const minPercent = getPercent(effectiveMin);
  const maxPercent = getPercent(effectiveMax);

  return (
    <div className="space-y-4">
      <span className="block font-medium text-[var(--color-text-primary)] text-sm">
        {label}
      </span>

      {/* Slider Track */}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: Slider handles inside are the focusable elements */}
      {/* biome-ignore lint/a11y/noStaticElementInteractions: Track is decorative */}
      <div
        ref={trackRef}
        className="relative h-2 cursor-pointer rounded-full bg-[var(--color-bg-tertiary)]"
        onClick={handleTrackClick}
      >
        {/* Active Range */}
        <div
          className="absolute h-full rounded-full bg-gradient-to-r from-[var(--color-accent-secondary)] to-[var(--color-accent-primary)]"
          style={{
            left: `${minPercent}%`,
            width: `${maxPercent - minPercent}%`,
          }}
        />

        {/* Min Handle */}
        <div
          role="slider"
          tabIndex={0}
          className={cn(
            "-translate-x-1/2 -translate-y-1/2 absolute top-1/2 h-5 w-5 cursor-pointer rounded-full",
            "bg-[var(--color-surface)] shadow-[var(--shadow-md)]",
            "border-2 border-[var(--color-accent-primary)]",
            "transition-all duration-200 hover:scale-110",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-primary)] focus-visible:ring-offset-2",
            dragging === "min" && "scale-125 shadow-[var(--shadow-lg)]",
          )}
          style={{ left: `${minPercent}%` }}
          onMouseDown={() => setDragging("min")}
          aria-label={`Minimum ${label}`}
          aria-valuemin={min}
          aria-valuemax={effectiveMax}
          aria-valuenow={effectiveMin}
          aria-valuetext={formatValue(effectiveMin)}
        />

        {/* Max Handle */}
        <div
          role="slider"
          tabIndex={0}
          className={cn(
            "-translate-x-1/2 -translate-y-1/2 absolute top-1/2 h-5 w-5 cursor-pointer rounded-full",
            "bg-[var(--color-surface)] shadow-[var(--shadow-md)]",
            "border-2 border-[var(--color-accent-primary)]",
            "transition-all duration-200 hover:scale-110",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-primary)] focus-visible:ring-offset-2",
            dragging === "max" && "scale-125 shadow-[var(--shadow-lg)]",
          )}
          style={{ left: `${maxPercent}%` }}
          onMouseDown={() => setDragging("max")}
          aria-label={`Maximum ${label}`}
          aria-valuemin={effectiveMin}
          aria-valuemax={max}
          aria-valuenow={effectiveMax}
          aria-valuetext={formatValue(effectiveMax)}
        />
      </div>

      {/* Value Display / Inputs */}
      {showInputs ? (
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={valueMin !== null ? formatInput(valueMin) : ""}
            onChange={(e) => {
              const parsed = parseInput(e.target.value);
              onChangeMin(
                parsed !== null ? Math.min(parsed, effectiveMax) : null,
              );
            }}
            placeholder={formatInput(min)}
            className={cn(
              "w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]",
              "px-3 py-2.5 text-[var(--color-text-primary)] text-sm",
              "placeholder:text-[var(--color-text-muted)]",
              "transition-all duration-200",
              "focus:border-[var(--color-accent-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]/20",
              "focus:bg-[var(--color-surface)]",
            )}
            aria-label={`Minimum ${label}`}
          />
          <span className="font-light text-[var(--color-text-muted)]">to</span>
          <input
            type="text"
            value={valueMax !== null ? formatInput(valueMax) : ""}
            onChange={(e) => {
              const parsed = parseInput(e.target.value);
              onChangeMax(
                parsed !== null ? Math.max(parsed, effectiveMin) : null,
              );
            }}
            placeholder={formatInput(max)}
            className={cn(
              "w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]",
              "px-3 py-2.5 text-[var(--color-text-primary)] text-sm",
              "placeholder:text-[var(--color-text-muted)]",
              "transition-all duration-200",
              "focus:border-[var(--color-accent-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]/20",
              "focus:bg-[var(--color-surface)]",
            )}
            aria-label={`Maximum ${label}`}
          />
          {unit && (
            <span className="shrink-0 text-[var(--color-text-muted)] text-sm">
              {unit}
            </span>
          )}
        </div>
      ) : (
        <div className="flex justify-between text-[var(--color-text-secondary)] text-sm">
          <span className="font-medium">{formatValue(effectiveMin)}</span>
          <span className="font-medium">{formatValue(effectiveMax)}</span>
        </div>
      )}
    </div>
  );
}
