import {
  UNIVERSAL_ACCOUNT_VERSION,
  UniversalAccount,
} from "@particle-network/universal-account-sdk";

import { DEFAULT_CHAIN_ID } from "@/providers/shared/constants/chain.constants";
import type {
  UniversalAccountSnapshot,
} from "@/providers/universal-account/types/universal-account.types";

export function createUniversalAccount(ownerAddress: string) {
  const projectId = process.env.NEXT_PUBLIC_PARTICLE_PROJECT_ID;
  const projectClientKey = process.env.NEXT_PUBLIC_PARTICLE_CLIENT_KEY;
  const projectAppUuid = process.env.NEXT_PUBLIC_PARTICLE_APP_ID;

  if (!projectId || !projectClientKey || !projectAppUuid) {
    throw new Error("Particle env belum lengkap.");
  }

  return new UniversalAccount({
    projectId,
    projectClientKey,
    projectAppUuid,
    smartAccountOptions: {
      useEIP7702: true,
      name: "UNIVERSAL",
      version:
        process.env.NEXT_PUBLIC_UNIVERSAL_ACCOUNT_VERSION ||
        UNIVERSAL_ACCOUNT_VERSION,
      ownerAddress,
    },
    tradeConfig: {
      slippageBps: 100,
      universalGas: false,
    },
  });
}

export async function loadUniversalAccountSnapshot(
  universalAccount: UniversalAccount,
  ownerAddress: string,
): Promise<UniversalAccountSnapshot> {
  const [options, assets, deployments] = await Promise.all([
    universalAccount.getSmartAccountOptions(),
    universalAccount.getPrimaryAssets(),
    universalAccount.getEIP7702Deployments(),
  ]);

  const targetChain = deployments.find(
    (deployment: { chainId?: number }) => deployment.chainId === DEFAULT_CHAIN_ID,
  );

  return {
    accountInfo: {
      ownerAddress,
      evmSmartAccount: options.smartAccountAddress || ownerAddress,
      solanaSmartAccount: options.solanaSmartAccountAddress || "",
    },
    isDelegated: Boolean((targetChain as { isDelegated?: boolean } | undefined)?.isDelegated),
    primaryAssets: assets,
  };
}
