"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

import { AboutDesktopSlider } from "./about-desktop-slider";
import { aboutSubsections } from "./data";
const ABOUT_TITLE_ID = "about-title";

const clampIndex = (value: number, maxIndex: number) => {
  return Math.min(Math.max(value, 0), Math.max(maxIndex, 0));
};

export function AboutUsSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const activeIndexRef = useRef(0);
  const mobileSlideScrollFrameRef = useRef<number | null>(null);

  const prefersReducedMotion = Boolean(useReducedMotion());

  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const slideCount = aboutSubsections.length;
  const activeSubsection = aboutSubsections[activeIndex];

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  const selectDesktopSlide = useCallback(
    (nextIndex: number) => {
      const safeIndex = clampIndex(nextIndex, slideCount - 1);
      const currentIndex = activeIndexRef.current;

      if (safeIndex === currentIndex) {
        return;
      }

      setDirection(safeIndex > currentIndex ? 1 : -1);
      activeIndexRef.current = safeIndex;
      setActiveIndex(safeIndex);
    },
    [slideCount],
  );

  const navigateDesktopSlide = useCallback(
    (step: 1 | -1) => {
      const currentIndex = activeIndexRef.current;
      const nextIndex =
        (currentIndex + step + slideCount) % Math.max(slideCount, 1);

      setDirection(step);
      activeIndexRef.current = nextIndex;
      setActiveIndex(nextIndex);
    },
    [slideCount],
  );

  useEffect(() => {
    return () => {
      if (
        typeof window !== "undefined" &&
        mobileSlideScrollFrameRef.current !== null
      ) {
        window.cancelAnimationFrame(mobileSlideScrollFrameRef.current);
      }
    };
  }, []);

  if (!activeSubsection) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      id="about"
      aria-labelledby={ABOUT_TITLE_ID}
      className="relative bg-white text-zinc-950"
    >
      <div className="relative border-y border-zinc-950/10 bg-white px-5 py-8 sm:px-8 sm:py-10 md:flex md:min-h-[calc(100vh-200px)] md:items-center md:overflow-hidden lg:px-14">

        <AboutDesktopSlider
          activeIndex={activeIndex}
          activeSubsection={activeSubsection}
          direction={direction}
          prefersReducedMotion={prefersReducedMotion}
          slideCount={slideCount}
          subsections={aboutSubsections}
          titleId={ABOUT_TITLE_ID}
          onSelect={selectDesktopSlide}
          onPrevious={() => navigateDesktopSlide(-1)}
          onNext={() => navigateDesktopSlide(1)}
        />
      </div>
    </section>
  );
}
