import { AppIcon } from "@/components/ui/app-icon";

import { BrandCard } from "@/components/ui/brand-card";

export function ChatEmptyState() {
  return (
    <BrandCard className="p-4 text-center">
      <AppIcon
        icon="solar:chat-round-like-bold"
        aria-hidden="true"
        width={32}
        height={32}
        className="mx-auto text-[#3B33BD]"
      />
      <p className="mt-3 text-sm font-bold text-white">
        Start with a strategy question
      </p>
      <p className="mt-1 text-xs font-medium leading-relaxed text-[#9A9AA2]">
        Ask mom3 agent for safest yield, risk review, or a rebalance suggestion.
      </p>
    </BrandCard>
  );
}
