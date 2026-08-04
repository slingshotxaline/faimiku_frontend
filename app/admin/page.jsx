"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Wallet,
  ShoppingCart,
  Clock,
  Package,
  Users,
  AlertTriangle,
  Banknote,
  RotateCcw,
  XCircle,
} from "lucide-react";
import { useGetDashboardSummaryQuery } from "../../features/admin/adminApi";
import { useGetInventoryOverviewQuery } from "../../features/inventory/inventoryApi";
import StatCard from "../../components/admin/StatCard";
// add to imports
import RevenueChart from "../../components/admin/charts/RevenueChart";
import TrafficChart from "../../components/admin/charts/TrafficChart";
import DeviceBreakdownChart from "../../components/admin/charts/DeviceBreakdownChart";
import HorizontalBarChart from "../../components/admin/charts/HorizontalBarChart";
import ChartCard from "../../components/admin/charts/ChartCard";
import {
  useGetSalesAnalyticsQuery,
  useGetDailyTrafficQuery,
  useGetDeviceBreakdownQuery,
  useGetTopPagesQuery,
  useGetProductAnalyticsQuery,
} from "../../features/admin/adminApi";

// range shorthand -> actual dates, since sales/customer analytics
// endpoints expect literal from/to, unlike the summary endpoint
const rangeToDates = (range) => {
  if (range === "all") return {};
  const now = new Date();
  const daysMap = {
    today: 1,
    yesterday: 2,
    "7d": 7,
    "1m": 30,
    "3m": 90,
    "6m": 180,
    "1y": 365,
    "2y": 730,
  };
  const daysAgo = daysMap[range] ?? 30;
  return {
    from: new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000).toISOString(),
    to: now.toISOString(),
  };
};

const rangeToDays = (range) => {
  const map = {
    today: 1,
    yesterday: 2,
    "7d": 7,
    "1m": 30,
    "3m": 90,
    "6m": 180,
    "1y": 365,
    "2y": 730,
    all: 365,
  };
  return map[range] ?? 30;
};

const REVENUE_RANGES = [
  { label: "All Time", value: "all" },
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "Last 7 Days", value: "7d" },
  { label: "Last Month", value: "1m" },
  { label: "Last 3 Months", value: "3m" },
  { label: "Last 6 Months", value: "6m" },
  { label: "Last 1 Year", value: "1y" },
  { label: "Last 2 Years", value: "2y" },
];

