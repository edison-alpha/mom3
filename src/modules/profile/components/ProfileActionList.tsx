"use client";

import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import Link from "next/link";

import { profileSectionVariants } from "@/modules/profile/constants/profile.constants";
import type { ProfileActionRow } from "@/modules/profile/types/profile.types";

type ProfileActionListProps = {
  rows: ProfileActionRow[];
};

export function ProfileActionList({ rows }: ProfileActionListProps) {
  return (
    <motion.section
      variants={profileSectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="mt-4 overflow-hidden rounded-[28px] bg-[#1C1C1E]"
    >
      {rows.map((row, index) => (
        <motion.div
          key={row.label}
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.2 + index * 0.06 }}
        >
          <Link
            href={row.href}
            className={`flex min-h-[64px] items-center gap-3 px-4 py-3 transition-colors hover:bg-white/[0.04] focus-visible:ring-2 focus-visible:ring-[#3B33BD] ${
              index < rows.length - 1 ? "border-b border-white/5" : ""
            }`}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#3B33BD]/20 text-[#8F89FF]">
              <Icon icon={row.icon} aria-hidden="true" width={20} height={20} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-bold text-white">
                {row.label}
              </span>
              <span className="mt-0.5 block truncate text-xs font-medium text-[#9A9AA2]">
                {row.value}
              </span>
            </span>
            <Icon
              icon="lucide:chevron-right"
              aria-hidden="true"
              width={20}
              height={20}
              className="text-[#66666D]"
            />
          </Link>
        </motion.div>
      ))}
    </motion.section>
  );
}
