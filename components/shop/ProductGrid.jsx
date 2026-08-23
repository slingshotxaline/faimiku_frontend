"use client";

import { useEffect, useState } from "react";
import { useGetProductsQuery } from "../../features/products/productsApi";
import ProductCard from "./ProductCard";
import { DEFAULT_FILTERS } from "./ProductFilters";

const PAGE_LIMIT = 24;
const SIBLING_COUNT = 1;

function getPageRange(current, total) {
  const totalNumbersShown = SIBLING_COUNT * 2 + 5;

  if (total <= totalNumbersShown) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const leftSibling = Math.max(current - SIBLING_COUNT, 1);
  const rightSibling = Math.min(current + SIBLING_COUNT, total);

  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < total - 1;

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftRange = Array.from({ length: 3 + SIBLING_COUNT * 2 }, (_, i) => i + 1);
    return [...leftRange, "...", total];
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    const rightRange = Array.from(
      { length: 3 + SIBLING_COUNT * 2 },
      (_, i) => total - (3 + SIBLING_COUNT * 2) + 1 + i
    );
    return [1, "...", ...rightRange];
  }

  const middleRange = Array.from(
    { length: rightSibling - leftSibling + 1 },
    (_, i) => leftSibling + i
  );
  return [1, "...", ...middleRange, "...", total];
}

// Strip empty/false values so we don't send category=&hotSale=false etc.
function buildQueryParams(filters, page) {
  const params = { limit: PAGE_LIMIT, page };
  if (filters.category) params.category = filters.category;
  if (filters.brand) params.brand = filters.brand;
  if (filters.minPrice) params.minPrice = filters.minPrice;
  if (filters.maxPrice) params.maxPrice = filters.maxPrice;
  if (filters.sort) params.sort = filters.sort;
  if (filters.hotSale) params.hotSale = true;
  if (filters.newArrival) params.newArrival = true;
  if (filters.flashSale) params.flashSale = true;
  return params;
}

export default function ProductGrid({ filters = DEFAULT_FILTERS }) {
  const [page, setPage] = useState(1);

  // Reset to page 1 whenever the filter selection changes.
  useEffect(() => {
    setPage(1);
  }, [
    filters.category,
    filters.brand,
    filters.minPrice,
    filters.maxPrice,
    filters.sort,
    filters.hotSale,
    filters.newArrival,
    filters.flashSale,
  ]);

  const { data, isLoading, isFetching, isError, refetch } = useGetProductsQuery(
    buildQueryParams(filters, page)
  );

  if (isLoading)
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-[3/4] bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );

  if (isError)
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 mb-3">Could not load products.</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-50"
        >
          Retry
        </button>
      </div>
    );

  const products = data?.data || [];
  const pagination = data?.pagination;

  if (!products.length)
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">No products match these filters.</p>
      </div>
    );

  const goToPage = (target) => {
    if (target < 1 || target > pagination.pages || target === page) return;
    setPage(target);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pageRange = pagination ? getPageRange(page, pagination.pages) : [];

  return (
    <div>
      <div
        className={`grid grid-cols-2 md:grid-cols-4 gap-6 transition-opacity duration-150 ${
          isFetching ? "opacity-50 pointer-events-none" : "opacity-100"
        }`}
      >
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {pagination && pagination.pages > 1 && (
        <nav
          aria-label="Product pagination"
          className="flex items-center justify-center flex-wrap gap-2 mt-10"
        >
          <button
            onClick={() => goToPage(page - 1)}
            disabled={page === 1 || isFetching}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Prev
          </button>

          {pageRange.map((item, idx) =>
            item === "..." ? (
              <span
                key={`ellipsis-${idx}`}
                className="w-9 h-9 flex items-center justify-center text-sm text-gray-400"
              >
                …
              </span>
            ) : (
              <button
                key={item}
                onClick={() => goToPage(item)}
                disabled={isFetching}
                aria-current={item === page ? "page" : undefined}
                className={`w-9 h-9 rounded-lg text-sm border transition-colors ${
                  item === page
                    ? "bg-brand-500 text-white border-brand-500"
                    : "border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {item}
              </button>
            )
          )}

          <button
            onClick={() => goToPage(page + 1)}
            disabled={page === pagination.pages || isFetching}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </nav>
      )}

      {pagination && (
        <p className="text-center text-xs text-gray-400 mt-3">
          Page {pagination.page} of {pagination.pages} · {pagination.total} products
        </p>
      )}
    </div>
  );
}