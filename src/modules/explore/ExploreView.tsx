"use client";

import { AppIcon } from "@/components/ui/app-icon";
import { motion } from "framer-motion";
import Link from "next/link";
import * as React from "react";

import { BottomSheet } from "@/components/ui/bottom-sheet";
import { MobileBottomBar, MobilePageHeader, MobileShell } from "@/components/ui/mobile-shell";
import { MiniChart, TimeRangeControl, type TimeRange } from "@/components/ui/mini-chart";
import { cn } from "@/lib/utils";

type MarketItem = {
  asset: string;
  protocol: string;
  primary: string;
  secondary: string;
  icon: string;
  color: string;
  positive?: boolean;
  category: "Lend" | "Borrow" | "Risk";
  tvl: string;
  utilization: string;
  risk: "Low" | "Medium" | "High";
  description: string;
  chartData: Record<TimeRange, number[]>;
};

type MarketCategoryFilter = "All" | MarketItem["category"];

const marketChartSeries: Record<string, Record<TimeRange, number[]>> = {
  stable: {
    "1D": [0, 0.05, 0.08, 0.12, 0.1, 0.16, 0.18],
    "1W": [0, 0.2, 0.5, 0.42, 0.72, 0.84, 1.02],
    "1M": [0, 0.8, 1.4, 2.1, 2.8, 3.2, 3.9],
    "1Y": [0, 4, 7.8, 10.4, 13.2, 15.6, 19.8],
  },
  volatile: {
    "1D": [0, -0.2, 0.5, -0.1, 0.9, 0.4, 1.3],
    "1W": [0, 1.6, -0.9, 2.8, 2.1, 4.2, 3.4],
    "1M": [0, 3.4, 1.2, 6.8, 4.4, 8.6, 7.2],
    "1Y": [0, 12, -4, 18, 34, 26, 48],
  },
  warning: {
    "1D": [0, -0.6, -0.2, -1.2, -0.8, -1.5, -1.1],
    "1W": [0, -1.8, -0.6, -3.6, -2.4, -4.8, -4.1],
    "1M": [0, -4.2, -1.6, -7.8, -5.8, -10.2, -8.4],
    "1Y": [0, 6, -8, 3, -15, -4, -21],
  },
};

const lendingPools: MarketItem[] = [
  {
    asset: "USDC",
    protocol: "Aave v3",
    primary: "5.15% APY",
    secondary: "Low risk",
    icon: "cryptocurrency-color:usdc",
    color: "bg-[#2775CA]",
    positive: true,
    category: "Lend",
    tvl: "$184.2M",
    utilization: "68%",
    risk: "Low",
    description: "Stable USDC lending market with deep liquidity and predictable yield.",
    chartData: marketChartSeries.stable,
  },
  {
    asset: "ETH",
    protocol: "Compound",
    primary: "3.42% APY",
    secondary: "Blue-chip",
    icon: "cryptocurrency-color:eth",
    color: "bg-[#627EEA]",
    positive: true,
    category: "Lend",
    tvl: "$96.4M",
    utilization: "54%",
    risk: "Low",
    description: "Blue-chip ETH lending market with lower APY and broad protocol support.",
    chartData: marketChartSeries.volatile,
  },
  {
    asset: "USDT",
    protocol: "Morpho",
    primary: "4.88% APY",
    secondary: "Stablecoin",
    icon: "cryptocurrency-color:usdt",
    color: "bg-[#26A17B]",
    positive: true,
    category: "Lend",
    tvl: "$72.8M",
    utilization: "61%",
    risk: "Low",
    description: "Conservative stablecoin lending route with steady utilization.",
    chartData: marketChartSeries.stable,
  },
];

