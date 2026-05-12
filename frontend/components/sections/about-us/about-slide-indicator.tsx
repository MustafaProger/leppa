import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils";

type AboutSlideIndicatorProps = {
  activeIndex: number;
  slideCount: number;
  prefersReducedMotion: boolean;
  align?: "start" | "center" | "end";
  className?: string;
  hasBottomMargin?: boolean;
};

const getAlignmentClass = (
  align: NonNullable<AboutSlideIndicatorProps["align"]>,
) => {
  if (align === "center") {
    return "justify-center";
  }

  return align === "start" ? "justify-start" : "justify-end";
};

export function AboutSlideIndicator({
  activeIndex,
  slideCount,
  prefersReducedMotion,
  align = "end",
  className,
  hasBottomMargin = true,
}: AboutSlideIndicatorProps) {
  const currentSlide = String(activeIndex + 1).padStart(2, "0");
  const totalSlides = String(slideCount).padStart(2, "0");

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className={cn(
        hasBottomMargin && "mb-5",
        "flex leading-none",
        getAlignmentClass(align),
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="flex md:flex-col flex-nowrap items-center whitespace-nowrap rounded-full border border-zinc-950/10 bg-white/90 text-zinc-950 shadow-[0_14px_40px_rgba(0,0,0,0.08)] backdrop-blur px-4 md:py-3 py-2.5"
      >
        <span className="relative inline-flex justify-end overflow-hidden tabular-nums text-base font-semibold tracking-[-0.04em] sm:text-lg">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={currentSlide}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.22,
                ease: "easeOut",
              }}
            >
              {currentSlide}
            </motion.span>
          </AnimatePresence>
        </span>
        <span className="hidden md:inline text-base font-medium text-zinc-950/45">
          —
        </span>

        <span className="md:hidden text-base font-medium text-zinc-950/45 px-2">
          /
        </span>
        <span className="tabular-nums text-base font-semibold tracking-[-0.04em] text-zinc-950/55 sm:text-lg">
          {totalSlides}
        </span>
      </span>
    </div>
  );
}
