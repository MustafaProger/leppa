"use client";

import {
  type CSSProperties,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";

import contentBlocks from "@/data/contentBlocks.json";
import { cn } from "@/lib/utils";

type ContentBlock = {
  id: string;
  title: string;
  body: string;
  seo_keywords?: string[];
  order: number;
};

type ScrollOptions = {
  immediate?: boolean;
};

const slides = [...(contentBlocks as ContentBlock[])]
  .sort((a, b) => a.order - b.order)
  .slice(0, 4);

const DESKTOP_MEDIA_QUERY = "(min-width: 768px)";
const SLIDE_SCROLL_TOP_OFFSET = 50;

const clampIndex = (value: number, maxIndex: number) => {
  return Math.min(Math.max(value, 0), Math.max(maxIndex, 0));
};

const isDesktopViewport = () => {
  return (
    typeof window !== "undefined" &&
    window.matchMedia(DESKTOP_MEDIA_QUERY).matches
  );
};

type SlideContentProps = {
  slide: ContentBlock;
  titleId?: string;
};

function SlideContent({ slide, titleId }: SlideContentProps) {
  return (
    <>
      <h2
        id={titleId}
        className="max-w-4xl text-2xl font-semibold leading-[0.98] tracking-[-0.055em] text-zinc-950 sm:text-3xl lg:text-5xl"
      >
        {slide.title}
      </h2>

      <p className="mt-6 max-w-3xl text-sm text-zinc-700 sm:mt-7 sm:text-base lg:text-lg">
        {slide.body}
      </p>

      {slide.seo_keywords?.length ? (
        <div className="mt-7 flex max-w-3xl flex-wrap gap-2 sm:mt-8">
          {slide.seo_keywords.map((keyword) => (
            <span
              key={`${slide.id}-${keyword}`}
              className="rounded-full border border-zinc-950/15 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-700 sm:text-xs sm:tracking-[0.18em]"
            >
              {keyword}
            </span>
          ))}
        </div>
      ) : null}
    </>
  );
}

type SlideDotsProps = {
  activeIndex: number;
  onSelect: (index: number) => void;
};

function SlideDots({ activeIndex, onSelect }: SlideDotsProps) {
  return (
    <>
      {slides.map((slide, index) => {
        const isActive = index === activeIndex;

        return (
          <button
            key={slide.id}
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

type SlideIndicatorProps = {
  activeIndex: number;
  slideCount: number;
  prefersReducedMotion: boolean;
  className?: string;
};

function SlideIndicator({
  activeIndex,
  slideCount,
  prefersReducedMotion,
  className,
}: SlideIndicatorProps) {
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

  const slideCount = slides.length;
  const activeSlide = slides[activeIndex];

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

  if (!activeSlide) {
    return null;
  }

  const sectionStyle = {
    "--about-section-height": `${slideCount * 100}vh`,
  } as CSSProperties;

  return (
    <section
      ref={sectionRef}
      id="about"
      aria-labelledby="about-title"
      className="relative bg-white text-zinc-950 md:min-h-(--about-section-height)"
      style={sectionStyle}
    >
      <div
        ref={stickyPanelRef}
        className="relative border-y border-zinc-950/10 bg-white px-5 py-8 sm:px-8 sm:py-10 md:sticky md:top-0 md:flex md:h-screen md:min-h-160 md:items-center md:overflow-hidden lg:px-14"
      >
        <div className="mx-auto w-full max-w-5xl py-2 md:hidden">
          <div ref={mobileSlideStartRef} className="scroll-mt-5">
            <SlideIndicator
              activeIndex={activeIndex}
              slideCount={slideCount}
              prefersReducedMotion={prefersReducedMotion}
            />
          </div>

          <AnimatePresence mode="wait" custom={direction}>
            <motion.article
              key={activeSlide.id}
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
              <SlideContent slide={activeSlide} />
            </motion.article>
          </AnimatePresence>

          <nav
            aria-label="About section slides"
            className="mx-auto mt-8 flex w-fit items-center gap-2 rounded-full border border-zinc-950/10 bg-white/90 p-3 shadow-[0_18px_60px_rgba(0,0,0,0.08)] backdrop-blur"
          >
            <SlideDots activeIndex={activeIndex} onSelect={selectMobileSlide} />
          </nav>
        </div>

        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 28 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto hidden w-full max-w-5xl md:block"
        >
          <div ref={desktopSlideStartRef} className="scroll-mt-6">
            <SlideIndicator
              activeIndex={activeIndex}
              slideCount={slideCount}
              prefersReducedMotion={prefersReducedMotion}
              className="mb-8 text-xs"
            />
          </div>

          <div className="relative min-h-105 md:min-h-130">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.article
                key={activeSlide.id}
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
                <SlideContent slide={activeSlide} titleId="about-title" />
              </motion.article>
            </AnimatePresence>
          </div>
        </motion.div>

        <AnimatePresence>
          {areDotsVisible ? (
            <motion.nav
              aria-label="About section slides"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="absolute bottom-6 left-1/2 z-20 hidden -translate-x-1/2 items-center gap-2 rounded-full border border-zinc-950/10 bg-white/85 p-3 shadow-[0_18px_60px_rgba(0,0,0,0.08)] backdrop-blur md:bottom-auto md:left-auto md:right-8 md:top-1/2 md:flex md:-translate-y-1/2 md:translate-x-0 md:flex-col"
            >
              <SlideDots activeIndex={activeIndex} onSelect={scrollToSlide} />
            </motion.nav>
          ) : null}
        </AnimatePresence>
      </div>
    </section>
  );
}
