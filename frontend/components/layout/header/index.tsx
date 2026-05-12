"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { ShoppingBag, SearchIcon, Heart, Menu, X } from "lucide-react";

import Link from "next/link";

import { NAV_ITEMS } from "./data";

const BODY_OVERLAY_CLASS = "overlay";
const DESKTOP_MEDIA_QUERY = "(min-width: 768px)";

const Header = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const activePage = pathname === "/" ? "" : pathname.replace("/", "");

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  const handleNavClick = () => {
    // Close menu immediately when navigating
    setIsOpen(false);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    document.body.classList.toggle(BODY_OVERLAY_CLASS, isOpen);

    return () => {
      document.body.classList.remove(BODY_OVERLAY_CLASS);
    };
  }, [isOpen]);

  useEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_MEDIA_QUERY);
    const handleDesktopChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setIsOpen(false);
      }
    };

    mediaQuery.addEventListener("change", handleDesktopChange);

    return () => {
      mediaQuery.removeEventListener("change", handleDesktopChange);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <header className="fixed top-4 left-1/2 z-50 w-full max-w-5xl -translate-x-1/2 px-4 isolate">
      <div className="grid w-full grid-cols-[minmax(0,auto)_minmax(0,1fr)] items-center gap-3 rounded-full border border-zinc-950/10 bg-zinc-100 px-5 py-2 shadow-header md:grid-cols-[minmax(0,auto)_minmax(0,1fr)_minmax(0,auto)] md:gap-4 md:px-6">
        {/* Logo on left */}
        <Link
          href="/"
          className="flex shrink-0 items-center text-lg font-bold text-zinc-950 transition-opacity hover:opacity-85"
          aria-label="LEPA&WANNISTON — на главную"
          onClick={handleNavClick}
        >
          L&W
        </Link>

        {/* Navigation in center - desktop only */}
        <nav className="hidden justify-center rounded-full border border-zinc-950/10 bg-zinc-200/80 p-1 shadow-control md:flex md:justify-self-center">
          {NAV_ITEMS.map((item) => {
            const isActive = activePage === item.href.replace("/", "");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-3 py-1 text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-zinc-950 text-white shadow-control"
                    : "text-zinc-700 hover:bg-zinc-950/10"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Icons on right */}
        <div className="flex items-center justify-end gap-2 md:gap-3">
          <button
            type="button"
            className="flex size-8 items-center justify-center rounded-full border border-zinc-950/10 bg-white text-zinc-700 shadow-control transition-all duration-300 hover:bg-zinc-950 hover:text-white"
          >
            <SearchIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="flex size-8 items-center justify-center rounded-full border border-zinc-950/10 bg-white text-zinc-700 shadow-control transition-all duration-300 hover:bg-zinc-950 hover:text-white"
          >
            <Heart className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="flex size-8 items-center justify-center rounded-full border border-zinc-950/10 bg-white text-zinc-700 shadow-control transition-all duration-300 hover:bg-zinc-950 hover:text-white"
          >
            <ShoppingBag className="h-4 w-4" />
          </button>
          {/* Mobile menu toggle */}
          <div className="relative md:hidden">
            <button
              type="button"
              className={`flex size-8 items-center justify-center rounded-full border border-zinc-950/10 shadow-control transition-all duration-300 ${
                isOpen
                  ? "bg-zinc-950 text-white"
                  : "bg-white text-zinc-700 hover:bg-zinc-950 hover:text-white"
              }`}
              aria-controls="mobile-navigation-menu"
              aria-expanded={isOpen}
              aria-label={isOpen ? "Закрыть меню" : "Открыть меню"}
              onClick={() => handleOpenChange(!isOpen)}
            >
              {isOpen ? (
                <X className="h-4 w-4 transition-all duration-300" />
              ) : (
                <Menu className="h-4 w-4 transition-all duration-300" />
              )}
            </button>

            {mounted && isOpen
              ? createPortal(
                  <>
                    <button
                      type="button"
                      aria-label="Закрыть меню"
                      className="fixed inset-0 z-40 cursor-default bg-black/20"
                      onClick={() => handleOpenChange(false)}
                    />
                    <div
                      id="mobile-navigation-menu"
                      role="dialog"
                      aria-modal="true"
                      className="pointer-events-none fixed left-1/2 top-14 z-100 w-full max-w-5xl -translate-x-1/2 px-4"
                    >
                      <div className="menu-content pointer-events-auto rounded-3xl border border-zinc-950/10 bg-zinc-100 px-6 py-3 shadow-surface-lg">
                        <nav className="flex flex-col space-y-2">
                          {NAV_ITEMS.map((item) => {
                            const isActive =
                              activePage === item.href.replace("/", "");
                            return (
                              <Link
                                key={item.href}
                                href={item.href}
                                onClick={handleNavClick}
                                className={`w-full rounded-full px-4 py-2 text-center text-sm font-medium transition-colors duration-300 ${
                                  isActive
                                    ? "bg-zinc-950 text-white shadow-control"
                                    : "text-zinc-700 hover:bg-zinc-950 hover:text-white"
                                }`}
                              >
                                {item.label}
                              </Link>
                            );
                          })}
                        </nav>
                      </div>
                    </div>
                  </>,
                  document.body,
                )
              : null}
          </div>
        </div>
      </div>
    </header>
  );
};

export { Header };
