import type { Metadata } from "next";
import { Suspense } from "react";
import SendView from "@/modules/send/SendView";
import { SendSkeleton } from "@/modules/send/components/SendSkeleton";

export const metadata: Metadata = {
  title: "Send | Oni",
  description: "Send assets to a mom3 tag or wallet address.",
};

export default function SendPage() {
  return (
    <Suspense fallback={<SendSkeleton />}>
      <SendView />
    </Suspense>
  );
}
