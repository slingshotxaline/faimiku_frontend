"use client";

import { useGetActiveHomepageSectionsQuery } from "../../features/homepageSections/homepageSectionsApi";
import ProductCard from "./ProductCard";

export default function HomepageProductSections() {
  const { data, isLoading } = useGetActiveHomepageSectionsQuery();
  const sections = data?.data || [];

  if (isLoading || sections.length === 0) return null;

  return (
    <>
      {sections.map((section) => (
        <section key={section._id} className="mb-14">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-900">{section.title}</h2>
            {section.subtitle && (
              <p className="text-gray-500 text-sm mt-0.5">{section.subtitle}</p>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {section.products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
