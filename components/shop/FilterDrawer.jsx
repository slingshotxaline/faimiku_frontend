"use client";

import { useEffect } from "react";

/**
 * Full-screen mobile drawer that slides in from the left.
 * Renders nothing visible on lg+ screens — desktop uses the sidebar instead.
 */
export default function FilterDrawer({ isOpen, onClose, children }) {
  // Lock body scroll while the drawer is open
  useEffect(() => {
    if (isOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [isOpen]);

  return (
    <div
      className={`lg:hidden fixed inset-0 z-50 ${isOpen ? "" : "pointer-events-none"}`}
      aria-hidden={!isOpen}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/40 transition-opacity duration-200 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Slide-in panel */}
      <div
        className={`absolute top-0 left-0 h-full w-[85%] max-w-sm bg-white shadow-xl flex flex-col transition-transform duration-200 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}