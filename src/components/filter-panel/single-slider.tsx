"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";

export type SingleSliderProps = {
  min: number;
  max: number;
  step?: number;
  value: number | null;
  onChange: (value: number | null) => void;
  formatValue?: (value: number) => string;
  label: string;
  nullAtMax?: boolean;
};

export function SingleSlider({
  min,
  max,
  step = 1,
  value,
  onChange,
  formatValue = (v) => v.toString(),
  label,
  nullAtMax = true,
}: SingleSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [localValue, setLocalValue] = useState<number | null>(null);

  const effectiveValue =
    dragging && localValue !== null ? localValue : (value ?? max);

  const getPercent = useCallback(
    (val: number) => ((val - min) / (max - min)) * 100,
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
      const newValue = getValueFromPercent(percent);
      onChange(nullAtMax && newValue === max ? null : newValue);
    },
    [getValueFromPercent, onChange, nullAtMax, max],
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragging || !trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const percent = Math.max(
        0,
        Math.min(100, ((e.clientX - rect.left) / rect.width) * 100),
      );
      const newValue = getValueFromPercent(percent);
      setLocalValue(newValue);
    },
    [dragging, getValueFromPercent],
  );

  const handleMouseUp = useCallback(() => {
    if (localValue !== null) {
      onChange(nullAtMax && localValue === max ? null : localValue);
    }
    setDragging(false);
    setLocalValue(null);
  }, [localValue, onChange, nullAtMax, max]);

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

  const percent = getPercent(effectiveValue);

  return (
    <div className="space-y-4">
      <span className="block font-medium text-[var(--color-text-primary)] text-sm">
        {label}
      </span>

      {/* Slider Track */}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: Slider handle inside is the focusable element */}
      {/* biome-ignore lint/a11y/noStaticElementInteractions: Track is decorative */}
      <div
        ref={trackRef}
        className="relative h-2 cursor-pointer rounded-full bg-[var(--color-bg-tertiary)]"
        onClick={handleTrackClick}
      >
        {/* Active Range */}
        <div
          className="absolute h-full rounded-full bg-[var(--color-accent-primary)]"
          style={{
            left: 0,
            width: `${percent}%`,
          }}
        />

        {/* Handle */}
        <div
          role="slider"
          tabIndex={0}
          className={cn(
            "-translate-x-1/2 -translate-y-1/2 absolute top-1/2 h-5 w-5 cursor-pointer rounded-full",
            "bg-[var(--color-surface)] shadow-[var(--shadow-md)]",
            "border-2 border-[var(--color-accent-primary)]",
            "transition-[transform,box-shadow] duration-200 hover:scale-110",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-primary)] focus-visible:ring-offset-2",
            dragging && "scale-125 shadow-[var(--shadow-lg)]",
          )}
          style={{ left: `${percent}%` }}
          onMouseDown={() => {
            setLocalValue(value ?? max);
            setDragging(true);
          }}
          aria-label={label}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={effectiveValue}
          aria-valuetext={formatValue(effectiveValue)}
        />
      </div>

      {/* Value Display */}
      <div className="flex justify-between text-[var(--color-text-muted)] text-xs">
        <span>{formatValue(min)}</span>
        <span className="font-medium text-[var(--color-text-primary)] text-sm">
          {nullAtMax && effectiveValue === max
            ? "Any"
            : formatValue(effectiveValue)}
        </span>
        <span>{formatValue(max)}</span>
      </div>
    </div>
  );
}
