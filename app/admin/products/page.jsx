"use client";

import Link from "next/link";
import {
  useGetProductsQuery,
  useDeleteProductMutation,
} from "../../../features/products/productsApi";
import { getEffectivePrice, getProductImage } from "../../../utils/pricing";

const BADGES = [
  { key: "isFlashSale", label: "Flash", className: "bg-red-50 text-red-600" },
  { key: "isHotSale", label: "Hot", className: "bg-orange-50 text-orange-600" },
  { key: "isNewArrival", label: "New", className: "bg-blue-50 text-blue-600" },
  {
    key: "isFeatured",
    label: "Featured",
    className: "bg-purple-50 text-purple-600",
  },
];

export default function AdminProductsPage() {
  const { data, isLoading } = useGetProductsQuery({ limit: 50 });
  const [deleteProduct] = useDeleteProductMutation();
  const products = data?.data || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link
          href="/admin/products/new"
          className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          + Add Product
        </Link>
      </div>
      {isLoading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-100">
              <th className="py-2 pr-4">Product</th>
              <th className="py-2 pr-4">Category</th>
              <th className="py-2 pr-4">Brand</th>
              <th className="py-2 pr-4">Price</th>
              <th className="py-2 pr-4">Tags</th>
              <th className="py-2 pr-4">Rating</th>
              <th className="py-2 pr-4"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-b border-gray-50">
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-2">
                    {getProductImage(p) && (
                      <img
                        src={getProductImage(p)}
                        alt=""
                        className="w-8 h-8 rounded object-cover"
                      />
                    )}
                    <span className="font-medium">{p.title}</span>
                  </div>
                </td>
                <td className="py-3 pr-4">{p.category?.name || "—"}</td>
                <td className="py-3 pr-4">{p.brand?.name || "—"}</td>
                <td className="py-3 pr-4">
                  ৳{getEffectivePrice(p).toLocaleString()}
                </td>
                <td className="py-3 pr-4">
                  <div className="flex gap-1 flex-wrap">
                    {BADGES.filter((b) => p[b.key]).map((b) => (
                      <span
                        key={b.key}
                        className={`text-[10px] px-1.5 py-0.5 rounded-full ${b.className}`}
                      >
                        {b.label}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-3 pr-4">
                  {p.ratingsAverage?.toFixed(1) || "—"} ({p.ratingsCount})
                </td>
                <td className="py-3 pr-4 space-x-3 whitespace-nowrap">
                  <Link
                    href={`/admin/products/${p._id}/edit`}
                    className="text-brand-500 hover:underline"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() =>
                      confirm(`Deactivate "${p.title}"?`) &&
                      deleteProduct(p._id)
                    }
                    className="text-red-500 hover:underline"
                  >
                    Deactivate
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={7} className="py-6 text-center text-gray-400">
                  No products yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
