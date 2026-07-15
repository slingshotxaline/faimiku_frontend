"use client";

import ProductGrid from "../../components/shop/ProductGrid";
import ProductCarousel from "../../components/shop/ProductCarousel";
import { useGetTrendingQuery } from "../../features/recommendations/recommendationsApi";

export default function HomePage() {
  const { data: trendingData } = useGetTrendingQuery();

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <section className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Featured Products</h1>
        <p className="text-gray-500 mt-1">Hand-picked items for you</p>
      </section>
      <ProductGrid />
      <ProductCarousel title="Trending This Week" products={trendingData?.data} />
    </div>
  );
}
