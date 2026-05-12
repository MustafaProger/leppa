"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ShoppingBag, SearchIcon, Heart, Menu, X } from "lucide-react";

import Link from "next/link";

import { NAV_ITEMS } from "./data";

const BODY_OVERLAY_CLASS = "overlay";
const DESKTOP_MEDIA_QUERY = "(min-width: 768px)";

const Header = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
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
    <header className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-5xl px-4">
      <div className="bg-gray-100 rounded-full px-6 py-2 grid grid-cols-[100px_auto] md:grid-cols-[100px_auto_100px] items-center justify-between w-full">
        {/* Logo on left */}
        <Link
          href="/"
          className="flex shrink-0 items-center text-lg font-bold text-gray-900 hover:opacity-85 transition-opacity"
          aria-label="LEPA&WANNISTON — на главную"
          onClick={handleNavClick}
        >
          L&W
        </Link>

        {/* Navigation in center - desktop only */}
        <nav className="hidden md:flex justify-center items-center p-1  bg-gray-200 rounded-full">
          {NAV_ITEMS.map((item) => {
            const isActive = activePage === item.href.replace("/", "");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${
                  isActive ? "bg-black text-white" : "bg-gray-200 text-gray-700"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Icons on right */}
        <div className="flex items-center gap-3">
          <button className="h-8 w-8 flex items-center justify-center text-gray-600 hover:bg-black hover:text-white rounded-full transition-all duration-300">
            <SearchIcon className="h-4 w-4" />
          </button>
          <button className="h-8 w-8 flex items-center justify-center text-gray-600 hover:bg-black hover:text-white rounded-full transition-all duration-300">
            <Heart className="h-4 w-4" />
          </button>
          <button className="h-8 w-8 flex items-center justify-center text-gray-600 hover:bg-black hover:text-white rounded-full transition-all duration-300">
            <ShoppingBag className="h-4 w-4" />
          </button>
          {/* Mobile menu toggle */}
          <div className="relative md:hidden">
            <button
              className={`h-8 w-8 flex items-center justify-center rounded-full transition-all duration-300 ${
                isOpen
                  ? "bg-black text-white"
                  : "text-gray-600 hover:bg-black hover:text-white"
              }`}
              type="button"
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

            {/* Custom mobile menu */}
            {/* Mobile menu */}
            <div
              id="mobile-navigation-menu"
              className={`fixed top-14 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-5xl px-4 transition-all duration-300
    ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
            >
              <div className="bg-gray-100 rounded-[40px] px-6 py-3 menu-content transition-all duration-300">
                <nav className="flex flex-col space-y-2">
                  {NAV_ITEMS.map((item) => {
                    const isActive = activePage === item.href.replace("/", "");
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={handleNavClick}
                        className={`w-full px-4 py-2 text-center text-sm font-medium rounded-full transition-colors duration-300 ${
                          isActive
                            ? "bg-black text-white"
                            : "text-gray-700 hover:bg-black hover:text-white"
                        }`}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export { Header };