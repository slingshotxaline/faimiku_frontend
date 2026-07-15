import Link from "next/link";
import {
  getEffectivePrice,
  getStrikethroughPrice,
  getProductImage,
} from "../../utils/pricing";

const BADGES = [
  { key: "isFlashSale", label: "⚡ Flash Sale", className: "bg-red-500" },
  { key: "isHotSale", label: "🔥 Hot Sale", className: "bg-orange-500" },
  { key: "isNewArrival", label: "✨ New", className: "bg-blue-500" },
];

export default function ProductCard({ product }) {
  const image = getProductImage(product);
  const price = getEffectivePrice(product);
  const strikethrough = getStrikethroughPrice(product);
  const badge = BADGES.find((b) => product[b.key]);

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow relative"
    >
      {badge && (
        <span
          className={`absolute top-2 left-2 z-10 text-white text-[10px] font-medium px-2 py-1 rounded-full ${badge.className}`}
        >
          {badge.label}
        </span>
      )}
      <div className="aspect-square bg-gray-100 overflow-hidden">
        {image && (
          <img
            src={image}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}
      </div>
      <div className="p-3">
        <h3 className="text-sm font-medium text-gray-900 truncate">
          {product.title}
        </h3>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-brand-500 font-semibold">
            ৳{price.toLocaleString()}
          </p>
          {strikethrough && (
            <p className="text-gray-400 text-xs line-through">
              ৳{strikethrough.toLocaleString()}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
