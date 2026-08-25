"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import ProductGrid from "../../../components/shop/ProductGrid";
import ProductFilters, {
  DEFAULT_FILTERS,
  countActive,
} from "../../../components/shop/ProductFilters";
import FilterDrawer from "../../../components/shop/FilterDrawer";
import { useGetCategoriesQuery } from "../../../features/categories/categoriesApi";
import { useGetBrandsQuery } from "../../../features/brands/brandsApi";

const FILTER_KEYS = [
  "category",
  "brand",
  "minPrice",
  "maxPrice",
  "sort",
  "hotSale",
  "newArrival",
  "flashSale",
];
const BOOLEAN_KEYS = ["hotSale", "newArrival", "flashSale"];

// category & brand are kept internally as Mongo _id (what the <select>
// controls and the backend API need), but shown in the URL as their
// human-readable slug (e.g. "women" instead of "6a76f26ac284..."). These
// two keys need id<->slug translation; everything else in FILTER_KEYS is 1:1.
const SLUG_KEYS = ["category", "brand"];

function buildLookup(items) {
  const byId = new Map();
  const bySlug = new Map();
  (items || []).forEach((item) => {
    byId.set(item._id, item.slug);
    bySlug.set(item.slug, item._id);
  });
  return { byId, bySlug };
}

function filtersFromSearchParams(searchParams, lookups) {
  const filters = { ...DEFAULT_FILTERS };
  FILTER_KEYS.forEach((key) => {
    const value = searchParams.get(key);
    if (value === null) return;

    if (SLUG_KEYS.includes(key)) {
      // URL holds a slug ("women") -> resolve to the _id used internally.
      // Falls back to the raw value if the lookup hasn't loaded yet or
      // the value doesn't match any known slug, so nothing silently breaks.
      filters[key] = lookups[key]?.bySlug.get(value) || value;
      return;
    }

    filters[key] = BOOLEAN_KEYS.includes(key) ? value === "true" : value;
  });
  return filters;
}

function queryStringFromFilters(filters, lookups) {
  const params = new URLSearchParams();
  FILTER_KEYS.forEach((key) => {
    const value = filters[key];
    if (!value) return;

    if (SLUG_KEYS.includes(key)) {
      // Internal value is an _id -> show its slug in the URL instead.
      params.set(key, lookups[key]?.byId.get(value) || value);
      return;
    }

    params.set(key, String(value));
  });
  return params.toString();
}

function ProductsPageInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Same cached queries ProductFilters already makes — RTK Query dedupes
  // these, so this doesn't trigger a second network request.
  const { data: categoriesData } = useGetCategoriesQuery();
  const { data: brandsData } = useGetBrandsQuery();

  const lookups = useMemo(
    () => ({
      category: buildLookup(categoriesData?.data),
      brand: buildLookup(brandsData?.data),
    }),
    [categoriesData, brandsData]
  );

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const activeCount = countActive(filters);

  // Resolve filters from the URL whenever the URL changes, or once the
  // category/brand slug lookups finish loading — so a direct link like
  // /products?category=women resolves correctly as soon as data arrives.
  useEffect(() => {
    setFilters(filtersFromSearchParams(searchParams, lookups));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    searchParams.toString(),
    lookups.category.bySlug.size,
    lookups.brand.bySlug.size,
  ]);

  const updateFilters = useCallback(
    (newFilters) => {
      setFilters(newFilters);
      const query = queryStringFromFilters(newFilters, lookups);
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [router, pathname, lookups]
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">All Products</h1>

        {/* Mobile filter trigger */}
        <button
          onClick={() => setDrawerOpen(true)}
          className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium"
        >
          Filters{activeCount > 0 ? ` (${activeCount})` : ""}
        </button>
      </div>

      <div className="flex gap-8 items-start">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-6">
          <ProductFilters filters={filters} onChange={updateFilters} />
        </aside>

        {/* Product grid */}
        <div className="flex-1 min-w-0">
          <ProductGrid filters={filters} />
        </div>
      </div>

      {/* Mobile drawer */}
      <FilterDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <ProductFilters
          filters={filters}
          onChange={updateFilters}
          onClose={() => setDrawerOpen(false)}
        />
      </FilterDrawer>
    </div>
  );
}

// useSearchParams() requires a Suspense boundary around the component that calls it.
export default function ProductsPage() {
  return (
    <Suspense fallback={null}>
      <ProductsPageInner />
    </Suspense>
  );
}
