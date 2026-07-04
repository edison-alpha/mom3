"use client";

import { Icon } from "@iconify/react";
import Link from "next/link";
import * as React from "react";

import { FloatingMenuButton } from "@/components/ui/menu-button";
import { cn } from "@/lib/utils";

type Tab = "assets" | "positions" | "summary";
type PositionKind = "Yield" | "Lend" | "Borrow";
type Risk = "Low" | "Medium" | "High";

type Asset = {
  symbol: string;
  name: string;
  amount: string;
  value: string;
  chain: string;
  icon: string;
};

type Position = {
  asset: string;
  protocol: string;
  balance: string;
  detail: string;
  kind: PositionKind;
  risk: Risk;
  health: number;
  summary: string;
  icon: string;
  protocolIcon: string;
  protocolTone: string;
};

const tabs: { id: Tab; label: string }[] = [
  { id: "assets", label: "Assets" },
  { id: "positions", label: "Positions" },
  { id: "summary", label: "Summary" },
];

const quickActions = [
  {
    label: "Deposit",
    href: "#",
    icon: "lucide:arrow-down",
    className: "bg-[#241CFF] text-[#ccff00]",
  },
  {
    label: "Convert",
    href: "/convert",
    icon: "lucide:refresh-cw",
    className: "bg-[#242426] text-white",
  },
  {
    label: "Send",
    href: "/send",
    icon: "lucide:arrow-up",
    className: "bg-[#242426] text-white",
  },
];

const assets: Asset[] = [
  {
    symbol: "USDC",
    name: "USD Coin",
    amount: "1,420.00 USDC",
    value: "$1,420.00",
    chain: "Base",
    icon: "cryptocurrency-color:usdc",
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    amount: "0.42 ETH",
    value: "$1,046.80",
    chain: "Arbitrum",
    icon: "cryptocurrency-color:eth",
  },
  {
    symbol: "USDe",
    name: "Ethena USDe",
    amount: "620.00 USDe",
    value: "$620.00",
    chain: "Ethereum",
    icon: "token-branded:ethena",
  },
  {
    symbol: "USDT",
    name: "Tether USD",
    amount: "430.00 USDT",
    value: "$430.00",
    chain: "Morpho",
    icon: "cryptocurrency-color:usdt",
  },
  {
    symbol: "PT-sUSDe",
    name: "Pendle Principal Token",
    amount: "210.00 PT",
    value: "$210.00",
    chain: "Pendle",
    icon: "token-branded:pendle",
  },
  {
    symbol: "ZORB",
    name: "Zora Position",
    amount: "184.20 ZORB",
    value: "$184.20",
    chain: "Zora",
    icon: "simple-icons:zora",
  },
];

const positions: Position[] = [
  {
    asset: "USDC",
    protocol: "Aave v3",
    balance: "$1,250.00",
    detail: "5.15% APY",
    kind: "Lend",
    risk: "Low",
    health: 94,
    summary: "Stable USDC supply on Aave with deep liquidity and low volatility.",
    icon: "cryptocurrency-color:usdc",
    protocolIcon: "simple-icons:aave",
    protocolTone: "text-[#B650F2]",
  },
  {
    asset: "ETH",
    protocol: "Aave v3",
    balance: "0.42 ETH",
    detail: "70% borrow power",
    kind: "Borrow",
    risk: "Medium",
    health: 82,
    summary: "ETH collateral position is healthy, but should be watched during volatility.",
    icon: "cryptocurrency-color:eth",
    protocolIcon: "simple-icons:aave",
    protocolTone: "text-[#B650F2]",
  },
  {
    asset: "USDe",
    protocol: "Ethena",
    balance: "$620.00",
    detail: "8.40% APY",
    kind: "Yield",
    risk: "Medium",
    health: 78,
    summary: "Higher yield stable strategy with additional protocol and market structure risk.",
    icon: "token-branded:ethena",
    protocolIcon: "simple-icons:ethereum",
    protocolTone: "text-[#8EA7FF]",
  },
  {
    asset: "USDT",
    protocol: "Morpho",
    balance: "$430.00",
    detail: "4.88% APY",
    kind: "Lend",
    risk: "Low",
    health: 91,
    summary: "Conservative lending market with strong collateral buffers.",
    icon: "cryptocurrency-color:usdt",
    protocolIcon: "simple-icons:morpho",
    protocolTone: "text-[#2E5BFF]",
  },
  {
    asset: "USDC",
    protocol: "Uniswap",
    balance: "$360.00",
    detail: "6.44% APY",
    kind: "Yield",
    risk: "Medium",
    health: 74,
    summary: "LP-style yield has fee upside, but can move with pool conditions.",
    icon: "cryptocurrency-color:usdc",
    protocolIcon: "simple-icons:uniswap",
    protocolTone: "text-[#FF007A]",
  },
  {
    asset: "ZORB",
    protocol: "Zora",
    balance: "$184.20",
    detail: "Creator yield",
    kind: "Yield",
    risk: "High",
    health: 63,
    summary: "Experimental creator yield position with higher variance and lower liquidity.",
    icon: "simple-icons:zora",
    protocolIcon: "simple-icons:zora",
    protocolTone: "text-white",
  },
];

