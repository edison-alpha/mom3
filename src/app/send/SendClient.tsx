"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import * as React from "react";
import { historyItems } from "@/lib/history";
import { cn } from "@/lib/utils";

type Recipient = {
  id: string;
  handle: string;
  name: string;
  address: string;
  network: string;
  status: "Friend" | "Recent" | "Verified" | "External";
  color: string;
};

type SendAsset = {
  symbol: string;
  name: string;
  balance: string;
  icon: string;
};

const sendAssets: SendAsset[] = [
  {
    symbol: "USDC",
    name: "USD Coin",
    balance: "0.00",
    icon: "cryptocurrency-color:usdc",
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    balance: "0.0000",
    icon: "cryptocurrency-color:eth",
  },
  {
    symbol: "USDT",
    name: "Tether USD",
    balance: "0.00",
    icon: "cryptocurrency-color:usdt",
  },
  {
    symbol: "MOM",
    name: "mom3 Coin",
    balance: "0.00",
    icon: "solar:stars-bold",
  },
];

const toneToGradient: Record<string, string> = {
  green: "from-[#ccff00] to-[#3B33BD]",
  purple: "from-[#3B33BD] to-[#7E78EA]",
  blue: "from-[#2d2eff] to-[#5EA2FF]",
};

const recentRecipients = historyItems.me
  .filter((item) => item.title.toLowerCase().includes("sent to") || item.title.includes("@"))
  .map((item, index) => {
    const handleMatch = item.title.match(/@(\w+)/);
    const handle = handleMatch ? `@${handleMatch[1]}` : item.title;
    const name = handle.replace("@", "");
    return {
      id: `recent-${item.id}`,
      handle,
      name: name.charAt(0).toUpperCase() + name.slice(1),
      address: item.reference.startsWith("0x") ? item.reference : `0x${item.id.replace(/-/g, "").slice(0, 6)}...`,
      network: item.network,
      status: "Recent" as const,
      color: toneToGradient[item.tone] ?? "from-[#3B33BD] to-[#7E78EA]",
    };
  })
  .reverse();

const addressBook: Recipient[] = [
  {
    id: "1",
    handle: "@ubayy",
    name: "Ubayy",
    address: "0x91b4...7A20",
    network: "Base",
    status: "Verified",
    color: "from-[#3B33BD] to-[#7E78EA]",
  },
  {
    id: "2",
    handle: "@raka",
    name: "Raka Pradana",
    address: "0x4f3h...8a7d",
    network: "Base",
    status: "Friend",
    color: "from-[#ccff00] to-[#3B33BD]",
  },
  {
    id: "3",
    handle: "@naya",
    name: "Naya Putri",
    address: "0x7c81...A2f0",
    network: "Base",
    status: "Friend",
    color: "from-[#ff7a45] to-[#3B33BD]",
  },
  {
    id: "4",
    handle: "@salsa",
    name: "Salsa Mahira",
    address: "0xb81a...19d2",
    network: "Base",
    status: "Recent",
    color: "from-[#2d2eff] to-[#5EA2FF]",
  },
];

const scannedRecipient: Recipient = {
  id: "scan",
  handle: "@scanned",
  name: "Scanned Wallet",
  address: "0xA71c...90E4",
  network: "Base",
  status: "External",
  color: "from-[#1C1C1E] to-[#3B33BD]",
};

function matchesRecipient(recipient: Recipient, query: string) {
  const normalized = query.toLowerCase();

  return (
    recipient.handle.toLowerCase().includes(normalized) ||
    recipient.name.toLowerCase().includes(normalized) ||
    recipient.address.toLowerCase().includes(normalized) ||
    recipient.network.toLowerCase().includes(normalized)
  );
}

