import { Icon } from "@iconify/react";
import Link from "next/link";
import { Fragment } from "react";

import { cn } from "@/lib/utils";

const routeSteps = [
  {
    step: "1",
    asset: "USDC",
    network: "Arbitrum",
    chip: "Arbitrum",
    assetIcon: "cryptocurrency-color:usdc",
    protocolIcon: "token-branded:arbitrum",
  },
  {
    step: "2",
    asset: "USDC",
    network: "Base",
    chip: "Base",
    assetIcon: "cryptocurrency-color:usdc",
    protocolIcon: "token-branded:base",
  },
  {
    step: "3",
    asset: "Aave",
    network: "Supply",
    chip: "Aave v3",
    assetIcon: "simple-icons:aave",
    protocolIcon: "token-branded:arbitrum",
    assetTone: "text-[#B650F2]",
  },
];

const metrics = [
  {
    label: "Net APY",
    value: "5.92%",
    helper: "After fees",
    icon: "solar:speedometer-bold",
    tone: "text-[#ccff00]",
  },
  {
    label: "Est. Fees",
    value: "$1.24",
    helper: "0.05%",
    icon: "solar:dollar-bold",
    tone: "text-white",
  },
  {
    label: "Health Score",
    value: "92 / 100",
    helper: "Healthy",
    icon: "solar:shield-check-bold",
    tone: "text-[#ccff00]",
  },
  {
    label: "Rebalance",
    value: "7 days",
    helper: "Auto",
    icon: "solar:clock-circle-bold",
    tone: "text-[#ccff00]",
  },
];

const reasons = [
  {
    title: "Highest risk-adjusted yield across stablecoin strategies",
    detail: "5.92% APY is 18% higher than your current allocation",
    icon: "solar:chart-2-bold",
  },
  {
    title: "Diversified across battle-tested lending markets",
    detail: "Mitigates protocol risk while maintaining strong yields",
    icon: "solar:shield-check-bold",
  },
  {
    title: "Market conditions favor stable yields right now",
    detail: "Low volatility environment ideal for lending strategies",
    icon: "solar:clock-circle-bold",
  },
];

export const metadata = {
  title: "AI Rebalancing | Oni",
  description: "Review AI powered rebalancing strategy details.",
};

