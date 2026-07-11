"use client";

import { AppIcon } from "@/components/ui/app-icon";
import Link from "next/link";
import * as React from "react";

import { MiniChart, TimeRangeControl, type TimeRange } from "@/components/ui/mini-chart";
import { MobilePageHeader, MobileShell } from "@/components/ui/mobile-shell";
import { cn } from "@/lib/utils";
import type { MarketDetail } from "@/lib/portfolio-data";

export default function MarketDetailView({ market }: { market: MarketDetail }) {
  const [range, setRange] = React.useState<TimeRange>("1W");
  const tone =
    market.risk === "High" ? "red" : market.risk === "Medium" ? "yellow" : "green";

  return (
    <MobileShell>
        <MobilePageHeader title="Market" backHref="/explore" backLabel="Back to explore" />

        <section className="mt-4 rounded-[24px] border border-white/10 bg-[radial-gradient(circle_at_82%_4%,rgba(204,255,0,0.16),rgba(17,18,23,1)_42%)] p-3.5">
          <div className="flex items-start gap-3">
            <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${market.color}`}>
              <AppIcon
                icon={market.icon}
                aria-hidden="true"
                width={28}
                height={28}
                className={market.color === "bg-[#ccff00]" ? "text-black" : "text-white"}
              />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h2 className="truncate text-base font-black text-white">
                  {market.asset} on {market.protocol}
                </h2>
                <span className="rounded-full bg-[#3B33BD]/20 px-2.5 py-1 text-[10px] font-black text-[#ccff00]">
                  {market.category}
                </span>
              </div>
              <p className="mt-1.5 text-xs font-medium leading-relaxed text-[#A7A7B7]">
                {market.description}
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs font-medium text-[#A7A7B7]">Current rate</p>
              <p className="mt-1 text-3xl font-black text-white">{market.primary}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-[#A7A7B7]">TVL</p>
              <p className="mt-1 text-2xl font-black text-[#ccff00]">{market.tvl}</p>
            </div>
          </div>
        </section>

        <section className="mt-4">
          <TimeRangeControl value={range} onChange={setRange} />
          <MiniChart
            values={market.chartData[range]}
            label={`${market.category} market trend`}
            tone={tone}
            range={range}
            defaultView="bar"
            className="mt-3"
          />
        </section>

        <section className="mt-3 grid grid-cols-3 overflow-hidden rounded-[20px] border border-white/10 bg-[#111217]">
          {[
            ["Risk", market.risk],
            ["Util.", market.utilization],
            ["Signal", market.secondary],
          ].map(([label, value], index) => (
            <div key={label} className={cn("p-2.5", index < 2 && "border-r border-white/10")}>
              <p className="text-xs font-medium text-[#A7A7B7]">{label}</p>
              <p className="mt-1.5 text-xs font-black text-white">{value}</p>
            </div>
          ))}
        </section>

        <section className="mt-3 rounded-[22px] border border-white/10 bg-[#111217] p-3.5">
          <h2 className="text-sm font-black text-white">Before entering</h2>
          <p className="mt-1.5 text-xs font-medium leading-relaxed text-[#A7A7B7]">
            Review utilization and risk before routing capital. Higher utilization
            can improve yield but may reduce liquidity and make exits slower.
          </p>
        </section>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <Link
            href="/ai/strategy"
            className="flex h-12 items-center justify-center rounded-full bg-[#ccff00] text-sm font-black text-black transition-transform active:scale-95 focus-visible:ring-2 focus-visible:ring-[#ccff00]/70"
          >
            View Strategy
          </Link>
          <Link
            href="/ai"
            className="flex h-12 items-center justify-center rounded-full bg-[#1C1C1E] text-sm font-black text-white transition-colors hover:bg-[#262628] focus-visible:ring-2 focus-visible:ring-[#3B33BD]"
          >
            Ask Agent
          </Link>
        </div>
    </MobileShell>
  );
}
