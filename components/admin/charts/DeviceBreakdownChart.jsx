"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = { desktop: "#6366f1", mobile: "#38bdf8", tablet: "#f59e0b" };
const FALLBACK = "#a1a1aa";

export default function DeviceBreakdownChart({ data = [] }) {
  const total = data.reduce((s, d) => s + d.views, 0);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey="views"
          nameKey="device"
          innerRadius={50}
          outerRadius={80}
          paddingAngle={3}
          strokeWidth={0}
        >
          {data.map((entry, i) => (
            <Cell
              key={entry.device ?? i}
              fill={COLORS[entry.device?.toLowerCase()] ?? FALLBACK}
            />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name) => [
            `${value} (${total ? Math.round((value / total) * 100) : 0}%)`,
            name,
          ]}
          contentStyle={{
            borderRadius: 12,
            border: "1px solid #f1f5f9",
            fontSize: 12,
          }}
        />
        <Legend
          verticalAlign="bottom"
          height={24}
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 11, textTransform: "capitalize" }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
