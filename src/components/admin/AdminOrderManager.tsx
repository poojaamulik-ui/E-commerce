"use client";

import React, { useState } from "react";
import Link from "next/link";
import { formatINR, formatDateTime } from "@/lib/formatters";
import {
  Truck,
  ExternalLink,
  Search,
  CheckCircle,
  AlertCircle,
  X,
  Package,
} from "lucide-react";

interface AdminOrderManagerProps {
  initialOrders: any[];
}

export function AdminOrderManager({ initialOrders }: AdminOrderManagerProps) {
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [activeModalOrderId, setActiveModalOrderId] = useState<string | null>(null);

  // Tracking Modal State
  const [carrier, setCarrier] = useState("India Post Speed Post / Delhivery");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [isSubmittingTracking, setIsSubmittingTracking] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === "ALL" || order.status === statusFilter;
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      order.orderNumber.toLowerCase().includes(q) ||
      order.customerName.toLowerCase().includes(q) ||
      order.customerEmail.toLowerCase().includes(q) ||
      order.customerPhone.includes(q);
    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update order status");
      }

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      setMessage({ type: "success", text: "Order status updated successfully." });
      setTimeout(() => setMessage(null), 3000);
    } catch (err: unknown) {
      const text = err instanceof Error ? err.message : "Update failed";
      setMessage({ type: "error", text });
    }
  };

  const handleDispatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModalOrderId || !trackingNumber.trim()) return;

    setIsSubmittingTracking(true);
    try {
      const res = await fetch(`/api/admin/orders/${activeModalOrderId}/shipment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ carrier, trackingNumber: trackingNumber.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to record dispatch");
      }

      setOrders((prev) =>
        prev.map((o) =>
          o.id === activeModalOrderId
            ? {
                ...o,
                status: "SHIPPED",
                shipments: [{ carrier, trackingNumber, status: "IN_TRANSIT" }],
              }
            : o
        )
      );

      setMessage({ type: "success", text: "Shipment dispatch recorded and tracking updated." });
      setActiveModalOrderId(null);
      setTrackingNumber("");
      setTimeout(() => setMessage(null), 3000);
    } catch (err: unknown) {
      const text = err instanceof Error ? err.message : "Dispatch recording failed";
      setMessage({ type: "error", text });
    } finally {
      setIsSubmittingTracking(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {message && (
        <div
          className={`rounded-xl p-3 text-xs flex items-center gap-2 ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle className="h-4 w-4 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-xs">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by order #, name, email, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-xs focus:border-amber-700 focus:bg-white focus:outline-hidden"
          />
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
        </div>

        {/* Status Filter Dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-gray-600">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-medium text-gray-800 focus:border-amber-700 focus:outline-hidden"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PROCESSING">Processing</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-500">
            No orders match the current filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/80 text-gray-500 uppercase tracking-wider text-[10px] border-b border-gray-100">
                <tr>
                  <th className="py-3 px-5 font-semibold">Order #</th>
                  <th className="py-3 px-5 font-semibold">Customer</th>
                  <th className="py-3 px-5 font-semibold">Date</th>
                  <th className="py-3 px-5 font-semibold">Items</th>
                  <th className="py-3 px-5 font-semibold">Payment</th>
                  <th className="py-3 px-5 font-semibold">Fulfillment Status</th>
                  <th className="py-3 px-5 font-semibold text-right">Total</th>
                  <th className="py-3 px-5 font-semibold text-center">Dispatch</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/60 transition">
                    <td className="py-3.5 px-5 font-mono font-bold text-gray-950">
                      <Link
                        href={`/orders/${order.orderNumber}`}
                        target="_blank"
                        className="hover:text-amber-800 flex items-center gap-1"
                      >
                        {order.orderNumber}
                        <ExternalLink className="h-3 w-3 text-gray-400" />
                      </Link>
                    </td>

                    <td className="py-3.5 px-5">
                      <p className="font-semibold text-gray-900">{order.customerName}</p>
                      <p className="text-[10px] text-gray-400 font-mono">+91 {order.customerPhone}</p>
                    </td>

                    <td className="py-3.5 px-5 text-gray-500">
                      {formatDateTime(order.createdAt)}
                    </td>

                    <td className="py-3.5 px-5 text-gray-700">
                      <span className="font-semibold">{order.items.length} items</span>
                    </td>

                    <td className="py-3.5 px-5">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                          order.paymentStatus === "PAID"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>

                    <td className="py-3.5 px-5">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs font-semibold text-gray-800 focus:border-amber-700 focus:outline-hidden"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>

                    <td className="py-3.5 px-5 text-right font-bold text-gray-950">
                      {formatINR(order.totalAmount)}
                    </td>

                    <td className="py-3.5 px-5 text-center">
                      <button
                        onClick={() => {
                          setActiveModalOrderId(order.id);
                          setTrackingNumber(
                            `BB-EXP-${Date.now().toString().slice(-6)}-${Math.random()
                              .toString(36)
                              .substring(2, 6)
                              .toUpperCase()}`
                          );
                        }}
                        className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1 text-[11px] font-semibold text-gray-700 hover:bg-amber-50 hover:text-amber-800"
                      >
                        <Truck className="h-3 w-3" />
                        <span>Dispatch</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Shipment Dispatch Modal */}
      {activeModalOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setActiveModalOrderId(null)}
          />
          <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-sm font-bold text-gray-950 flex items-center gap-2">
                <Truck className="h-4 w-4 text-amber-700" /> Record Courier Dispatch
              </h3>
              <button
                onClick={() => setActiveModalOrderId(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleDispatchSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700">Courier Partner</label>
                <input
                  type="text"
                  required
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs focus:border-amber-700 focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700">Tracking Number / AWB</label>
                <input
                  type="text"
                  required
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-mono focus:border-amber-700 focus:bg-white focus:outline-hidden"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModalOrderId(null)}
                  className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingTracking}
                  className="rounded-xl bg-amber-800 px-4 py-2 text-xs font-bold text-white hover:bg-amber-900 disabled:opacity-50"
                >
                  {isSubmittingTracking ? "Saving..." : "Confirm Dispatch"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
