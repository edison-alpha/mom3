"use client";

import { motion, useReducedMotion } from "framer-motion";

import type { RecommendationItem } from "../types/ai.types";
import { RecommendationCard } from "./RecommendationCard";

type RecommendationListProps = {
  items: RecommendationItem[];
  onSelect: (value: string) => void;
};

export function RecommendationList({ items, onSelect }: RecommendationListProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.section
      initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="mt-5 space-y-3"
    >
      {items.map((item, index) => (
        <motion.div
          key={item.title}
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ delay: index * 0.08, duration: 0.2, ease: "easeOut" }}
        >
          <RecommendationCard item={item} onSelect={() => onSelect(item.title)} />
        </motion.div>
      ))}
    </motion.section>
  );
}
