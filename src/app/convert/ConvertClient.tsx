"use client";

import { Icon } from "@iconify/react";
import Link from "next/link";
import * as React from "react";

const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0"];

export default function ConvertClient() {
  const [amount, setAmount] = React.useState("");
  const [previewed, setPreviewed] = React.useState(false);
  const displayAmount = amount || "0";
  const receiveAmount = amount ? (Number(amount) / 62000).toFixed(6) : "0";

  const pressKey = (key: string) => {
    setPreviewed(false);

    if (key === "." && amount.includes(".")) return;
    if (amount === "0" && key !== ".") {
      setAmount(key);
      return;
    }
    setAmount((value) => `${value}${key}`);
  };

  const removeKey = () => {
    setPreviewed(false);
    setAmount((value) => value.slice(0, -1));
  };

  return (
    <main className="min-h-screen w-full bg-black font-sans text-white antialiased">
      <div className="mx-auto flex min-h-screen w-full flex-col px-5 pb-8 pt-4 sm:max-w-md">
        <header className="relative flex h-12 items-center justify-center">
          <Link
            href="/assets"
            aria-label="Back to assets"
            className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-[#3B33BD]"
          >
            <Icon icon="lucide:chevron-left" aria-hidden="true" width={28} height={28} />
          </Link>

          <h1 className="text-xl font-black text-white">Convert</h1>
        </header>

        <section className="relative mt-16">
          <div className="rounded-[28px] bg-[#151714] p-5">
            <p className="text-sm font-black text-[#A7A7A7]">You pay</p>
            <p className="mt-5 text-5xl font-black tracking-tight text-white">
              ${displayAmount}
            </p>
            <Icon
              icon="lucide:arrow-up-down"
              aria-hidden="true"
              width={24}
              height={24}
              className="mt-8 text-[#A7A7A7]"
            />
          </div>

          <button
            type="button"
            className="absolute left-1/2 top-[170px] z-10 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full border border-white/10 bg-[#171917] text-white shadow-[0_8px_18px_-10px_rgba(0,0,0,0.9)] focus-visible:ring-2 focus-visible:ring-[#3B33BD]"
            aria-label="Switch assets"
          >
            <Icon icon="lucide:chevron-down" aria-hidden="true" width={28} height={28} />
          </button>

          <div className="mt-3 rounded-[28px] bg-[#151714] p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-black text-[#A7A7A7]">You receive</p>
                <p className="mt-5 text-5xl font-black tracking-tight text-white">
                  ${displayAmount}
                </p>
              </div>
              <div className="mt-11 text-right">
                <button
                  type="button"
                  className="inline-flex h-11 items-center gap-2 rounded-2xl bg-[#242620] px-3 text-base font-black text-white"
                >
                  <span className="h-6 w-6 rounded-lg bg-[#f7931a]" />
                  BTC
                  <Icon icon="lucide:chevron-right" aria-hidden="true" width={17} height={17} />
                </button>
                <p className="mt-3 rounded-xl border border-white/10 px-2 py-1 text-xs font-black text-[#555]">
                  {amount ? `${receiveAmount} BTC` : "No balance"}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-auto grid grid-cols-3 gap-y-5 pb-5 pt-10">
          {keys.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => pressKey(key)}
              className="mx-auto flex h-14 w-14 items-center justify-center rounded-full text-4xl font-black text-white transition-colors hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-[#3B33BD]"
            >
              {key}
            </button>
          ))}
          <button
            type="button"
            onClick={removeKey}
            className="mx-auto flex h-14 w-14 items-center justify-center rounded-full text-white transition-colors hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-[#3B33BD]"
            aria-label="Delete"
          >
            <Icon icon="lucide:delete" aria-hidden="true" width={28} height={28} />
          </button>
        </section>

        <button
          type="button"
          disabled={!amount}
          onClick={() => setPreviewed(true)}
          className="flex h-14 w-full items-center justify-center rounded-[24px] bg-[#ccff00] text-base font-black text-black transition-transform active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-[#ccff00]/70 disabled:bg-[#203900] disabled:text-black/60"
        >
          {previewed ? "Preview ready" : "Preview"}
        </button>
      </div>
    </main>
  );
}
