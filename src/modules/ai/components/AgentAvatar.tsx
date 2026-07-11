import { AppIcon } from "@/components/ui/app-icon";

type AgentAvatarProps = {
  className?: string;
};

export function AgentAvatar({ className }: AgentAvatarProps) {
  return (
    <span
      className={[
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2d2eff] text-white",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <AppIcon
        icon="solar:smile-circle-bold"
        aria-hidden="true"
        width={24}
        height={24}
      />
    </span>
  );
}
