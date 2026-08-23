"use client";

import { useState } from "react";
import ProductGrid from "../../../components/shop/ProductGrid";
import ProductFilters, {
  DEFAULT_FILTERS,
  countActive,
} from "../../../components/shop/ProductFilters";
import FilterDrawer from "../../../components/shop/FilterDrawer";

export default function ProductsPage() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const activeCount = countActive(filters);

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
          <ProductFilters filters={filters} onChange={setFilters} />
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
          onChange={setFilters}
          onClose={() => setDrawerOpen(false)}
        />
      </FilterDrawer>
    </div>
  );
}