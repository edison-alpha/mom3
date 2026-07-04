import type { Metadata, Viewport } from "next";
import AiChat from "./AiChat";

export const metadata: Metadata = {
  title: "AI Rebalancing | Oni",
  description: "AI assistant for mom3 portfolio rebalancing.",
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function AiPage() {
  return <AiChat />;
}
