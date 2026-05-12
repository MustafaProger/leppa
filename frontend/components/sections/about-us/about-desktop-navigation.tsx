import { AnimatePresence, motion } from "framer-motion";

import type { AboutSubsection } from "./types";
import { AboutSlideDots } from "./about-slide-dots";

type AboutDesktopNavigationProps = {
  activeIndex: number;
  isVisible: boolean;
  subsections: AboutSubsection[];
  onSelect: (index: number) => void;
};

export function AboutDesktopNavigation({
  activeIndex,
  isVisible,
  subsections,
  onSelect,
}: AboutDesktopNavigationProps) {
  return (
    <AnimatePresence>
      {isVisible ? (
        <motion.nav
          aria-label="About section slides"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="absolute bottom-6 left-1/2 z-20 hidden -translate-x-1/2 items-center gap-2 rounded-full border border-zinc-950/10 bg-white/85 p-3 shadow-[0_18px_60px_rgba(0,0,0,0.08)] backdrop-blur md:bottom-auto md:left-auto md:right-8 md:top-1/2 md:flex md:-translate-y-1/2 md:translate-x-0 md:flex-col"
        >
          <AboutSlideDots
            activeIndex={activeIndex}
            subsections={subsections}
            onSelect={onSelect}
          />
        </motion.nav>
      ) : null}
    </AnimatePresence>
  );
}
