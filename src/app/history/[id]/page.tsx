import { Icon } from "@iconify/react";
import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { allHistoryItems, getHistoryItemById, historyTabs, type HistoryItem } from "@/lib/history";
import { cn } from "@/lib/utils";

type HistoryDetailPageProps = {
  params: Promise<{ id: string }>;
};

const toneClassName: Record<HistoryItem["tone"], string> = {
  green: "bg-[#ccff00] text-[#0a0a0a]",
  purple: "bg-[#3B33BD] text-white",
  blue: "bg-[#2d2eff] text-white",
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export function generateStaticParams() {
  return allHistoryItems.map((item) => ({ id: item.id }));
}

export async function generateMetadata({
  params,
}: HistoryDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const item = getHistoryItemById(id);

  return {
    title: item ? `${item.title} | History` : "History Detail | Oni",
    description: item?.note ?? "View activity detail.",
  };
}

export default async function HistoryDetailPage({
  params,
}: HistoryDetailPageProps) {
  const { id } = await params;
  const item = getHistoryItemById(id);

  if (!item) {
    notFound();
  }

  const tabLabel = historyTabs.find((tab) => tab.id === item.tab)?.label;

  return (
    <main className="min-h-screen w-full bg-black font-sans text-white antialiased">
      <div className="mx-auto flex min-h-screen w-full flex-col px-5 pb-28 pt-4 sm:max-w-md">
        <header className="relative flex h-12 items-center justify-center">
          <Link
            href="/history"
            aria-label="Back to history"
            className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full bg-[#1C1C1E] text-white transition-colors hover:bg-[#262628] focus-visible:ring-2 focus-visible:ring-[#3B33BD]"
          >
            <Icon
              icon="lucide:chevron-left"
              aria-hidden="true"
              width={24}
              height={24}
            />
          </Link>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Detail
          </h1>
        </header>

        <section className="mt-5 rounded-[32px] bg-[#1C1C1E] p-5 text-center">
          <span
            className={cn(
              "mx-auto flex h-16 w-16 items-center justify-center rounded-full",
              toneClassName[item.tone]
            )}
          >
            <Icon icon={item.icon} aria-hidden="true" width={30} height={30} />
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
        </section>

        <section className="mt-5 overflow-hidden rounded-[28px] bg-[#1C1C1E]">
          {[
            ["Status", item.status],
            ["Network", item.network],
            ["Reference", item.reference],
            ["Time", item.time],
          ].map(([label, value], index) => (
            <div
              key={label}
              className={cn(
                "flex min-h-14 items-center justify-between gap-4 px-4 py-3",
                index < 3 && "border-b border-white/5"
              )}
            >
              <span className="text-sm font-medium text-[#9A9AA2]">{label}</span>
              <span className="min-w-0 truncate text-right text-sm font-bold text-white">
                {value}
              </span>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