export default function AdminOverviewPage() {
  const [range, setRange] = useState("all");

  const { data, isLoading, isFetching } = useGetDashboardSummaryQuery({
    range,
  });
  const { data: inventoryData } = useGetInventoryOverviewQuery({
    lowStockOnly: true,
  });
  const summary = data?.data;
  const lowStockCount = inventoryData?.data?.length ?? 0;

  const { from, to } = rangeToDates(range);
  const days = rangeToDays(range);

  const { data: salesRes, isFetching: salesLoading } =
    useGetSalesAnalyticsQuery({ from, to });
  const { data: trafficRes, isFetching: trafficLoading } =
    useGetDailyTrafficQuery(days);
  const { data: deviceRes, isFetching: deviceLoading } =
    useGetDeviceBreakdownQuery(days);
  const { data: topPagesRes, isFetching: topPagesLoading } =
    useGetTopPagesQuery({ days, limit: 8 });
  const { data: productRes, isFetching: productLoading } =
    useGetProductAnalyticsQuery();

  const byDay = salesRes?.data?.byDay ?? [];
  const dailyTraffic = trafficRes?.data ?? [];
  const deviceBreakdown = deviceRes?.data ?? [];
  const topPages = topPagesRes?.data ?? [];
  const bestSellers = productRes?.data?.bestSellers?.slice(0, 6) ?? [];

  return (
    <div className="relative">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(80%_60%_at_20%_-10%,theme(colors.emerald.50),transparent),radial-gradient(60%_50%_at_100%_0%,theme(colors.sky.50),transparent)]" />

      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-sky-500 mb-1">
            Dashboard
          </p>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
            Overview
          </h1>
        </div>

        <div className="relative">
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="appearance-none text-sm font-medium border border-gray-200 bg-white rounded-xl pl-4 pr-9 py-2 text-gray-600 shadow-sm transition-all duration-200 hover:border-sky-300 hover:shadow focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400"
          >
            {REVENUE_RANGES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
          <svg
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M5 7.5L10 12.5L15 7.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {isFetching && !isLoading && (
            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-sky-500 animate-ping" />
          )}
        </div>
      </div>

      {isLoading ? (
        <SkeletonGrid />
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <StatCard
              index={0}
              icon={Wallet}
              label="Total Revenue"
              value={summary?.totalRevenue ?? 0}
              prefix="৳"
              sublabel="Collected & confirmed"
              loading={isFetching}
              accent="emerald"
              trend={summary?.revenueTrend}
            />
            <StatCard
              index={1}
              icon={ShoppingCart}
              label="Orders Today"
              value={summary?.ordersToday ?? 0}
              loading={isFetching}
              accent="sky"
            />
            <StatCard
              index={2}
              icon={Clock}
              label="Pending Orders"
              value={summary?.pendingOrders ?? 0}
              loading={isFetching}
              accent="amber"
            />
            <StatCard
              index={3}
              icon={Package}
              label="Active Products"
              value={summary?.productCount ?? 0}
              loading={isFetching}
              accent="violet"
            />
            <StatCard
              index={4}
              icon={Users}
              label="Customers"
              value={summary?.customerCount ?? 0}
              loading={isFetching}
              accent="fuchsia"
            />
            <Link href="/admin/inventory?lowStockOnly=true">
              <StatCard
                index={5}
                icon={AlertTriangle}
                label="Low Stock Items"
                value={lowStockCount}
                sublabel={lowStockCount > 0 ? "Click to review" : "All good"}
                accent="rose"
                pulse={lowStockCount > 0}
              />
            </Link>
          </div>

          <div className="flex items-center gap-2 mt-10 mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Money in Motion
            </h2>
            <span className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <StatCard
              index={6}
              icon={Banknote}
              label="Pending COD"
              value={summary?.pendingCodRevenue ?? 0}
              prefix="৳"
              sublabel={`${
                summary?.pendingCodOrderCount ?? 0
              } order(s) not yet delivered`}
              loading={isFetching}
              accent="amber"
            />
            <StatCard
              index={7}
              icon={RotateCcw}
              label="Refunded"
              value={summary?.totalRefunded ?? 0}
              prefix="৳"
              sublabel={`${summary?.refundedOrderCount ?? 0} order(s)`}
              loading={isFetching}
              accent="sky"
            />
            <StatCard
              index={8}
              icon={XCircle}
              label="Cancelled (value)"
              value={summary?.totalCancelled ?? 0}
              prefix="৳"
              sublabel={`${summary?.cancelledOrderCount ?? 0} order(s)`}
              loading={isFetching}
              accent="rose"
            />
          </div>

          <div className="flex items-center gap-2 mt-10 mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Analytics</h2>
            <span className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <ChartCard
              title="Revenue & Orders"
              subtitle="Paid revenue vs. order volume by day"
              loading={salesLoading}
              empty={!byDay.length}
              index={0}
              className="lg:col-span-2"
            >
              <RevenueChart data={byDay} />
            </ChartCard>

            <ChartCard
              title="Device Breakdown"
              subtitle={`Views by device, last ${days}d`}
              loading={deviceLoading}
              empty={!deviceBreakdown.length}
              index={1}
            >
              <DeviceBreakdownChart data={deviceBreakdown} />
            </ChartCard>

            <ChartCard
              title="Site Traffic"
              subtitle="Page views vs. unique visitors"
              loading={trafficLoading}
              empty={!dailyTraffic.length}
              index={2}
              className="lg:col-span-2"
            >
              <TrafficChart data={dailyTraffic} />
            </ChartCard>

            <ChartCard
              title="Top Pages"
              subtitle={`Most viewed, last ${days}d`}
              loading={topPagesLoading}
              empty={!topPages.length}
              index={3}
            >
              <HorizontalBarChart
                data={topPages}
                dataKey="views"
                labelKey="path"
                color="#6366f1"
              />
            </ChartCard>

            <ChartCard
              title="Best Sellers"
              subtitle="Units sold, all-time"
              loading={productLoading}
              empty={!bestSellers.length}
              index={4}
              className="lg:col-span-3"
            >
              <HorizontalBarChart
                data={bestSellers}
                dataKey="unitsSold"
                labelKey="title"
                color="#10b981"
                formatter={(v) => `${v} units`}
              />
            </ChartCard>
          </div>
        </>
      )}
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-28 rounded-2xl bg-white border border-gray-100 overflow-hidden relative"
        >
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_infinite] bg-gradient-to-r from-transparent via-gray-100 to-transparent" />
        </div>
      ))}
      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}
