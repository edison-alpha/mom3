import { Icon } from "@iconify/react";
import type { Metadata, Viewport } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Profile | Oni",
  description: "View your mom3 profile.",
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

const stats = [
  { label: "Score", value: "92", sub: "Trusted" },
  { label: "Streak", value: "14d", sub: "Active" },
  { label: "Rewards", value: "0.00", sub: "MOM" },
];

const identityRows = [
  {
    icon: "solar:wallet-money-bold",
    label: "Universal Balance",
    value: "$00.00",
  },
  {
    icon: "solar:shield-check-bold",
    label: "Security",
    value: "Turnkey signed",
  },
  {
    icon: "solar:global-bold",
    label: "Network",
    value: "Base",
  },
];

const actionRows = [
  {
    icon: "solar:user-id-bold",
    label: "Public profile",
    value: "mom3/u/ubayy",
  },
  {
    icon: "solar:chart-2-bold",
    label: "AI rebalancing",
    value: "Ready",
  },
  {
    icon: "solar:bell-bold",
    label: "Activity alerts",
    value: "Enabled",
  },
];

export default function ProfilePage() {
  return (
    <main className="min-h-screen w-full bg-black font-sans text-white antialiased">
      <div className="mx-auto flex min-h-screen w-full flex-col px-5 pb-10 pt-4 sm:max-w-md">
        <header className="relative flex h-12 items-center justify-center">
          <Link
            href="/dashboard"
            aria-label="Back to dashboard"
            className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full bg-[#1C1C1E] text-white transition-colors hover:bg-[#262628] focus-visible:ring-2 focus-visible:ring-[#3B33BD]"
          >
            <Icon
              icon="lucide:chevron-left"
              aria-hidden="true"
              width={24}
              height={24}
            />
          </Link>

          <h1 className="text-base font-bold text-white">/Profile</h1>
        </header>

        <section className="relative mt-5 overflow-hidden rounded-[32px] bg-[radial-gradient(circle_at_50%_0%,rgba(59,51,189,0.55),rgba(28,28,30,0.98)_56%,rgba(17,18,24,1)_100%)] p-5 text-center shadow-[0_18px_52px_-28px_rgba(59,51,189,0.9)]">
          <div className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-[#ccff00]/10 blur-[54px]" />
          <div className="pointer-events-none absolute -left-12 bottom-4 h-40 w-40 rounded-full bg-[#3B33BD]/35 blur-[54px]" />

          <div className="relative z-10">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#3B33BD] via-[#5A52D4] to-[#7E78EA] shadow-[0_18px_44px_-18px_rgba(59,51,189,0.9)] ring-4 ring-black/25">
              <span className="text-3xl font-black text-white">U</span>
            </div>
            <div className="mt-4 flex items-center justify-center gap-2">
              <h2 className="text-2xl font-black tracking-tight text-white">
                @ubayy
              </h2>
              <Icon
                icon="material-symbols:verified-rounded"
                aria-hidden="true"
                width={23}
                height={23}
                className="text-[#ccff00]"
              />
            </div>
            <p className="mt-2 text-sm font-medium text-[#B8B8C5]">
              Universal wallet profile on mom3
            </p>

            <div className="mt-5 grid grid-cols-3 gap-2">
              {stats.map((item) => (
                <div key={item.label} className="rounded-2xl bg-black/25 p-3">
                  <p className="text-[11px] font-bold uppercase text-[#8E8E98]">
                    {item.label}
                  </p>
                  <p className="mt-1 text-lg font-black text-white">
                    {item.value}
                  </p>
                  <p className="mt-0.5 text-[11px] font-semibold text-[#ccff00]">
                    {item.sub}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-4 rounded-[28px] bg-[#1C1C1E] p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">
                Agent readiness
              </h3>
              <p className="mt-1 text-sm font-medium text-[#9A9AA2]">
                Your profile is ready for AI portfolio actions.
              </p>
            </div>
            <span className="rounded-full bg-[#ccff00]/10 px-3 py-1 text-xs font-black text-[#ccff00]">
              READY
            </span>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-black/35">
            <div className="h-full w-[82%] rounded-full bg-[#ccff00]" />
          </div>
        </section>

        <section className="mt-4 rounded-[28px] bg-[#1C1C1E] p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white">Receive link</h3>
              <p className="mt-1 text-sm font-medium text-[#9A9AA2]">
                Share your QR or send directly by mom3 tag.
              </p>
            </div>
            <div className="grid h-20 w-20 shrink-0 grid-cols-5 gap-1 rounded-2xl bg-white p-2">
              {Array.from({ length: 25 }).map((_, index) => (
                <span
                  key={index}
                  className={`rounded-[2px] ${
                    [
                      0, 1, 2, 5, 7, 10, 11, 12, 18, 20, 21, 22, 24,
                    ].includes(index)
                      ? "bg-black"
                      : "bg-transparent"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <Link
              href="/send?to=@ubayy"
              className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-[#3B33BD] text-sm font-black text-[#ccff00] transition-transform active:scale-95 focus-visible:ring-2 focus-visible:ring-[#3B33BD]"
            >
              <Icon icon="solar:plain-bold" aria-hidden="true" width={18} height={18} />
              Send by link
            </Link>
            <Link
              href="/send"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-black/30 text-white transition-colors hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-[#3B33BD]"
              aria-label="Open send"
            >
              <Icon icon="lucide:external-link" aria-hidden="true" width={19} height={19} />
            </Link>
          </div>
        </section>

        <section className="mt-4 overflow-hidden rounded-[28px] bg-[#1C1C1E]">
          {identityRows.map((row, index) => (
            <div
              key={row.label}
              className={`flex min-h-[64px] items-center gap-3 px-4 py-3 ${
                index < identityRows.length - 1 ? "border-b border-white/5" : ""
              }`}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2A2A3E] text-white">
                <Icon icon={row.icon} aria-hidden="true" width={20} height={20} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold text-white">
                  {row.label}
                </span>
                <span className="mt-0.5 block text-xs font-medium text-[#9A9AA2]">
                  {row.value}
                </span>
              </span>
            </div>
          ))}
        </section>

        <section className="mt-4 overflow-hidden rounded-[28px] bg-[#1C1C1E]">
          {actionRows.map((row, index) => (
            <Link
              key={row.label}
              href={row.label === "AI rebalancing" ? "/ai" : "#"}
              className={`flex min-h-[64px] items-center gap-3 px-4 py-3 transition-colors hover:bg-white/[0.04] focus-visible:ring-2 focus-visible:ring-[#3B33BD] ${
                index < actionRows.length - 1 ? "border-b border-white/5" : ""
              }`}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#3B33BD]/20 text-[#8F89FF]">
                <Icon icon={row.icon} aria-hidden="true" width={20} height={20} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold text-white">
                  {row.label}
                </span>
                <span className="mt-0.5 block truncate text-xs font-medium text-[#9A9AA2]">
                  {row.value}
                </span>
              </span>
              <Icon
                icon="lucide:chevron-right"
                aria-hidden="true"
                width={20}
                height={20}
                className="text-[#66666D]"
              />
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
