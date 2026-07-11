"use client";

import { AppIcon } from "@/components/ui/app-icon";
import { motion } from "framer-motion";

import { profileSectionVariants } from "@/modules/profile/constants/profile.constants";

type ProfileLogoutButtonProps = {
  onLogout: () => void;
};

export function ProfileLogoutButton({ onLogout }: ProfileLogoutButtonProps) {
  return (
    <motion.section
      variants={profileSectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: 0.25 }}
      className="mt-4 space-y-3"
    >
      <button
        type="button"
        onClick={onLogout}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-[#1C1C1E] text-base font-bold text-white transition-colors hover:bg-[#262628] focus-visible:ring-2 focus-visible:ring-[#3B33BD]"
      >
        <AppIcon icon="lucide:log-out" aria-hidden="true" width={20} height={20} />
        Log out
      </button>
    </motion.section>
  );
}
