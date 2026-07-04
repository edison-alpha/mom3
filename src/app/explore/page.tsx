import { Icon } from "@iconify/react";
import type { Metadata, Viewport } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Explore Lending | Oni",
  description: "Explore lending and borrowing opportunities on mom3.",
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

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

function MarketList({
  title,
  items,
}: {
  title: string;
  items: MarketItem[];
}) {
  return (
    <section className="mt-6">
      <h2 className="flex items-center gap-1 text-base font-semibold text-white">
        {title}
        <Icon icon="lucide:chevron-right" aria-hidden="true" width={17} height={17} />
      </h2>
      <div className="mt-3 overflow-hidden rounded-[28px] bg-[#151714] p-3">
        {items.map((item) => (
          <div key={`${title}-${item.asset}`} className="flex min-h-[68px] items-center gap-3">
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
          </div>
        ))}
      </div>
    </section>
  );
}

export default function ExplorePage() {
  return (
    <main className="min-h-screen w-full bg-black font-sans text-white antialiased">
      <div className="mx-auto flex min-h-screen w-full flex-col px-5 pb-28 pt-4 sm:max-w-md">
        <header className="relative flex h-12 items-center justify-center">
          <Link
            href="/dashboard"
            aria-label="Back to dashboard"
            className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-[#3B33BD]"
          >
            <Icon
              icon="lucide:chevron-left"
              aria-hidden="true"
              width={28}
              height={28}
            />
          </Link>
          <h1 className="text-base font-bold text-white">Explore</h1>
        </header>

        <section className="mt-4 overflow-hidden">
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
            ].map((item) => (
              <article
                key={item.title}
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
              </article>
            ))}
          </div>
          <div className="flex justify-center gap-2">
            <span className="h-2 w-5 rounded-full bg-[#ccff00]" />
            <span className="h-2 w-2 rounded-full bg-[#242620]" />
          </div>
        </section>

        <MarketList title="Best lend rates" items={lendingPools} />
        <MarketList title="Borrow markets" items={borrowMarkets} />
        <MarketList title="Risk watch" items={riskWatch} />
      </div>

      <div className="fixed inset-x-0 bottom-5 z-40 flex justify-center px-5">
        <div className="flex h-14 w-full max-w-md items-center gap-3 rounded-full bg-[#1C1C1E]/90 px-5 shadow-[0_16px_34px_-18px_rgba(0,0,0,0.95)] backdrop-blur-md">
          <Icon
            icon="icon-park-outline:search"
            aria-hidden="true"
            width={24}
            height={24}
            className="text-[#85858d]"
          />
          <span className="text-base font-bold text-[#9A9AA2]">
            Search lending markets
          </span>
        </div>
      </div>
    </main>
  );
}
