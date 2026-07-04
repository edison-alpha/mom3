"use client";

import { Icon } from "@iconify/react";
import Link from "next/link";
import * as React from "react";
import { cn } from "@/lib/utils";

const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0"];

type ConvertAsset = {
  symbol: string;
  name: string;
  balance: string;
  icon: string;
  color: string;
  rate: number;
};

const assets: ConvertAsset[] = [
  {
    symbol: "USDC",
    name: "USD Coin",
    balance: "0.00",
    icon: "cryptocurrency-color:usdc",
    color: "bg-[#2775CA]",
    rate: 1,
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    balance: "0.0000",
    icon: "cryptocurrency-color:eth",
    color: "bg-[#627EEA]",
    rate: 2500,
  },
  {
    symbol: "USDT",
    name: "Tether USD",
    balance: "0.00",
    icon: "cryptocurrency-color:usdt",
    color: "bg-[#26A17B]",
    rate: 1,
  },
  {
    symbol: "MOM",
    name: "mom3 Coin",
    balance: "0.00",
    icon: "solar:stars-bold",
    color: "bg-[#ccff00]",
    rate: 0.05,
  },
  {
    symbol: "BTC",
    name: "Bitcoin",
    balance: "0.000000",
    icon: "cryptocurrency-color:btc",
    color: "bg-[#f7931a]",
    rate: 62000,
  },
];

