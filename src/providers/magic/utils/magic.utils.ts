import { EVMExtension } from "@magic-ext/evm";
import { OAuthExtension } from "@magic-ext/oauth2";
import { Magic as MagicBase } from "magic-sdk";

import type { Mom3AuthProvider, Mom3WalletSession } from "@/types/wallet.types";
import { saveWalletSession } from "@/utils/wallet-session.utils";

import { MAGIC_CHAIN_CONFIGS } from "@/providers/magic/constants/magic.constants";
import type { Mom3Magic } from "@/providers/magic/types/magic.types";

export function createMagicInstance() {
  const apiKey = process.env.NEXT_PUBLIC_MAGIC_API_KEY;

  if (!apiKey) {
    throw new Error("NEXT_PUBLIC_MAGIC_API_KEY belum diisi.");
  }

  return new MagicBase(apiKey, {
    extensions: [
      new OAuthExtension(),
      new EVMExtension(MAGIC_CHAIN_CONFIGS),
    ],
  }) as Mom3Magic;
}

export function getPublicAddress(
  metadata: Awaited<ReturnType<Mom3Magic["user"]["getInfo"]>>,
) {
  const metadataWithLegacyAddress = metadata as typeof metadata & {
    publicAddress?: string;
  };

  return (
    metadata?.wallets?.ethereum?.publicAddress ||
    metadataWithLegacyAddress.publicAddress ||
    ""
  );
}

export async function persistCurrentUser(
  magic: Mom3Magic,
  token: string,
  provider: Mom3AuthProvider,
) {
  const metadata = await magic.user.getInfo();
  const ownerAddress = getPublicAddress(metadata);

  if (!ownerAddress) {
    throw new Error("Magic login berhasil, tapi EOA address tidak ditemukan.");
  }

  const nextSession: Mom3WalletSession = {
    token,
    ownerAddress,
    email: metadata.email ?? undefined,
    issuer: metadata.issuer ?? undefined,
    provider,
  };

  saveWalletSession(nextSession);
  return nextSession;
}
