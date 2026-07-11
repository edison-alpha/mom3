import {
  type IAssetsResponse,
  CHAIN_ID,
  type ITokenWithUSD,
  type ITransaction,
} from "@particle-network/universal-account-sdk";

import {
  addressBook,
  recentRecipients,
  receiveTokenTemplates,
  scannedRecipient,
  ZERO_ADDRESS,
} from "@/modules/send/constants/send.constants";
import type { Recipient, TokenRow } from "@/modules/send/types/send.types";
import {
  formatTokenBalance,
  formatUsd,
  formatUsdValue,
  parseDecimalish,
} from "@/lib/format";
import { chainNameFromId, tokenIcon } from "@/lib/chain";

/* â”€â”€ Address validation â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

export function isValidAddress(address: string) {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export function isValidSolanaAddress(address: string) {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
}

/* â”€â”€ Token / chain helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

/* â”€â”€ Formatting â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

/* â”€â”€ Token price / amount â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

export function getTokenUsdPrice(token: TokenRow | null) {
  if (!token) return null;
  if (token.balance > 0 && token.amountInUSD > 0) return token.amountInUSD / token.balance;
  if (["USDC", "USDT"].includes(token.symbol.toUpperCase())) return 1;
  return null;
}

export function getEstimatedAmountInUSD(amount: number, token: TokenRow | null) {
  const price = getTokenUsdPrice(token);
  if (price === null) return null;
  return amount * price;
}

export function normalizePrimaryAssetTokens(
  primaryAssets: IAssetsResponse | null | undefined,
  includeReceiveTokens = false,
): TokenRow[] {
  const rowsById = new Map<string, TokenRow>();

  if (includeReceiveTokens) {
    receiveTokenTemplates.forEach((token) => {
      const id = `${token.chainId}-${token.tokenAddress.toLowerCase()}-${token.symbol}`;
      rowsById.set(id, { ...token, id, balance: 0, amountInUSD: 0 });
    });
  }

  for (const assetItem of primaryAssets?.assets ?? []) {
    const tokenType = String(assetItem.tokenType || "TOKEN").toUpperCase();

    for (const entry of assetItem.chainAggregation) {
      const tokenSymbol = String(entry.token.symbol || tokenType).toUpperCase();
      const chainId = Number(entry.token.chainId ?? 0);
      const tokenAddress = String(entry.token.address ?? ZERO_ADDRESS);
      const token: TokenRow = {
        id: `${chainId}-${tokenAddress.toLowerCase()}-${tokenSymbol}`,
        symbol: tokenSymbol,
        name: String(entry.token.name || tokenSymbol),
        balance: parseDecimalish(
          entry.amount,
          Number(entry.token.realDecimals ?? entry.token.decimals ?? 18),
        ),
        amountInUSD: parseDecimalish(entry.amountInUSD),
        icon: tokenIcon(tokenSymbol),
        chainName: chainNameFromId(chainId),
        chainId,
        tokenAddress,
      };

      rowsById.set(token.id, token);
    }
  }

  return Array.from(rowsById.values()).sort((left, right) => {
    if (right.amountInUSD !== left.amountInUSD) {
      return right.amountInUSD - left.amountInUSD;
    }
    if (right.balance !== left.balance) return right.balance - left.balance;
    if (Number(Boolean(left.isSuggested)) !== Number(Boolean(right.isSuggested))) {
      return Number(Boolean(left.isSuggested)) - Number(Boolean(right.isSuggested));
    }
    return left.symbol.localeCompare(right.symbol);
  });
}

/* â”€â”€ Fee helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

export function getTransactionFeeQuote(transaction: ITransaction | null) {
  if (!transaction) return null;
  return transaction.gasless ?? transaction.feeQuotes?.[0] ?? null;
}

export function getFeeBreakdownRows(transaction: ITransaction | null) {
  const feeQuote = getTransactionFeeQuote(transaction);
  const totals = feeQuote?.fees.totals;

  if (!totals) {
    return [{ label: "Estimated fees", value: "Unavailable" }];
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
    rows.push({ label: "Solana rent", value: formatUsdValue(solanaRentFee) });
  }

  if (parseDecimalish(totals.solanaMevTipFeeInUSD) > 0) {
    rows.push({ label: "Solana MEV tip", value: formatUsdValue(totals.solanaMevTipFeeInUSD) });
  }

  return rows;
}

export function getTotalFeeLabel(transaction: ITransaction | null) {
  const feeQuote = getTransactionFeeQuote(transaction);
  return formatUsdValue(
    feeQuote?.fees.totals.feeTokenAmountInUSD ?? transaction?.tokenChanges?.totalFeeInUSD,
  );
}

export function formatTokenChange(item: ITokenWithUSD) {
  const decimals = item.token.realDecimals ?? item.token.decimals ?? 18;
  const amount = parseDecimalish(item.amount, decimals);
  const symbol = item.token.symbol || item.token.type || "Token";
  const chain = chainNameFromId(Number(item.token.chainId));
  return `${formatTokenBalance(amount)} ${symbol.toUpperCase()} on ${chain}`;
}

export function getFundingRows(transaction: ITransaction | null) {
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

export function getFeeTokenRows(transaction: ITransaction | null) {
  const feeQuote = getTransactionFeeQuote(transaction);
  return (feeQuote?.fees.feeTokens ?? []).slice(0, 2).map((item) => ({
    label: formatTokenChange(item),
    value: formatUsdValue(item.amountInUSD),
  }));
}

/* â”€â”€ Asset query helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

export function normalizeAssetQuery(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

export function sanitizeAmountInput(value: string) {
  const normalized = value.replace(",", ".").replace(/[^0-9.]/g, "");
  const [whole, ...fractions] = normalized.split(".");

  if (fractions.length === 0) return whole;
  return `${whole}.${fractions.join("")}`;
}

export function matchesAsset(token: TokenRow, asset: string, chain = "") {
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

export function findPreferredToken(tokens: TokenRow[], asset: string, chain = "") {
  if (!asset) return null;

  return (
    tokens.find((token) => matchesAsset(token, asset, chain)) ??
    tokens.find((token) => matchesAsset(token, asset)) ??
    null
  );
}

/* â”€â”€ Amount validation â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

export function getAmountValidationMessage(
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

/* â”€â”€ Recipient validation â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

export function isRecipientValidForToken(recipient: Recipient, selectedToken: TokenRow) {
  if (selectedToken.chainId === CHAIN_ID.SOLANA_MAINNET) {
    return isValidSolanaAddress(recipient.address);
  }
  return isValidAddress(recipient.address);
}

/* â”€â”€ Error helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

export function isUserRejectedError(cause: unknown) {
  const message = cause instanceof Error ? cause.message : String(cause);
  return /reject|denied|cancel/i.test(message);
}

export function getSendErrorMessage(cause: unknown) {
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

/* â”€â”€ Recipient search / resolve â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

export function matchesRecipient(recipient: Recipient, query: string) {
  const normalized = query.toLowerCase();
  return (
    recipient.handle.toLowerCase().includes(normalized) ||
    recipient.name.toLowerCase().includes(normalized) ||
    recipient.address.toLowerCase().includes(normalized) ||
    recipient.network.toLowerCase().includes(normalized)
  );
}

export function resolveRecipient(query: string): Recipient | null {
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

export { ZERO_ADDRESS };
