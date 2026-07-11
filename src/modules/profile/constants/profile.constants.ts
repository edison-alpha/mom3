import type { ProfileActionRow, ProfileStat } from "@/modules/profile/types/profile.types";

export const profileStats: ProfileStat[] = [
  { label: "Score", value: "92", sub: "Trusted" },
  { label: "Streak", value: "14d", sub: "Active" },
  { label: "Rewards", value: "0.00", sub: "MOM" },
];

export const profileActionRows: ProfileActionRow[] = [
  {
    icon: "solar:user-id-bold",
    label: "Public profile",
    value: "mom3/u/ubayy",
    href: "#",
  },
  {
    icon: "solar:chart-2-bold",
    label: "AI rebalancing",
    value: "Ready",
    href: "/ai",
  },
  {
    icon: "solar:bell-bold",
    label: "Activity alerts",
    value: "Enabled",
    href: "#",
  },
];

export const profileSectionVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};
