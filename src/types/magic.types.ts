"use client";

import type { EVMExtension } from "@magic-ext/evm";
import type { OAuthExtension } from "@magic-ext/oauth2";
import type { Magic as MagicBase } from "magic-sdk";
import type { ReactNode } from "react";

import type { Mom3WalletSession } from "@/types/wallet.types";

export type Mom3Magic = MagicBase<[OAuthExtension, EVMExtension]>;

export type MagicContextType = {
  magic: Mom3Magic | null;
  session: Mom3WalletSession | null;
  isReady: boolean;
  isLoading: boolean;
  error: string | null;
  loginWithGoogle: () => Promise<void>;
  completeRedirectLogin: () => Promise<Mom3WalletSession | null>;
  logout: () => Promise<void>;
};

export type MagicProviderProps = {
  children: ReactNode;
};
