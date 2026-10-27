import React from "react";
import Link from "next/link";
import { getAdminDashboardStats } from "@/lib/services/adminService";
import { formatINR, formatDate, formatDateTime } from "@/lib/formatters";
import {
  IndianRupee,
  ShoppingCart,
  Clock,
  AlertTriangle,
  Package,
  TrendingUp,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardOverviewPage() {
  const stats = await getAdminDashboardStats();

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold font-serif text-gray-950 sm:text-3xl">
            Store Performance Overview
          </h1>
          <p className="mt-1 text-xs text-gray-500">
            Real-time analytics and operations data from PostgreSQL database.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/orders"
            className="rounded-xl bg-amber-800 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-900 transition"
          >
            Manage Orders ({stats.pendingFulfillmentCount} pending)
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Revenue */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Paid Revenue
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
              <IndianRupee className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-extrabold text-gray-950">
            {formatINR(stats.totalRevenuePaise)}
          </p>
          <p className="mt-1 text-[11px] text-gray-500">
            From {stats.paidOrdersCount} verified paid transactions
          </p>
        </div>

        {/* Total Orders */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Total Orders
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
              <ShoppingCart className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-extrabold text-gray-950">
            {stats.totalOrdersCount}
          </p>
          <p className="mt-1 text-[11px] text-gray-500">
            Avg Order: {formatINR(stats.averageOrderValuePaise)}
          </p>
        </div>

        {/* Pending Fulfillment */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Awaiting Dispatch
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-extrabold text-amber-800">
            {stats.pendingFulfillmentCount}
          </p>
          <p className="mt-1 text-[11px] text-gray-500">
            Orders requiring packaging & courier dispatch
          </p>
        </div>

        {/* Active Products & Low Stock */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Stock Health
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-700">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-extrabold text-gray-950">
            {stats.lowStockCount}{" "}
            <span className="text-xs font-normal text-gray-400">/ {stats.productsCount} items</span>
          </p>
          <p className="mt-1 text-[11px] text-red-600 font-semibold">
            {stats.lowStockCount > 0
              ? `${stats.lowStockCount} items at or below threshold`
              : "All products sufficiently stocked"}
          </p>
        </div>
      </div>

      {/* Low Stock Alerts Banner */}
      {stats.lowStockProducts.length > 0 && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase tracking-wider">
              <AlertTriangle className="h-4 w-4 text-amber-700" />
              <span>Low Stock Replenishment Alerts</span>
            </div>
            <Link
              href="/admin/inventory"
              className="text-xs font-semibold text-amber-800 hover:underline"
            >
              Adjust Inventory →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {stats.lowStockProducts.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between rounded-xl bg-white p-3 text-xs border border-amber-150 shadow-2xs"
              >
                <div>
                  <p className="font-semibold text-gray-900 line-clamp-1">{p.name}</p>
                  <p className="text-[10px] text-gray-400 font-mono">SKU: {p.sku}</p>
                </div>
                <span className="rounded-md bg-red-100 px-2 py-0.5 text-[11px] font-bold text-red-700">
                  {p.stockQuantity} left
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Orders Table */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-xs overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-bold text-gray-950 uppercase tracking-wider">
            Recent Orders
          </h2>
          <Link
            href="/admin/orders"
            className="text-xs font-semibold text-amber-800 hover:text-amber-900"
          >
            View All Orders →
          </Link>
        </div>

        {stats.recentOrders.length === 0 ? (
          <div className="p-8 text-center text-xs text-gray-500">
            No customer orders placed yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/80 text-gray-500 uppercase tracking-wider text-[10px] border-b border-gray-100">
                <tr>
                  <th className="py-3 px-6 font-semibold">Order</th>
                  <th className="py-3 px-6 font-semibold">Customer</th>
                  <th className="py-3 px-6 font-semibold">Date</th>
                  <th className="py-3 px-6 font-semibold">Payment</th>
                  <th className="py-3 px-6 font-semibold">Fulfillment</th>
                  <th className="py-3 px-6 font-semibold text-right">Amount</th>
                  <th className="py-3 px-6 font-semibold text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stats.recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/60 transition">
                    <td className="py-3.5 px-6 font-mono font-bold text-gray-900">
                      {order.orderNumber}
                    </td>
                    <td className="py-3.5 px-6">
                      <p className="font-semibold text-gray-900">{order.customerName}</p>
                      <p className="text-[10px] text-gray-400">{order.customerEmail}</p>
                    </td>
                    <td className="py-3.5 px-6 text-gray-500">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="py-3.5 px-6">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          order.paymentStatus === "PAID"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-6">
                      <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[10px] font-bold text-gray-700 uppercase">
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-right font-bold text-gray-950">
                      {formatINR(order.totalAmount)}
                    </td>
                    <td className="py-3.5 px-6 text-center">
                      <Link
                        href={`/orders/${order.orderNumber}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-amber-800 hover:underline"
                      >
                        Details <ExternalLink className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
