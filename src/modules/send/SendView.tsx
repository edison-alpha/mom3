"use client";

import { Icon } from "@iconify/react";
import {
  CHAIN_ID,
  type ITokenWithUSD,
  type ITransaction,
} from "@particle-network/universal-account-sdk";
import { formatUnits } from "ethers";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import * as React from "react";

import { MobilePageHeader, MobileShell } from "@/components/ui/mobile-shell";
import { historyItems } from "@/lib/history";
import { truncateAddress } from "@/lib/wallet-session";
import { cn } from "@/lib/utils";
import { useUniversalAccount } from "@/providers/UniversalAccountProvider";

type Recipient = {
  id: string;
  handle: string;
  name: string;
  address: string;
  network: string;
  status: "Friend" | "Recent" | "Verified" | "External";
  color: string;
};

type TokenRow = {
  id: string;
  symbol: string;
  name: string;
  balance: number;
  amountInUSD: number;
  icon: string;
  chainName: string;
  chainId: number;
  tokenAddress: string;
  isSuggested?: boolean;
};

type SendStatus = "idle" | "delegating" | "preparing" | "signing";

type SendPreview = {
  transaction: ITransaction;
  amount: string;
  token: TokenRow;
  recipient: Recipient;
};

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

const toneToGradient: Record<string, string> = {
  green: "from-[#ccff00] to-[#3B33BD]",
  purple: "from-[#3B33BD] to-[#7E78EA]",
  blue: "from-[#2d2eff] to-[#5EA2FF]",
};

function isValidAddress(address: string) {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

function isValidSolanaAddress(address: string) {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
}

function tokenIcon(symbol: string) {
  switch (symbol.toUpperCase()) {
    case "USDC":
      return "cryptocurrency-color:usdc";
    case "USDT":
      return "cryptocurrency-color:usdt";
    case "ETH":
      return "cryptocurrency-color:eth";
    case "BNB":
      return "cryptocurrency-color:bnb";
    case "SOL":
      return "cryptocurrency-color:solana";
    default:
      return "solar:wallet-money-bold";
  }
}

function chainNameFromId(chainId: number) {
  switch (chainId) {
    case 101:
      return "Solana";
    case 1:
      return "Ethereum";
    case 10:
      return "Optimism";
    case 56:
      return "BNB Chain";
    case 137:
      return "Polygon";
    case 146:
      return "Sonic";
    case 196:
      return "X Layer";
    case 42161:
      return "Arbitrum";
    case 43114:
      return "Avalanche";
    case 8453:
      return "Base";
    case 59144:
      return "Linea";
    case 80094:
      return "Berachain";
    default:
      return `Chain ${chainId}`;
  }
}

const receiveTokenTemplates: Array<Omit<TokenRow, "id" | "balance" | "amountInUSD">> = [
  {
    symbol: "USDC",
    name: "USD Coin",
    icon: tokenIcon("USDC"),
    chainName: "Base",
    chainId: CHAIN_ID.BASE_MAINNET,
    tokenAddress: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    isSuggested: true,
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    icon: tokenIcon("USDC"),
    chainName: "Solana",
    chainId: CHAIN_ID.SOLANA_MAINNET,
    tokenAddress: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    isSuggested: true,
  },
  {
    symbol: "SOL",
    name: "Solana",
    icon: tokenIcon("SOL"),
    chainName: "Solana",
    chainId: CHAIN_ID.SOLANA_MAINNET,
    tokenAddress: ZERO_ADDRESS,
    isSuggested: true,
  },
];

function formatTokenBalance(balance: number) {
  if (balance === 0) return "0.00";
  if (balance >= 1) return balance.toFixed(4).replace(/\.?(0+)$/, "");
  return balance.toFixed(6).replace(/\.?(0+)$/, "");
}

function parseDecimalish(value: string | number | null | undefined, decimals = 18) {
  if (value === null || value === undefined || value === "") return 0;
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;

  const trimmed = value.trim();
  if (!trimmed) return 0;

  if (/^\d+$/.test(trimmed) && trimmed.length > Math.max(6, decimals - 2)) {
    try {
      return Number(formatUnits(trimmed, decimals));
    } catch {
      return 0;
    }
  }

  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatUsd(value: number) {
  if (!Number.isFinite(value)) return "$0.00";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: value > 0 && value < 0.01 ? 4 : 2,
    maximumFractionDigits: value > 0 && value < 0.01 ? 6 : 2,
  }).format(value);
}

function formatUsdValue(value: string | number | null | undefined) {
  return formatUsd(parseDecimalish(value));
}

function getTokenUsdPrice(token: TokenRow | null) {
  if (!token) return null;
  if (token.balance > 0 && token.amountInUSD > 0) return token.amountInUSD / token.balance;
  if (["USDC", "USDT"].includes(token.symbol.toUpperCase())) return 1;
  return null;
}

function getEstimatedAmountInUSD(amount: number, token: TokenRow | null) {
  const price = getTokenUsdPrice(token);
  if (price === null) return null;
  return amount * price;
}

function getTransactionFeeQuote(transaction: ITransaction | null) {
  if (!transaction) return null;
  return transaction.gasless ?? transaction.feeQuotes?.[0] ?? null;
}

