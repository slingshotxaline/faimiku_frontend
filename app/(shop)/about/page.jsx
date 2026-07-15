"use client";

import { useGetPageBySlugQuery } from "../../../features/cms/pagesApi";

// Renders whatever sections the admin has configured for this page via
// /admin/pages — no code changes needed to update the About page's content.
export default function AboutPage() {
  const { data, isLoading } = useGetPageBySlugQuery("about");
  const page = data?.data;

  if (isLoading) return <div className="max-w-3xl mx-auto px-4 py-16">Loading...</div>;
  if (!page) return <div className="max-w-3xl mx-auto px-4 py-16">Page not found.</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{page.title}</h1>
      {page.sections?.map((section) => (
        <section key={section._id} className="mb-10">
          {section.title && <h2 className="text-xl font-semibold text-gray-900 mb-2">{section.title}</h2>}
          {section.subtitle && <p className="text-gray-500 mb-3">{section.subtitle}</p>}
          {section.body && (
            <div className="prose text-gray-700" dangerouslySetInnerHTML={{ __html: section.body }} />
          )}
          {section.type === "cta" && section.ctaLabel && (
            <a href={section.ctaUrl} className="inline-block mt-4 bg-brand-500 hover:bg-brand-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium">
              {section.ctaLabel}
            </a>
          )}
        </section>
      ))}
    </div>
  );
}
