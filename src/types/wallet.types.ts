export type Mom3AuthProvider = "google" | "apple" | "email" | "unknown";

export type Mom3WalletSession = {
  token: string;
  ownerAddress: string;
  email?: string;
  issuer?: string;
  provider: Mom3AuthProvider;
};
