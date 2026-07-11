"use client";

import { AppIcon } from "@/components/ui/app-icon";
import * as React from "react";

export function SentConfirmation({
  amount,
  tokenSymbol,
  recipientHandle,
  transactionId,
}: {
  amount: string;
  tokenSymbol: string;
  recipientHandle: string;
  transactionId: string;
}) {
  return (
    <div className="mt-3 rounded-2xl bg-[#ccff00]/10 px-4 py-3 text-sm font-bold text-[#ccff00]">
      Sent {amount} {tokenSymbol} to {recipientHandle}.{" "}
      <a
        href={`https://universalx.app/activity/details?id=${transactionId}`}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1 underline decoration-[#ccff00]/50 underline-offset-4 focus-visible:ring-2 focus-visible:ring-[#ccff00]"
      >
        View transaction
        <AppIcon icon="lucide:external-link" aria-hidden="true" width={14} height={14} />
      </a>
    </div>
  );
}
