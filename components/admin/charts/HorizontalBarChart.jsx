"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function HorizontalBarChart({
  data = [],
  dataKey,
  labelKey,
  color = "#6366f1",
  formatter,
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
      >
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey={labelKey}
          width={110}
          tick={{ fontSize: 11, fill: "#475569" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => (v?.length > 16 ? `${v.slice(0, 16)}…` : v)}
        />
        <Tooltip
          formatter={(value) => [formatter ? formatter(value) : value]}
          cursor={{ fill: "#f8fafc" }}
          contentStyle={{
            borderRadius: 12,
            border: "1px solid #f1f5f9",
            fontSize: 12,
          }}
        />
        <Bar dataKey={dataKey} radius={[0, 6, 6, 0]} barSize={14}>
          {data.map((_, i) => (
            <Cell key={i} fill={color} fillOpacity={1 - i * 0.09} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
