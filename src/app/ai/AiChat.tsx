"use client";

import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import Link from "next/link";
import * as React from "react";
import { cn } from "@/lib/utils";

type ChatMessage = {
  id: number;
  role: "assistant" | "user";
  content: string;
  kind?: "text" | "strategy";
};

const recommendations = [
  {
    title: "Safest Yield Strategy",
    description: "Low risk, stable returns with blue-chip DeFi protocols.",
    badge: "AI PICK",
    icon: "solar:shield-check-bold",
    iconTone: "text-[#ccff00]",
    chips: [
      { icon: "cryptocurrency-color:usdc", label: "USDC" },
      { icon: "token-branded:aave", label: "Aave" },
      { icon: "cryptocurrency-color:eth", label: "Ethereum" },
    ],
  },
  {
    title: "Rebalance Suggestion",
    description: "Shift allocation to optimize your risk-adjusted returns.",
    badge: "+0.42% APY",
    icon: "solar:chart-square-bold",
    iconTone: "text-[#5A52FF]",
    chips: [
      { icon: "cryptocurrency-color:usdc", label: "USDC" },
      { icon: "token-branded:ethena", label: "Ethena" },
      { icon: "token-branded:arbitrum", label: "Arbitrum" },
    ],
  },
  {
    title: "Risk Alert",
    description: "High volatility detected on 2 positions. Review recommended.",
    badge: "MEDIUM RISK",
    icon: "solar:danger-triangle-bold",
    iconTone: "text-[#ccff00]",
    chips: [
      { icon: "cryptocurrency-color:usdt", label: "USDT" },
      { icon: "token-branded:pendle", label: "Pendle" },
      { icon: "token-branded:manta", label: "Manta" },
    ],
  },
];

const initialMessages: ChatMessage[] = [
];

function createAiReply(message: string): ChatMessage {
  const normalized = message.toLowerCase();

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

function RecommendationCard({
  item,
  onSelect,
}: {
  item: (typeof recommendations)[number];
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="group w-full rounded-[22px] border border-[#3B33BD]/80 bg-[radial-gradient(circle_at_0%_0%,rgba(59,51,189,0.42),rgba(8,9,36,0.94)_42%,rgba(5,6,19,0.98)_100%)] p-3 text-left shadow-[0_14px_36px_-24px_rgba(59,51,189,0.9)] transition-transform active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-[#3B33BD]"
    >
      <div className="flex gap-3">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.05]">
          <Icon
            icon={item.icon}
            aria-hidden="true"
            width={30}
            height={30}
            className={item.iconTone}
          />
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex items-start justify-between gap-3">
            <span>
              <span className="flex items-center gap-1.5 text-[15px] font-black leading-tight text-white">
                <Icon
                  icon="solar:stars-bold"
                  aria-hidden="true"
                  width={15}
                  height={15}
                  className="text-[#ccff00]"
                />
                {item.title}
              </span>
              <span className="mt-1.5 block text-xs font-medium leading-relaxed text-[#A7A7B7]">
                {item.description}
              </span>
            </span>
            <span className="shrink-0 rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 text-[10px] font-black text-[#ccff00]">
              {item.badge}
            </span>
          </span>

          <span className="mt-3 flex flex-wrap gap-1.5">
            {item.chips.map((chip) => (
              <span
                key={`${item.title}-${chip.label}`}
                className="inline-flex h-7 items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-2.5 text-xs font-bold text-white"
              >
                <Icon icon={chip.icon} aria-hidden="true" width={16} height={16} />
                {chip.label}
              </span>
            ))}
          </span>
        </span>

        <span className="flex items-center text-[#BDBDCC]">
          <Icon
            icon="lucide:chevron-right"
            aria-hidden="true"
            width={20}
            height={20}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </span>
      </div>
    </button>
  );
}

