"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export type TimeRange = "1D" | "1W" | "1M" | "1Y";

export const timeRanges: TimeRange[] = ["1D", "1W", "1M", "1Y"];

type MiniChartProps = {
  values: number[];
  label: string;
  tone?: "green" | "purple" | "yellow" | "red";
  className?: string;
};

const toneClassName = {
  green: "text-[#ccff00]",
  purple: "text-[#8F89FF]",
  yellow: "text-[#FFD166]",
  red: "text-[#FF6B6B]",
};

const strokeColor = {
  green: "#ccff00",
  purple: "#8F89FF",
  yellow: "#FFD166",
  red: "#FF6B6B",
};

export function MiniChart({
  values,
  label,
  tone = "green",
  className,
}: MiniChartProps) {
  const chart = React.useMemo(() => {
    const width = 320;
    const height = 112;
    const padding = 10;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;

    const points = values.map((value, index) => {
      const x =
        padding +
        (index / Math.max(values.length - 1, 1)) * (width - padding * 2);
      const y =
        height -
        padding -
        ((value - min) / range) * (height - padding * 2);

      return [x, y] as const;
    });

    const line = points
      .map(([x, y], index) => `${index === 0 ? "M" : "L"} ${x} ${y}`)
      .join(" ");
    const area = `${line} L ${width - padding} ${height - padding} L ${padding} ${height - padding} Z`;

    return { width, height, line, area, points };
  }, [values]);

  return (
    <div className={cn("rounded-[20px] border border-white/10 bg-black/25 p-3", className)}>
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase text-[#8F8F99]">{label}</p>
        <p className={cn("text-xs font-black", toneClassName[tone])}>
          {values[values.length - 1] >= values[0] ? "+" : "-"}
          {Math.abs(values[values.length - 1] - values[0]).toFixed(2)}%
        </p>
      </div>

      <svg
        viewBox={`0 0 ${chart.width} ${chart.height}`}
        className="mt-2 h-28 w-full overflow-visible"
        role="img"
        aria-label={`${label} chart`}
      >
        <defs>
          <linearGradient id={`mini-chart-${tone}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={strokeColor[tone]} stopOpacity="0.26" />
            <stop offset="100%" stopColor={strokeColor[tone]} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[24, 56, 88].map((y) => (
          <line
            key={y}
            x1="10"
            x2="310"
            y1={y}
            y2={y}
            stroke="rgba(255,255,255,0.08)"
            strokeDasharray="4 6"
          />
        ))}
        <path d={chart.area} fill={`url(#mini-chart-${tone})`} />
        <path
          d={chart.line}
          fill="none"
          stroke={strokeColor[tone]}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3"
        />
        <circle
          cx={chart.points[chart.points.length - 1]?.[0]}
          cy={chart.points[chart.points.length - 1]?.[1]}
          r="4"
          fill={strokeColor[tone]}
          stroke="#111217"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}

export function TimeRangeControl({
  value,
  onChange,
}: {
  value: TimeRange;
  onChange: (range: TimeRange) => void;
}) {
  return (
    <div className="grid grid-cols-4 rounded-full bg-black/30 p-1">
      {timeRanges.map((range) => (
        <button
          key={range}
          type="button"
          onClick={() => onChange(range)}
          className={cn(
            "h-8 rounded-full text-xs font-black transition-colors focus-visible:ring-2 focus-visible:ring-[#3B33BD]",
            value === range
              ? "bg-[#3B33BD] text-[#ccff00]"
              : "text-[#8F8F99] hover:text-white",
          )}
        >
          {range}
        </button>
      ))}
    </div>
  );
}
