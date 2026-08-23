"use client";

import { useEffect, useState } from "react";
import { useGetCategoriesQuery } from "../../features/categories/categoriesApi";
import { useGetBrandsQuery } from "../../features/brands/brandsApi";

const SORT_OPTIONS = [
  { value: "", label: "Newest first" },
  { value: "priceAsc", label: "Price: Low to High" },
  { value: "priceDesc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

const TOGGLES = [
  { key: "flashSale", label: "⚡ Flash Sale" },
  { key: "hotSale", label: "🔥 Hot Sale" },
  { key: "newArrival", label: "✨ New Arrival" },
];

const DEFAULT_FILTERS = {
  category: "",
  brand: "",
  minPrice: "",
  maxPrice: "",
  sort: "",
  hotSale: false,
  newArrival: false,
  flashSale: false,
};

export { DEFAULT_FILTERS };

function countActive(filters) {
  return (
    (filters.category ? 1 : 0) +
    (filters.brand ? 1 : 0) +
    (filters.minPrice ? 1 : 0) +
    (filters.maxPrice ? 1 : 0) +
    (filters.sort ? 1 : 0) +
    (filters.hotSale ? 1 : 0) +
    (filters.newArrival ? 1 : 0) +
    (filters.flashSale ? 1 : 0)
  );
}

export { countActive };

/**
 * Vertical filter panel. Used directly as a desktop sidebar, and
 * dropped inside <FilterDrawer> for mobile.
 *
 * `onClose` is optional — when provided (i.e. rendered inside the
 * drawer), a header with a close button and an "Apply" button are shown.
 */
export default function ProductFilters({ filters, onChange, onClose }) {
  const [minPriceInput, setMinPriceInput] = useState(filters.minPrice);
  const [maxPriceInput, setMaxPriceInput] = useState(filters.maxPrice);

  useEffect(() => {
    setMinPriceInput(filters.minPrice);
    setMaxPriceInput(filters.maxPrice);
  }, [filters.minPrice, filters.maxPrice]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (
        minPriceInput !== filters.minPrice ||
        maxPriceInput !== filters.maxPrice
      ) {
        onChange({
          ...filters,
          minPrice: minPriceInput,
          maxPrice: maxPriceInput,
        });
      }
    }, 500);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minPriceInput, maxPriceInput]);

  const { data: categoriesData, isError: categoriesError } =
    useGetCategoriesQuery();
  const { data: brandsData, isError: brandsError } = useGetBrandsQuery();

  const categories = categoriesData?.data || [];
  const brands = brandsData?.data || [];
  const activeCount = countActive(filters);

  const update = (patch) => onChange({ ...filters, ...patch });
  const toggleFlag = (key) => update({ [key]: !filters[key] });

  const clearAll = () => {
    setMinPriceInput("");
    setMaxPriceInput("");
    onChange({ ...DEFAULT_FILTERS });
  };

  return (
    <div className="w-full">
      {/* Header (drawer only) */}
      {onClose && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">
            Filters{activeCount > 0 ? ` (${activeCount})` : ""}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close filters"
            className="text-gray-400 hover:text-gray-600 text-xl leading-none px-2"
          >
            ×
          </button>
        </div>
      )}

      <div className={`${onClose ? "px-4 py-4" : ""} flex flex-col gap-6`}>
        {!onClose && activeCount > 0 && (
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Filters</h2>
            <button
              onClick={clearAll}
              className="text-xs text-gray-500 underline underline-offset-2 hover:text-gray-700"
            >
              Clear all
            </button>
          </div>
        )}
        {!onClose && activeCount === 0 && (
          <h2 className="font-semibold text-gray-900">Filters</h2>
        )}

        {/* Category */}
        {!categoriesError && categories.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => update({ category: e.target.value })}
              className="w-full border border-gray-200 rounded-lg text-sm px-3 py-2 bg-white"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Brand */}
        {!brandsError && brands.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Brand
            </label>
            <select
              value={filters.brand}
              onChange={(e) => update({ brand: e.target.value })}
              className="w-full border border-gray-200 rounded-lg text-sm px-3 py-2 bg-white"
            >
              <option value="">All Brands</option>
              {brands.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Price range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price Range
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              placeholder="Min ৳"
              value={minPriceInput}
              onChange={(e) => setMinPriceInput(e.target.value)}
              className="w-full min-w-0 border border-gray-200 rounded-lg text-sm px-3 py-2"
            />
            <span className="text-gray-400 text-sm">–</span>
            <input
              type="number"
              min="0"
              placeholder="Max ৳"
              value={maxPriceInput}
              onChange={(e) => setMaxPriceInput(e.target.value)}
              className="w-full min-w-0 border border-gray-200 rounded-lg text-sm px-3 py-2"
            />
          </div>
        </div>

        {/* Sort */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sort By
          </label>
          <select
            value={filters.sort}
            onChange={(e) => update({ sort: e.target.value })}
            className="w-full border border-gray-200 rounded-lg text-sm px-3 py-2 bg-white"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value || "default"} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Toggles */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Highlights
          </label>
          <div className="flex flex-col gap-2">
            {TOGGLES.map((t) => (
              <label
                key={t.key}
                className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  checked={!!filters[t.key]}
                  onChange={() => toggleFlag(t.key)}
                  className="w-4 h-4 rounded border-gray-300 accent-brand-500"
                />
                {t.label}
              </label>
            ))}
          </div>
        </div>

        {onClose && (
          <div className="flex gap-2 pt-2 sticky bottom-0 bg-white pb-1">
            <button
              onClick={clearAll}
              className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Clear all
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg bg-brand-500 text-white text-sm font-medium hover:opacity-90"
            >
              Show results
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
