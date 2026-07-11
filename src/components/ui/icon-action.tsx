import * as React from "react";

import { AppIcon } from "@/components/ui/app-icon";

import { cn } from "@/lib/utils";

type IconActionProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: string;
  label: string;
  iconClassName?: string;
  iconSize?: number;
  tone?: "muted" | "primary" | "lime";
};

function IconAction({
  icon,
  label,
  className,
  iconClassName,
  iconSize = 22,
  tone = "muted",
  ...props
}: IconActionProps) {
  return (
    <button
      type="button"
      className={cn(
        "flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors active:scale-95 focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-60",
        tone === "muted" &&
          "text-[#8E8E98] hover:bg-white/5 hover:text-white focus-visible:ring-[#3B33BD]",
        tone === "primary" &&
          "bg-[#3B33BD] text-[#ccff00] shadow-[0_10px_28px_-12px_rgba(59,51,189,0.9)] focus-visible:ring-[#ccff00]/60 disabled:bg-[#2A2A3E] disabled:text-[#77777f]",
        tone === "lime" &&
          "border border-[#ccff00]/50 text-[#ccff00] hover:bg-[#ccff00]/10 focus-visible:ring-[#ccff00]/70",
        className,
      )}
      aria-label={label}
      {...props}
    >
      <AppIcon
        icon={icon}
        aria-hidden="true"
        width={iconSize}
        height={iconSize}
        className={iconClassName}
      />
    </button>
  );
}

export { IconAction };
