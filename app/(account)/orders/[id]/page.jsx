"use client";

import Link from "next/link";
import { useGetOrderQuery } from "../../../../features/orders/ordersApi";

const RETURNABLE_STATUSES = ["delivered", "completed"];

export default function OrderDetailPage({ params }) {
  const { data, isLoading } = useGetOrderQuery(params.id);

  if (isLoading) return <div className="max-w-2xl mx-auto px-4 py-16">Loading order...</div>;
  const order = data?.data;
  if (!order) return <div className="max-w-2xl mx-auto px-4 py-16">Order not found.</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">Order {order.orderNumber}</h1>
      <p className="text-gray-500 mb-6">
        Status: <span className="font-medium text-gray-900">{order.status}</span> · Payment:{" "}
        <span className="font-medium text-gray-900">{order.paymentStatus}</span>
      </p>

      <div className="space-y-3">
        {order.items.map((item) => (
          <div key={item._id} className="flex justify-between border-b border-gray-100 pb-2">
            <span>{item.title} × {item.quantity}</span>
            <span>৳{item.subtotal.toLocaleString()}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-1 text-sm">
        <div className="flex justify-between"><span>Subtotal</span><span>৳{order.subtotal.toLocaleString()}</span></div>
        {order.discount > 0 && (
          <div className="flex justify-between text-green-600"><span>Discount</span><span>-৳{order.discount.toLocaleString()}</span></div>
        )}
        <div className="flex justify-between"><span>Shipping{order.shippingZoneName ? ` (${order.shippingZoneName})` : ""}</span><span>৳{order.shippingCost.toLocaleString()}</span></div>
        <div className="flex justify-between font-semibold text-base pt-2"><span>Total</span><span>৳{order.total.toLocaleString()}</span></div>
      </div>

      <div className="mt-6 flex gap-4">
        <a
          href={`${process.env.NEXT_PUBLIC_API_URL}/invoices/${order._id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-brand-500 hover:underline"
        >
          Download Invoice (PDF)
        </a>
        {RETURNABLE_STATUSES.includes(order.status) && (
          <Link href={`/orders/${order._id}/return`} className="text-sm text-brand-500 hover:underline">
            Request a Return
          </Link>
        )}
      </div>
    </div>
  );
}
