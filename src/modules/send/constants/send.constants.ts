import { CHAIN_ID } from "@particle-network/universal-account-sdk";

import { historyItems } from "@/lib/history";
import type { Recipient, TokenRow } from "@/modules/send/types/send.types";

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export const toneToGradient: Record<string, string> = {
  green: "from-[#ccff00] to-[#3B33BD]",
  purple: "from-[#3B33BD] to-[#7E78EA]",
  blue: "from-[#2d2eff] to-[#5EA2FF]",
};

export const receiveTokenTemplates: Array<
  Omit<TokenRow, "id" | "balance" | "amountInUSD">
> = [
  {
    symbol: "USDC",
    name: "USD Coin",
    icon: "cryptocurrency-color:usdc",
    chainName: "Base",
    chainId: CHAIN_ID.BASE_MAINNET,
    tokenAddress: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    isSuggested: true,
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    icon: "cryptocurrency-color:usdc",
    chainName: "Solana",
    chainId: CHAIN_ID.SOLANA_MAINNET,
    tokenAddress: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    isSuggested: true,
  },
  {
    symbol: "SOL",
    name: "Solana",
    icon: "cryptocurrency-color:solana",
    chainName: "Solana",
    chainId: CHAIN_ID.SOLANA_MAINNET,
    tokenAddress: ZERO_ADDRESS,
    isSuggested: true,
  },
];

export const recipientDirectory: Recipient[] = [
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
    name: "Naya putri",
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

export const scannedRecipient: Recipient = {
  id: "scan",
  handle: "@scanned",
  name: "Scanned Wallet",
  address: "0xa71c90e4d4c21d0ab33e6f7a4d8c9b1e2f3a4c5d",
  network: "EVM",
  status: "External",
  color: "from-[#1C1C1E] to-[#3B33BD]",
};

export const recentRecipients: Recipient[] = historyItems.me
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

export const addressBook: Recipient[] = recipientDirectory;
