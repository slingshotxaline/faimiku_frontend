"use client";

import Link from "next/link";
import { useGetDashboardSummaryQuery } from "../../features/admin/adminApi";
import { useGetInventoryOverviewQuery } from "../../features/inventory/inventoryApi";
import StatCard from "../../components/admin/StatCard";

export default function AdminOverviewPage() {
  const { data, isLoading } = useGetDashboardSummaryQuery();
  const { data: inventoryData } = useGetInventoryOverviewQuery({
    lowStockOnly: true,
  });
  const summary = data?.data;
  const lowStockCount = inventoryData?.data?.length ?? 0;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Overview</h1>
      {isLoading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="Total Revenue"
            value={`৳${summary?.totalRevenue?.toLocaleString() || 0}`}
          />
          <StatCard label="Orders Today" value={summary?.ordersToday ?? 0} />
          <StatCard
            label="Pending Orders"
            value={summary?.pendingOrders ?? 0}
          />
          <StatCard
            label="Active Products"
            value={summary?.productCount ?? 0}
          />
          <StatCard label="Customers" value={summary?.customerCount ?? 0} />
          <Link href="/admin/inventory?lowStockOnly=true">
            <StatCard
              label="Low Stock Items"
              value={lowStockCount}
              sublabel={lowStockCount > 0 ? "Click to review" : "All good"}
            />
          </Link>
        </div>
      )}
    </div>
  );
}
