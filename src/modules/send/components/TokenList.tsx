"use client";

import * as React from "react";

import { TokenRowItem } from "@/modules/send/components/TokenRowItem";
import type { TokenRow } from "@/modules/send/types/send.types";
import { normalizeAssetQuery } from "@/modules/send/utils/send.utils";

function matchesToken(token: TokenRow, query: string) {
  const normalized = normalizeAssetQuery(query);
  if (!normalized) return true;
  return (
    normalizeAssetQuery(token.symbol).includes(normalized) ||
    normalizeAssetQuery(token.name).includes(normalized) ||
    normalizeAssetQuery(token.chainName).includes(normalized)
  );
}

export function TokenList({
  tokenRows,
  selectedToken,
  isLoading,
  searchQuery,
  onTokenSelect,
}: {
  tokenRows: TokenRow[];
  selectedToken: TokenRow | null;
  isLoading: boolean;
  searchQuery: string;
  onTokenSelect: (token: TokenRow) => void;
}) {
  const filtered = React.useMemo(
    () => tokenRows.filter((token) => matchesToken(token, searchQuery)),
    [tokenRows, searchQuery],
  );

  return (
    <div className="space-y-2">
      {isLoading && tokenRows.length === 0 ? (
        Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="min-h-[76px] rounded-[24px] border border-white/5 bg-black/20 p-3"
            aria-hidden="true"
          >
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-white/[0.08]" />
              <div className="min-w-0 flex-1 space-y-2">
                <div className="h-3.5 w-16 rounded-full bg-white/[0.08]" />
                <div className="h-2.5 w-20 rounded-full bg-white/[0.06]" />
              </div>
              <div className="space-y-2 text-right">
                <div className="ml-auto h-3.5 w-14 rounded-full bg-white/[0.08]" />
                <div className="ml-auto h-2.5 w-12 rounded-full bg-white/[0.06]" />
              </div>
            </div>
          </div>
        ))
      ) : filtered.length > 0 ? (
        filtered.map((token) => (
          <TokenRowItem
            key={token.id}
            token={token}
            selected={selectedToken?.id === token.id}
            onSelect={onTokenSelect}
          />
        ))
      ) : (
        <div className="rounded-[24px] border border-white/5 bg-black/20 px-4 py-5 text-center">
          <p className="text-sm font-bold text-white">No token found</p>
          <p className="mt-1 text-xs font-medium text-[#9A9AA2]">Try a different search term.</p>
        </div>
      )}
    </div>
  );
}
