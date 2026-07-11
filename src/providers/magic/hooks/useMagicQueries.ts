"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getWalletSession } from "@/utils/wallet-session.utils";

import { magicQueryKeys } from "@/providers/magic/constants/magic.constants";
import {
  createMagicInstance,
  persistCurrentUser,
} from "@/providers/magic/utils/magic.utils";
import { universalAccountQueryKeys } from "@/providers/universal-account/constants/universal-account.constants";

export function useMagicInstanceQuery() {
  return useQuery({
    queryKey: magicQueryKeys.instance,
    queryFn: createMagicInstance,
    gcTime: Infinity,
    staleTime: Infinity,
  });
}

export function useMagicSessionQuery() {
  return useQuery({
    queryKey: magicQueryKeys.session,
    queryFn: getWalletSession,
    gcTime: Infinity,
    staleTime: Infinity,
  });
}

export function useLoginWithGoogleMutation(magic: ReturnType<typeof useMagicInstanceQuery>["data"]) {
  return useMutation({
    mutationFn: async () => {
      if (!magic) throw new Error("Magic belum siap.");

      await magic.oauth2.loginWithRedirect({
        provider: "google",
        redirectURI: `${window.location.origin}/auth`,
      });
    },
  });
}

export function useCompleteRedirectLoginMutation(
  magic: ReturnType<typeof useMagicInstanceQuery>["data"],
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!magic) return null;

      const result = await magic.oauth2.getRedirectResult();
      const token =
        result?.magic?.idToken ||
        (await magic.user.getIdToken({ lifespan: 60 * 60 * 24 * 7 }));
      return persistCurrentUser(magic, token, "google");
    },
    onSuccess: (nextSession) => {
      queryClient.setQueryData(magicQueryKeys.session, nextSession);
    },
  });
}

export function useLogoutMutation(magic: ReturnType<typeof useMagicInstanceQuery>["data"]) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (magic && (await magic.user.isLoggedIn())) {
        await magic.user.logout();
      }

      const { clearWalletSession } = await import("@/utils/wallet-session.utils");
      clearWalletSession();
    },
    onSuccess: () => {
      queryClient.setQueryData(magicQueryKeys.session, null);
      queryClient.removeQueries({ queryKey: universalAccountQueryKeys.root });
    },
  });
}
