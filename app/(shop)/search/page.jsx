"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useLazySmartSearchQuery } from "../../../features/search/searchApi";
import ProductCard from "../../../components/shop/ProductCard";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const [triggerSearch, { data, isLoading }] = useLazySmartSearchQuery();

  useEffect(() => {
    if (q) triggerSearch(q);
  }, [q, triggerSearch]);

  const products = data?.data || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-1">Results for "{q}"</h1>
      {data?.parsedFilters && (
        <p className="text-sm text-gray-400 mb-6">
          Understood as: {[
            data.parsedFilters.textSearch,
            data.parsedFilters.maxPrice && `under ৳${data.parsedFilters.maxPrice.toLocaleString()}`,
            data.parsedFilters.minPrice && `over ৳${data.parsedFilters.minPrice.toLocaleString()}`,
            data.parsedFilters.color && data.parsedFilters.color,
          ].filter(Boolean).join(" · ")}
        </p>
      )}

      {isLoading ? (
        <p className="text-gray-500">Searching...</p>
      ) : products.length === 0 ? (
        <p className="text-gray-500">No products matched your search.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
