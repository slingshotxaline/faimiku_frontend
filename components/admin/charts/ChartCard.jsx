"use client";

import { useEffect, useState } from "react";

export default function ChartCard({
  title,
  subtitle,
  loading,
  empty,
  emptyLabel = "No data for this range",
  children,
  index = 0,
  className = "",
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), index * 80);
    return () => clearTimeout(t);
  }, [index]);

  return (
    <div
      className={`rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-500 ease-out hover:shadow-md ${
        mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      } ${className}`}
    >
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        {subtitle && (
          <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
        )}
      </div>

      {loading ? (
        <div className="h-56 rounded-xl bg-gray-50 animate-pulse" />
      ) : empty ? (
        <div className="h-56 flex items-center justify-center text-sm text-gray-400">
          {emptyLabel}
        </div>
      ) : (
        <div className="h-56">{children}</div>
      )}
    </div>
  );
}