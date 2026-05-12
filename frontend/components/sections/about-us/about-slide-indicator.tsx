import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils";

type AboutSlideIndicatorProps = {
  activeIndex: number;
  slideCount: number;
  prefersReducedMotion: boolean;
  className?: string;
};

export function AboutSlideIndicator({
  activeIndex,
  slideCount,
  prefersReducedMotion,
  className,
}: AboutSlideIndicatorProps) {
  const visualLabel = `${activeIndex + 1}/${slideCount}`;

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className={cn(
        "mb-5 flex justify-end text-[11px] font-medium leading-none tracking-[0.22em] text-zinc-500 sm:text-xs",
        className,
      )}
    >
      <span className="sr-only">
        {`Slide ${activeIndex + 1} of ${slideCount}`}
      </span>
      <span
        aria-hidden="true"
        className="relative inline-flex min-w-9 justify-end overflow-hidden py-1 tabular-nums"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={visualLabel}
            initial={{ opacity: 0, y: 7 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -7 }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.2,
              ease: "easeOut",
            }}
          >
            {visualLabel}
          </motion.span>
        </AnimatePresence>
      </span>
    </div>
  );
}
