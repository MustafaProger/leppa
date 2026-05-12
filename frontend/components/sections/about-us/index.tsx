"use client";

import {
  type CSSProperties,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useInView, useReducedMotion } from "framer-motion";

import { AboutDesktopNavigation } from "./about-desktop-navigation";
import { AboutDesktopSlider } from "./about-desktop-slider";
import { AboutMobileSlider } from "./about-mobile-slider";
import { aboutSubsections } from "./data";
import type { ScrollOptions } from "./types";

const DESKTOP_MEDIA_QUERY = "(min-width: 768px)";
const SLIDE_SCROLL_TOP_OFFSET = 50;
const ABOUT_TITLE_ID = "about-title";

const clampIndex = (value: number, maxIndex: number) => {
  return Math.min(Math.max(value, 0), Math.max(maxIndex, 0));
};

const isDesktopViewport = () => {
  return (
    typeof window !== "undefined" &&
    window.matchMedia(DESKTOP_MEDIA_QUERY).matches
  );
};

export function AboutUsSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stickyPanelRef = useRef<HTMLDivElement | null>(null);
  const activeIndexRef = useRef(0);
  const scrollLockRef = useRef(false);
  const lockTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const programmaticScrollUntilRef = useRef(0);
  const mobileSlideStartRef = useRef<HTMLDivElement | null>(null);
  const desktopSlideStartRef = useRef<HTMLDivElement | null>(null);
  const mobileSlideScrollFrameRef = useRef<number | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const touchHandledRef = useRef(false);

  const prefersReducedMotion = Boolean(useReducedMotion());
  const areDotsVisible = useInView(stickyPanelRef, { amount: 0.18 });

  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const slideCount = aboutSubsections.length;
  const activeSubsection = aboutSubsections[activeIndex];

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  const isSectionPinned = useCallback(() => {
    const section = sectionRef.current;

    if (!section || typeof window === "undefined") {
      return false;
    }

    const rect = section.getBoundingClientRect();
    const viewportHeight = window.innerHeight || 1;

    return rect.top <= 1 && rect.bottom >= viewportHeight - 1;
  }, []);

  const lockNavigation = useCallback((duration = 600) => {
    scrollLockRef.current = true;

    if (lockTimeoutRef.current) {
      clearTimeout(lockTimeoutRef.current);
    }

    lockTimeoutRef.current = setTimeout(() => {
      scrollLockRef.current = false;
    }, duration);
  }, []);

  const getDesktopSlideScrollTop = useCallback(
    (slideIndex: number) => {
      const section = sectionRef.current;

      if (!section || typeof window === "undefined") {
        return null;
      }

      const viewportHeight = window.innerHeight || 1;
      const sectionScrollDistance = Math.max(
        section.offsetHeight - viewportHeight,
        0,
      );
      const slideProgress =
        slideCount <= 1 ? 0 : slideIndex / Math.max(slideCount - 1, 1);

      return section.offsetTop + sectionScrollDistance * slideProgress;
    },
    [slideCount],
  );

  const scrollMobileSlideStartIntoView = useCallback(
    (behavior: ScrollBehavior = prefersReducedMotion ? "auto" : "smooth") => {
      const target = mobileSlideStartRef.current ?? sectionRef.current;

      if (!target || typeof window === "undefined") {
        return;
      }

      const targetScrollTop =
        target.getBoundingClientRect().top +
        window.scrollY -
        SLIDE_SCROLL_TOP_OFFSET;

      window.scrollTo({
        top: Math.max(targetScrollTop, 0),
        behavior,
      });
    },
    [prefersReducedMotion],
  );

  const queueMobileSlideStartScroll = useCallback(
    (behavior: ScrollBehavior = prefersReducedMotion ? "auto" : "smooth") => {
      if (typeof window === "undefined") {
        return;
      }

      if (mobileSlideScrollFrameRef.current !== null) {
        window.cancelAnimationFrame(mobileSlideScrollFrameRef.current);
      }

      mobileSlideScrollFrameRef.current = window.requestAnimationFrame(() => {
        mobileSlideScrollFrameRef.current = null;
        scrollMobileSlideStartIntoView(behavior);
      });
    },
    [prefersReducedMotion, scrollMobileSlideStartIntoView],
  );

  const scrollToSlide = useCallback(
    (nextIndex: number, options: ScrollOptions = {}) => {
      const section = sectionRef.current;
      const safeIndex = clampIndex(nextIndex, slideCount - 1);
      const currentIndex = activeIndexRef.current;
      const targetScrollTop = getDesktopSlideScrollTop(safeIndex);

      if (
        !section ||
        targetScrollTop === null ||
        typeof window === "undefined"
      ) {
        return;
      }

      const immediate = Boolean(options.immediate || prefersReducedMotion);

      if (safeIndex !== currentIndex) {
        setDirection(safeIndex > currentIndex ? 1 : -1);
        activeIndexRef.current = safeIndex;
        setActiveIndex(safeIndex);
      }

      programmaticScrollUntilRef.current =
        performance.now() + (immediate ? 160 : 760);

      window.scrollTo({
        top: Math.max(targetScrollTop - SLIDE_SCROLL_TOP_OFFSET, 0),
        behavior: immediate ? "auto" : "smooth",
      });
    },
    [getDesktopSlideScrollTop, prefersReducedMotion, slideCount],
  );

  const selectMobileSlide = useCallback(
    (nextIndex: number) => {
      const safeIndex = clampIndex(nextIndex, slideCount - 1);
      const currentIndex = activeIndexRef.current;

      const behavior: ScrollBehavior = prefersReducedMotion ? "auto" : "smooth";

      if (safeIndex === currentIndex) {
        scrollMobileSlideStartIntoView(behavior);
        return;
      }

      setDirection(safeIndex > currentIndex ? 1 : -1);
      activeIndexRef.current = safeIndex;
      setActiveIndex(safeIndex);
      queueMobileSlideStartScroll(behavior);
    },
    [
      prefersReducedMotion,
      queueMobileSlideStartScroll,
      scrollMobileSlideStartIntoView,
      slideCount,
    ],
  );

  const navigateMobileSlide = useCallback(
    (step: 1 | -1) => {
      const currentIndex = activeIndexRef.current;
      const nextIndex =
        (currentIndex + step + slideCount) % Math.max(slideCount, 1);
      const behavior: ScrollBehavior = prefersReducedMotion ? "auto" : "smooth";

      setDirection(step);
      activeIndexRef.current = nextIndex;
      setActiveIndex(nextIndex);
      queueMobileSlideStartScroll(behavior);
    },
    [prefersReducedMotion, queueMobileSlideStartScroll, slideCount],
  );

  useEffect(() => {
    if (slideCount <= 1) {
      return;
    }

    const syncActiveSlideWithScroll = () => {
      const section = sectionRef.current;

      if (
        !isDesktopViewport() ||
        !section ||
        performance.now() < programmaticScrollUntilRef.current
      ) {
        return;
      }

      const viewportHeight = window.innerHeight || 1;
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight - viewportHeight;
      const scrollPosition = window.scrollY;

      if (scrollPosition < sectionTop || scrollPosition > sectionBottom) {
        return;
      }

      const sectionScrollDistance = Math.max(
        section.offsetHeight - viewportHeight,
        1,
      );
      const slideProgress =
        (scrollPosition - sectionTop) / sectionScrollDistance;
      const nextIndex = clampIndex(
        Math.round(slideProgress * Math.max(slideCount - 1, 0)),
        slideCount - 1,
      );
      const currentIndex = activeIndexRef.current;

      if (nextIndex === currentIndex) {
        return;
      }

      setDirection(nextIndex > currentIndex ? 1 : -1);
      activeIndexRef.current = nextIndex;
      setActiveIndex(nextIndex);
    };

    syncActiveSlideWithScroll();
    window.addEventListener("scroll", syncActiveSlideWithScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", syncActiveSlideWithScroll);
    };
  }, [slideCount]);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section || slideCount <= 1) {
      return;
    }

    const navigateByStep = (step: 1 | -1, immediate: boolean) => {
      const currentIndex = activeIndexRef.current;
      const nextIndex = currentIndex + step;

      if (nextIndex < 0 || nextIndex >= slideCount) {
        return false;
      }

      if (scrollLockRef.current) {
        return true;
      }

      lockNavigation(prefersReducedMotion ? 180 : 620);
      scrollToSlide(nextIndex, { immediate });

      return true;
    };

    const handleWheel = (event: WheelEvent) => {
      if (
        !isDesktopViewport() ||
        !isSectionPinned() ||
        Math.abs(event.deltaY) < 8
      ) {
        return;
      }

      const step = event.deltaY > 0 ? 1 : -1;
      const handled = navigateByStep(
        step,
        Math.abs(event.deltaY) > 82 || prefersReducedMotion,
      );

      if (handled) {
        event.preventDefault();
      }
    };

    const handleTouchStart = (event: TouchEvent) => {
      if (!isDesktopViewport() || event.touches.length !== 1) {
        return;
      }

      const touch = event.touches[0];
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
      };
      touchHandledRef.current = false;
    };

    const handleTouchMove = (event: TouchEvent) => {
      const start = touchStartRef.current;
      const touch = event.touches[0];

      if (
        !isDesktopViewport() ||
        !start ||
        !touch ||
        touchHandledRef.current ||
        !isSectionPinned()
      ) {
        return;
      }

      const deltaY = start.y - touch.clientY;
      const deltaX = start.x - touch.clientX;

      if (Math.abs(deltaY) < 36 || Math.abs(deltaY) < Math.abs(deltaX)) {
        return;
      }

      const step = deltaY > 0 ? 1 : -1;
      const handled = navigateByStep(
        step,
        Math.abs(deltaY) > 96 || prefersReducedMotion,
      );

      if (handled) {
        event.preventDefault();
        touchHandledRef.current = true;
      }
    };

    const resetTouch = () => {
      touchStartRef.current = null;
      touchHandledRef.current = false;
    };

    section.addEventListener("wheel", handleWheel, { passive: false });
    section.addEventListener("touchstart", handleTouchStart, { passive: true });
    section.addEventListener("touchmove", handleTouchMove, { passive: false });
    section.addEventListener("touchend", resetTouch, { passive: true });
    section.addEventListener("touchcancel", resetTouch, { passive: true });

    return () => {
      section.removeEventListener("wheel", handleWheel);
      section.removeEventListener("touchstart", handleTouchStart);
      section.removeEventListener("touchmove", handleTouchMove);
      section.removeEventListener("touchend", resetTouch);
      section.removeEventListener("touchcancel", resetTouch);
    };
  }, [
    isSectionPinned,
    lockNavigation,
    prefersReducedMotion,
    scrollToSlide,
    slideCount,
  ]);

  useEffect(() => {
    return () => {
      if (lockTimeoutRef.current) {
        clearTimeout(lockTimeoutRef.current);
      }

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

  const sectionStyle = {
    "--about-section-height": `${slideCount * 100}vh`,
  } as CSSProperties;

  return (
    <section
      ref={sectionRef}
      id="about"
      aria-labelledby={ABOUT_TITLE_ID}
      className="relative bg-white text-zinc-950 md:min-h-(--about-section-height)"
      style={sectionStyle}
    >
      <div
        ref={stickyPanelRef}
        className="relative border-y border-zinc-950/10 bg-white px-5 py-8 sm:px-8 sm:py-10 md:sticky md:top-0 md:flex md:h-screen md:min-h-160 md:items-center md:overflow-hidden lg:px-14"
      >
        <AboutMobileSlider
          activeIndex={activeIndex}
          activeSubsection={activeSubsection}
          direction={direction}
          prefersReducedMotion={prefersReducedMotion}
          slideCount={slideCount}
          subsections={aboutSubsections}
          slideStartRef={mobileSlideStartRef}
          onSelect={selectMobileSlide}
          onPrevious={() => navigateMobileSlide(-1)}
          onNext={() => navigateMobileSlide(1)}
        />

        <AboutDesktopSlider
          activeIndex={activeIndex}
          activeSubsection={activeSubsection}
          direction={direction}
          prefersReducedMotion={prefersReducedMotion}
          slideCount={slideCount}
          slideStartRef={desktopSlideStartRef}
          titleId={ABOUT_TITLE_ID}
        />

        <AboutDesktopNavigation
          activeIndex={activeIndex}
          isVisible={areDotsVisible}
          subsections={aboutSubsections}
          onSelect={scrollToSlide}
        />
      </div>
    </section>
  );
}
