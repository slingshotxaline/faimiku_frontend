"use client";

import Link from "next/link";
import {
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
} from "../../../features/admin/adminApi";
import ExportCsvButton from "../../../components/admin/ExportCsvButton";

const STATUSES = [
  "pending",
  "confirmed",
  "packed",
  "shipped",
  "out_for_delivery",
  "delivered",
  "completed",
  "cancelled",
  "returned",
  "refunded",
  "failed",
];

export default function AdminOrdersPage() {
  const { data, isLoading } = useGetAllOrdersQuery();
  const [updateStatus] = useUpdateOrderStatusMutation();

  const orders = data?.data || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Orders</h1>
        <ExportCsvButton path="/orders/export.csv" label="Export Orders CSV" />
      </div>
      {isLoading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-100">
                <th className="py-2 pr-4">Order #</th>
                <th className="py-2 pr-4">Customer</th>
                <th className="py-2 pr-4">Total</th>
                <th className="py-2 pr-4">Payment</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b border-gray-50">
                  <td className="py-3 pr-4 font-medium">
                    <Link
                      href={`/admin/orders/${order._id}`}
                      className="hover:text-brand-500"
                    >
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="py-3 pr-4">{order.customer?.name || "—"}</td>
                  <td className="py-3 pr-4">৳{order.total.toLocaleString()}</td>
                  <td className="py-3 pr-4">{order.paymentStatus}</td>
                  <td className="py-3 pr-4">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateStatus({
                          id: order._id,
                          status: e.target.value,
                          note: `Status changed to ${e.target.value}`,
                        })
                      }
                      className="border rounded px-2 py-1"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 pr-4">
                    <Link
                      href={`/admin/orders/${order._id}`}
                      className="text-brand-500 hover:underline text-xs"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-gray-400">
                    No orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
