// Maps a HomepageSection's promoFlag to the matching toggle filter on the
// /products page.
const PROMO_FILTER_MAP = {
  isHotSale: "hotSale",
  isNewArrival: "newArrival",
  isFlashSale: "flashSale",
  isFeatured: "featured",
};

/**
 * Builds the URL a homepage section's "Show More" button should link to.
 *  - Manual `showMoreLink` (set by the admin) always wins — the only
 *    option that works for "custom" (hand-picked) sections.
 *  - "category" sections -> /products?category=<slug>
 *  - "promo" sections     -> /products?hotSale=true (etc.)
 *  - anything else        -> plain /products
 */
export function buildSectionShowMoreLink(section) {
  if (section.showMoreLink) return section.showMoreLink;

  if (section.sourceType === "category" && section.category?.slug) {
    return `/products?category=${section.category.slug}`;
  }

  if (section.sourceType === "promo") {
    const filterKey = PROMO_FILTER_MAP[section.promoFlag];
    if (filterKey) return `/products?${filterKey}=true`;
  }

  return "/products";
}
