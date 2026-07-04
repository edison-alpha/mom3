"use client";

import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import * as React from "react";
import { FloatingMenuButton } from "@/components/ui/menu-button";
import { historyItems, historyTabs, type HistoryItem, type HistoryTab } from "@/lib/history";
import { cn } from "@/lib/utils";

const toneClassName: Record<HistoryItem["tone"], string> = {
  green: "bg-[#ccff00] text-[#0a0a0a]",
  purple: "bg-[#3B33BD] text-white",
  blue: "bg-[#2d2eff] text-white",
};

export default function History() {
  const [activeTab, setActiveTab] = React.useState<HistoryTab>("me");
  const activeItems = historyItems[activeTab];

  return (
    <main className="min-h-screen w-full bg-black font-sans text-white antialiased">
      <div className="mx-auto flex min-h-screen w-full flex-col px-5 pb-28 pt-4 sm:max-w-md">
        <motion.header
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="relative flex h-12 items-center justify-center"
        >
          <h1 className="text-xl font-bold text-white">History</h1>
        </motion.header>

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="mt-5 rounded-[28px] bg-[#1C1C1E] p-2"
        >
          <div className="grid grid-cols-3 gap-1">
                {historyTabs.map((tab) => {
              const isActive = tab.id === activeTab;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "h-11 rounded-full text-sm font-bold transition-colors focus-visible:ring-2 focus-visible:ring-[#ccff00]/60",
                    isActive
                      ? "bg-[#3B33BD] text-[#ccff00]"
                      : "text-[#9A9AA2] hover:bg-white/5 hover:text-white"
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </motion.section>

        <section className="mt-5">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-base font-bold text-white">
                {historyTabs.find((tab) => tab.id === activeTab)?.label} history
              </h2>
              <p className="mt-1 text-sm font-medium text-[#9A9AA2]">
                Recent activity that matters to you.
              </p>
            </div>
            <span className="rounded-full bg-[#1C1C1E] px-3 py-1 text-xs font-bold text-[#9A9AA2]">
              {activeItems.length} item
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              {activeItems.length > 0 ? (
                <div className="mt-4 overflow-hidden rounded-[28px] bg-[#1C1C1E]">
                  {activeItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        href={`/history/${item.id}`}
                        className={cn(
                          "flex min-h-[78px] items-center gap-3 px-4 py-3 transition-colors hover:bg-white/[0.04] focus-visible:ring-2 focus-visible:ring-[#3B33BD]",
                          index < activeItems.length - 1 && "border-b border-white/5"
                        )}
                      >
                        <span
                          className={cn(
                            "flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
                            toneClassName[item.tone]
                          )}
                        >
                          <Icon
                            icon={item.icon}
                            aria-hidden="true"
                            width={22}
                            height={22}
                          />
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-base font-bold text-white">
                            {item.title}
                          </span>
                          <span className="mt-0.5 block truncate text-sm font-medium text-[#9A9AA2]">
                            {item.description}
                          </span>
                        </span>

                        <span className="flex shrink-0 items-center gap-2 text-right">
                          <span>
                            <span className="block text-sm font-bold text-white">
                              {item.amount}
                            </span>
                            <span className="mt-0.5 block text-xs font-semibold text-[#77777f]">
                              {item.time}
                            </span>
                          </span>
                          <Icon
                            icon="lucide:chevron-right"
                            aria-hidden="true"
                            width={18}
                            height={18}
                            className="text-[#66666D]"
                          />
                        </span>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 flex min-h-48 flex-col items-center justify-center rounded-[28px] bg-[#1C1C1E] px-6 text-center"
                >
                  <Icon
                    icon="material-symbols:history-2"
                    aria-hidden="true"
                    width={36}
                    height={36}
                    className="text-[#9A9AA2]"
                  />
                  <p className="mt-3 text-base font-bold text-white">
                    No history yet
                  </p>
                  <p className="mt-1 text-sm font-medium text-[#9A9AA2]">
                    New activity will appear here.
                  </p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </section>
      </div>

      <FloatingMenuButton activeHref="/history" />
    </main>
  );
}
