"use client";

import { Icon } from "@iconify/react";
import * as React from "react";

import { MobilePageHeader, MobileShell } from "@/components/ui/mobile-shell";
import { WalletAvatar } from "@/components/ui/wallet-avatar";
import { formatTokenBalance, formatUsd } from "@/lib/format";
import { truncateAddress } from "@/utils/address.utils";
import { useConfirmPaymentState } from "@/modules/send/hooks/useConfirmPaymentState";
import { getFeeBreakdownRows, getTotalFeeLabel } from "@/modules/send/utils/send.utils";

export default function ConfirmPaymentView() {
  const state = useConfirmPaymentState();

  const feeRows = state.sendPreview ? getFeeBreakdownRows(state.sendPreview.transaction) : [];

  const estimatedUsd = React.useMemo(() => {
    if (!state.selectedToken || !state.amount) return null;
    const price = state.selectedToken.balance > 0 && state.selectedToken.amountInUSD > 0
      ? state.selectedToken.amountInUSD / state.selectedToken.balance
      : ["USDC", "USDT"].includes(state.selectedToken.symbol.toUpperCase())
        ? 1
        : null;
    if (price === null) return null;
    return Number(state.amount) * price;
  }, [state.selectedToken, state.amount]);

  return (
    <MobileShell>
      <MobilePageHeader
        title="Confirm Payment"
        leading={
          <button
            type="button"
            onClick={state.handleBack}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1C1C1E] text-white transition-colors hover:bg-[#262628] focus-visible:ring-2 focus-visible:ring-[#3B33BD]"
            aria-label="Back to send"
          >
            <Icon icon="lucide:chevron-left" aria-hidden="true" width={28} height={28} />
          </button>
        }
      />

      <section className="mt-5 flex flex-1 flex-col">
        {/* Recipient summary */}
        <div className="rounded-[32px] bg-[#111217] p-5 shadow-[0_12px_44px_-24px_rgba(59,51,189,0.6)]">
          {state.recipient ? (
            <>
              <WalletAvatar
                address={state.recipient.address}
                label={state.recipient.name}
                fallback={state.recipient.name}
                size="xl"
                className="mx-auto"
                fallbackClassName={state.recipient.color}
              />
              <div className="mt-4 flex items-center justify-center gap-2">
                <h2 className="text-2xl font-black tracking-tight text-white">{state.recipient.handle}</h2>
                {state.recipient.status === "Verified" ? (
                  <Icon
                    icon="material-symbols:verified-rounded"
                    aria-hidden="true"
                    width={22}
                    height={22}
                    className="text-[#ccff00]"
                  />
                ) : null}
              </div>
              <p className="mt-2 text-center text-sm font-medium text-[#9A9AA2]">
                {state.recipient.name} â€¢ {truncateAddress(state.recipient.address, 5)}
              </p>
            </>
          ) : (
            <div className="py-8 text-center text-sm font-medium text-[#9A9AA2]">Recipient not found</div>
          )}
        </div>

        {/* Amount card */}
        <div className="mt-4 rounded-[28px] bg-[#111217] p-5">
          <p className="text-center text-xs font-black uppercase text-[#77777f]">You send</p>
          <div className="mt-2 text-center">
            <span className="text-4xl font-black text-white">
              {state.amount ? formatTokenBalance(Number(state.amount)) : "0.00"}
            </span>
            <span className="ml-2 text-xl font-black text-[#ccff00]">
              {state.selectedToken?.symbol ?? "---"}
            </span>
          </div>
          {estimatedUsd !== null ? (
            <p className="mt-1 text-center text-sm font-semibold text-[#9A9AA2]">
              â‰ˆ {formatUsd(estimatedUsd)}
            </p>
          ) : null}
          <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4 text-sm">
            <span className="text-[#9A9AA2]">Network</span>
            <span className="font-bold text-white">{state.selectedToken?.chainName ?? "---"}</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-sm">
            <span className="text-[#9A9AA2]">Recipient receives</span>
            <span className="font-mono font-black text-white">
              {state.amount ? formatTokenBalance(Number(state.amount)) : "0.00"} {state.selectedToken?.symbol ?? ""}
            </span>
          </div>
        </div>

        {/* Fee breakdown */}
        <div className="mt-4 rounded-[28px] bg-[#111217] p-5">
          <h3 className="text-xs font-black uppercase text-[#77777f]">Transaction details</h3>

          {!state.sendPreview || state.isPreparing ? (
            <div className="mt-4 flex items-center justify-center gap-2 text-sm font-semibold text-[#9A9AA2]">
              <Icon icon="lucide:loader-circle" aria-hidden="true" width={18} height={18} className="animate-spin" />
              Preparing preview...
            </div>
          ) : (
            <>
              <dl className="mt-4 space-y-2.5 text-sm">
                {feeRows.map((row) => (
                  <div key={row.label} className="flex items-start justify-between gap-3">
                    <dt className="text-[#9A9AA2]">{row.label}</dt>
                    <dd className="font-mono font-bold tabular-nums text-white">{row.value}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-4 border-t border-white/10 pt-4">
                <div className="flex items-start justify-between gap-3 text-sm">
                  <dt className="font-bold text-white">Estimated total fee</dt>
                  <dd className="font-mono font-black tabular-nums text-[#ccff00]">
                    {getTotalFeeLabel(state.sendPreview.transaction)}
                  </dd>
                </div>
              </div>

            </>
          )}
        </div>

        {state.accountError ? (
          <div className="mt-4 rounded-2xl bg-red-500/10 px-4 py-3">
            <p className="text-sm font-semibold text-red-100">Real balance belum bisa dimuat.</p>
            <p className="mt-1 text-xs font-medium text-red-100/75">{state.accountError}</p>
            <button
              type="button"
              onClick={() => void state.refreshAccount()}
              className="mt-3 flex h-10 items-center justify-center rounded-full bg-red-500/15 px-4 text-xs font-black text-red-50 transition-colors hover:bg-red-500/20"
            >
              Retry
            </button>
          </div>
        ) : null}

        {state.error ? (
          <div className="mt-4 rounded-2xl bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-100">
            {state.error}
          </div>
        ) : null}

        {state.transactionId ? (
          <div className="mt-4 rounded-2xl bg-[#ccff00]/10 px-4 py-3 text-sm font-bold text-[#ccff00]">
            Transaction sent!{" "}
            <a
              href={`https://universalx.app/activity/details?id=${state.transactionId}`}
              target="_blank"
              rel="noreferrer"
              className="underline decoration-[#ccff00]/50 underline-offset-4"
            >
              View transaction
            </a>
          </div>
        ) : null}

        <div className="mt-auto pt-5">
          <button
            type="button"
            onClick={() => void state.handleConfirmSend()}
            disabled={!state.isReady || state.isPreparing || state.isSigning || Boolean(state.transactionId)}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[#ccff00] text-base font-black text-[#3B33BD] shadow-[0_10px_28px_-10px_rgba(204,255,0,0.5)] transition-transform active:scale-95 focus-visible:ring-2 focus-visible:ring-[#ccff00]/70 disabled:cursor-not-allowed disabled:bg-[#2A2A3E] disabled:text-[#77777f]"
          >
            <Icon
              icon={state.isSigning ? "lucide:loader-circle" : "lucide:check-circle"}
              aria-hidden="true"
              width={20}
              height={20}
              className={state.isSigning ? "animate-spin" : ""}
            />
            {state.isSigning ? "Signing..." : "Confirm Payment"}
          </button>
        </div>
      </section>
    </MobileShell>
  );
}
