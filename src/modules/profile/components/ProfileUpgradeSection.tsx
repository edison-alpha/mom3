"use client";

import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

import { profileSectionVariants } from "@/modules/profile/constants/profile.constants";

type ProfileUpgradeSectionProps = {
  copiedAddress: string | null;
  errorMessage: string | null;
  isDelegated: boolean;
  isPending: boolean;
  isUpgradeDisabled: boolean;
  onUpgrade: () => void;
};

export function ProfileUpgradeSection({
  copiedAddress,
  errorMessage,
  isDelegated,
  isPending,
  isUpgradeDisabled,
  onUpgrade,
}: ProfileUpgradeSectionProps) {
  if (isDelegated) return null;

  return (
    <motion.section
      variants={profileSectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: 0.06 }}
      className="mt-4 space-y-3"
    >
      <button
        type="button"
        onClick={onUpgrade}
        disabled={isUpgradeDisabled}
        aria-busy={isPending}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#ccff00] text-base font-black text-[#3B33BD] transition-transform active:scale-95 focus-visible:ring-2 focus-visible:ring-[#ccff00]/70 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Icon
          icon={isPending ? "lucide:loader-circle" : "solar:shield-check-bold"}
          aria-hidden="true"
          width={20}
          height={20}
          className={isPending ? "animate-spin" : ""}
        />
        {isDelegated ? "EOA upgraded" : "Upgrade EOA with 7702"}
      </button>

      {errorMessage ? (
        <p
          role="alert"
          className="rounded-2xl bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-100"
        >
          {errorMessage}
        </p>
      ) : null}

      {copiedAddress ? (
        <p className="text-center text-xs font-bold text-[#ccff00]">
          {copiedAddress} copied
        </p>
      ) : null}
    </motion.section>
  );
}
