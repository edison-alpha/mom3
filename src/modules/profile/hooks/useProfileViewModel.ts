"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import * as React from "react";

import { formatUsd } from "@/lib/format";
import { truncateAddress } from "@/utils/address.utils";
import { useMagic } from "@/providers/magic/components/MagicProvider";
import { useUniversalAccount } from "@/providers/universal-account/components/UniversalAccountProvider";
import type {
  ProfileIdentityRow,
  UniversalAccountRow,
} from "@/modules/profile/types/profile.types";

export function useProfileViewModel() {
  const router = useRouter();
  const { isLoading: isMagicLoading, logout: magicLogout, session } = useMagic();
  const {
    accountInfo,
    ensureDelegated,
    error: universalAccountError,
    isDelegated,
    isLoading: isUniversalAccountLoading,
    primaryAssets,
    refreshAccount,
    universalAccount,
  } = useUniversalAccount();
  const [copiedAddress, setCopiedAddress] = React.useState<string | null>(null);
  const [universalAccountOpen, setUniversalAccountOpen] = React.useState(false);

  useEffect(() => {
    if (!isMagicLoading && !session?.ownerAddress) {
      router.replace("/login");
    }
  }, [isMagicLoading, router, session?.ownerAddress]);

  const delegateMutation = useMutation({
    mutationFn: async () => {
      await ensureDelegated();
      await refreshAccount();
    },
  });

  const totalUsd =
    primaryAssets && "totalAmountInUSD" in primaryAssets
      ? Number(primaryAssets.totalAmountInUSD || 0)
      : 0;

  const ownerAddress = accountInfo.ownerAddress || session?.ownerAddress || "";

  const identityRows: ProfileIdentityRow[] = [
    {
      icon: "solar:wallet-money-bold",
      label: "Universal Balance",
      value: isUniversalAccountLoading ? "Loading" : formatUsd(totalUsd),
    },
    {
      icon: "solar:shield-check-bold",
      label: "EIP-7702",
      value: isDelegated ? "Delegated" : "Ready to upgrade",
    },
    {
      icon: "solar:global-bold",
      label: "Owner EOA",
      value: truncateAddress(session?.ownerAddress || ""),
    },
  ];

  const universalAccountRows: UniversalAccountRow[] = [
    {
      icon: "solar:user-id-bold",
      label: "Owner EOA",
      description: "Magic signer",
      address: ownerAddress,
    },
    {
      icon: "solar:global-bold",
      label: "EVM account",
      description: "Universal EVM smart account",
      address: accountInfo.evmSmartAccount,
    },
    {
      icon: "token-branded:solana",
      label: "Solana account",
      description: "Universal Solana address",
      address: accountInfo.solanaSmartAccount,
    },
  ];

  const logout = async () => {
    await magicLogout();
    router.replace("/login");
  };

  const copyAddress = async (address: string, label: string) => {
    if (!address) return;
    await navigator.clipboard.writeText(address);
    setCopiedAddress(label);
    window.setTimeout(() => setCopiedAddress(null), 1200);
  };

  const openUniversalAccountSheet = () => setUniversalAccountOpen(true);

  return {
    copiedAddress,
    delegateErrorMessage: delegateMutation.error?.message || null,
    identityRows,
    isAuthenticated: Boolean(session?.ownerAddress),
    isDelegated,
    isUpgradeDisabled:
      isMagicLoading ||
      !universalAccount ||
      isDelegated ||
      delegateMutation.isPending,
    isUpgradePending: delegateMutation.isPending,
    logout,
    onUpgrade: () => delegateMutation.mutate(),
    openUniversalAccountSheet,
    ownerAddress,
    profileEmail: session?.email || null,
    setUniversalAccountOpen,
    universalAccountError,
    universalAccountOpen,
    universalAccountRows,
    copyAddress,
  };
}
