import type { Metadata } from "next";
import { Suspense } from "react";
import SendClient from "./SendClient";

export const metadata: Metadata = {
  title: "Send | Oni",
  description: "Send assets to a mom3 tag or wallet address.",
};

export default function SendPage() {
  return (
    <Suspense fallback={null}>
      <SendClient />
    </Suspense>
  );
}
