import { AppIcon } from "@/components/ui/app-icon";
import Link from "next/link";

import { BrandCard } from "@/components/ui/brand-card";
import { IconAction } from "@/components/ui/icon-action";

export function StrategyResponse() {
  return (
    <BrandCard tone="accent" className="p-3">
      <div className="flex items-center gap-2 text-sm font-medium text-white">
        <AppIcon
          icon="solar:stars-bold"
          aria-hidden="true"
          width={20}
          height={20}
          className="text-[#ccff00]"
        />
        Berikut strategi yield paling aman saat ini
      </div>

      <div className="mt-3 rounded-[20px] border border-white/10 bg-white/[0.04] p-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[#ccff00]/30 bg-[#ccff00]/10">
              <AppIcon
                icon="solar:shield-check-bold"
                aria-hidden="true"
                width={27}
                height={27}
                className="text-[#ccff00]"
              />
            </span>
            <div>
              <p className="text-sm font-black text-white">Aave Earn</p>
              <p className="mt-1 text-xs font-medium text-[#A7A7B7]">
                Supply USDC on Aave v3
              </p>
              <p className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-[#A7A7B7]">
                <AppIcon
                  icon="cryptocurrency-color:eth"
                  aria-hidden="true"
                  width={16}
                  height={16}
                />
                Ethereum
              </p>
            </div>
          </div>

          <div className="border-l border-white/10 pl-3 text-right">
            <p className="text-xs font-medium text-[#A7A7B7]">Expected APY</p>
            <p className="mt-1 text-3xl font-black text-white">5.15%</p>
            <p className="mt-1.5 rounded-full border border-[#ccff00]/40 bg-[#ccff00]/10 px-2.5 py-1 text-[10px] font-black text-[#ccff00]">
              Low Risk Score
            </p>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3 border-t border-white/10 pt-3">
          <div>
            <p className="text-xs font-medium text-[#A7A7B7]">Why this strategy?</p>
            <p className="mt-1 text-xs font-bold leading-snug text-white">
              Stablecoins, blue-chip protocol, audited and battle-tested.
            </p>
          </div>
          <div className="border-l border-white/10 pl-3">
            <p className="text-xs font-medium text-[#A7A7B7]">Best for</p>
            <p className="mt-1 text-xs font-bold leading-snug text-white">
              Capital preservation and steady returns
            </p>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <Link
          href="/ai/strategy"
          className="inline-flex h-10 items-center gap-2 rounded-full bg-[#ccff00] px-4 text-sm font-black text-black transition-transform active:scale-95 focus-visible:ring-2 focus-visible:ring-[#ccff00]/70"
        >
          View Strategy
          <AppIcon icon="lucide:external-link" aria-hidden="true" width={16} height={16} />
        </Link>
        <IconAction
          icon="solar:bookmark-linear"
          label="Save strategy"
          tone="lime"
          className="h-12 w-12"
        />
        <span className="ml-auto text-xs font-medium text-[#9A9AA2]">10:30 AM</span>
      </div>
    </BrandCard>
  );
}
