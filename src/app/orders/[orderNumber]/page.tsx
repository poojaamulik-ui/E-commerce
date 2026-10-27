import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getOrderForCustomer } from "@/lib/services/orderService";
import { formatINR, formatDateTime } from "@/lib/formatters";
import {
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

interface OrderPageProps {
  params: Promise<{ orderNumber: string }>;
  searchParams: Promise<{ status?: string }>;
}

export default async function OrderConfirmationPage({
  params,
  searchParams,
}: OrderPageProps) {
  const { orderNumber } = await params;
  const { status: queryStatus } = await searchParams;

  const order = await getOrderForCustomer(orderNumber);

  if (!order) {
    notFound();
  }

  const shippingAddress = order.shippingAddress as Record<string, string>;
  const activeShipment = order.shipments[0];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Success Banner */}
      <div className="rounded-3xl border border-emerald-100 bg-emerald-50/70 p-6 sm:p-8 text-center shadow-xs">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <CheckCircle2 className="h-10 w-10 stroke-[2]" />
        </div>
        <span className="mt-4 inline-block text-xs font-bold uppercase tracking-wider text-emerald-800">
          Order Placed Successfully
        </span>
        <h1 className="mt-1 text-2xl font-bold font-serif text-gray-950 sm:text-3xl">
          Thank you, {order.customerName}!
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
          We have received your order and sent a confirmation email to{" "}
          <span className="font-semibold text-gray-900">{order.customerEmail}</span>.
        </p>

        <div className="mt-6 inline-flex items-center gap-3 rounded-2xl bg-white px-5 py-2.5 shadow-xs border border-emerald-200/60 text-xs">
          <span className="text-gray-500">Order Reference:</span>
          <span className="font-mono font-bold text-gray-900">{order.orderNumber}</span>
        </div>
      </div>

      {/* Order Status & Tracking Timeline */}
      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 border-b border-gray-100 pb-3">
          Fulfillment Status
        </h2>

        <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gray-50/70 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-900">
                Order Status: <span className="text-amber-800 font-bold">{order.status}</span>
              </p>
              <p className="text-[11px] text-gray-500">
                Payment: <span className="font-semibold text-emerald-700">{order.paymentStatus}</span>
              </p>
            </div>
          </div>

          {activeShipment?.trackingNumber && (
            <div className="text-left sm:text-right">
              <p className="text-xs font-semibold text-gray-900">
                Carrier: {activeShipment.carrier}
              </p>
              <p className="text-[11px] text-gray-500 font-mono">
                Tracking: {activeShipment.trackingNumber}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Items & Price Breakdown */}
      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 border-b border-gray-100 pb-3">
          Items Ordered ({order.items.length})
        </h2>

        <div className="divide-y divide-gray-100">
          {order.items.map((item) => (
            <div key={item.id} className="py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-50 border border-gray-100" style={{ position: "relative" }}>
                  {item.imageUrl ? (
                    <Image src={item.imageUrl} alt={item.productName} fill className="object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                      Item
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-gray-900">{item.productName}</h4>
                  <p className="text-[11px] text-gray-500">
                    Qty: {item.quantity} × {formatINR(item.unitPrice)}
                  </p>
                  <p className="text-[10px] text-gray-400 font-mono">SKU: {item.sku}</p>
                </div>
              </div>
              <span className="text-sm font-bold text-gray-950">
                {formatINR(item.totalPrice)}
              </span>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="border-t border-gray-100 pt-4 space-y-2 text-xs">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span className="font-semibold text-gray-900">{formatINR(order.subtotalAmount)}</span>
          </div>
          {order.discountAmount > 0 && (
            <div className="flex justify-between text-emerald-700">
              <span>Coupon Discount ({order.couponCode})</span>
              <span className="font-semibold">-{formatINR(order.discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between text-gray-600">
            <span>Delivery Charges</span>
            <span className="font-semibold text-gray-900">
              {order.shippingAmount === 0 ? "FREE" : formatINR(order.shippingAmount)}
            </span>
          </div>
          <div className="border-t border-gray-100 pt-3 flex justify-between items-baseline text-sm">
            <span className="font-bold text-gray-950">Total Paid</span>
            <span className="text-lg font-extrabold text-amber-900">
              {formatINR(order.totalAmount)}
            </span>
          </div>
        </div>
      </div>

      {/* Delivery Address & Customer Details */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-amber-700" /> Delivery Address
          </h3>
          <div className="mt-3 text-xs text-gray-600 space-y-1">
            <p className="font-semibold text-gray-900">{shippingAddress.name}</p>
            <p>{shippingAddress.street}</p>
            {shippingAddress.landmark && <p>Landmark: {shippingAddress.landmark}</p>}
            <p>
              {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pincode}
            </p>
            <p className="pt-1">Phone: +91 {shippingAddress.phone}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-amber-700" /> Order Details
          </h3>
          <div className="mt-3 text-xs text-gray-600 space-y-1.5">
            <p>Date: {formatDateTime(order.createdAt)}</p>
            <p>Payment Method: Online (Razorpay UPI / Cards)</p>
            <p>Invoice status: Issued</p>
          </div>
        </div>
      </div>

      {/* Back to Shopping */}
      <div className="mt-12 text-center">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 rounded-lg bg-[#1E3F20] px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm hover:bg-[#2A572D] transition"
        >
          Continue Shopping <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