function getFeeBreakdownRows(transaction: ITransaction | null) {
  const feeQuote = getTransactionFeeQuote(transaction);
  const totals = feeQuote?.fees.totals;

  if (!totals) {
    return [
      {
        label: "Estimated fees",
        value: "Unavailable",
      },
    ];
  }

  const rows = [
    {
      label: "Network + gas",
      value: feeQuote.fees.freeGasFee ? "Free" : formatUsdValue(totals.gasFeeTokenAmountInUSD),
    },
    {
      label: "Service fee",
      value: feeQuote.fees.freeServiceFee
        ? "Free"
        : formatUsdValue(totals.transactionServiceFeeTokenAmountInUSD),
    },
    {
      label: "LP / settlement",
      value: formatUsdValue(totals.transactionLPFeeTokenAmountInUSD),
    },
  ];

  const solanaRentFee = totals.solanaRentFeeInUSD ?? totals.solanaRentFeeAmountInUSD;
  if (parseDecimalish(solanaRentFee) > 0) {
    rows.push({
      label: "Solana rent",
      value: formatUsdValue(solanaRentFee),
    });
  }

  if (parseDecimalish(totals.solanaMevTipFeeInUSD) > 0) {
    rows.push({
      label: "Solana MEV tip",
      value: formatUsdValue(totals.solanaMevTipFeeInUSD),
    });
  }

  return rows;
}

function getTotalFeeLabel(transaction: ITransaction | null) {
  const feeQuote = getTransactionFeeQuote(transaction);
  return formatUsdValue(
    feeQuote?.fees.totals.feeTokenAmountInUSD ?? transaction?.tokenChanges?.totalFeeInUSD,
  );
}

function formatTokenChange(item: ITokenWithUSD) {
  const decimals = item.token.realDecimals ?? item.token.decimals ?? 18;
  const amount = parseDecimalish(item.amount, decimals);
  const symbol = item.token.symbol || item.token.type || "Token";
  const chain = chainNameFromId(Number(item.token.chainId));
  return `${formatTokenBalance(amount)} ${symbol.toUpperCase()} on ${chain}`;
}

function getFundingRows(transaction: ITransaction | null) {
  if (!transaction) return [];

  const rows =
    transaction.depositTokens?.length > 0
      ? transaction.depositTokens
      : transaction.tokenChanges?.decr ?? [];

  return rows.slice(0, 3).map((item) => ({
    label: formatTokenChange(item),
    value: formatUsdValue(item.amountInUSD),
  }));
}

function getFeeTokenRows(transaction: ITransaction | null) {
  const feeQuote = getTransactionFeeQuote(transaction);
  return (feeQuote?.fees.feeTokens ?? []).slice(0, 2).map((item) => ({
    label: formatTokenChange(item),
    value: formatUsdValue(item.amountInUSD),
  }));
}

function normalizeAssetQuery(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function sanitizeAmountInput(value: string) {
  const normalized = value.replace(",", ".").replace(/[^0-9.]/g, "");
  const [whole, ...fractions] = normalized.split(".");

  if (fractions.length === 0) return whole;
  return `${whole}.${fractions.join("")}`;
}

function matchesAsset(token: TokenRow, asset: string, chain = "") {
  const normalizedAsset = normalizeAssetQuery(asset);
  const normalizedChain = normalizeAssetQuery(chain);

  if (!normalizedAsset) return false;

  const assetMatches = [token.symbol, token.name]
    .map(normalizeAssetQuery)
    .some((value) => value === normalizedAsset || value.includes(normalizedAsset));

  if (!assetMatches) return false;
  if (!normalizedChain) return true;

  const tokenChain = normalizeAssetQuery(token.chainName);
  return tokenChain === normalizedChain || tokenChain.includes(normalizedChain);
}

function findPreferredToken(tokens: TokenRow[], asset: string, chain = "") {
  if (!asset) return null;

  return (
    tokens.find((token) => matchesAsset(token, asset, chain)) ??
    tokens.find((token) => matchesAsset(token, asset)) ??
    null
  );
}

function getAmountValidationMessage(
  amount: string,
  selectedToken: TokenRow | null,
  totalPrimaryAssetsInUSD: number | null,
) {
  if (!amount.trim()) return null;

  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    return "Masukkan jumlah yang valid.";
  }

  const estimatedAmountInUSD = getEstimatedAmountInUSD(numericAmount, selectedToken);

  if (
    totalPrimaryAssetsInUSD !== null &&
    estimatedAmountInUSD !== null &&
    estimatedAmountInUSD > totalPrimaryAssetsInUSD
  ) {
    return `Universal Balance belum cukup. Estimasi kebutuhan ${formatUsd(estimatedAmountInUSD)}, tersedia ${formatUsd(totalPrimaryAssetsInUSD)}.`;
  }

  return null;
}

function isRecipientValidForToken(recipient: Recipient, selectedToken: TokenRow) {
  if (selectedToken.chainId === CHAIN_ID.SOLANA_MAINNET) {
    return isValidSolanaAddress(recipient.address);
  }

  return isValidAddress(recipient.address);
}

function isUserRejectedError(cause: unknown) {
  const message = cause instanceof Error ? cause.message : String(cause);
  return /reject|denied|cancel/i.test(message);
}

