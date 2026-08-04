"use client";

import {
  ComposedChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
const fmtMoney = (v) => `৳${Number(v).toLocaleString()}`;

export default function RevenueChart({ data = [] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        data={data}
        margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
      >
        <defs>
          <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity={0.25} />
            <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="#f1f5f9" />
        <XAxis
          dataKey="_id"
          tickFormatter={fmtDate}
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          yAxisId="revenue"
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `৳${Math.round(v / 1000)}k`}
        />
        <YAxis yAxisId="orders" orientation="right" hide />
        <Tooltip
          formatter={(value, name) =>
            name === "revenue"
              ? [fmtMoney(value), "Revenue"]
              : [value, "Orders"]
          }
          labelFormatter={fmtDate}
          contentStyle={{
            borderRadius: 12,
            border: "1px solid #f1f5f9",
            fontSize: 12,
            boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
          }}
        />
        <Area
          yAxisId="revenue"
          type="monotone"
          dataKey="revenue"
          stroke="#10b981"
          strokeWidth={2}
          fill="url(#revenueFill)"
        />
        <Bar
          yAxisId="orders"
          dataKey="orders"
          fill="#38bdf8"
          radius={[4, 4, 0, 0]}
          barSize={10}
          fillOpacity={0.7}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
