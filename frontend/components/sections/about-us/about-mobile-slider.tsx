import type { Ref } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

import type { AboutSubsection } from "./types";
import { AboutSlideDots } from "./about-slide-dots";
import { AboutSlideIndicator } from "./about-slide-indicator";
import { AboutSubsectionContent } from "./about-subsection-content";

type AboutMobileSliderProps = {
  activeIndex: number;
  activeSubsection: AboutSubsection;
  direction: number;
  prefersReducedMotion: boolean;
  slideCount: number;
  subsections: AboutSubsection[];
  slideStartRef: Ref<HTMLDivElement>;
  onSelect: (index: number) => void;
  onPrevious: () => void;
  onNext: () => void;
};

export function AboutMobileSlider({
  activeIndex,
  activeSubsection,
  direction,
  prefersReducedMotion,
  slideCount,
  subsections,
  slideStartRef,
  onSelect,
  onPrevious,
  onNext,
}: AboutMobileSliderProps) {
  return (
    <div className="mx-auto w-full max-w-5xl py-2 md:hidden">
      <div ref={slideStartRef} className="scroll-mt-5">
        <AboutSlideIndicator
          activeIndex={activeIndex}
          slideCount={slideCount}
          prefersReducedMotion={prefersReducedMotion}
        />
      </div>

      <AnimatePresence mode="wait" custom={direction}>
        <motion.article
          key={activeSubsection.id}
          custom={direction}
          variants={{
            enter: (slideDirection: number) => ({
              opacity: 0,
              y: slideDirection > 0 ? 24 : -24,
            }),
            center: {
              opacity: 1,
              y: 0,
            },
            exit: (slideDirection: number) => ({
              opacity: 0,
              y: slideDirection > 0 ? -20 : 20,
            }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            duration: prefersReducedMotion ? 0 : 0.36,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <AboutSubsectionContent subsection={activeSubsection} />
        </motion.article>
      </AnimatePresence>

      <nav
        aria-label="About section slides"
        className="mx-auto mt-8 flex w-fit items-center gap-3 rounded-full border border-zinc-950/10 bg-white/90 p-2.5 shadow-[0_18px_60px_rgba(0,0,0,0.08)] backdrop-blur"
      >
        <button
          type="button"
          aria-label="Show previous about slide"
          onClick={onPrevious}
          className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-950 transition-colors duration-200 hover:bg-zinc-950/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2"
        >
          <ChevronLeft aria-hidden="true" className="h-4 w-4" />
        </button>

        <AboutSlideDots
          activeIndex={activeIndex}
          subsections={subsections}
          onSelect={onSelect}
        />

        <button
          type="button"
          aria-label="Show next about slide"
          onClick={onNext}
          className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-950 transition-colors duration-200 hover:bg-zinc-950/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2"
        >
          <ChevronRight aria-hidden="true" className="h-4 w-4" />
        </button>
      </nav>
    </div>
  );
}
