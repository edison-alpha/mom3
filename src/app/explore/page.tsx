"use client";

import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import Link from "next/link";
import * as React from "react";

type MarketItem = {
  asset: string;
  protocol: string;
  primary: string;
  secondary: string;
  icon: string;
  color: string;
  positive?: boolean;
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
  },
  {
    asset: "ETH",
    protocol: "Compound",
    primary: "3.42% APY",
    secondary: "Blue-chip",
    icon: "cryptocurrency-color:eth",
    color: "bg-[#627EEA]",
    positive: true,
  },
  {
    asset: "USDT",
    protocol: "Morpho",
    primary: "4.88% APY",
    secondary: "Stablecoin",
    icon: "cryptocurrency-color:usdt",
    color: "bg-[#26A17B]",
    positive: true,
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
  },
  {
    asset: "cbETH",
    protocol: "Aave v3",
    primary: "2.14% APR",
    secondary: "70% LTV",
    icon: "cryptocurrency-color:eth",
    color: "bg-[#3B33BD]",
  },
  {
    asset: "MOM",
    protocol: "mom3 Vault",
    primary: "9.80% APR",
    secondary: "Beta",
    icon: "solar:stars-bold",
    color: "bg-[#ccff00]",
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
  },
  {
    asset: "Ethena",
    protocol: "USDe Loop",
    primary: "Medium risk",
    secondary: "Review",
    icon: "token-branded:ethena",
    color: "bg-[#20211f]",
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

function MarketList({
  title,
  items,
}: {
  title: string;
  items: MarketItem[];
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mt-6"
    >
      <h2 className="flex items-center gap-1 text-base font-semibold text-white">
        {title}
        <Icon icon="lucide:chevron-right" aria-hidden="true" width={17} height={17} />
      </h2>
      <div className="mt-3 overflow-hidden rounded-[28px] bg-[#151714] p-3">
        {items.map((item, index) => (
          <motion.div
            key={`${title}-${item.asset}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex min-h-[68px] items-center gap-3"
          >
            <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${item.color}`}>
              <Icon
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
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

export default function ExplorePage() {
  const [query, setQuery] = React.useState("");

  const filteredLending = React.useMemo(
    () => (query.trim() ? lendingPools.filter((item) => matchesMarket(item, query)) : lendingPools),
    [query]
  );
  const filteredBorrow = React.useMemo(
    () => (query.trim() ? borrowMarkets.filter((item) => matchesMarket(item, query)) : borrowMarkets),
    [query]
  );
  const filteredRisk = React.useMemo(
    () => (query.trim() ? riskWatch.filter((item) => matchesMarket(item, query)) : riskWatch),
    [query]
  );

  const hasResults = filteredLending.length > 0 || filteredBorrow.length > 0 || filteredRisk.length > 0;

  return (
    <main className="min-h-screen w-full bg-black font-sans text-white antialiased">
      <div className="mx-auto flex min-h-screen w-full flex-col px-5 pb-28 pt-4 sm:max-w-md">
        <header className="relative flex h-12 items-center justify-center">
          <Link
            href="/dashboard"
            aria-label="Back to dashboard"
            className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full bg-[#1C1C1E] text-white transition-colors hover:bg-[#262628] focus-visible:ring-2 focus-visible:ring-[#3B33BD]"
          >
            <Icon
              icon="lucide:chevron-left"
              aria-hidden="true"
              width={28}
              height={28}
            />
          </Link>
          <h1 className="text-xl font-bold text-white">Explore</h1>
        </header>

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-4 overflow-hidden"
        >
          <div className="flex gap-3 overflow-x-auto pb-3">
            {[
              {
                title: "Lend stablecoins",
                subtitle: "Earn up to 5.15% APY",
                icon: "solar:wallet-money-bold",
              },
              {
                title: "Borrow against ETH",
                subtitle: "Collateralized credit from 2.14% APR",
                icon: "solar:hand-money-bold",
              },
            ].map((item, index) => (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="min-w-[82%] rounded-[24px] bg-[#151714] p-4"
              >
                <div className="flex items-start justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#242620] text-[#ccff00]">
                    <Icon icon={item.icon} aria-hidden="true" width={25} height={25} />
                  </span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#242620]">
                    <Icon icon="lucide:arrow-right" aria-hidden="true" width={22} height={22} />
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
            {filteredLending.length > 0 ? <MarketList title="Best lend rates" items={filteredLending} /> : null}
            {filteredBorrow.length > 0 ? <MarketList title="Borrow markets" items={filteredBorrow} /> : null}
            {filteredRisk.length > 0 ? <MarketList title="Risk watch" items={filteredRisk} /> : null}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
            className="mt-8 flex flex-col items-center justify-center rounded-[28px] bg-[#151714] px-6 py-12 text-center"
          >
            <Icon
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
      </div>

      <div className="fixed inset-x-0 bottom-7 z-40 flex justify-center px-5">
        <label htmlFor="explore-search" className="sr-only">
          Search lending markets
        </label>
        <div className="flex h-14 w-full max-w-md items-center gap-3 rounded-full bg-[#1C1C1E]/90 px-5 shadow-[0_16px_34px_-18px_rgba(0,0,0,0.95)] backdrop-blur-md">
          <Icon
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
      </div>
    </main>
  );
}
