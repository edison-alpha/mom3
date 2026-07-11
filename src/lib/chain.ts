export function tokenIcon(symbol: string): string {
  switch (symbol.toUpperCase()) {
    case "USDC":
      return "cryptocurrency-color:usdc";
    case "USDT":
      return "cryptocurrency-color:usdt";
    case "ETH":
      return "cryptocurrency-color:eth";
    case "BNB":
      return "cryptocurrency-color:bnb";
    case "SOL":
      return "cryptocurrency-color:solana";
    default:
      return "solar:wallet-money-bold";
  }
}

export function chainNameFromId(chainId: number): string {
  const names: Record<number, string> = {
    1: "Ethereum",
    10: "Optimism",
    56: "BNB Chain",
    101: "Solana",
    137: "Polygon",
    146: "Sonic",
    196: "X Layer",
    42161: "Arbitrum",
    43114: "Avalanche",
    8453: "Base",
    59144: "Linea",
    80094: "Berachain",
  };

  return names[chainId] ?? `Chain ${chainId}`;
}

export function chainBadgeIconFromId(chainId: number): string {
  const icons: Record<number, string> = {
    1: "simple-icons:ethereum",
    10: "simple-icons:optimism",
    56: "cryptocurrency-color:bnb",
    101: "token-branded:solana",
    137: "simple-icons:polygon",
    146: "simple-icons:sonic",
    42161: "token-branded:arbitrum",
    43114: "simple-icons:avalanche",
    8453: "token-branded:base",
    59144: "simple-icons:linea",
    80094: "simple-icons:berachain",
  };

  return icons[chainId] ?? "material-symbols:public";
}
