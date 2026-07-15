"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useGetInventoryOverviewQuery } from "../../../features/inventory/inventoryApi";
import StockAdjustModal from "../../../components/admin/StockAdjustModal";

export default function AdminInventoryPage() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [lowStockOnly, setLowStockOnly] = useState(
    searchParams.get("lowStockOnly") === "true"
  );
  const [adjustingRow, setAdjustingRow] = useState(null);

  const { data, isLoading } = useGetInventoryOverviewQuery({
    search: search || undefined,
    lowStockOnly,
  });
  const rows = data?.data || [];
  const lowStockCount = rows.filter((r) => r.isLowStock).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold">Inventory</h1>
        {lowStockCount > 0 && (
          <span className="text-sm bg-red-50 text-red-600 px-3 py-1 rounded-full font-medium">
            {lowStockCount} item{lowStockCount > 1 ? "s" : ""} low on stock
          </span>
        )}
      </div>

      <div className="flex items-center gap-3 mb-6">
        <input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2 text-sm w-64"
        />
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={lowStockOnly}
            onChange={(e) => setLowStockOnly(e.target.checked)}
          />
          Low stock only
        </label>
      </div>

      {isLoading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-100">
              <th className="py-2 pr-4">Product</th>
              <th className="py-2 pr-4">Current</th>
              <th className="py-2 pr-4">Reserved</th>
              <th className="py-2 pr-4">Sold</th>
              <th className="py-2 pr-4">Damaged</th>
              <th className="py-2 pr-4">Returned</th>
              <th className="py-2 pr-4">Incoming</th>
              <th className="py-2 pr-4"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={`${row.product._id}-${row.variantId || "base"}`}
                className={`border-b border-gray-50 ${
                  row.isLowStock ? "bg-red-50/40" : ""
                }`}
              >
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-2">
                    {row.product.image && (
                      <img
                        src={row.product.image}
                        alt=""
                        className="w-8 h-8 rounded object-cover"
                      />
                    )}
                    <div>
                      <p className="font-medium">{row.product.title}</p>
                      {row.variantLabel && (
                        <p className="text-xs text-gray-400">
                          {row.variantLabel}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td
                  className={`py-3 pr-4 font-semibold ${
                    row.isLowStock ? "text-red-600" : ""
                  }`}
                >
                  {row.currentStock}
                </td>
                <td className="py-3 pr-4 text-gray-500">{row.reservedStock}</td>
                <td className="py-3 pr-4 text-gray-500">{row.soldStock}</td>
                <td className="py-3 pr-4 text-gray-500">{row.damagedStock}</td>
                <td className="py-3 pr-4 text-gray-500">{row.returnedStock}</td>
                <td className="py-3 pr-4 text-gray-500">{row.incomingStock}</td>
                <td className="py-3 pr-4 space-x-3 whitespace-nowrap">
                  <button
                    onClick={() => setAdjustingRow(row)}
                    className="text-brand-500 hover:underline"
                  >
                    Adjust
                  </button>
                  <Link
                    href={`/admin/inventory/${row.product._id}`}
                    className="text-gray-400 hover:underline"
                  >
                    History
                  </Link>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={8} className="py-6 text-center text-gray-400">
                  No inventory records match.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {adjustingRow && (
        <StockAdjustModal
          row={adjustingRow}
          onClose={() => setAdjustingRow(null)}
        />
      )}
    </div>
  );
}
