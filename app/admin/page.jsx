"use client";

import Link from "next/link";
import {
  Wallet,
  ShoppingCart,
  Clock,
  Package,
  Users,
  AlertTriangle,
} from "lucide-react";
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

  const stats = [
    {
      icon: Wallet,
      label: "Total Revenue",
      value: summary?.totalRevenue ?? 0,
      prefix: "৳",
      accent: "emerald",
    },
    {
      icon: ShoppingCart,
      label: "Orders Today",
      value: summary?.ordersToday ?? 0,
      accent: "sky",
    },
    {
      icon: Clock,
      label: "Pending Orders",
      value: summary?.pendingOrders ?? 0,
      accent: "amber",
    },
    {
      icon: Package,
      label: "Active Products",
      value: summary?.productCount ?? 0,
      accent: "violet",
    },
    {
      icon: Users,
      label: "Customers",
      value: summary?.customerCount ?? 0,
      accent: "fuchsia",
    },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            A live snapshot of how the store is doing today.
          </p>
        </div>
        <span className="hidden items-center gap-1.5 rounded-full bg-gray-50 px-3 py-1 text-xs text-gray-400 sm:inline-flex">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          Live
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <StatCard key={stat.label} {...stat} index={i} loading={isLoading} />
        ))}

        <Link href="/admin/inventory?lowStockOnly=true" className="block">
          <StatCard
            icon={AlertTriangle}
            label="Low Stock Items"
            value={lowStockCount}
            sublabel={lowStockCount > 0 ? "Click to review →" : "All good"}
            accent={lowStockCount > 0 ? "rose" : "emerald"}
            pulse={lowStockCount > 0}
            index={stats.length}
            loading={isLoading}
          />
        </Link>
      </div>
    </div>
  );
}