export default function AiStrategyPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto flex min-h-screen w-full flex-col px-5 pb-28 pt-4 sm:max-w-md">
        <header className="relative flex h-12 items-center justify-center">
          <Link
            href="/ai"
            className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[#17181D] text-white transition-colors hover:bg-[#202127] focus-visible:ring-2 focus-visible:ring-[#3B33BD]"
            aria-label="Back to AI chat"
          >
            <Icon icon="lucide:arrow-left" className="h-5 w-5" aria-hidden="true" />
          </Link>
          <h1 className="text-xl font-bold text-white">AI Rebalancing</h1>
        </header>

        <section className="relative mt-5 overflow-hidden rounded-[24px] border border-[#4F46E5] bg-[radial-gradient(circle_at_86%_20%,rgba(59,51,255,0.46),rgba(13,14,51,0.96)_42%,rgba(4,5,17,0.98)_100%)] p-4">
          <div className="pointer-events-none absolute right-2 top-9 h-28 w-28 rounded-full border-[18px] border-[#3B33FF] opacity-80 blur-[1px]" />
          <div className="pointer-events-none absolute -right-2 top-24 h-20 w-20 rotate-45 rounded-full border-[14px] border-[#2114B8] opacity-90 blur-[1px]" />
          <div className="pointer-events-none absolute right-5 top-16 h-20 w-44 rotate-[34deg] rounded-full bg-[#3328FF]/55 blur-xl" />

          <div className="relative z-10 max-w-[70%]">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#2F22FF]">
              <Icon icon="solar:stars-bold" className="h-8 w-8 text-white" aria-hidden="true" />
            </span>
            <h2 className="mt-4 text-2xl font-black leading-tight tracking-normal text-white">
              Stable Yield Strategy
            </h2>

            <div className="mt-3 flex gap-2">
              <span className="rounded-[12px] border border-[#ccff00]/25 bg-black/18 px-3 py-2">
                <span className="block text-base font-black leading-none text-[#ccff00]">
                  5.9% APY
                </span>
                <span className="mt-1 block text-xs font-medium text-[#B7B7C7]">Expected</span>
              </span>
              <span className="rounded-[12px] border border-white/12 bg-black/18 px-3 py-2">
                <span className="flex items-center gap-1 text-base font-black leading-none text-white">
                  <Icon icon="solar:shield-check-linear" className="h-4 w-4" aria-hidden="true" />
                  Low
                </span>
                <span className="mt-1 block text-xs font-medium text-[#B7B7C7]">Risk Level</span>
              </span>
            </div>

            <p className="mt-4 text-sm font-medium leading-snug text-[#B7B7C7]">
              AI allocates your assets across low-risk lending markets on Base to
              maximize stable yields with minimal volatility.
            </p>

            <p className="mt-4 inline-flex h-8 items-center gap-2 rounded-full border border-white/12 bg-black/18 px-3 text-xs font-black text-[#ccff00]">
              <Icon icon="solar:stars-bold" className="h-4 w-4" aria-hidden="true" />
              AI Confidence: High
            </p>
          </div>
        </section>

        <section className="mt-4 rounded-[24px] border border-white/12 bg-[#111217] p-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-black text-white">Execution Route</h2>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#A7A7B7]">
              <span className="rounded-full border border-white/12 px-2.5 py-1 text-white">
                3 Steps
              </span>
              <Icon icon="solar:clock-circle-linear" className="h-4 w-4" aria-hidden="true" />
              ~2 min
            </div>
          </div>

          <div className="mt-5 grid grid-cols-[1fr_22px_1fr_22px_1fr] items-center">
            {routeSteps.map((item, index) => (
              <Fragment key={item.step}>
                <div className="flex flex-col items-center text-center">
                  <span className="mb-2 flex h-6 w-6 items-center justify-center rounded-full border border-white/20 bg-[#15161D] text-xs font-bold text-white">
                    {item.step}
                  </span>
                  <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#1976E8]">
                    <Icon
                      icon={item.assetIcon}
                      className={cn("h-8 w-8", item.assetTone)}
                      aria-hidden="true"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full border border-[#111217] bg-[#1A1B22]">
                      <Icon icon={item.protocolIcon} className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                  </span>
                  <p className="mt-2 text-sm font-bold text-white">{item.asset}</p>
                  <p className="text-xs font-bold text-[#625DFF]">{item.network}</p>
                  <span className="mt-2 inline-flex h-8 items-center gap-1 rounded-[10px] border border-white/10 bg-white/[0.04] px-2 text-[11px] font-semibold text-[#B7B7C7]">
                    <Icon icon={item.protocolIcon} className="h-3.5 w-3.5" aria-hidden="true" />
                    {item.chip}
                  </span>
                </div>
                {index < routeSteps.length - 1 ? (
                  <div className="flex items-center justify-center text-[#625DFF]" aria-hidden="true">
                    <span className="h-px flex-1 border-t border-dashed border-[#625DFF]" />
                    <Icon icon="lucide:chevron-right" className="h-5 w-5 shrink-0" />
                  </div>
                ) : null}
              </Fragment>
            ))}
          </div>
        </section>

        <section className="mt-4 grid grid-cols-2 overflow-hidden rounded-[22px] border border-white/12 bg-[#111217] sm:grid-cols-4">
          {metrics.map((metric) => (
            <div key={metric.label} className="border-b border-r border-white/10 p-3 last:border-r-0 sm:border-b-0">
              <div className="flex items-center gap-2 text-xs font-medium text-[#B7B7C7]">
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white">
                  <Icon icon={metric.icon} className="h-4 w-4" aria-hidden="true" />
                </span>
                {metric.label}
              </div>
              <p className={cn("mt-2 text-xl font-black", metric.tone)}>{metric.value}</p>
              <p className="mt-1 text-xs font-medium text-[#8F8F99]">{metric.helper}</p>
            </div>
          ))}
        </section>

        <section className="mt-4 rounded-[24px] border border-white/12 bg-[#111217] p-4">
          <h2 className="text-lg font-black text-white">Why AI recommends this</h2>
          <div className="mt-4 space-y-3">
            {reasons.map((reason) => (
              <div key={reason.title} className="flex gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#625DFF]/35 bg-[#625DFF]/18 text-[#625DFF]">
                  <Icon icon={reason.icon} className="h-5 w-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-sm font-bold leading-snug text-white">
                    {reason.title}
                  </span>
                  <span className="mt-1 block text-xs font-medium leading-snug text-[#A7A7B7]">
                    {reason.detail}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs font-bold text-[#8F8F99]">
          <span className="inline-flex items-center gap-1.5 text-[#ccff00]">
            <Icon icon="solar:stars-bold" className="h-4 w-4" aria-hidden="true" />
            AI Powered
          </span>
          <span className="h-5 w-px bg-white/10" />
          <span className="inline-flex items-center gap-1.5">
            <Icon icon="solar:shield-check-linear" className="h-4 w-4" aria-hidden="true" />
            Non-custodial
          </span>
          <span className="h-5 w-px bg-white/10" />
          <span className="inline-flex items-center gap-1.5">
            <Icon icon="solar:lock-keyhole-linear" className="h-4 w-4" aria-hidden="true" />
            You stay in control
          </span>
        </section>

        <button
          type="button"
          className="relative mt-4 flex h-14 w-full items-center justify-center rounded-full bg-[#ccff00] text-base font-black text-black transition-transform active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#ccff00]/70"
        >
          Execute Strategy
          <span className="absolute right-2 flex h-10 w-10 items-center justify-center rounded-full bg-black/10">
            <Icon icon="lucide:arrow-right" className="h-5 w-5" aria-hidden="true" />
          </span>
        </button>
      </div>
    </main>
  );
}
