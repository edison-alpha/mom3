export type ChatRole = "assistant" | "user";

export type ChatMessageKind = "text" | "strategy";

export type ChatMessage = {
  id: number;
  role: ChatRole;
  content: string;
  kind?: ChatMessageKind;
};

export type RecommendationChip = {
  icon: string;
  label: string;
};

export type RecommendationItem = {
  title: string;
  description: string;
  badge: string;
  icon: string;
  iconTone: string;
  chips: RecommendationChip[];
};
