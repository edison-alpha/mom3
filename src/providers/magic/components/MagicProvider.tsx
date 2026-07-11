"use client";

import { createContext, useContext, useMemo } from "react";

import {
  useCompleteRedirectLoginMutation,
  useLoginWithGoogleMutation,
  useLogoutMutation,
  useMagicInstanceQuery,
  useMagicSessionQuery,
} from "@/providers/magic/hooks/useMagicQueries";
import type { MagicContextType, MagicProviderProps } from "@/providers/magic/types/magic.types";

const MagicContext = createContext<MagicContextType | null>(null);

export function MagicProvider({ children }: MagicProviderProps) {
  const magicQuery = useMagicInstanceQuery();
  const sessionQuery = useMagicSessionQuery();

  const loginWithGoogleMutation = useLoginWithGoogleMutation(magicQuery.data);
  const completeRedirectLoginMutation = useCompleteRedirectLoginMutation(magicQuery.data);
  const logoutMutation = useLogoutMutation(magicQuery.data);

  const value = useMemo(
    () => ({
      magic: magicQuery.data ?? null,
      session: sessionQuery.data ?? null,
      isReady: Boolean(magicQuery.data),
      isLoading:
        magicQuery.isLoading ||
        sessionQuery.isLoading ||
        loginWithGoogleMutation.isPending ||
        completeRedirectLoginMutation.isPending ||
        logoutMutation.isPending,
      error:
        magicQuery.error?.message ||
        sessionQuery.error?.message ||
        loginWithGoogleMutation.error?.message ||
        completeRedirectLoginMutation.error?.message ||
        logoutMutation.error?.message ||
        null,
      loginWithGoogle: loginWithGoogleMutation.mutateAsync,
      completeRedirectLogin: completeRedirectLoginMutation.mutateAsync,
      logout: logoutMutation.mutateAsync,
    }),
    [
      magicQuery.data,
      magicQuery.error?.message,
      magicQuery.isLoading,
      sessionQuery.data,
      sessionQuery.error?.message,
      sessionQuery.isLoading,
      loginWithGoogleMutation.isPending,
      loginWithGoogleMutation.error?.message,
      loginWithGoogleMutation.mutateAsync,
      completeRedirectLoginMutation.isPending,
      completeRedirectLoginMutation.error?.message,
      completeRedirectLoginMutation.mutateAsync,
      logoutMutation.isPending,
      logoutMutation.error?.message,
      logoutMutation.mutateAsync,
    ],
  );

  return <MagicContext.Provider value={value}>{children}</MagicContext.Provider>;
}

export function useMagic() {
  const context = useContext(MagicContext);

  if (!context) {
    throw new Error("useMagic must be used within MagicProvider");
  }

  return context;
}
