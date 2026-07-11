"use client";

import { AppIcon } from "@/components/ui/app-icon";
import { motion } from "framer-motion";
import { MobilePageHeader, MobileShell } from "@/components/ui/mobile-shell";
import { historyTabs, type HistoryItem } from "@/lib/history";
import { cn } from "@/lib/utils";

const toneClassName: Record<HistoryItem["tone"], string> = {
  green: "bg-[#ccff00] text-[#0a0a0a]",
  purple: "bg-[#3B33BD] text-white",
  blue: "bg-[#2d2eff] text-white",
};

export default function HistoryDetailView({ item }: { item: HistoryItem }) {
  const tabLabel = historyTabs.find((tab) => tab.id === item.tab)?.label;

  return (
    <MobileShell>
        <MobilePageHeader title="Detail" backHref="/history" backLabel="Back to history" />

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mt-5 rounded-[32px] bg-[#1C1C1E] p-5 text-center"
        >
          <span
            className={cn(
              "mx-auto flex h-16 w-16 items-center justify-center rounded-full",
              toneClassName[item.tone]
            )}
          >
            <AppIcon icon={item.icon} aria-hidden="true" width={30} height={30} />
          </span>
          <p className="mt-4 text-sm font-semibold text-[#9A9AA2]">
            {tabLabel} history
          </p>
          <h2 className="mt-1 text-2xl font-black tracking-tight text-white">
            {item.title}
          </h2>
          <p className="mt-2 text-sm font-medium text-[#9A9AA2]">
            {item.note}
          </p>
          <p className="mt-5 text-3xl font-black text-white">{item.amount}</p>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="mt-5 overflow-hidden rounded-[28px] bg-[#1C1C1E]"
        >
          {[
            ["Status", item.status],
            ["Network", item.network],
            ["Reference", item.reference],
            ["Time", item.time],
          ].map(([label, value], index) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.15 + index * 0.06 }}
              className={cn(
                "flex min-h-14 items-center justify-between gap-4 px-4 py-3",
                index < 3 && "border-b border-white/5"
              )}
            >
              <span className="text-sm font-medium text-[#9A9AA2]">{label}</span>
              <span className="min-w-0 truncate text-right text-sm font-bold text-white">
                {value}
              </span>
            </motion.div>
          ))}
        </motion.section>
    </MobileShell>
  );
}