const borrowMarkets: MarketItem[] = [
  {
    asset: "USDC",
    protocol: "Base Market",
    primary: "6.20% APR",
    secondary: "80% LTV",
    icon: "cryptocurrency-color:usdc",
    color: "bg-[#2775CA]",
    category: "Borrow",
    tvl: "$42.1M",
    utilization: "80%",
    risk: "Medium",
    description: "Borrow USDC against supported collateral. Watch utilization before entering.",
    chartData: marketChartSeries.volatile,
  },
  {
    asset: "cbETH",
    protocol: "Aave v3",
    primary: "2.14% APR",
    secondary: "70% LTV",
    icon: "cryptocurrency-color:eth",
    color: "bg-[#3B33BD]",
    category: "Borrow",
    tvl: "$38.6M",
    utilization: "70%",
    risk: "Medium",
    description: "Borrow market for cbETH collateral with moderate rate movement.",
    chartData: marketChartSeries.volatile,
  },
  {
    asset: "MOM",
    protocol: "mom3 Vault",
    primary: "9.80% APR",
    secondary: "Beta",
    icon: "solar:stars-bold",
    color: "bg-[#ccff00]",
    category: "Borrow",
    tvl: "$4.8M",
    utilization: "46%",
    risk: "High",
    description: "Beta borrow market with higher rate uncertainty and smaller liquidity.",
    chartData: marketChartSeries.warning,
  },
];

const riskWatch: MarketItem[] = [
  {
    asset: "Pendle",
    protocol: "Yield Market",
    primary: "High util.",
    secondary: "89% used",
    icon: "token-branded:pendle",
    color: "bg-[#242620]",
    category: "Risk",
    tvl: "$12.6M",
    utilization: "89%",
    risk: "High",
    description: "High utilization can make exits slower and rates less predictable.",
    chartData: marketChartSeries.warning,
  },
  {
    asset: "Ethena",
    protocol: "USDe Loop",
    primary: "Medium risk",
    secondary: "Review",
    icon: "token-branded:ethena",
    color: "bg-[#20211f]",
    category: "Risk",
    tvl: "$28.9M",
    utilization: "73%",
    risk: "Medium",
    description: "Yield loop is active but should be reviewed before adding more size.",
    chartData: marketChartSeries.warning,
  },
];

const categoryFilters: Array<{
  id: MarketCategoryFilter;
  label: string;
  icon: string;
}> = [
  { id: "All", label: "Semua", icon: "lucide:layers-3" },
  { id: "Lend", label: "Lend", icon: "solar:wallet-money-bold" },
  { id: "Borrow", label: "Borrow", icon: "solar:hand-money-bold" },
  { id: "Risk", label: "Risk", icon: "solar:shield-warning-bold" },
];

const marketCategoryStyles: Record<
  MarketItem["category"],
  {
    container: string;
    row: string;
    sectionIcon: string;
  }
> = {
  Lend: {
    container: "bg-[#1C1C1E]",
    row: "hover:bg-[#202024] focus-visible:ring-[#ccff00]/70",
    sectionIcon: "text-[#ccff00]",
  },
  Borrow: {
    container: "bg-[#1C1C1E]",
    row: "hover:bg-[#202024] focus-visible:ring-[#ccff00]/70",
    sectionIcon: "text-[#ccff00]",
  },
  Risk: {
    container: "bg-[#1C1C1E]",
    row: "hover:bg-[#202024] focus-visible:ring-[#ccff00]/70",
    sectionIcon: "text-[#ccff00]",
  },
};

const exploreFeatureCards = [
  {
    title: "Lend stablecoins",
    subtitle: "Earn up to 5.15% APY",
    icon: "solar:wallet-money-bold",
    className: "bg-[#1C1C1E]",
    iconClassName: "bg-[#2A2A3E] text-[#ccff00]",
    actionClassName: "bg-[#2A2A3E] text-[#ccff00]",
  },
  {
    title: "Borrow against ETH",
    subtitle: "Collateralized credit from 2.14% APR",
    icon: "solar:hand-money-bold",
    className: "bg-[#1C1C1E]",
    iconClassName: "bg-[#2A2A3E] text-[#ccff00]",
    actionClassName: "bg-[#2A2A3E] text-[#ccff00]",
  },
];

