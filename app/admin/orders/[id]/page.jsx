"use client";

import Link from "next/link";
import { useGetOrderQuery } from "../../../../features/orders/ordersApi";
import { useUpdateOrderStatusMutation } from "../../../../features/admin/adminApi";
import DownloadFileButton from "../../../../components/shared/DownloadFileButton";

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

const STATUS_COLORS = {
  pending: "bg-gray-100 text-gray-600",
  confirmed: "bg-blue-50 text-blue-600",
  packed: "bg-indigo-50 text-indigo-600",
  shipped: "bg-purple-50 text-purple-600",
  out_for_delivery: "bg-purple-50 text-purple-600",
  delivered: "bg-green-50 text-green-600",
  completed: "bg-green-50 text-green-600",
  cancelled: "bg-red-50 text-red-600",
  returned: "bg-red-50 text-red-600",
  refunded: "bg-red-50 text-red-600",
  failed: "bg-red-50 text-red-600",
};

const PAYMENT_STATUS_COLORS = {
  pending: "bg-gray-100 text-gray-600",
  success: "bg-green-50 text-green-600",
  failed: "bg-red-50 text-red-600",
  cancelled: "bg-red-50 text-red-600",
  refunded: "bg-amber-50 text-amber-600",
  initiated: "bg-blue-50 text-blue-600",
};

export default function AdminOrderDetailPage({ params }) {
  const { data, isLoading } = useGetOrderQuery(params.id);
  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateOrderStatusMutation();

  if (isLoading) return <p className="text-gray-500">Loading...</p>;

  const order = data?.data?.order;
  const payments = data?.data?.payments || [];

  if (!order) return <p className="text-gray-500">Order not found.</p>;

  const handleStatusChange = (status) => {
    updateStatus({
      id: order._id,
      status,
      note: `Status changed to ${status}`,
    });
  };

  return (
    <div className="max-w-4xl">
      <Link
        href="/admin/orders"
        className="text-sm text-gray-400 hover:underline"
      >
        ← Back to Orders
      </Link>

      <div className="flex items-start justify-between mt-2 mb-6">
        <div>
          <h1 className="text-2xl font-bold">{order.orderNumber}</h1>
          <p className="text-sm text-gray-400 mt-1">
            Placed {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="flex gap-2">
          <DownloadFileButton
            path={`/invoices/${order._id}/packing-slip`}
            className="text-sm border rounded-lg px-4 py-2 hover:bg-gray-50"
          >
            Packing Slip
          </DownloadFileButton>
          <DownloadFileButton
            path={`/invoices/${order._id}`}
            className="text-sm border rounded-lg px-4 py-2 hover:bg-gray-50"
          >
            Download Invoice
          </DownloadFileButton>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="border border-gray-100 rounded-xl p-4">
            <h2 className="font-medium mb-3">Items</h2>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item._id} className="flex items-center gap-3">
                  {item.image && (
                    <img
                      src={item.image}
                      alt=""
                      className="w-12 h-12 rounded object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-gray-400">
                      Qty {item.quantity} × ৳{item.price.toLocaleString()}
                    </p>
                  </div>
                  <p className="text-sm font-medium">
                    ৳{item.subtotal.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-1 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>৳{order.subtotal.toLocaleString()}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>
                    Discount{" "}
                    {order.coupon?.code ? `(${order.coupon.code})` : ""}
                  </span>
                  <span>-৳{order.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-500">
                <span>
                  Shipping{" "}
                  {order.shippingZoneName ? `(${order.shippingZoneName})` : ""}
                </span>
                <span>৳{order.shippingCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-semibold pt-1">
                <span>Total</span>
                <span>৳{order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="border border-gray-100 rounded-xl p-4">
            <h2 className="font-medium mb-3">Status History</h2>
            <div className="space-y-3">
              {[...order.statusHistory].reverse().map((entry, i) => (
                <div key={i} className="flex gap-3 text-sm">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs h-fit ${
                      STATUS_COLORS[entry.status] || "bg-gray-100"
                    }`}
                  >
                    {entry.status}
                  </span>
                  <div>
                    {entry.note && (
                      <p className="text-gray-600">{entry.note}</p>
                    )}
                    <p className="text-xs text-gray-400">
                      {new Date(entry.changedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {payments.length > 0 && (
            <div className="border border-gray-100 rounded-xl p-4">
              <h2 className="font-medium mb-3">Payment Attempts</h2>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-400 text-xs">
                    <th className="pb-2">Gateway</th>
                    <th className="pb-2">Amount</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2">Transaction ID</th>
                    <th className="pb-2">When</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => (
                    <tr key={p._id} className="border-t border-gray-50">
                      <td className="py-2">{p.gateway}</td>
                      <td className="py-2">৳{p.amount.toLocaleString()}</td>
                      <td className="py-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs ${
                            PAYMENT_STATUS_COLORS[p.status] || "bg-gray-100"
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="py-2 text-gray-400 font-mono text-xs">
                        {p.transactionId || "—"}
                      </td>
                      <td className="py-2 text-gray-400">
                        {new Date(p.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="border border-gray-100 rounded-xl p-4">
            <h2 className="font-medium mb-3">Order Status</h2>
            <select
              value={order.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={isUpdating}
              className="w-full border rounded px-3 py-2 text-sm"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-400 mt-2">
              Payment:{" "}
              <span
                className={`px-2 py-0.5 rounded-full ${
                  PAYMENT_STATUS_COLORS[order.paymentStatus] || "bg-gray-100"
                }`}
              >
                {order.paymentStatus}
              </span>
              {" · "}
              {order.paymentMethod}
            </p>
          </div>

          <div className="border border-gray-100 rounded-xl p-4">
            <h2 className="font-medium mb-3">Customer</h2>
            <p className="text-sm font-medium">{order.customer?.name}</p>
            {order.customer?.email && (
              <p className="text-sm text-gray-500">{order.customer.email}</p>
            )}
            {order.customer?.phone && (
              <p className="text-sm text-gray-500">{order.customer.phone}</p>
            )}
            {order.customer?.isGuest && (
              <span className="inline-block mt-2 text-xs bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full">
                Guest account
              </span>
            )}
          </div>

          <div className="border border-gray-100 rounded-xl p-4">
            <h2 className="font-medium mb-3">Shipping Address</h2>
            <p className="text-sm text-gray-600">
              {order.shippingAddress?.fullName}
            </p>
            <p className="text-sm text-gray-600">
              {order.shippingAddress?.phone}
            </p>
            <p className="text-sm text-gray-600">
              {order.shippingAddress?.street}
            </p>
            <p className="text-sm text-gray-600">
              {order.shippingAddress?.city}
              {order.shippingAddress?.district
                ? `, ${order.shippingAddress.district}`
                : ""}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
