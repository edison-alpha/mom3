"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Signature } from "ethers";

import type { Mom3Magic } from "@/providers/magic/types/magic.types";
import { DEFAULT_CHAIN_ID } from "@/providers/shared/constants/chain.constants";
import { universalAccountQueryKeys } from "@/providers/universal-account/constants/universal-account.constants";
import type { SignAndSendTransaction } from "@/providers/universal-account/types/universal-account.types";
import {
  createUniversalAccount,
  loadUniversalAccountSnapshot,
} from "@/providers/universal-account/utils/universal-account.utils";

export function useUniversalAccountInstanceQuery(ownerAddress?: string) {
  return useQuery({
    queryKey: universalAccountQueryKeys.instance(ownerAddress),
    queryFn: () => createUniversalAccount(ownerAddress as string),
    enabled: Boolean(ownerAddress),
    gcTime: Infinity,
    staleTime: Infinity,
  });
}

export function useUniversalAccountSnapshotQuery(
  universalAccount: ReturnType<typeof useUniversalAccountInstanceQuery>["data"],
  ownerAddress?: string,
) {
  return useQuery({
    queryKey: universalAccountQueryKeys.snapshot(ownerAddress),
    queryFn: () =>
      loadUniversalAccountSnapshot(
        universalAccount as NonNullable<typeof universalAccount>,
        ownerAddress as string,
      ),
    enabled: Boolean(ownerAddress && universalAccount),
  });
}

export function useEnsureDelegatedMutation(
  universalAccount: ReturnType<typeof useUniversalAccountInstanceQuery>["data"],
  magic: Mom3Magic | null,
  ownerAddress?: string,
) {
  const queryClient = useQueryClient();

  const signEip7702Auth = async (contractAddress: string, chainId: number, nonce?: number) => {
    if (!magic) throw new Error("Magic belum siap.");

    return magic.wallet.sign7702Authorization({
      contractAddress,
      chainId,
      ...(nonce !== undefined ? { nonce } : {}),
    });
  };

  return useMutation({
    mutationFn: async () => {
      if (!universalAccount || !magic || !ownerAddress) {
        throw new Error("Universal Account atau Magic wallet belum siap.");
      }

      const deployments = await universalAccount.getEIP7702Deployments();
      const targetChain = deployments.find(
        (deployment: { chainId?: number }) => deployment.chainId === DEFAULT_CHAIN_ID,
      ) as { isDelegated?: boolean } | undefined;

      if (targetChain?.isDelegated) return;

      await magic.evm.switchChain(DEFAULT_CHAIN_ID);

      const [auth] = await universalAccount.getEIP7702Auth([DEFAULT_CHAIN_ID]);
      const authorization = await signEip7702Auth(
        auth.address,
        DEFAULT_CHAIN_ID,
        Number(auth.nonce) + 1,
      );

      await magic.wallet.send7702Transaction({
        to: ownerAddress,
        data: "0x",
        authorizationList: [authorization],
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: universalAccountQueryKeys.snapshot(ownerAddress),
      });
    },
  });
}

export function useSignAndSend(
  universalAccount: ReturnType<typeof useUniversalAccountInstanceQuery>["data"],
  magic: Mom3Magic | null,
  ownerAddress?: string,
): SignAndSendTransaction {
  return async (transaction) => {
    if (!universalAccount || !magic || !ownerAddress) {
      throw new Error("Universal Account atau Magic wallet belum siap.");
    }

    const authorizations: Array<{ userOpHash: string; signature: string }> = [];
    const nonceMap = new Map<number, string>();

    const signEip7702Auth = async (contractAddress: string, chainId: number, nonce?: number) => {
      return magic.wallet.sign7702Authorization({
        contractAddress,
        chainId,
        ...(nonce !== undefined ? { nonce } : {}),
      });
    };

    for (const userOp of transaction.userOps || []) {
      const auth = userOp.eip7702Auth;

      if (auth && !userOp.eip7702Delegated) {
        let serialized = nonceMap.get(Number(auth.nonce));

        if (!serialized) {
          const authorization = await signEip7702Auth(
            auth.address,
            Number(auth.chainId || userOp.chainId),
            Number(auth.nonce),
          );

          serialized = Signature.from({
            r: authorization.r,
            s: authorization.s,
            v: authorization.v,
          }).serialized;
          nonceMap.set(Number(auth.nonce), serialized);
        }

        authorizations.push({
          userOpHash: String(userOp.userOpHash),
          signature: serialized,
        });
      }
    }

    const signature = (await magic.rpcProvider.request({
      method: "eth_sign",
      params: [ownerAddress, transaction.rootHash],
    })) as string;

    return universalAccount.sendTransaction(
      transaction as any,
      signature,
      authorizations.length > 0 ? authorizations : undefined,
    );
  };
}

export function useRefreshAccount(ownerAddress?: string) {
  const queryClient = useQueryClient();

  return async () => {
    await queryClient.invalidateQueries({
      queryKey: universalAccountQueryKeys.snapshot(ownerAddress),
    });
  };
}
