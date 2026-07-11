"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useMagic } from "@/providers/magic/components/MagicProvider";

export default function SplashPage() {
  const router = useRouter();
  const { isLoading, session } = useMagic();
  const [minimumDurationElapsed, setMinimumDurationElapsed] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setMinimumDurationElapsed(true);
    }, 600);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLoading || !minimumDurationElapsed) return;

    router.replace(session?.ownerAddress ? "/dashboard" : "/login");
  }, [isLoading, minimumDurationElapsed, router, session?.ownerAddress]);

  return (
    <main
      aria-busy={isLoading || !minimumDurationElapsed}
      aria-label="mom3 loading"
      className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#1700D6]"
    >
      <div
        aria-hidden="true"
        className="splash-halo absolute h-36 w-36 rounded-full bg-[#6f7cff]/35 blur-2xl"
      />
      <Image
        src="/brand-logo.png"
        alt="mom3"
        width={112}
        height={112}
        priority
        className="splash-logo relative z-10 h-24 w-24 object-contain sm:h-28 sm:w-28"
      />
      <span className="sr-only" role="status">
        Loading mom3
      </span>
    </main>
  );
}