function getSendErrorMessage(cause: unknown) {
  const message = cause instanceof Error ? cause.message : String(cause || "");
  const normalized = message.toLowerCase();

  if (normalized.includes("insufficient")) {
    return "Saldo belum cukup untuk amount atau biaya jaringan.";
  }

  if (normalized.includes("blockhash")) {
    return "Jaringan sedang berubah cepat. Coba kirim ulang sebentar lagi.";
  }

  if (normalized.includes("timeout") || normalized.includes("network")) {
    return "Koneksi ke jaringan sedang lambat. Coba lagi dalam beberapa detik.";
  }

  return message || "Gagal mengirim transaksi.";
}

const recipientDirectory: Recipient[] = [
  {
    id: "1",
    handle: "@ubayy",
    name: "Ubayy",
    address: "0x91b4d8a5cc0fa2b7f8a1ab3c4d5e6f708192a7b1",
    network: "EVM",
    status: "Verified",
    color: "from-[#3B33BD] to-[#7E78EA]",
  },
  {
    id: "2",
    handle: "@raka",
    name: "Raka Pradana",
    address: "0x4f3ad8b1c72e4ef8a46d1e2f3c7b81a2d4f19c23",
    network: "EVM",
    status: "Friend",
    color: "from-[#ccff00] to-[#3B33BD]",
  },
  {
    id: "3",
    handle: "@naya",
    name: "Naya Putri",
    address: "0x7c81a2f0f1a64df9822d7c1b2e3f4a5c6d7e8f90",
    network: "EVM",
    status: "Friend",
    color: "from-[#ff7a45] to-[#3B33BD]",
  },
  {
    id: "4",
    handle: "@salsa",
    name: "Salsa Mahira",
    address: "0xb81a19d2c4f0b7e13579ace02468bd14f5e6d7c8a",
    network: "EVM",
    status: "Recent",
    color: "from-[#2d2eff] to-[#5EA2FF]",
  },
];

const scannedRecipient: Recipient = {
  id: "scan",
  handle: "@scanned",
  name: "Scanned Wallet",
  address: "0xa71c90e4d4c21d0ab33e6f7a4d8c9b1e2f3a4c5d",
  network: "EVM",
  status: "External",
  color: "from-[#1C1C1E] to-[#3B33BD]",
};

const recentRecipients = historyItems.me
  .map((item): Recipient | null => {
    const handleMatch = item.title.match(/@(\w+)/);
    const handle = handleMatch ? `@${handleMatch[1]}` : item.title;
    const known = recipientDirectory.find(
      (recipient) => recipient.handle.toLowerCase() === handle.toLowerCase(),
    );

    if (!known) return null;

    return {
      id: `recent-${item.id}`,
      handle,
      name: known.name,
      address: known.address,
      network: "EVM",
      status: "Recent" as const,
      color: toneToGradient[item.tone] ?? "from-[#3B33BD] to-[#7E78EA]",
    } as Recipient;
  })
  .filter((item): item is Recipient => item !== null)
  .reverse();

const addressBook = recipientDirectory;

function matchesRecipient(recipient: Recipient, query: string) {
  const normalized = query.toLowerCase();
  return (
    recipient.handle.toLowerCase().includes(normalized) ||
    recipient.name.toLowerCase().includes(normalized) ||
    recipient.address.toLowerCase().includes(normalized) ||
    recipient.network.toLowerCase().includes(normalized)
  );
}

function resolveRecipient(query: string): Recipient | null {
  const trimmed = query.trim();
  if (!trimmed) return null;

  const known = [...addressBook, ...recentRecipients].find((recipient) => {
    return (
      recipient.handle.toLowerCase() === trimmed.toLowerCase() ||
      recipient.handle.toLowerCase().includes(trimmed.toLowerCase()) ||
      recipient.name.toLowerCase().includes(trimmed.toLowerCase())
    );
  });

  if (known) return known;

  if (isValidAddress(trimmed) || isValidSolanaAddress(trimmed)) {
    return {
      ...scannedRecipient,
      id: "typed-address",
      handle: "Wallet address",
      name: "External wallet",
      address: trimmed,
      network: isValidSolanaAddress(trimmed) ? "Solana" : "EVM",
    };
  }

  return null;
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
        selected && "bg-[#3B33BD]/10",
      )}
    >
      <span
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-sm font-black text-white",
          recipient.color,
        )}
      >
        {recipient.name.slice(0, 1)}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="truncate text-sm font-bold text-white">{recipient.handle}</span>
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
          {recipient.name} • {truncateAddress(recipient.address)}
        </span>
      </span>
      <span className="shrink-0 rounded-full bg-black/30 px-2.5 py-1 text-[10px] font-black text-[#9A9AA2]">
        {recipient.network}
      </span>
    </button>
  );
}

