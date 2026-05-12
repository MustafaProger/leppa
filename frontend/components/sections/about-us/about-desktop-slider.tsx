import type { Ref } from "react";
import { AnimatePresence, motion } from "framer-motion";

import type { AboutSubsection } from "./types";
import { AboutSlideIndicator } from "./about-slide-indicator";
import { AboutSubsectionContent } from "./about-subsection-content";

type AboutDesktopSliderProps = {
  activeIndex: number;
  activeSubsection: AboutSubsection;
  direction: number;
  prefersReducedMotion: boolean;
  slideCount: number;
  slideStartRef: Ref<HTMLDivElement>;
  titleId: string;
};

export function AboutDesktopSlider({
  activeIndex,
  activeSubsection,
  direction,
  prefersReducedMotion,
  slideCount,
  slideStartRef,
  titleId,
}: AboutDesktopSliderProps) {
  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 28 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto hidden w-full max-w-5xl md:block"
    >
      <div ref={slideStartRef} className="scroll-mt-6">
        <AboutSlideIndicator
          activeIndex={activeIndex}
          slideCount={slideCount}
          prefersReducedMotion={prefersReducedMotion}
          className="mb-8 text-xs"
        />
      </div>

      <div className="relative min-h-105 md:min-h-130">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.article
            key={activeSubsection.id}
            custom={direction}
            variants={{
              enter: (slideDirection: number) => ({
                opacity: 0,
                y: slideDirection > 0 ? 34 : -34,
              }),
              center: {
                opacity: 1,
                y: 0,
              },
              exit: (slideDirection: number) => ({
                opacity: 0,
                y: slideDirection > 0 ? -28 : 28,
              }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              duration: prefersReducedMotion ? 0 : 0.46,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute inset-0 flex flex-col justify-center"
          >
            <AboutSubsectionContent
              subsection={activeSubsection}
              titleId={titleId}
            />
          </motion.article>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
