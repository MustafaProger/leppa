import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

import type { AboutSubsection } from "./types";

type AboutSlideDotsProps = {
  activeIndex: number;
  subsections: AboutSubsection[];
  onSelect: (index: number) => void;
};

export function AboutSlideDots({
  activeIndex,
  subsections,
  onSelect,
}: AboutSlideDotsProps) {
  return (
    <>
      {subsections.map((subsection, index) => {
        const isActive = index === activeIndex;

        return (
          <button
            key={subsection.id}
            type="button"
            aria-label={`Show about slide ${index + 1}`}
            aria-current={isActive ? "step" : undefined}
            onClick={() => onSelect(index)}
            className="group flex h-auto w-auto items-center justify-center rounded-full py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 md:h-auto md:w-auto"
          >
            <motion.span
              layout
              transition={{
                type: "spring",
                stiffness: 420,
                damping: 32,
              }}
              className={cn(
                "block rounded-full transition-colors duration-300",
                isActive
                  ? "h-2 w-8 bg-zinc-950 md:h-8 md:w-2"
                  : "h-2 w-2 bg-zinc-950/25 group-hover:bg-zinc-950/45",
              )}
            />
          </button>
        );
      })}
    </>
  );
}