function RecipientRow({
  recipient,
  selected,
  onSelect,
}: {
  recipient: Recipient;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex min-h-[74px] w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-white/[0.04] focus-visible:ring-2 focus-visible:ring-[#3B33BD]",
        selected && "bg-[#3B33BD]/10"
      )}
    >
      <span
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-sm font-black text-white",
          recipient.color
        )}
      >
        {recipient.name.slice(0, 1)}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="truncate text-sm font-bold text-white">
            {recipient.handle}
          </span>
          {recipient.status === "Verified" ? (
            <Icon
              icon="material-symbols:verified-rounded"
              aria-hidden="true"
              width={16}
              height={16}
              className="text-[#ccff00]"
            />
          ) : null}
        </span>
        <span className="mt-0.5 block truncate text-xs font-medium text-[#9A9AA2]">
          {recipient.name} • {recipient.address}
        </span>
      </span>
      <span className="shrink-0 rounded-full bg-black/30 px-2.5 py-1 text-[10px] font-black text-[#9A9AA2]">
        {recipient.network}
      </span>
    </button>
  );
}

export default function SendClient() {
  const searchParams = useSearchParams();
  const initialTo = searchParams.get("to") ?? "";

  const [query, setQuery] = React.useState(initialTo);
  const [selectedRecipient, setSelectedRecipient] = React.useState<Recipient | null>(null);
  const [selectedAsset, setSelectedAsset] = React.useState<SendAsset | null>(null);
  const [amount, setAmount] = React.useState("");
  const [scanOpen, setScanOpen] = React.useState(false);
  const [sent, setSent] = React.useState(false);

  React.useEffect(() => {
    if (initialTo) {
      const matched =
        addressBook.find((recipient) => matchesRecipient(recipient, initialTo)) ??
        recentRecipients.find((recipient) => matchesRecipient(recipient, initialTo));

      if (matched) {
        setSelectedRecipient(matched);
      } else if (initialTo.startsWith("0x") && initialTo.length >= 8) {
        setSelectedRecipient({
          ...scannedRecipient,
          id: "typed-address",
          handle: "Wallet address",
          name: "External wallet",
          address: initialTo,
        });
      }
    }
  }, [initialTo]);

  const filteredRecipients = React.useMemo(() => {
    if (!query.trim()) return recentRecipients;

    const combined = [...recentRecipients, ...addressBook].filter(
      (recipient, index, self) => index === self.findIndex((r) => r.handle === recipient.handle)
    );
    const filtered = combined.filter((recipient) => matchesRecipient(recipient, query));

    if (filtered.length > 0) return filtered;

    if (query.startsWith("0x") && query.length >= 8) {
      return [
        {
          ...scannedRecipient,
          id: "typed-address",
          handle: "Wallet address",
          name: "External wallet",
          address: query,
        },
      ];
    }

    return [];
  }, [query]);

  const handleScan = () => {
    setScanOpen(false);
    setQuery(scannedRecipient.address);
    setSelectedRecipient(scannedRecipient);
    setSelectedAsset(null);
    setAmount("");
    setSent(false);
  };

  const resetCompose = () => {
    setSelectedRecipient(null);
    setSelectedAsset(null);
    setAmount("");
    setSent(false);
    setQuery("");
  };

  const canSend = Boolean(selectedRecipient && selectedAsset && amount.trim());

  const showRecentLabel = !query.trim() && recentRecipients.length > 0;

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto flex min-h-screen w-full flex-col px-5 pb-28 pt-4 sm:max-w-md">
        <header className="relative flex h-12 items-center justify-center">
          {selectedRecipient ? (
            <button
              type="button"
              onClick={resetCompose}
              className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-[#3B33BD]"
              aria-label="Back to recipient search"
            >
              <Icon
                icon="lucide:chevron-left"
                aria-hidden="true"
                width={28}
                height={28}
              />
            </button>
          ) : (
            <Link
              href="/assets"
              className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-[#3B33BD]"
              aria-label="Back to assets"
            >
              <Icon
                icon="lucide:chevron-left"
                aria-hidden="true"
                width={28}
                height={28}
              />
            </Link>
          )}

          <h1 className="text-base font-bold text-white">/Send</h1>
        </header>

        {selectedRecipient ? (
          <section className="mt-5 flex flex-1 flex-col">
            <div className="rounded-[32px] bg-[#1C1C1E] p-5 text-center">
              <div
                className={cn(
                  "mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br text-2xl font-black text-white",
                  selectedRecipient.color
                )}
              >
                {selectedRecipient.name.slice(0, 1)}
              </div>
              <div className="mt-4 flex items-center justify-center gap-2">
                <h2 className="text-2xl font-black tracking-tight text-white">
                  {selectedRecipient.handle}
                </h2>
                {selectedRecipient.status === "Verified" ? (
                  <Icon
                    icon="material-symbols:verified-rounded"
                    aria-hidden="true"
                    width={22}
                    height={22}
                    className="text-[#ccff00]"
                  />
                ) : null}
              </div>
              <p className="mt-2 text-sm font-medium text-[#9A9AA2]">
                {selectedRecipient.name} • {selectedRecipient.address}
              </p>
            </div>

            <div className="mt-5 rounded-[28px] bg-[#1C1C1E] p-4">
              <label
                htmlFor="send-asset"
                className="block text-xs font-black uppercase text-[#77777f]"
              >
                Asset
              </label>
              <div className="mt-2 grid grid-cols-4 gap-2">
                {sendAssets.map((asset) => {
                  const isSelected = selectedAsset?.symbol === asset.symbol;

                  return (
                    <button
                      key={asset.symbol}
                      type="button"
                      onClick={() => {
                        setSelectedAsset(asset);
                        setSent(false);
                      }}
                      className={cn(
                        "flex flex-col items-center gap-1.5 rounded-[18px] border border-white/10 bg-black/25 p-2.5 transition-colors focus-visible:ring-2 focus-visible:ring-[#3B33BD]",
                        isSelected && "border-[#3B33BD] bg-[#3B33BD]/15"
                      )}
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.08]">
                        <Icon icon={asset.icon} aria-hidden="true" width={20} height={20} />
                      </span>
                      <span className="text-xs font-black text-white">{asset.symbol}</span>
                    </button>
                  );
                })}
              </div>

              <label
                htmlFor="send-amount"
                className="mt-5 block text-xs font-black uppercase text-[#77777f]"
              >
                Amount
              </label>
              <div className="mt-2 flex h-14 items-center gap-2 rounded-2xl bg-black/25 px-4">
                <input
                  id="send-amount"
                  type="text"
                  inputMode="decimal"
                  value={amount}
                  onChange={(event) => {
                    setAmount(event.target.value.replace(/[^0-9.]/g, ""));
                    setSent(false);
                  }}
                  placeholder="0.00"
                  className="min-w-0 flex-1 bg-transparent text-3xl font-black text-white placeholder:text-[#66666D] focus:outline-none"
                />
                <span className="rounded-full bg-[#3B33BD]/20 px-3 py-1 text-xs font-black text-[#8F89FF]">
                  {selectedAsset?.symbol ?? "ASSET"}
                </span>
              </div>
              {selectedAsset ? (
                <p className="mt-2 text-right text-xs font-semibold text-[#9A9AA2]">
                  Balance: {selectedAsset.balance} {selectedAsset.symbol}
                </p>
              ) : null}

              <button
                type="button"
                disabled={!canSend}
                onClick={() => setSent(true)}
                className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#3B33BD] text-base font-black text-[#ccff00] shadow-[0_10px_28px_-10px_rgba(59,51,189,0.8)] transition-transform active:scale-95 focus-visible:ring-2 focus-visible:ring-[#3B33BD] disabled:cursor-not-allowed disabled:bg-[#2A2A3E] disabled:text-[#77777f]"
              >
                <Icon icon="lucide:send" aria-hidden="true" width={20} height={20} />
                Preview
              </button>

              {sent ? (
                <div className="mt-3 rounded-2xl bg-[#ccff00]/10 px-4 py-3 text-sm font-bold text-[#ccff00]">
                  Ready to send {amount} {selectedAsset?.symbol} to{" "}
                  {selectedRecipient.handle}.
                </div>
              ) : null}
            </div>
          </section>
        ) : (
          <>
            <label htmlFor="recipient-search" className="sr-only">
              Search with tag or address
            </label>
            <div className="mt-5 flex h-12 items-center gap-3 rounded-2xl bg-[#1f1f21] px-4">
              <Icon
                icon="icon-park-outline:search"
                aria-hidden="true"
                width={20}
                height={20}
                className="shrink-0 text-[#9A9AA2]"
              />
              <input
                id="recipient-search"
                type="search"
                inputMode="search"
                autoComplete="off"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setSent(false);
                }}
                placeholder="Search @ tag or address"
                className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-[#8E8E93] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setScanOpen(true)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[#3B33BD] transition-colors hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-[#3B33BD]"
                aria-label="Scan address"
              >
                <Icon icon="lucide:scan-line" aria-hidden="true" width={23} height={23} />
              </button>
            </div>

            <section className="mt-5 flex-1">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-white">
                  {showRecentLabel ? "Recent" : "Recipients"}
                </h2>
                <span className="rounded-full bg-[#1C1C1E] px-3 py-1 text-xs font-bold text-[#9A9AA2]">
                  {filteredRecipients.length}
                </span>
              </div>

              {filteredRecipients.length > 0 ? (
                <div className="mt-3 overflow-hidden rounded-[28px] bg-[#1C1C1E]">
                  {filteredRecipients.map((recipient, index) => (
                    <div
                      key={recipient.id}
                      className={index < filteredRecipients.length - 1 ? "border-b border-white/5" : ""}
                    >
                      <RecipientRow
                        recipient={recipient}
                        selected={false}
                        onSelect={() => {
                          setSelectedRecipient(recipient);
                          setSelectedAsset(null);
                          setAmount("");
                          setSent(false);
                        }}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-3 flex flex-1 flex-col items-center justify-center rounded-[28px] bg-[#1C1C1E] px-6 py-12 text-center">
                  <Image
                    src="/send-friend.png"
                    alt=""
                    width={132}
                    height={96}
                    className="h-auto w-28 object-contain"
                    priority
                  />
                  <h2 className="mt-5 text-xl font-bold tracking-tight text-white">
                    No recipient found
                  </h2>
                  <p className="mt-2 text-sm font-medium leading-relaxed text-[#9A9AA2]">
                    Try a mom3 tag like @raka or paste a wallet address.
                  </p>
                </div>
              )}
            </section>
          </>
        )}
      </div>

      {scanOpen ? (
        <div className="fixed inset-0 z-50 flex items-end bg-black/70 p-5 backdrop-blur-sm sm:items-center sm:justify-center">
          <div className="mx-auto w-full max-w-md rounded-[32px] bg-[#1C1C1E] p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-white">Scan wallet QR</h2>
              <button
                type="button"
                onClick={() => setScanOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-black/30 text-[#9A9AA2] hover:text-white"
                aria-label="Close scanner"
              >
                <Icon icon="lucide:x" aria-hidden="true" width={20} height={20} />
              </button>
            </div>
            <div className="mt-5 flex aspect-square items-center justify-center rounded-[28px] border border-[#3B33BD]/50 bg-black">
              <div className="relative h-48 w-48 rounded-[24px] border-2 border-[#ccff00]">
                <div className="absolute left-5 top-5 h-8 w-8 border-l-4 border-t-4 border-white" />
                <div className="absolute right-5 top-5 h-8 w-8 border-r-4 border-t-4 border-white" />
                <div className="absolute bottom-5 left-5 h-8 w-8 border-b-4 border-l-4 border-white" />
                <div className="absolute bottom-5 right-5 h-8 w-8 border-b-4 border-r-4 border-white" />
                <div className="absolute inset-x-6 top-1/2 h-0.5 bg-[#ccff00] shadow-[0_0_18px_rgba(204,255,0,0.8)]" />
              </div>
            </div>
            <button
              type="button"
              onClick={handleScan}
              className="mt-5 flex h-12 w-full items-center justify-center rounded-full bg-[#3B33BD] text-base font-black text-[#ccff00]"
            >
              Use scanned wallet
            </button>
          </div>
        </div>
      ) : null}
    </main>
  );
}
