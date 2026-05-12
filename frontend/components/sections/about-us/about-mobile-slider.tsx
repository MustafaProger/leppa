import type { Ref } from "react";
import { AnimatePresence, motion } from "framer-motion";

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
        className="mx-auto mt-8 flex w-fit items-center gap-2 rounded-full border border-zinc-950/10 bg-white/90 p-3 shadow-[0_18px_60px_rgba(0,0,0,0.08)] backdrop-blur"
      >
        <AboutSlideDots
          activeIndex={activeIndex}
          subsections={subsections}
          onSelect={onSelect}
        />
      </nav>
    </div>
  );
}
