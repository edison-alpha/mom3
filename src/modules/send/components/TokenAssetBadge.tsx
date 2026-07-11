"use client";

import { Icon } from "@iconify/react";

import type { TokenRow } from "@/modules/send/types/send.types";
import { chainBadgeIconFromId } from "@/lib/chain";

export function TokenAssetBadge({ token }: { token: TokenRow }) {
  return (
    <span className="relative flex h-12 w-12 shrink-0 items-center justify-center">
      <Icon icon={token.icon} aria-hidden="true" width={30} height={30} />
      <span className="absolute -bottom-1 -right-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]">
        <Icon
          icon={chainBadgeIconFromId(token.chainId)}
          aria-hidden="true"
          width={13}
          height={13}
          className="text-white"
        />
      </span>
    </span>
  );
}