function StrategyResponse() {
  return (
    <div className="rounded-[24px] border border-white/10 bg-[radial-gradient(circle_at_0%_0%,rgba(59,51,189,0.24),rgba(20,21,35,0.98)_54%,rgba(13,14,24,0.98)_100%)] p-3 shadow-[0_14px_40px_-28px_rgba(59,51,189,0.9)]">
      <div className="flex items-center gap-2 text-sm font-medium text-white">
        <Icon
          icon="solar:stars-bold"
          aria-hidden="true"
          width={20}
          height={20}
          className="text-[#ccff00]"
        />
        Berikut strategi yield paling aman saat ini
      </div>

      <div className="mt-3 rounded-[20px] border border-white/10 bg-white/[0.04] p-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[#ccff00]/30 bg-[#ccff00]/10">
              <Icon
                icon="solar:shield-check-bold"
                aria-hidden="true"
                width={27}
                height={27}
                className="text-[#ccff00]"
              />
            </span>
            <div>
              <p className="text-sm font-black text-white">Aave Earn</p>
              <p className="mt-1 text-xs font-medium text-[#A7A7B7]">
                Supply USDC on Aave v3
              </p>
              <p className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-[#A7A7B7]">
                <Icon icon="cryptocurrency-color:eth" aria-hidden="true" width={16} height={16} />
                Ethereum
              </p>
            </div>
          </div>

          <div className="border-l border-white/10 pl-3 text-right">
            <p className="text-xs font-medium text-[#A7A7B7]">Expected APY</p>
            <p className="mt-1 text-3xl font-black text-white">5.15%</p>
            <p className="mt-1.5 rounded-full border border-[#ccff00]/40 bg-[#ccff00]/10 px-2.5 py-1 text-[10px] font-black text-[#ccff00]">
              Low Risk Score
            </p>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3 border-t border-white/10 pt-3">
          <div>
            <p className="text-xs font-medium text-[#A7A7B7]">Why this strategy?</p>
            <p className="mt-1 text-xs font-bold leading-snug text-white">
              Stablecoins, blue-chip protocol, audited and battle-tested.
            </p>
          </div>
          <div className="border-l border-white/10 pl-3">
            <p className="text-xs font-medium text-[#A7A7B7]">Best for</p>
            <p className="mt-1 text-xs font-bold leading-snug text-white">
              Capital preservation and steady returns
            </p>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <Link
          href="/ai/strategy"
          className="inline-flex h-10 items-center gap-2 rounded-full bg-[#ccff00] px-4 text-sm font-black text-black transition-transform active:scale-95 focus-visible:ring-2 focus-visible:ring-[#ccff00]/70"
        >
          View Strategy
          <Icon icon="lucide:external-link" aria-hidden="true" width={16} height={16} />
        </Link>
        <button
          type="button"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-[#ccff00]/50 text-[#ccff00] transition-colors hover:bg-[#ccff00]/10 focus-visible:ring-2 focus-visible:ring-[#ccff00]/70"
          aria-label="Save strategy"
        >
          <Icon icon="solar:bookmark-linear" aria-hidden="true" width={22} height={22} />
        </button>
        <span className="ml-auto text-xs font-medium text-[#9A9AA2]">10:30 AM</span>
      </div>
    </div>
  );
}

export default function AiChat() {
  const [messages, setMessages] = React.useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = React.useState("");
  const [isThinking, setIsThinking] = React.useState(false);

  const userTurns = React.useMemo(
    () => messages.filter((message) => message.role === "user").length,
    [messages]
  );
  const showRecommendations = userTurns >= 3;

  const sendMessage = React.useCallback(
    (value: string) => {
      const trimmed = value.trim();

      if (!trimmed || isThinking) return;

      const userMessage: ChatMessage = {
        id: Date.now(),
        role: "user",
        content: trimmed,
      };

      setMessages((current) => [...current, userMessage]);
      setInput("");
      setIsThinking(true);

      window.setTimeout(() => {
        setMessages((current) => [...current, createAiReply(trimmed)]);
        setIsThinking(false);
      }, 650);
    },
    [isThinking]
  );

  return (
    <main className="min-h-screen w-full bg-black font-sans text-white antialiased">
      <header className="fixed inset-x-0 top-0 z-50 mx-auto flex h-14 w-full max-w-md items-center justify-center bg-black/80 px-5 backdrop-blur-md">
        <Link
          href="/dashboard"
          className="absolute left-5 flex h-10 w-10 items-center justify-center rounded-full bg-[#1C1C1E] text-white transition-colors hover:bg-[#262628] focus-visible:ring-2 focus-visible:ring-[#3B33BD]"
          aria-label="Back to dashboard"
        >
          <Icon
            icon="lucide:chevron-left"
            aria-hidden="true"
            width={28}
            height={28}
          />
        </Link>

        <h1 className="text-xl font-bold text-white">mom3 /agent</h1>
      </header>

      <div className="mx-auto flex min-h-screen w-full flex-col px-5 pb-32 pt-20 sm:max-w-md">

        {showRecommendations ? (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-5 space-y-3"
          >
            {recommendations.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <RecommendationCard
                  item={item}
                  onSelect={() => sendMessage(item.title)}
                />
              </motion.div>
            ))}
          </motion.section>
        ) : null}

        <section className="mt-6 space-y-4 pb-4">
          {messages.length === 0 && !isThinking ? (
            <div className="rounded-[24px] border border-white/10 bg-[#1C1C1E] p-4 text-center">
              <Icon
                icon="solar:chat-round-like-bold"
                aria-hidden="true"
                width={32}
                height={32}
                className="mx-auto text-[#3B33BD]"
              />
              <p className="mt-3 text-sm font-bold text-white">
                Start with a strategy question
              </p>
              <p className="mt-1 text-xs font-medium leading-relaxed text-[#9A9AA2]">
                Ask mom3 agent for safest yield, risk review, or a rebalance
                suggestion.
              </p>
            </div>
          ) : null}

          {messages.map((message) => {
            const isUser = message.role === "user";

            if (message.kind === "strategy") {
              return (
                <div key={message.id} className="flex gap-3">
                  <span className="mt-7 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2d2eff] text-white shadow-[0_0_0_4px_rgba(204,255,0,0.1)]">
                    <Icon icon="solar:smile-circle-bold" aria-hidden="true" width={24} height={24} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <StrategyResponse />
                  </div>
                </div>
              );
            }

            return (
              <div
                key={message.id}
                className={cn("flex", isUser ? "justify-end" : "justify-start")}
              >
                <p
                  className={cn(
                    "max-w-[82%] rounded-[22px] px-4 py-3 text-sm font-medium leading-relaxed",
                    isUser
                      ? "rounded-br-md bg-[#1C1C1E] text-white"
                      : "rounded-bl-md bg-[#111428] text-white"
                  )}
                >
                  {message.content}
                  {isUser && (
                    <span className="mt-2 flex items-center justify-end gap-1 text-xs text-[#9A9AA2]">
                      10:30 AM
                      <Icon
                        icon="solar:check-read-bold"
                        aria-hidden="true"
                        width={16}
                        height={16}
                        className="text-[#3B33BD]"
                      />
                    </span>
                  )}
                </p>
              </div>
            );
          })}

          {isThinking && (
            <div className="flex gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2d2eff] text-white">
                <Icon icon="solar:smile-circle-bold" aria-hidden="true" width={24} height={24} />
              </span>
              <div className="rounded-[22px] rounded-bl-md bg-[#1C1C1E] px-4 py-3 text-sm font-bold text-[#9A9AA2]">
                Thinking...
              </div>
            </div>
          )}
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-7 z-40 flex justify-center px-5">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            sendMessage(input);
          }}
          className="flex h-14 w-full max-w-md items-center gap-2 rounded-full border border-white/10 bg-[#1C1C1E]/95 p-2 shadow-[0_16px_44px_-24px_rgba(0,0,0,0.9)] backdrop-blur-md"
        >
          <button
            type="button"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[#8E8E98] transition-colors hover:bg-white/5 hover:text-white focus-visible:ring-2 focus-visible:ring-[#3B33BD]"
            aria-label="Attach file"
          >
            <Icon
              icon="lucide:paperclip"
              aria-hidden="true"
              width={22}
              height={22}
            />
          </button>
          <label htmlFor="ai-message" className="sr-only">
            Message mom3 agent
          </label>
          <input
            id="ai-message"
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask mom3 anything..."
            autoComplete="off"
            className="min-w-0 flex-1 bg-transparent text-base font-medium text-white placeholder:text-[#77777f] focus:outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || isThinking}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#3B33BD] text-[#ccff00] shadow-[0_10px_28px_-12px_rgba(59,51,189,0.9)] transition-transform active:scale-95 focus-visible:ring-2 focus-visible:ring-[#ccff00]/60 disabled:cursor-not-allowed disabled:bg-[#2A2A3E] disabled:text-[#77777f]"
            aria-label="Send message"
          >
            <Icon
              icon="lucide:arrow-up"
              aria-hidden="true"
              width={20}
              height={20}
              strokeWidth={3}
            />
          </button>
        </form>
      </div>
    </main>
  );
}