function matchesMarket(item: MarketItem, query: string) {
  const normalized = query.toLowerCase();
  return (
    item.asset.toLowerCase().includes(normalized) ||
    item.protocol.toLowerCase().includes(normalized) ||
    item.primary.toLowerCase().includes(normalized) ||
    item.secondary.toLowerCase().includes(normalized)
  );
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function MarketList({
  title,
  items,
}: {
  title: string;
  items: MarketItem[];
}) {
  const category = items[0]?.category ?? "Lend";
  const styles = marketCategoryStyles[category];

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mt-6"
    >
      <h2 className="flex items-center gap-1 text-base font-semibold text-white">
        {title}
        <AppIcon
          icon="lucide:chevron-right"
          aria-hidden="true"
          width={17}
          height={17}
          className={styles.sectionIcon}
        />
      </h2>
      <div className={cn("mt-3 overflow-hidden rounded-[28px] p-3", styles.container)}>
        {items.map((item, index) => (
          <motion.div
            key={`${title}-${item.asset}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link
              href={`/explore/${slugify(`${item.category}-${item.asset}-${item.protocol}`)}`}
              className={cn(
                "flex min-h-[68px] w-full items-center gap-3 rounded-[20px] px-2 text-left transition-colors focus-visible:ring-2",
                styles.row,
              )}
            >
              <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${item.color}`}>
                <AppIcon
                  icon={item.icon}
                  aria-hidden="true"
                  width={24}
                  height={24}
                  className={item.color === "bg-[#ccff00]" ? "text-black" : "text-white"}
                />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-base font-bold text-white">
                  {item.asset}
                </span>
                <span className="mt-0.5 block text-sm font-medium text-[#8E8E93]">
                  {item.protocol}
                </span>
              </span>
              <span className="text-right">
                <span className="block text-sm font-bold text-white">
                  {item.primary}
                </span>
                <span
                  className={`mt-0.5 block text-xs font-black ${
                    item.positive ? "text-[#ccff00]" : "text-[#A7A7A7]"
                  }`}
                >
                  {item.secondary}
                </span>
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

function MarketDetail({
  market,
  range,
  onRangeChange,
}: {
  market: MarketItem;
  range: TimeRange;
  onRangeChange: (range: TimeRange) => void;
}) {
  const tone =
    market.risk === "High" ? "red" : market.risk === "Medium" ? "yellow" : "green";

  return (
    <motion.section
      key={`${market.category}-${market.asset}-${market.protocol}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="mt-5 rounded-[28px] border border-white/10 bg-[#111217] p-4"
    >
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
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h2 className="truncate text-lg font-black text-white">
                {market.asset} on {market.protocol}
              </h2>
              <p className="mt-1 text-sm font-medium leading-snug text-[#A7A7B7]">
                {market.description}
              </p>
            </div>
            <span
              className={cn(
                "shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-black",
                market.risk === "Low" && "border-[#ccff00]/25 bg-[#ccff00]/10 text-[#ccff00]",
                market.risk === "Medium" && "border-[#FFD166]/25 bg-[#FFD166]/10 text-[#FFD166]",
                market.risk === "High" && "border-[#FF6B6B]/25 bg-[#FF6B6B]/10 text-[#FF6B6B]",
              )}
            >
              {market.risk}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 overflow-hidden rounded-[18px] border border-white/10">
        {[
          ["Rate", market.primary],
          ["TVL", market.tvl],
          ["Util.", market.utilization],
        ].map(([label, value], index) => (
          <div
            key={label}
            className={cn("p-3", index < 2 && "border-r border-white/10")}
          >
            <p className="text-xs font-medium text-[#A7A7B7]">{label}</p>
            <p className="mt-1 text-sm font-black text-white">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <TimeRangeControl value={range} onChange={onRangeChange} />
        <MiniChart
          values={market.chartData[range]}
          label={`${market.category} market trend`}
          tone={tone}
          range={range}
          className="mt-3"
        />
      </div>

      <div className="mt-4 flex gap-2">
        <Link
          href={market.category === "Borrow" ? "/assets" : "/ai/strategy"}
          className="flex h-11 flex-1 items-center justify-center rounded-full bg-[#ccff00] text-sm font-black text-black transition-transform active:scale-95 focus-visible:ring-2 focus-visible:ring-[#ccff00]/70"
        >
          {market.category === "Borrow" ? "Review collateral" : "View strategy"}
        </Link>
        <Link
          href="/ai"
          aria-label="Ask agent about market"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-[#ccff00] transition-colors hover:bg-white/[0.08] focus-visible:ring-2 focus-visible:ring-[#3B33BD]"
        >
          <AppIcon icon="solar:stars-bold" aria-hidden="true" width={20} height={20} />
        </Link>
      </div>
    </motion.section>
  );
}

export default function ExploreView() {
  const [query, setQuery] = React.useState("");
  const [filterSheetOpen, setFilterSheetOpen] = React.useState(false);
  const [categoryFilter, setCategoryFilter] =
    React.useState<MarketCategoryFilter>("All");

  const showLending = categoryFilter === "All" || categoryFilter === "Lend";
  const showBorrow = categoryFilter === "All" || categoryFilter === "Borrow";
  const showRisk = categoryFilter === "All" || categoryFilter === "Risk";

  const filteredLending = React.useMemo(
    () =>
      showLending
        ? query.trim()
          ? lendingPools.filter((item) => matchesMarket(item, query))
          : lendingPools
        : [],
    [query, showLending]
  );
  const filteredBorrow = React.useMemo(
    () =>
      showBorrow
        ? query.trim()
          ? borrowMarkets.filter((item) => matchesMarket(item, query))
          : borrowMarkets
        : [],
    [query, showBorrow]
  );
  const filteredRisk = React.useMemo(
    () =>
      showRisk
        ? query.trim()
          ? riskWatch.filter((item) => matchesMarket(item, query))
          : riskWatch
        : [],
    [query, showRisk]
  );

  const hasResults = filteredLending.length > 0 || filteredBorrow.length > 0 || filteredRisk.length > 0;
  const selectedCategoryLabel =
    categoryFilters.find((item) => item.id === categoryFilter)?.label ?? "Semua";
  const headerAction = (
    <button
      type="button"
      onClick={() => setFilterSheetOpen(true)}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1C1C1E] text-white transition-colors hover:bg-[#262628] focus-visible:ring-2 focus-visible:ring-[#3B33BD]"
      aria-label="Open explore filters"
      aria-expanded={filterSheetOpen}
      aria-haspopup="dialog"
    >
      <AppIcon icon="lucide:sliders-horizontal" aria-hidden="true" width={18} height={18} />
    </button>
  );

  return (
    <MobileShell
      bottomSlot={
        <MobileBottomBar>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.2 }}
            className="w-full max-w-md"
          >
            <label htmlFor="explore-search" className="sr-only">
              Search lending markets
            </label>
            <div className="flex h-14 w-full items-center gap-3 rounded-full bg-[#1C1C1E]/90 px-5 shadow-[0_16px_34px_-18px_rgba(0,0,0,0.95)] backdrop-blur-md">
              <AppIcon
                icon="icon-park-outline:search"
                aria-hidden="true"
                width={24}
                height={24}
                className="text-[#85858d]"
              />
              <input
                id="explore-search"
                type="search"
                autoComplete="off"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search lending markets"
                className="min-w-0 flex-1 bg-transparent text-base font-bold text-white placeholder:text-[#9A9AA2] focus:outline-none"
              />
            </div>
          </motion.div>
        </MobileBottomBar>
      }
    >
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <MobilePageHeader
            title="Explore"
            backHref="/dashboard"
            backLabel="Back to dashboard"
            action={headerAction}
          />
        </motion.div>

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-4 overflow-hidden"
        >
          <div className="flex gap-3 overflow-x-auto pb-3">
            {exploreFeatureCards.map((item, index) => (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn("min-w-[82%] rounded-[24px] p-4", item.className)}
              >
                <div className="flex items-start justify-between">
                  <span
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-2xl",
                      item.iconClassName,
                    )}
                  >
                    <AppIcon icon={item.icon} aria-hidden="true" width={25} height={25} />
                  </span>
                  <span
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full",
                      item.actionClassName,
                    )}
                  >
                    <AppIcon icon="lucide:arrow-right" aria-hidden="true" width={22} height={22} />
                  </span>
                </div>
                <h2 className="mt-5 text-base font-bold text-white">{item.title}</h2>
                <p className="mt-2 text-sm font-medium text-[#8E8E93]">
                  {item.subtitle}
                </p>
              </motion.article>
            ))}
          </div>
          <div className="flex justify-center gap-2">
            <span className="h-2 w-5 rounded-full bg-[#ccff00]" />
            <span className="h-2 w-2 rounded-full bg-[#242620]" />
          </div>
        </motion.section>

        {hasResults ? (
          <>
            {filteredLending.length > 0 ? (
              <MarketList
                title="Best lend rates"
                items={filteredLending}
              />
            ) : null}
            {filteredBorrow.length > 0 ? (
              <MarketList
                title="Borrow markets"
                items={filteredBorrow}
              />
            ) : null}
            {filteredRisk.length > 0 ? (
              <MarketList
                title="Risk watch"
                items={filteredRisk}
              />
            ) : null}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
            className="mt-8 flex flex-col items-center justify-center rounded-[28px] bg-[#151714] px-6 py-12 text-center"
          >
            <AppIcon
              icon="icon-park-outline:search"
              aria-hidden="true"
              width={40}
              height={40}
              className="text-[#9A9AA2]"
            />
            <p className="mt-4 text-base font-bold text-white">No markets found</p>
            <p className="mt-1 text-sm font-medium text-[#9A9AA2]">
              Try searching by asset, protocol, rate, or risk.
            </p>
          </motion.div>
        )}

        <BottomSheet
          open={filterSheetOpen}
          onOpenChange={setFilterSheetOpen}
          title="Filter"
          description="Pilih kategori market yang ingin kamu lihat."
          closeLabel="Close explore filters"
          contentClassName="space-y-2"
        >
          {categoryFilters.map((filter) => {
            const isActive = filter.id === categoryFilter;

            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => {
                  setCategoryFilter(filter.id);
                  setFilterSheetOpen(false);
                }}
                className={cn(
                  "flex min-h-[52px] w-full items-center justify-between gap-3 rounded-2xl px-4 text-left transition-colors focus-visible:ring-2 focus-visible:ring-[#3B33BD]",
                  isActive
                    ? "bg-[#3B33BD] text-[#ccff00]"
                    : "bg-black/25 text-white hover:bg-white/[0.04]",
                )}
              >
                <span className="min-w-0 flex items-center gap-3">
                  <AppIcon
                    icon={filter.icon}
                    aria-hidden="true"
                    width={19}
                    height={19}
                    className="shrink-0"
                  />
                  <span className="truncate text-sm font-bold">{filter.label}</span>
                </span>
                {isActive ? (
                  <AppIcon
                    icon="material-symbols:check-rounded"
                    aria-hidden="true"
                    width={20}
                    height={20}
                    className="shrink-0"
                  />
                ) : null}
              </button>
            );
          })}

          <p className="pt-2 text-center text-xs font-bold text-[#8E8E93]">
            Aktif: {selectedCategoryLabel}
          </p>
        </BottomSheet>
    </MobileShell>
  );
}
