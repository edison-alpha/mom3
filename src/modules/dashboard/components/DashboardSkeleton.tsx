import {
  Skeleton,
  SkeletonCircle,
  SkeletonListRow,
  SkeletonPageHeader,
  SkeletonText,
} from "@/components/ui/skeleton";
import { FloatingMenuButton } from "@/components/ui/menu-button";
import { MobileShell } from "@/components/ui/mobile-shell";

export function DashboardSkeleton() {
  return (
    <MobileShell bottomSlot={<FloatingMenuButton activeHref="/dashboard" />}>
      <SkeletonPageHeader hasAction />

      <section className="mt-4 rounded-[28px] bg-[#111217] p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <SkeletonText className="h-3 w-20" />
            <SkeletonText className="h-8 w-40" />
            <SkeletonText className="h-3 w-28" />
          </div>
          <SkeletonCircle className="h-10 w-10" />
        </div>
        <Skeleton className="mt-5 h-32 rounded-[24px]" />
      </section>

      <section className="mt-4 rounded-[24px] bg-[#1C1C1E] p-3">
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-10 rounded-full" />
          ))}
        </div>
      </section>

      <section className="mt-4 grid grid-cols-2 gap-2.5">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-[22px] bg-[#1C1C1E] p-3.5">
            <div className="flex items-center gap-2">
              <SkeletonCircle className="h-9 w-9" />
              <SkeletonText className="h-4 w-20" />
            </div>
            <SkeletonText className="mt-4 h-4 w-24" />
            <SkeletonText className="mt-2 h-3 w-16" />
          </div>
        ))}
      </section>

      <section className="mt-4 overflow-hidden rounded-[28px] bg-[#1C1C1E]">
        {Array.from({ length: 3 }).map((_, index) => (
          <SkeletonListRow key={index} />
        ))}
      </section>
    </MobileShell>
  );
}