const kindClassName: Record<PositionKind, string> = {
  Yield: "border-[#ccff00]/25 bg-[#ccff00]/10 text-[#ccff00]",
  Lend: "border-[#3B82F6]/25 bg-[#3B82F6]/10 text-[#75A7FF]",
  Borrow: "border-[#FFB020]/25 bg-[#FFB020]/10 text-[#FFD166]",
};

const riskClassName: Record<Risk, string> = {
  Low: "text-[#ccff00]",
  Medium: "text-[#FFD166]",
  High: "text-[#FF6B6B]",
};

function PositionIcon({ position }: { position: Position }) {
  return (
    <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/[0.08]">
      <Icon icon={position.icon} className="h-7 w-7" aria-hidden="true" />
      <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border border-[#1F1F21] bg-[#111113]">
        <Icon
          icon={position.protocolIcon}
          className={cn("h-3.5 w-3.5", position.protocolTone)}
          aria-hidden="true"
        />
      </span>
    </span>
  );
}

function DetailPanel({ position }: { position: Position }) {
  return (
    <section className="rounded-[24px] border border-white/10 bg-[#111217] p-4">
      <div className="flex items-start gap-3">
        <PositionIcon position={position} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="truncate text-lg font-black text-white">
              {position.protocol} Detail
            </h2>
            <span
              className={cn(
                "rounded-full border px-2 py-0.5 text-[10px] font-black",
                kindClassName[position.kind],
              )}
            >
              {position.kind}
            </span>
          </div>
          <p className="mt-1 text-sm font-medium leading-snug text-[#A7A7B7]">
            {position.summary}
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 overflow-hidden rounded-[18px] border border-white/10">
        <div className="border-r border-white/10 p-3">
          <p className="text-xs font-medium text-[#A7A7B7]">Risk</p>
          <p className={cn("mt-1 text-base font-black", riskClassName[position.risk])}>
            {position.risk}
          </p>
        </div>
        <div className="border-r border-white/10 p-3">
          <p className="text-xs font-medium text-[#A7A7B7]">Health</p>
          <p className="mt-1 text-base font-black text-[#ccff00]">{position.health}</p>
        </div>
        <div className="p-3">
          <p className="text-xs font-medium text-[#A7A7B7]">Return</p>
          <p className="mt-1 text-base font-black text-white">{position.detail}</p>
        </div>
      </div>

      <div className="mt-4 rounded-[18px] border border-white/10 bg-white/[0.03] p-3">
        <p className="text-sm font-black text-white">Summary</p>
        <p className="mt-2 text-xs font-medium leading-relaxed text-[#A7A7B7]">
          AI score recommends keeping this position active while health stays above
          75. Rebalance if risk increases or expected return drops below the
          portfolio target.
        </p>
      </div>
    </section>
  );
}

export default function AssetsClient() {
  const [activeTab, setActiveTab] = React.useState<Tab>("assets");
  const [selectedPosition, setSelectedPosition] = React.useState(positions[0]);

  const cta =
    activeTab === "positions"
      ? { label: "View AI Strategy", href: "/ai/strategy", icon: "lucide:arrow-right" }
      : activeTab === "summary"
        ? { label: "Rebalance Portfolio", href: "/ai", icon: "solar:stars-bold" }
        : { label: "Add Assets", href: "#", icon: "lucide:arrow-down" };

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto flex min-h-screen w-full flex-col px-4 pb-32 pt-4 sm:max-w-md">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#3B33BD] via-[#5A52D4] to-[#7E78EA]" />
            <p className="text-sm font-bold leading-none">@ubayy</p>
          </div>

          <Link
            href="/history"
            className="flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-[#3B33BD]"
            aria-label="Open history"
          >
            <Icon icon="ic:twotone-wallet" className="h-6 w-6" aria-hidden="true" />
          </Link>
        </header>

        <section className="mt-10 text-center">
          <p className="text-[44px] font-black leading-none tracking-normal text-white">
            <span className="align-top text-xl">$</span>2,500.00
          </p>
          <p className="mx-auto mt-2 max-w-44 text-sm font-medium leading-tight text-[#8F8F96]">
            Portfolio health 86 / 100
          </p>
        </section>

        <section className="mt-5 grid grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="group flex min-h-[72px] flex-col items-center justify-center gap-2 rounded-[18px] transition-transform active:scale-95 focus-visible:ring-2 focus-visible:ring-[#3B33BD]"
            >
              <span
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-full",
                  action.className,
                )}
              >
                <Icon icon={action.icon} className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="text-sm font-semibold text-white">{action.label}</span>
            </Link>
          ))}
        </section>

        <div className="mt-5 grid grid-cols-3 rounded-full bg-[#1C1C1E] p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "h-9 rounded-full text-sm font-black transition-colors focus-visible:ring-2 focus-visible:ring-[#3B33BD]",
                activeTab === tab.id
                  ? "bg-white text-black"
                  : "text-[#9A9AA2] hover:text-white",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "assets" ? (
          <section className="mt-4 overflow-hidden rounded-[24px] bg-[#1F1F21]">
            {assets.map((asset) => (
              <Link
                key={asset.symbol}
                href="#"
                className="flex min-h-[76px] items-center gap-3 border-b border-white/[0.06] px-4 py-3 last:border-b-0 transition-colors hover:bg-white/[0.04] focus-visible:ring-2 focus-visible:ring-[#3B33BD]"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/[0.08]">
                  <Icon icon={asset.icon} className="h-7 w-7" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-base font-black text-white">
                    {asset.name}
                  </span>
                  <span className="mt-1 block text-sm font-semibold text-[#8F8F96]">
                    {asset.amount} on {asset.chain}
                  </span>
                </span>
                <span className="text-right">
                  <span className="block text-base font-black text-white">{asset.value}</span>
                  <span className="mt-1 block text-xs font-bold text-[#ccff00]">
                    {asset.symbol}
                  </span>
                </span>
              </Link>
            ))}
          </section>
        ) : null}

        {activeTab === "positions" ? (
          <section className="mt-4 space-y-4">
            <div className="overflow-hidden rounded-[24px] bg-[#1F1F21]">
              {positions.map((position) => (
                <button
                  key={`${position.asset}-${position.protocol}-${position.kind}`}
                  type="button"
                  onClick={() => setSelectedPosition(position)}
                  className={cn(
                    "flex min-h-[80px] w-full items-center gap-3 border-b border-white/[0.06] px-4 py-3 text-left last:border-b-0 transition-colors focus-visible:ring-2 focus-visible:ring-[#3B33BD]",
                    selectedPosition === position ? "bg-white/[0.06]" : "hover:bg-white/[0.04]",
                  )}
                >
                  <PositionIcon position={position} />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="truncate text-base font-black text-white">
                        {position.asset}
                      </span>
                      <span
                        className={cn(
                          "rounded-full border px-2 py-0.5 text-[10px] font-black",
                          kindClassName[position.kind],
                        )}
                      >
                        {position.kind}
                      </span>
                    </span>
                    <span className="mt-1 block truncate text-sm font-semibold text-[#8F8F96]">
                      {position.protocol}
                    </span>
                  </span>
                  <span className="shrink-0 text-right">
                    <span className="block text-base font-black text-white">
                      {position.balance}
                    </span>
                    <span className={cn("mt-1 block text-xs font-bold", riskClassName[position.risk])}>
                      {position.risk} risk
                    </span>
                  </span>
                </button>
              ))}
            </div>

            <DetailPanel position={selectedPosition} />
          </section>
        ) : null}

        {activeTab === "summary" ? (
          <section className="mt-4 space-y-4">
            <div className="rounded-[24px] border border-white/10 bg-[#111217] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#A7A7B7]">Portfolio Health</p>
                  <p className="mt-1 text-3xl font-black text-[#ccff00]">86</p>
                </div>
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#ccff00]/10 text-[#ccff00]">
                  <Icon icon="solar:shield-check-bold" className="h-8 w-8" aria-hidden="true" />
                </span>
              </div>
              <p className="mt-4 text-sm font-medium leading-relaxed text-[#A7A7B7]">
                Portfolio is healthy with stablecoin-heavy exposure. AI suggests reducing
                experimental yield and moving part of it into Aave or Morpho lending.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                ["Net APY", "5.92%", "After fees"],
                ["Risk Level", "Low", "Stable weighted"],
                ["Borrow Usage", "28%", "Safe range"],
                ["Rebalance", "7 days", "Auto check"],
              ].map(([label, value, helper]) => (
                <div key={label} className="rounded-[20px] border border-white/10 bg-[#111217] p-3">
                  <p className="text-xs font-medium text-[#A7A7B7]">{label}</p>
                  <p className="mt-2 text-xl font-black text-white">{value}</p>
                  <p className="mt-1 text-xs font-semibold text-[#8F8F96]">{helper}</p>
                </div>
              ))}
            </div>

            <DetailPanel position={selectedPosition} />
          </section>
        ) : null}

        <Link
          href={cta.href}
          className="mt-5 flex h-14 items-center justify-center rounded-full bg-[#ccff00] px-5 text-base font-black text-black transition-transform active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#ccff00]/70"
        >
          {cta.label}
          <Icon icon={cta.icon} className="ml-2 h-5 w-5" aria-hidden="true" />
        </Link>
      </div>

      <FloatingMenuButton />
    </main>
  );
}
