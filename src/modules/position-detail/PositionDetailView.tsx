"use client";

import { AppIcon } from "@/components/ui/app-icon";
import Link from "next/link";
import * as React from "react";

import { MiniChart, TimeRangeControl, type TimeRange } from "@/components/ui/mini-chart";
import { MobilePageHeader, MobileShell } from "@/components/ui/mobile-shell";
import { cn } from "@/lib/utils";
import type { PositionDetail } from "@/lib/portfolio-data";

const riskClassName = {
  Low: "text-[#ccff00]",
  Medium: "text-[#FFD166]",
  High: "text-[#FF6B6B]",
};

const kindClassName = {
  Yield: "border-[#ccff00]/25 bg-[#ccff00]/10 text-[#ccff00]",
  Lend: "border-[#3B82F6]/25 bg-[#3B82F6]/10 text-[#75A7FF]",
  Borrow: "border-[#FFB020]/25 bg-[#FFB020]/10 text-[#FFD166]",
};

export default function PositionDetailView({
  position,
}: {
  position: PositionDetail;
}) {
  const [range, setRange] = React.useState<TimeRange>("1W");
  const tone =
    position.risk === "High" ? "red" : position.risk === "Medium" ? "yellow" : "green";

  return (
    <MobileShell>
        <MobilePageHeader title="Position" backHref="/assets" backLabel="Back to assets" />

        <section className="mt-4 rounded-[24px] border border-white/10 bg-[radial-gradient(circle_at_80%_0%,rgba(59,51,189,0.42),rgba(17,18,23,1)_46%)] p-3.5">
          <div className="flex items-start gap-3">
            <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/[0.08]">
              <AppIcon icon={position.icon} className="h-8 w-8" aria-hidden="true" />
              <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border border-[#111217] bg-black">
                <AppIcon
                  icon={position.protocolIcon}
                  className={cn("h-4 w-4", position.protocolTone)}
                  aria-hidden="true"
                />
              </span>
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h2 className="truncate text-base font-black text-white">
                  {position.asset} / {position.protocol}
                </h2>
                <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-black", kindClassName[position.kind])}>
                  {position.kind}
                </span>
              </div>
              <p className="mt-1.5 text-xs font-medium leading-relaxed text-[#A7A7B7]">
                {position.summary}
              </p>
            </div>
          </div>

          <div className="mt-5 flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-[#A7A7B7]">Position value</p>
              <p className="mt-1 text-3xl font-black text-white">{position.balance}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-[#A7A7B7]">Health</p>
              <p className="mt-1 text-2xl font-black text-[#ccff00]">{position.health}</p>
            </div>
          </div>
        </section>

        <section className="mt-4">
          <TimeRangeControl value={range} onChange={setRange} />
          <MiniChart
            values={position.chartData[range]}
            label={`${position.protocol} position trend`}
            tone={tone}
            range={range}
            defaultView="line"
            className="mt-3"
          />
        </section>

        <section className="mt-3 grid grid-cols-3 overflow-hidden rounded-[20px] border border-white/10 bg-[#111217]">
          {[
            ["Risk", position.risk],
            ["Return", position.detail],
            ["Action", position.action],
          ].map(([label, value], index) => (
            <div key={label} className={cn("p-2.5", index < 2 && "border-r border-white/10")}>
              <p className="text-xs font-medium text-[#A7A7B7]">{label}</p>
              <p className={cn("mt-1.5 text-xs font-black text-white", label === "Risk" && riskClassName[position.risk])}>
                {value}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-3 rounded-[22px] border border-white/10 bg-[#111217] p-3.5">
          <h2 className="text-sm font-black text-white">Exposure</h2>
          <p className="mt-1.5 text-xs font-medium leading-relaxed text-[#A7A7B7]">
            {position.exposure}. AI recommends keeping this position active while
            health stays above 75 and reducing exposure if risk rises.
          </p>
        </section>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <Link
            href="/ai/strategy"
            className="flex h-12 items-center justify-center rounded-full bg-[#ccff00] text-sm font-black text-[#3B33BD] transition-transform active:scale-95 focus-visible:ring-2 focus-visible:ring-[#ccff00]/70"
          >
            Rebalance
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
