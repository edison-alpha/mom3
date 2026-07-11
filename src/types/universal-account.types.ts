"use client";

import type { IAssetsResponse, UniversalAccount } from "@particle-network/universal-account-sdk";
import type { ReactNode } from "react";

export type AccountInfo = {
  ownerAddress: string;
  evmSmartAccount: string;
  solanaSmartAccount: string;
};

export type UniversalAccountSnapshot = {
  accountInfo: AccountInfo;
  isDelegated: boolean;
  primaryAssets: IAssetsResponse | null;
};

export type SignAndSendTransaction = (
  transaction: { rootHash: string; userOps?: Array<Record<string, any>> } & Record<string, any>,
) => Promise<{ transactionId: string }>;

export type UniversalAccountContextType = {
  universalAccount: UniversalAccount | null;
  accountInfo: AccountInfo;
  primaryAssets: IAssetsResponse | null;
  isDelegated: boolean;
  isLoading: boolean;
  error: string | null;
  refreshAccount: () => Promise<void>;
  ensureDelegated: () => Promise<void>;
  signAndSend: SignAndSendTransaction;
};

export type UniversalAccountProviderProps = {
  children: ReactNode;
};