function AssetButton({
  asset,
  onClick,
}: {
  asset: ConvertAsset;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 rounded-2xl bg-[#242620] px-3 py-2 text-white transition-colors hover:bg-[#2f2f2a] focus-visible:ring-2 focus-visible:ring-[#3B33BD]"
    >
      <span className={cn("flex h-7 w-7 items-center justify-center rounded-full", asset.color)}>
        <Icon icon={asset.icon} aria-hidden="true" width={18} height={18} />
      </span>
      <span className="flex items-center gap-1 text-sm font-black">
        {asset.symbol}
        <Icon icon="lucide:chevron-down" aria-hidden="true" width={14} height={14} />
      </span>
    </button>
  );
}

function AssetSelectModal({
  isOpen,
  onClose,
  onSelect,
  exclude,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (asset: ConvertAsset) => void;
  exclude?: ConvertAsset;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/70 p-5 backdrop-blur-sm sm:items-center sm:justify-center">
      <div className="mx-auto w-full max-w-md rounded-[32px] bg-[#1C1C1E] p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-black text-white">Select asset</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-black/30 text-[#9A9AA2] hover:text-white"
            aria-label="Close"
          >
            <Icon icon="lucide:x" aria-hidden="true" width={20} height={20} />
          </button>
        </div>
        <div className="mt-3 overflow-hidden rounded-[24px] bg-black/25">
          {assets
            .filter((asset) => asset.symbol !== exclude?.symbol)
            .map((asset, index, list) => (
              <button
                key={asset.symbol}
                type="button"
                onClick={() => onSelect(asset)}
                className={cn(
                  "flex w-full min-h-[64px] items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-white/[0.04]",
                  index < list.length - 1 && "border-b border-white/5"
                )}
              >
                <span
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                    asset.color
                  )}
                >
                  <Icon icon={asset.icon} aria-hidden="true" width={22} height={22} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold text-white">
                    {asset.name}
                  </span>
                  <span className="block text-xs font-medium text-[#9A9AA2]">
                    Bal {asset.balance} {asset.symbol}
                  </span>
                </span>
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}

export default function ConvertClient() {
  const [amount, setAmount] = React.useState("");
  const [previewed, setPreviewed] = React.useState(false);
  const [payAsset, setPayAsset] = React.useState(assets[0]);
  const [receiveAsset, setReceiveAsset] = React.useState(assets[4]);
  const [selecting, setSelecting] = React.useState<"pay" | "receive" | null>(null);

  const displayAmount = amount || "0";
  const numericAmount = Number(amount) || 0;
  const receiveAmount =
    numericAmount && payAsset.rate && receiveAsset.rate
      ? ((numericAmount * payAsset.rate) / receiveAsset.rate).toFixed(
          receiveAsset.symbol === "BTC" ? 6 : 4
        )
      : "0";

  const pressKey = (key: string) => {
    setPreviewed(false);

    if (key === "." && amount.includes(".")) return;
    if (amount === "0" && key !== ".") {
      setAmount(key);
      return;
    }
    setAmount((value) => `${value}${key}`);
  };

  const removeKey = () => {
    setPreviewed(false);
    setAmount((value) => value.slice(0, -1));
  };

  const handleSwitch = () => {
    setPreviewed(false);
    setPayAsset(receiveAsset);
    setReceiveAsset(payAsset);
  };

  const handleSelect = (asset: ConvertAsset) => {
    if (selecting === "pay") {
      setPayAsset(asset);
      if (asset.symbol === receiveAsset.symbol) {
        setReceiveAsset(assets.find((a) => a.symbol !== asset.symbol) ?? assets[1]);
      }
    } else {
      setReceiveAsset(asset);
      if (asset.symbol === payAsset.symbol) {
        setPayAsset(assets.find((a) => a.symbol !== asset.symbol) ?? assets[0]);
      }
    }
    setSelecting(null);
    setPreviewed(false);
  };

  return (
    <main className="min-h-screen w-full bg-black font-sans text-white antialiased">
      <div className="mx-auto flex min-h-screen w-full flex-col px-5 pb-28 pt-4 sm:max-w-md">
        <header className="relative flex h-12 items-center justify-center">
          <Link
            href="/assets"
            aria-label="Back to assets"
            className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full bg-[#1C1C1E] text-white transition-colors hover:bg-[#262628] focus-visible:ring-2 focus-visible:ring-[#3B33BD]"
          >
            <Icon icon="lucide:chevron-left" aria-hidden="true" width={28} height={28} />
          </Link>

          <h1 className="text-base font-bold text-white">/Convert</h1>
        </header>

        <section className="relative mt-5 flex flex-col gap-3">
          <div className="rounded-[28px] bg-[#1C1C1E] p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-black uppercase text-[#A7A7A7]">You pay</p>
                <p className="mt-2 text-4xl font-black tracking-tight text-white">
                  {displayAmount}
                </p>
                <p className="mt-1 text-xs font-semibold text-[#9A9AA2]">
                  Balance: {payAsset.balance} {payAsset.symbol}
                </p>
              </div>
              <AssetButton asset={payAsset} onClick={() => setSelecting("pay")} />
            </div>
          </div>

          <div className="relative flex justify-center">
            <button
              type="button"
              onClick={handleSwitch}
              className="flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-[#3B33BD] text-[#ccff00] shadow-[0_8px_18px_-10px_rgba(0,0,0,0.9)] transition-transform hover:rotate-180 focus-visible:ring-2 focus-visible:ring-[#ccff00]/70"
              aria-label="Switch assets"
            >
              <Icon icon="lucide:arrow-up-down" aria-hidden="true" width={22} height={22} />
            </button>
          </div>

          <div className="rounded-[28px] bg-[#1C1C1E] p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-black uppercase text-[#A7A7A7]">You receive</p>
                <p className="mt-2 text-4xl font-black tracking-tight text-white">
                  {receiveAmount}
                </p>
                <p className="mt-1 text-xs font-semibold text-[#9A9AA2]">
                  ≈ ${numericAmount ? numericAmount.toFixed(2) : "0.00"}
                </p>
              </div>
              <AssetButton asset={receiveAsset} onClick={() => setSelecting("receive")} />
            </div>
          </div>
        </section>

        <section className="mt-auto grid grid-cols-3 gap-y-3 pb-4 pt-6">
          {keys.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => pressKey(key)}
              className="mx-auto flex h-12 w-12 items-center justify-center rounded-full text-2xl font-black text-white transition-colors hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-[#3B33BD]"
            >
              {key}
            </button>
          ))}
          <button
            type="button"
            onClick={removeKey}
            className="mx-auto flex h-12 w-12 items-center justify-center rounded-full text-white transition-colors hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-[#3B33BD]"
            aria-label="Delete"
          >
            <Icon icon="lucide:delete" aria-hidden="true" width={24} height={24} />
          </button>
        </section>

        <button
          type="button"
          disabled={!amount}
          onClick={() => setPreviewed(true)}
          className="flex h-12 w-full items-center justify-center rounded-[24px] bg-[#ccff00] text-base font-black text-black transition-transform active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-[#ccff00]/70 disabled:bg-[#203900] disabled:text-black/60"
        >
          {previewed ? "Preview ready" : "Preview"}
        </button>
      </div>

      <AssetSelectModal
        isOpen={selecting !== null}
        onClose={() => setSelecting(null)}
        onSelect={handleSelect}
        exclude={selecting === "pay" ? receiveAsset : payAsset}
      />
    </main>
  );
}