export default function SendView() {
  const searchParams = useSearchParams();
  const initialTo = searchParams.get("to") ?? "";
  const initialAsset = searchParams.get("asset") ?? "";
  const initialChain = searchParams.get("chain") ?? "";
  const {
    universalAccount,
    primaryAssets,
    isLoading,
    error: accountError,
    ensureDelegated,
    isDelegated,
    refreshAccount,
    signAndSend,
  } = useUniversalAccount();

  const [query, setQuery] = React.useState(initialTo);
  const [selectedRecipient, setSelectedRecipient] = React.useState<Recipient | null>(null);
  const [selectedTokenId, setSelectedTokenId] = React.useState<string | null>(null);
  const [amount, setAmount] = React.useState("");
  const [scanOpen, setScanOpen] = React.useState(false);
  const [isSending, setIsSending] = React.useState(false);
  const [sendStatus, setSendStatus] = React.useState<SendStatus>("idle");
  const [sendPreview, setSendPreview] = React.useState<SendPreview | null>(null);
  const [sent, setSent] = React.useState(false);
  const [transactionId, setTransactionId] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const appliedInitialAsset = React.useRef<string | null>(null);

  const tokenRows = React.useMemo<TokenRow[]>(() => {
    const assets = primaryAssets?.assets ?? [];
    const rowsById = new Map<string, TokenRow>();

    receiveTokenTemplates.forEach((token) => {
      const id = `${token.chainId}-${token.tokenAddress.toLowerCase()}-${token.symbol}`;
      rowsById.set(id, {
        ...token,
        id,
        balance: 0,
        amountInUSD: 0,
      });
    });

    assets
      .flatMap((asset) => {
        const tokenType = String(asset.tokenType || "TOKEN").toUpperCase();

        return asset.chainAggregation.map((entry) => {
          const tokenSymbol = String(entry.token.symbol || tokenType).toUpperCase();
          const chainId = Number(entry.token.chainId ?? 0);
          const balance = Number(entry.amount ?? 0);
          const amountInUSD = Number(entry.amountInUSD ?? 0);
          const tokenAddress = String(entry.token.address ?? ZERO_ADDRESS);

          return {
            id: `${chainId}-${tokenAddress.toLowerCase()}-${tokenSymbol}`,
            symbol: tokenSymbol,
            name: String(entry.token.name || tokenSymbol),
            balance,
            amountInUSD,
            icon: tokenIcon(tokenSymbol),
            chainName: chainNameFromId(chainId),
            chainId,
            tokenAddress,
          };
        });
      })
      .forEach((token) => rowsById.set(token.id, token));

    return Array.from(rowsById.values())
      .sort((left, right) => {
        if (right.amountInUSD !== left.amountInUSD) return right.amountInUSD - left.amountInUSD;
        if (right.balance !== left.balance) return right.balance - left.balance;
        if (Number(Boolean(left.isSuggested)) !== Number(Boolean(right.isSuggested))) {
          return Number(Boolean(left.isSuggested)) - Number(Boolean(right.isSuggested));
        }
        return left.symbol.localeCompare(right.symbol);
      });
  }, [primaryAssets]);

  const totalPrimaryAssetsInUSD =
    primaryAssets && "totalAmountInUSD" in primaryAssets
      ? Number(primaryAssets.totalAmountInUSD || 0)
      : null;

  const selectedToken = React.useMemo(
    () => tokenRows.find((token) => token.id === selectedTokenId) ?? null,
    [selectedTokenId, tokenRows],
  );
  const amountValidationMessage = React.useMemo(
    () => getAmountValidationMessage(amount, selectedToken, totalPrimaryAssetsInUSD),
    [amount, selectedToken, totalPrimaryAssetsInUSD],
  );
  const previewFeeRows = React.useMemo(
    () => getFeeBreakdownRows(sendPreview?.transaction ?? null),
    [sendPreview],
  );
  const previewFundingRows = React.useMemo(
    () => getFundingRows(sendPreview?.transaction ?? null),
    [sendPreview],
  );
  const previewFeeTokenRows = React.useMemo(
    () => getFeeTokenRows(sendPreview?.transaction ?? null),
    [sendPreview],
  );
  const selectedTokenIsPrefilled = Boolean(
    selectedToken && initialAsset && matchesAsset(selectedToken, initialAsset, initialChain),
  );

  React.useEffect(() => {
    if (!initialTo) return;
    const resolved = resolveRecipient(initialTo);
    if (resolved) {
      setSelectedRecipient(resolved);
      setQuery(resolved.handle.startsWith("@") ? resolved.handle : resolved.address);
    }
  }, [initialTo]);

  React.useEffect(() => {
    if (!selectedRecipient || selectedTokenId || tokenRows.length === 0) return;
    const preferredToken = findPreferredToken(tokenRows, initialAsset, initialChain);
    const nextToken =
      preferredToken ?? tokenRows.find((token) => token.balance > 0) ?? tokenRows[0] ?? null;
    if (nextToken) setSelectedTokenId(nextToken.id);
  }, [initialAsset, initialChain, selectedRecipient, selectedTokenId, tokenRows]);

  React.useEffect(() => {
    if (!initialAsset || tokenRows.length === 0) return;
    const initialAssetKey = `${normalizeAssetQuery(initialAsset)}:${normalizeAssetQuery(initialChain)}`;
    if (appliedInitialAsset.current === initialAssetKey) return;

    const preferredToken = findPreferredToken(tokenRows, initialAsset, initialChain);

    if (preferredToken) {
      setSelectedTokenId(preferredToken.id);
      appliedInitialAsset.current = initialAssetKey;
    }
  }, [initialAsset, initialChain, tokenRows]);

  React.useEffect(() => {
    if (!selectedTokenId || tokenRows.length === 0) return;
    if (!tokenRows.some((token) => token.id === selectedTokenId)) {
      setSelectedTokenId(null);
      setSendPreview(null);
    }
  }, [selectedTokenId, tokenRows]);

  React.useEffect(() => {
    if (!scanOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setScanOpen(false);
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [scanOpen]);

  const filteredRecipients = React.useMemo(() => {
    if (!query.trim()) return recentRecipients;

    const combined = [...recentRecipients, ...addressBook].filter(
      (recipient, index, self) => index === self.findIndex((item) => item.handle === recipient.handle),
    );
    const filtered = combined.filter((recipient) => matchesRecipient(recipient, query));

    if (filtered.length > 0) return filtered;

    const resolved = resolveRecipient(query);
    return resolved ? [resolved] : [];
  }, [query]);

  const showRecentLabel = !query.trim() && recentRecipients.length > 0;

  const resetCompose = () => {
    setSelectedRecipient(null);
    setAmount("");
    setSendPreview(null);
    setSent(false);
    setTransactionId(null);
    setError(null);
    setSendStatus("idle");
    setQuery("");
  };

  const selectRecipient = (recipient: Recipient) => {
    setSelectedRecipient(recipient);
    setAmount("");
    setSendPreview(null);
    setSent(false);
    setTransactionId(null);
    setError(null);
    setSendStatus("idle");
    setQuery(recipient.handle.startsWith("@") ? recipient.handle : recipient.address);
  };

  const handleScan = () => {
    setScanOpen(false);
    selectRecipient(scannedRecipient);
  };

  const handleSearchSubmit = () => {
    const resolved = resolveRecipient(query);
    if (!resolved) {
      setError("Recipient tidak ditemukan. Pakai @tag atau paste alamat wallet yang valid.");
      return;
    }

    selectRecipient(resolved);
  };

  const canPreview = Boolean(
    selectedRecipient &&
      selectedToken &&
      universalAccount &&
      Number(amount) > 0 &&
      !amountValidationMessage &&
      !isSending,
  );

  const handlePreviewSend = async () => {
    if (!universalAccount || !selectedRecipient || !selectedToken) return;

    if (!isRecipientValidForToken(selectedRecipient, selectedToken)) {
      setError(
        selectedToken.chainId === CHAIN_ID.SOLANA_MAINNET
          ? "Alamat tujuan harus alamat Solana untuk token tujuan Solana."
          : "Alamat tujuan harus alamat EVM untuk token tujuan EVM.",
      );
      return;
    }

    const numericAmount = Number(amount);
    const validationMessage = getAmountValidationMessage(
      amount,
      selectedToken,
      totalPrimaryAssetsInUSD,
    );
    if (validationMessage || !Number.isFinite(numericAmount)) {
      setError(validationMessage ?? "Masukkan jumlah yang valid.");
      return;
    }

    setError(null);
    setIsSending(true);
    setSendStatus(isDelegated ? "preparing" : "delegating");
    setSent(false);
    setTransactionId(null);
    setSendPreview(null);

    try {
      if (!isDelegated) {
        await ensureDelegated();
      }

      setSendStatus("preparing");
      const transaction = await universalAccount.createTransferTransaction({
        token: {
          chainId: selectedToken.chainId,
          address: selectedToken.tokenAddress,
        },
        amount: amount.trim(),
        receiver: selectedRecipient.address,
      });

      setSendPreview({
        transaction,
        amount: amount.trim(),
        token: selectedToken,
        recipient: selectedRecipient,
      });
    } catch (cause) {
      if (!isUserRejectedError(cause)) {
        setError(getSendErrorMessage(cause));
      }
    } finally {
      setIsSending(false);
      setSendStatus("idle");
    }
  };

  const handleConfirmSend = async () => {
    if (!sendPreview) {
      await handlePreviewSend();
      return;
    }

    setError(null);
    setIsSending(true);
    setSendStatus("signing");
    setSent(false);
    setTransactionId(null);

    try {
      setSendStatus("signing");
      const result = await signAndSend(sendPreview.transaction as any);
      setTransactionId(result.transactionId ?? sendPreview.transaction.transactionId);
      setSent(true);
      setSendPreview(null);
      await refreshAccount();
    } catch (cause) {
      if (!isUserRejectedError(cause)) {
        setError(getSendErrorMessage(cause));
      }
    } finally {
      setIsSending(false);
      setSendStatus("idle");
    }
  };

  const handleSendSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void handlePreviewSend();
  };

  const sendButtonLabel =
    sendStatus === "delegating"
      ? "Authorizing..."
      : sendStatus === "preparing"
        ? "Preparing preview..."
        : sendStatus === "signing"
          ? "Signing..."
          : sendPreview
            ? "Refresh preview"
            : "Preview send";

  return (
    <MobileShell>
      <MobilePageHeader
        title="Send"
        leading={
          selectedRecipient ? (
            <button
              type="button"
              onClick={resetCompose}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1C1C1E] text-white transition-colors hover:bg-[#262628] focus-visible:ring-2 focus-visible:ring-[#3B33BD]"
              aria-label="Back to recipient search"
            >
              <Icon icon="lucide:chevron-left" aria-hidden="true" width={28} height={28} />
            </button>
          ) : (
            <Link
              href="/assets"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1C1C1E] text-white transition-colors hover:bg-[#262628] focus-visible:ring-2 focus-visible:ring-[#3B33BD]"
              aria-label="Back to assets"
            >
              <Icon icon="lucide:chevron-left" aria-hidden="true" width={28} height={28} />
            </Link>
          )
        }
      />

      {selectedRecipient ? (
        <section className="mt-5 flex flex-1 flex-col">
          <div className="rounded-[32px] bg-[#111217] p-5 shadow-[0_12px_44px_-24px_rgba(59,51,189,0.6)]">
            <div
              className={cn(
                "mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br text-2xl font-black text-white",
                selectedRecipient.color,
              )}
            >
              {selectedRecipient.name.slice(0, 1)}
            </div>
            <div className="mt-4 flex items-center justify-center gap-2">
              <h2 className="text-2xl font-black tracking-tight text-white">{selectedRecipient.handle}</h2>
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
            <p className="mt-2 text-center text-sm font-medium text-[#9A9AA2]">
              {selectedRecipient.name} • {truncateAddress(selectedRecipient.address, 5)}
            </p>
            <div className="mt-3 flex items-center justify-center gap-2">
              <span className="rounded-full bg-[#3B33BD]/15 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#8F89FF]">
                {selectedRecipient.network}
              </span>
              <span className="rounded-full bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#A7A7B7]">
                Universal Balance
              </span>
            </div>
          </div>

          <form onSubmit={handleSendSubmit} className="mt-5 rounded-[28px] bg-[#111217] p-4">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-black uppercase text-[#77777f]">Recipient gets</label>
              <span className="text-xs font-semibold text-[#9A9AA2]">
                {selectedTokenIsPrefilled ? "Prefilled" : `${tokenRows.length} routes`}
              </span>
            </div>

            <div className="mt-3 max-h-[38vh] space-y-2 overflow-y-auto pr-1">
              {isLoading && !primaryAssets ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="min-h-[72px] rounded-[22px] border border-white/5 bg-black/20 p-3"
                    aria-hidden="true"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-white/[0.08]" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 w-24 rounded-full bg-white/[0.08]" />
                        <div className="h-2.5 w-36 rounded-full bg-white/[0.06]" />
                      </div>
                    </div>
                  </div>
                ))
              ) : tokenRows.length > 0 ? (
                tokenRows.map((token) => {
                  const isSelected = selectedToken?.id === token.id;
                  const hasLocalBalance = token.balance > 0;

                  return (
                    <button
                      key={token.id}
                      type="button"
                      onClick={() => {
                        setSelectedTokenId(token.id);
                        setSendPreview(null);
                        setSent(false);
                        setTransactionId(null);
                        setError(null);
                      }}
                      className={cn(
                        "flex min-h-[72px] w-full items-center gap-3 rounded-[22px] border border-white/5 bg-black/20 px-3 py-2 text-left transition-colors hover:bg-white/[0.04] focus-visible:ring-2 focus-visible:ring-[#3B33BD] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-black/20",
                        isSelected && "border-[#ccff00]/50 bg-[#3B33BD]/18",
                        !hasLocalBalance && !token.isSuggested && "opacity-70",
                      )}
                    >
                      <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/[0.08]">
                        <Icon icon={token.icon} aria-hidden="true" width={22} height={22} />
                        <span className="absolute -bottom-1 -right-1 rounded-full bg-[#111217] px-1.5 py-0.5 text-[9px] font-black text-[#ccff00] shadow-[0_0_0_1px_rgba(255,255,255,0.06)]">
                          {token.chainName}
                        </span>
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center justify-between gap-2">
                          <span className="truncate text-sm font-black text-white">{token.symbol}</span>
                          <span className="text-right text-base font-black text-white">
                            {hasLocalBalance ? formatTokenBalance(token.balance) : "Routeable"}
                          </span>
                        </span>
                        <span className="mt-0.5 block text-xs font-medium text-[#9A9AA2]">
                          {token.name} • receive on {token.chainName}
                        </span>
                      </span>
                    </button>
                  );
                })
              ) : (
                <div className="rounded-[22px] border border-white/5 bg-black/20 px-4 py-5 text-center">
                  <p className="text-sm font-bold text-white">No token balance available yet.</p>
                  <p className="mt-1 text-xs font-medium text-[#9A9AA2]">
                    Refresh after deposit or wallet sync finishes.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      void refreshAccount();
                    }}
                    className="mx-auto mt-3 flex h-10 items-center justify-center rounded-full bg-white/5 px-4 text-xs font-black text-white transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-[#3B33BD]"
                  >
                    Refresh balances
                  </button>
                </div>
              )}
            </div>

            <label htmlFor="send-amount" className="mt-5 block text-xs font-black uppercase text-[#77777f]">
              Amount
            </label>
            <div className="mt-2 flex h-16 items-center gap-3 rounded-[22px] bg-black/25 px-4 transition-shadow focus-within:ring-2 focus-within:ring-[#3B33BD]">
              <input
                id="send-amount"
                type="text"
                inputMode="decimal"
                value={amount}
                onChange={(event) => {
                  setAmount(sanitizeAmountInput(event.target.value));
                  setSendPreview(null);
                  setSent(false);
                  setTransactionId(null);
                  setError(null);
                }}
                placeholder="0.00"
                aria-invalid={amountValidationMessage ? "true" : undefined}
                aria-describedby={amountValidationMessage ? "send-amount-error" : undefined}
                className="min-w-0 flex-1 bg-transparent text-3xl font-black text-white placeholder:text-[#66666D] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  if (!selectedToken) return;
                  setSendPreview(null);
                  setAmount(selectedToken.balance.toString());
                }}
                disabled={!selectedToken || selectedToken.balance <= 0}
                className="flex h-10 min-w-10 items-center justify-center rounded-full bg-[#3B33BD]/20 px-3 text-xs font-black text-[#8F89FF] transition-colors hover:bg-[#3B33BD]/30 focus-visible:ring-2 focus-visible:ring-[#3B33BD] disabled:cursor-not-allowed disabled:opacity-50"
                aria-label={
                  selectedToken && selectedToken.balance > 0
                    ? `Use local ${selectedToken.symbol} balance on ${selectedToken.chainName}`
                    : "No local balance for selected receive token"
                }
              >
                Max
              </button>
            </div>

            {selectedToken ? (
              <div className="mt-2 flex items-center justify-between text-xs font-semibold text-[#9A9AA2]">
                <span>
                  Receive: <span className="text-white">{selectedToken.chainName}</span>
                </span>
                <span>
                  UA balance:{" "}
                  <span className="text-white">
                    {totalPrimaryAssetsInUSD === null ? "Loading" : formatUsd(totalPrimaryAssetsInUSD)}
                  </span>
                </span>
              </div>
            ) : null}

            {amountValidationMessage ? (
              <p id="send-amount-error" className="mt-2 text-xs font-semibold text-red-200">
                {amountValidationMessage}
              </p>
            ) : null}

            {accountError ? (
              <div className="mt-3 rounded-2xl bg-red-500/10 px-4 py-3">
                <p className="text-sm font-semibold text-red-100">Real balance belum bisa dimuat.</p>
                <p className="mt-1 text-xs font-medium text-red-100/75">{accountError}</p>
                <button
                  type="button"
                  onClick={() => {
                    void refreshAccount();
                  }}
                  className="mt-3 flex h-10 items-center justify-center rounded-full bg-red-500/15 px-4 text-xs font-black text-red-50 transition-colors hover:bg-red-500/20 focus-visible:ring-2 focus-visible:ring-red-200"
                >
                  Retry
                </button>
              </div>
            ) : null}

            {error ? (
              <div className="mt-3 rounded-2xl bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-100">
                {error}
              </div>
            ) : null}

            {sendPreview ? (
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
                    <dd className="text-right font-mono text-xs font-bold tabular-nums text-white">
                      {sendPreview.recipient.handle} · {truncateAddress(sendPreview.recipient.address, 5)}
                    </dd>
                  </div>
                  <div className="flex items-start justify-between gap-3 border-t border-white/10 pt-2.5">
                    <dt className="font-bold text-white">Estimated total fee</dt>
                    <dd className="font-mono font-black tabular-nums text-[#ccff00]">
                      {getTotalFeeLabel(sendPreview.transaction)}
                    </dd>
                  </div>
                  {previewFeeRows.map((row) => (
                    <div key={row.label} className="flex items-start justify-between gap-3">
                      <dt className="text-[#9A9AA2]">{row.label}</dt>
                      <dd className="font-mono text-xs font-bold tabular-nums text-white">{row.value}</dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-4 rounded-[18px] bg-black/25 p-3">
                  <p className="text-xs font-black uppercase text-[#77777f]">Funding source</p>
                  {previewFundingRows.length > 0 ? (
                    <div className="mt-2 space-y-1.5">
                      {previewFundingRows.map((row) => (
                        <div
                          key={`${row.label}-${row.value}`}
                          className="flex items-center justify-between gap-3 text-xs"
                        >
                          <span className="min-w-0 truncate font-semibold text-white">{row.label}</span>
                          <span className="shrink-0 font-mono font-bold tabular-nums text-[#A7A7B7]">
                            {row.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-2 text-xs font-medium text-[#A7A7B7]">
                      Route funding will be selected from your Universal Balance.
                    </p>
                  )}
                </div>

                {previewFeeTokenRows.length > 0 ? (
                  <div className="mt-3 rounded-[18px] bg-black/25 p-3">
                    <p className="text-xs font-black uppercase text-[#77777f]">Fee paid with</p>
                    <div className="mt-2 space-y-1.5">
                      {previewFeeTokenRows.map((row) => (
                        <div
                          key={`${row.label}-${row.value}`}
                          className="flex items-center justify-between gap-3 text-xs"
                        >
                          <span className="min-w-0 truncate font-semibold text-white">{row.label}</span>
                          <span className="shrink-0 font-mono font-bold tabular-nums text-[#A7A7B7]">
                            {row.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className="mt-3 flex items-center justify-between gap-3 rounded-[18px] bg-black/20 px-3 py-2">
                  <span className="text-xs font-semibold text-[#9A9AA2]">Signature hash</span>
                  <span className="font-mono text-xs font-bold tabular-nums text-white">
                    {truncateAddress(sendPreview.transaction.rootHash, 6)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    void handleConfirmSend();
                  }}
                  disabled={isSending}
                  aria-busy={isSending && sendStatus === "signing" ? "true" : undefined}
                  className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#ccff00] text-sm font-black text-[#3B33BD] transition-transform active:scale-95 focus-visible:ring-2 focus-visible:ring-[#ccff00]/70 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Icon
                    icon={isSending && sendStatus === "signing" ? "lucide:loader-circle" : "lucide:send"}
                    aria-hidden="true"
                    width={18}
                    height={18}
                    className={isSending && sendStatus === "signing" ? "animate-spin" : ""}
                  />
                  {isSending && sendStatus === "signing" ? "Signing..." : "Confirm & send"}
                </button>
              </section>
            ) : null}

            {sent && transactionId ? (
              <div className="mt-3 rounded-2xl bg-[#ccff00]/10 px-4 py-3 text-sm font-bold text-[#ccff00]">
                Sent {amount} {selectedToken?.symbol} to {selectedRecipient.handle}.{" "}
                <a
                  href={`https://universalx.app/activity/details?id=${transactionId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 underline decoration-[#ccff00]/50 underline-offset-4 focus-visible:ring-2 focus-visible:ring-[#ccff00]"
                >
                  View transaction
                  <Icon icon="lucide:external-link" aria-hidden="true" width={14} height={14} />
                </a>
              </div>
            ) : null}

            <button
              type="submit"
              disabled={!canPreview || isLoading || sendStatus === "signing"}
              className={cn(
                "mt-4 flex h-14 w-full items-center justify-center gap-2 rounded-full text-base font-black shadow-[0_10px_28px_-10px_rgba(59,51,189,0.8)] transition-transform active:scale-95 focus-visible:ring-2 focus-visible:ring-[#3B33BD] disabled:cursor-not-allowed disabled:bg-[#2A2A3E] disabled:text-[#77777f]",
                sendPreview
                  ? "bg-white/5 text-white hover:bg-white/10"
                  : "bg-[#3B33BD] text-[#ccff00]",
              )}
              aria-busy={isSending && sendStatus !== "signing" ? "true" : undefined}
            >
              <Icon
                icon={isSending && sendStatus !== "signing" ? "lucide:loader-circle" : "lucide:receipt-text"}
                aria-hidden="true"
                width={20}
                height={20}
                className={isSending && sendStatus !== "signing" ? "animate-spin" : ""}
              />
              {sendButtonLabel}
            </button>
          </form>
        </section>
      ) : (
        <>
          <label htmlFor="recipient-search" className="sr-only">
            Search with tag or address
          </label>
          <div className="mt-5 flex h-12 items-center gap-3 rounded-2xl bg-[#1f1f21] px-4 transition-shadow focus-within:ring-2 focus-within:ring-[#3B33BD]">
            <Icon icon="icon-park-outline:search" aria-hidden="true" width={20} height={20} className="shrink-0 text-[#9A9AA2]" />
            <input
              id="recipient-search"
              type="search"
              inputMode="search"
              autoComplete="off"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setSendPreview(null);
                setSent(false);
                setError(null);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleSearchSubmit();
                }
              }}
              placeholder="Tag mom3 atau alamat wallet"
              aria-invalid={error ? "true" : undefined}
              aria-describedby={error ? "recipient-search-error" : undefined}
              className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-[#8E8E93] focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setScanOpen(true)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[#3B33BD] transition-colors hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-[#3B33BD]"
              aria-label="Scan address"
            >
              <Icon icon="lucide:scan-line" aria-hidden="true" width={23} height={23} />
            </button>
          </div>
          {error ? (
            <p id="recipient-search-error" className="mt-2 text-xs font-semibold text-red-200">
              {error}
            </p>
          ) : null}

          <section className="mt-5 flex-1">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white">{showRecentLabel ? "Recent" : "Recipients"}</h2>
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
                      onSelect={() => selectRecipient(recipient)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-3 flex flex-1 flex-col items-center justify-center rounded-[28px] bg-[#1C1C1E] px-6 py-12 text-center">
                <Image src="/send-friend.png" alt="" width={132} height={96} className="h-auto w-28 object-contain" priority />
                <h2 className="mt-5 text-xl font-bold tracking-tight text-white">No recipient found</h2>
                <p className="mt-2 text-sm font-medium leading-relaxed text-[#9A9AA2]">
                  Try a mom3 tag like @raka or paste a wallet address.
                </p>
              </div>
            )}
          </section>
        </>
      )}

      {scanOpen ? (
        <div className="fixed inset-0 z-50 flex items-end bg-black/70 p-5 backdrop-blur-sm sm:items-center sm:justify-center">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="scan-wallet-title"
            className="mx-auto w-full max-w-md rounded-[32px] bg-[#1C1C1E] p-5"
          >
            <div className="flex items-center justify-between">
              <h2 id="scan-wallet-title" className="text-base font-black text-white">Scan wallet QR</h2>
              <button
                type="button"
                onClick={() => setScanOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-black/30 text-[#9A9AA2] transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-[#3B33BD]"
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
              className="mt-5 flex h-12 w-full items-center justify-center rounded-full bg-[#3B33BD] text-base font-black text-[#ccff00] transition-transform active:scale-95 focus-visible:ring-2 focus-visible:ring-[#3B33BD]"
            >
              Use scanned wallet
            </button>
          </div>
        </div>
      ) : null}
    </MobileShell>
  );
}
