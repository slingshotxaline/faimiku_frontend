"use client";

import { useState, useEffect } from "react";
import { useGetProductBySlugQuery } from "../../../../features/products/productsApi";
import { useDispatch, useSelector } from "react-redux";
import { addItem } from "../../../../features/cart/cartSlice";
import { toggleCompare } from "../../../../features/compare/compareSlice";
import { recordView } from "../../../../features/recentlyViewed/recentlyViewedSlice";
import ReviewsSection from "../../../../components/shop/ReviewsSection";
import WishlistButton from "../../../../components/shop/WishlistButton";
import ProductCarousel from "../../../../components/shop/ProductCarousel";
import {
  useGetSimilarProductsQuery,
  useGetFrequentlyBoughtTogetherQuery,
} from "../../../../features/recommendations/recommendationsApi";
import RecentlyViewedCarousel from "../../../../components/shop/RecentlyViewedCarousel";
import {
  getEffectivePrice,
  getStrikethroughPrice,
  getProductImage,
} from "../../../../utils/pricing";

const BADGES = [
  { key: "isFlashSale", label: "⚡ Flash Sale", className: "bg-red-500" },
  { key: "isHotSale", label: "🔥 Hot Sale", className: "bg-orange-500" },
  { key: "isNewArrival", label: "✨ New Arrival", className: "bg-blue-500" },
];

export default function ProductDetailPage({ params }) {
  const { data, isLoading, isError } = useGetProductBySlugQuery(params.slug);
  const dispatch = useDispatch();
  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [activeImage, setActiveImage] = useState(null);
  const compareItems = useSelector((state) => state.compare.items);

  const { data: similarData } = useGetSimilarProductsQuery(data?.data?._id, {
    skip: !data?.data,
  });
  const { data: fbtData } = useGetFrequentlyBoughtTogetherQuery(
    data?.data?._id,
    { skip: !data?.data }
  );

  useEffect(() => {
    if (data?.data) {
      const p = data.data;
      dispatch(
        recordView({
          _id: p._id,
          title: p.title,
          slug: p.slug,
          basePrice: p.basePrice,
          offerPrice: p.offerPrice,
          specialPrice: p.specialPrice,
          oldPrice: p.oldPrice,
          baseImage: p.baseImage,
          images: p.images,
          ratingsAverage: p.ratingsAverage,
        })
      );
      setActiveImage(getProductImage(p));
    }
  }, [data, dispatch]);

  if (isLoading)
    return <div className="max-w-5xl mx-auto px-4 py-16">Loading...</div>;
  if (isError || !data?.data)
    return (
      <div className="max-w-5xl mx-auto px-4 py-16">Product not found.</div>
    );

  const product = data.data;
  const selectedVariant = product.hasVariants
    ? product.variants.find((v) => v._id === selectedVariantId) ||
      product.variants[0]
    : null;

  const displayPrice = selectedVariant?.price ?? getEffectivePrice(product);
  const strikethrough = selectedVariant
    ? selectedVariant.compareAtPrice
    : getStrikethroughPrice(product);
  const inStock = selectedVariant
    ? selectedVariant.stock > 0
    : product.stock > 0;
  const isComparing = compareItems.some((p) => p._id === product._id);
  const badge = BADGES.find((b) => product[b.key]);
  const gallery = [product.baseImage, ...(product.images || [])].filter(
    (img) => img?.url
  );

  const handleAddToCart = () => {
    if (product.hasVariants && !selectedVariant) return;
    dispatch(
      addItem({
        productId: product._id,
        variantId: selectedVariant?._id || null,
        title: product.hasVariants
          ? `${product.title} (${Object.values(
              selectedVariant.attributes || {}
            ).join(", ")})`
          : product.title,
        price: displayPrice,
        image: getProductImage(product),
        quantity: 1,
      })
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden relative">
            {badge && (
              <span
                className={`absolute top-3 left-3 z-10 text-white text-xs font-medium px-2.5 py-1 rounded-full ${badge.className}`}
              >
                {badge.label}
              </span>
            )}
            {activeImage && (
              <img
                src={activeImage}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          {gallery.length > 1 && (
            <div className="flex gap-2 mt-3">
              {gallery.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(img.url)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${
                    activeImage === img.url
                      ? "border-brand-500"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={img.url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{product.title}</h1>
          <div className="flex items-center gap-3 mt-2">
            <p className="text-brand-500 text-xl font-semibold">
              ৳{displayPrice.toLocaleString()}
            </p>
            {strikethrough && (
              <p className="text-gray-400 line-through">
                ৳{strikethrough.toLocaleString()}
              </p>
            )}
          </div>
          <p className="text-gray-600 mt-4">{product.shortDescription}</p>

          {product.hasVariants && product.variants?.length > 0 && (
            <div className="mt-4">
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Select an option
              </label>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v._id}
                    type="button"
                    onClick={() => setSelectedVariantId(v._id)}
                    disabled={v.stock <= 0}
                    className={`border rounded-lg px-3 py-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed ${
                      (selectedVariant?._id || product.variants[0]._id) ===
                      v._id
                        ? "border-brand-500 text-brand-500 bg-brand-50"
                        : "border-gray-200"
                    }`}
                  >
                    {Object.values(v.attributes || {}).join(" / ") || v.sku}
                    {v.stock <= 0 && " (out of stock)"}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!inStock && (
            <p className="text-sm text-red-500 mt-3">Out of stock</p>
          )}

          <div className="mt-6 flex gap-3">
            <button
              onClick={handleAddToCart}
              disabled={!inStock}
              className="bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Add to Cart
            </button>
            <WishlistButton productId={product._id} />
            <button
              onClick={() =>
                dispatch(
                  toggleCompare({
                    _id: product._id,
                    title: product.title,
                    slug: product.slug,
                    basePrice: product.basePrice,
                    images: product.images,
                    ratingsAverage: product.ratingsAverage,
                  })
                )
              }
              className={`border rounded-lg px-4 py-3 text-sm font-medium ${
                isComparing
                  ? "border-brand-500 text-brand-500 bg-brand-50"
                  : "border-gray-200 text-gray-600"
              }`}
            >
              {isComparing ? "Remove from Compare" : "+ Compare"}
            </button>
          </div>

          {product.description && (
            <div className="mt-8 pt-8 border-t border-gray-100">
              <h2 className="font-semibold text-gray-900 mb-2">Description</h2>
              <div
                className="prose prose-sm max-w-none text-gray-600"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>
          )}
        </div>
      </div>

      <ProductCarousel
        title="Frequently Bought Together"
        products={fbtData?.data}
      />
      <ProductCarousel title="Similar Products" products={similarData?.data} />
      <RecentlyViewedCarousel excludeId={product._id} />

      <ReviewsSection productId={product._id} />
    </div>
  );
}
