"use client";

import { Icon } from "@iconify/react";
import * as React from "react";

import { WalletAvatar } from "@/components/ui/wallet-avatar";
import { truncateAddress } from "@/utils/address.utils";
import type { SendPreview } from "@/modules/send/types/send.types";
import {
  getFeeBreakdownRows,
  getTotalFeeLabel,
} from "@/modules/send/utils/send.utils";

export function SendPreviewCard({
  sendPreview,
  isSending,
  isSigning,
  onConfirmSend,
}: {
  sendPreview: SendPreview;
  isSending: boolean;
  isSigning: boolean;
  onConfirmSend: () => void;
}) {
  const feeRows = getFeeBreakdownRows(sendPreview.transaction);

  return (
    <section className="mt-4 rounded-[24px] border border-[#ccff00]/20 bg-[#ccff00]/[0.04] p-4">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ccff00]/15 text-[#ccff00]">
          <Icon icon="lucide:receipt-text" aria-hidden="true" width={19} height={19} />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-black text-white">Review before signing</h3>
          <p className="mt-1 text-xs font-medium leading-relaxed text-[#A7A7B7]">
            Particle prepared this route. Fees can move slightly before settlement.
          </p>
        </div>
      </div>

      <dl className="mt-4 space-y-2.5 text-sm">
        <div className="flex items-start justify-between gap-3">
          <dt className="text-[#9A9AA2]">Recipient gets</dt>
          <dd className="text-right font-mono font-black tabular-nums text-white">
            {sendPreview.amount} {sendPreview.token.symbol} on {sendPreview.token.chainName}
          </dd>
        </div>
        <div className="flex items-start justify-between gap-3">
          <dt className="text-[#9A9AA2]">To</dt>
          <dd className="flex items-center justify-end gap-2 text-right font-mono text-xs font-bold tabular-nums text-white">
            <span>
              {sendPreview.recipient.handle} Â· {truncateAddress(sendPreview.recipient.address, 5)}
            </span>
            <WalletAvatar
              address={sendPreview.recipient.address}
              label={sendPreview.recipient.name}
              fallback={sendPreview.recipient.name}
              size="sm"
              className="h-8 w-8"
              fallbackClassName={sendPreview.recipient.color}
            />
          </dd>
        </div>
        <div className="flex items-start justify-between gap-3 border-t border-white/10 pt-2.5">
          <dt className="font-bold text-white">Estimated total fee</dt>
          <dd className="font-mono font-black tabular-nums text-[#ccff00]">
            {getTotalFeeLabel(sendPreview.transaction)}
          </dd>
        </div>
        {feeRows.map((row) => (
          <div key={row.label} className="flex items-start justify-between gap-3">
            <dt className="text-[#9A9AA2]">{row.label}</dt>
            <dd className="font-mono text-xs font-bold tabular-nums text-white">{row.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-3 flex items-center justify-between gap-3 rounded-[18px] bg-black/20 px-3 py-2">
        <span className="text-xs font-semibold text-[#9A9AA2]">Signature hash</span>
        <span className="font-mono text-xs font-bold tabular-nums text-white">
          {truncateAddress(sendPreview.transaction.rootHash, 6)}
        </span>
      </div>

      <button
        type="button"
        onClick={onConfirmSend}
        disabled={isSending}
        aria-busy={isSigning ? "true" : undefined}
        className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#ccff00] text-sm font-black text-[#3B33BD] transition-transform active:scale-95 focus-visible:ring-2 focus-visible:ring-[#ccff00]/70 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Icon
          icon={isSigning ? "lucide:loader-circle" : "lucide:send"}
          aria-hidden="true"
          width={18}
          height={18}
          className={isSigning ? "animate-spin" : ""}
        />
        {isSigning ? "Signing..." : "Confirm & send"}
      </button>
    </section>
  );
}
