"use client";

import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

import { profileSectionVariants } from "@/modules/profile/constants/profile.constants";
import type { ProfileIdentityRow } from "@/modules/profile/types/profile.types";
import { UniversalAccountOwnerRow } from "@/modules/profile/components/UniversalAccountSheet";

type ProfileIdentityListProps = {
  rows: ProfileIdentityRow[];
  onOpenUniversalAccount: () => void;
};

export function ProfileIdentityList({
  rows,
  onOpenUniversalAccount,
}: ProfileIdentityListProps) {
  return (
    <motion.section
      variants={profileSectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: 0.15 }}
      className="mt-4 overflow-hidden rounded-[28px] bg-[#1C1C1E]"
    >
      {rows.map((row, index) => {
        const isOwnerEoa = row.label === "Owner EOA";
        const bordered = index < rows.length - 1;

        return (
          <motion.div
            key={row.label}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.15 + index * 0.06 }}
          >
            {isOwnerEoa ? (
              <UniversalAccountOwnerRow
                icon={row.icon}
                label={row.label}
                value={row.value}
                bordered={bordered}
                onOpen={onOpenUniversalAccount}
              />
            ) : (
              <div
                className={`flex min-h-[64px] w-full items-center gap-3 px-4 py-3 text-left ${
                  bordered ? "border-b border-white/5" : ""
                }`}
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2A2A3E] text-white">
                  <Icon icon={row.icon} aria-hidden="true" width={20} height={20} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold text-white">
                    {row.label}
                  </span>
                  <span className="mt-0.5 block text-xs font-medium text-[#9A9AA2]">
                    {row.value}
                  </span>
                </span>
              </div>
            )}
          </motion.div>
        );
      })}
    </motion.section>
  );
}
