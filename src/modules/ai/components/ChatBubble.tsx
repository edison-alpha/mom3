import { AppIcon } from "@/components/ui/app-icon";

import { cn } from "@/lib/utils";

type ChatBubbleProps = {
  content: string;
  isUser: boolean;
  time?: string;
};

export function ChatBubble({ content, isUser, time = "10:30 AM" }: ChatBubbleProps) {
  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <p
        className={cn(
          "max-w-[82%] rounded-[22px] px-4 py-3 text-sm font-medium leading-relaxed",
          isUser
            ? "rounded-br-md bg-[#1C1C1E] text-white"
            : "rounded-bl-md bg-[#111428] text-white",
        )}
      >
        {content}
        {isUser ? (
          <span className="mt-2 flex items-center justify-end gap-1 text-xs text-[#9A9AA2]">
            {time}
            <AppIcon
              icon="solar:check-read-bold"
              aria-hidden="true"
              width={16}
              height={16}
              className="text-[#3B33BD]"
            />
          </span>
        ) : null}
      </p>
    </div>
  );
}
