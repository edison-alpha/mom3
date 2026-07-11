import type { ChatMessage } from "../types/ai.types";

export async function createAiReply(message: string): Promise<ChatMessage> {
  const normalized = message.toLowerCase();

  await new Promise((resolve) => {
    window.setTimeout(resolve, 650);
  });

  if (normalized.includes("safe") || normalized.includes("yield")) {
    return {
      id: Date.now() + 1,
      role: "assistant",
      kind: "strategy",
      content: "Berikut strategi yield paling aman saat ini",
    };
  }

  if (normalized.includes("risk") || normalized.includes("volatility")) {
    return {
      id: Date.now() + 1,
      role: "assistant",
      content:
        "I would reduce exposure to volatile yield positions first, then keep new deposits in USDC until the portfolio risk score returns to low.",
    };
  }

  return {
    id: Date.now() + 1,
    role: "assistant",
    content:
      "I can compare your positions, risk level, and expected APY, then suggest the smallest rebalance needed before you take action.",
  };
}
