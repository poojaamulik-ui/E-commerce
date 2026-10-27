import React from "react";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getUserOrders } from "@/lib/services/orderService";
import { prisma } from "@/lib/db";
import { formatINR, formatDate } from "@/lib/formatters";
import {
  User,
  Package,
  MapPin,
  Heart,
  Settings,
  LogOut,
  Truck,
  CheckCircle2,
  Clock,
  ArrowRight,
} from "lucide-react";

export default async function CustomerAccountPage() {
  const session = await getSession();

  if (!session) {
    redirect("/account/login");
  }

  const [user, orders] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.userId },
      include: { addresses: true },
    }),
    getUserOrders(session.userId),
  ]);

  if (!user) {
    redirect("/account/login");
  }

  return (
    <div className="mx-auto max-w-7xl 2xl:max-w-[1600px] px-4 py-10 sm:px-6 lg:px-8 2xl:px-12">
      {/* 3-Column Layout from Reference Board Screen 6 */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 2xl:gap-10">
        {/* Left Sidebar: Account Navigation */}
        <div className="lg:col-span-3">
          <div className="rounded-2xl border border-[#E8E3DA] bg-white p-5 shadow-xs">
            {/* User Profile Info */}
            <div className="flex items-center gap-3 border-b border-[#E8E3DA] pb-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1E3F20] text-sm font-bold text-white">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <h2 className="text-sm font-bold text-gray-900 truncate">{user.name}</h2>
                <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
              </div>
            </div>

            {/* Nav Links */}
            <nav className="mt-4 flex flex-col space-y-1 text-xs">
              <button className="flex items-center gap-3 rounded-lg px-3 py-2.5 font-medium text-gray-600 hover:bg-[#F5F2EB] transition text-left">
                <User className="h-4 w-4" /> My Account
              </button>
              <button className="flex items-center gap-3 rounded-lg bg-[#FAF7F2] border border-[#1E3F20]/20 px-3 py-2.5 font-bold text-[#1E3F20] text-left">
                <Package className="h-4 w-4" /> My Orders
              </button>
              <button className="flex items-center gap-3 rounded-lg px-3 py-2.5 font-medium text-gray-600 hover:bg-[#F5F2EB] transition text-left">
                <Truck className="h-4 w-4" /> Track Order
              </button>
              <button className="flex items-center gap-3 rounded-lg px-3 py-2.5 font-medium text-gray-600 hover:bg-[#F5F2EB] transition text-left">
                <Heart className="h-4 w-4" /> Wishlist
              </button>
              <button className="flex items-center gap-3 rounded-lg px-3 py-2.5 font-medium text-gray-600 hover:bg-[#F5F2EB] transition text-left">
                <MapPin className="h-4 w-4" /> Addresses
              </button>
              <button className="flex items-center gap-3 rounded-lg px-3 py-2.5 font-medium text-gray-600 hover:bg-[#F5F2EB] transition text-left">
                <Settings className="h-4 w-4" /> Account Settings
              </button>

              <div className="pt-2">
                <form action="/api/auth/logout" method="POST">
                  <button
                    type="submit"
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 font-medium text-red-600 hover:bg-red-50 transition text-left"
                  >
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </form>
              </div>
            </nav>
          </div>
        </div>

        {/* Center Panel: My Orders with Status Tabs */}
        <div className="lg:col-span-6 space-y-6">
          <div className="rounded-2xl border border-[#E8E3DA] bg-white p-6 shadow-xs">
            <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#1C1F1C]">
              My Orders
            </h1>

            {/* Order Status Tabs */}
            <div className="mt-4 flex gap-4 overflow-x-auto border-b border-[#E8E3DA] pb-2 text-xs font-semibold uppercase tracking-wider">
              <button className="text-[#1E3F20] border-b-2 border-[#1E3F20] pb-2 font-bold whitespace-nowrap">
                All Orders ({orders.length})
              </button>
              <button className="text-gray-400 hover:text-gray-800 pb-2 whitespace-nowrap transition">
                Processing
              </button>
              <button className="text-gray-400 hover:text-gray-800 pb-2 whitespace-nowrap transition">
                Shipped
              </button>
              <button className="text-gray-400 hover:text-gray-800 pb-2 whitespace-nowrap transition">
                Delivered
              </button>
              <button className="text-gray-400 hover:text-gray-800 pb-2 whitespace-nowrap transition">
                Cancelled
              </button>
            </div>

            {/* Orders List */}
            <div className="mt-6 space-y-5">
              {orders.length === 0 ? (
                <div className="py-12 text-center text-xs text-gray-500">
                  <p>You have not placed any orders yet.</p>
                  <Link
                    href="/products"
                    className="mt-4 inline-block font-semibold text-[#1E3F20] underline"
                  >
                    Start exploring Nestora essentials
                  </Link>
                </div>
              ) : (
                orders.map((order) => (
                  <div
                    key={order.id}
                    className="overflow-hidden rounded-xl border border-[#E8E3DA] bg-white transition hover:border-[#D5CDC2]"
                  >
                    {/* Order Card Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2 bg-[#FAF7F2] px-4 py-3 border-b border-[#E8E3DA]">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold text-[#1C1F1C]">
                          Order #{order.orderNumber}
                        </span>
                        <span className="text-[11px] text-gray-500">
                          Placed on {formatDate(order.createdAt)}
                        </span>
                      </div>
                      <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                        {order.status === "SHIPPED" ? "In Transit" : order.status}
                      </span>
                    </div>

                    {/* Order Items Preview */}
                    <div className="divide-y divide-gray-100 p-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 py-2">
                          <div
                            className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-50 border border-gray-100"
                            style={{ position: "relative", width: "3rem", height: "3rem" }}
                          >
                            {item.imageUrl ? (
                              <Image src={item.imageUrl} alt={item.productName} fill className="object-cover" />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-[10px] text-gray-400">
                                Item
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-semibold text-gray-900 truncate">
                              {item.productName}
                            </h4>
                            <p className="text-[11px] text-gray-500">
                              Qty: {item.quantity} × {formatINR(item.unitPrice)}
                            </p>
                          </div>
                          <span className="text-xs font-bold text-gray-900">
                            {formatINR(item.totalPrice)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Footer Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E8E3DA] bg-[#FAF7F2] px-4 py-3 text-xs">
                      <span className="text-[11px] text-[#60665E]">
                        Estimated Delivery: 24 Jan 2025
                      </span>
                      <div className="flex gap-2">
                        <Link
                          href={`/orders/${order.orderNumber}`}
                          className="rounded-lg border border-[#E8E3DA] bg-white px-3 py-1.5 font-semibold text-gray-700 hover:bg-gray-50 transition"
                        >
                          View Details
                        </Link>
                        <Link
                          href={`/orders/${order.orderNumber}`}
                          className="rounded-lg bg-[#1E3F20] px-3 py-1.5 font-semibold text-white hover:bg-[#2A572D] transition"
                        >
                          Track Order
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Track Your Order with Milestone Timeline */}
        <div className="lg:col-span-3">
          <div className="rounded-2xl border border-[#E8E3DA] bg-white p-5 shadow-xs space-y-6">
            <div>
              <h3 className="font-serif text-sm font-bold text-[#1C1F1C]">
                Track Your Order
              </h3>
              <p className="text-[11px] text-gray-500 mt-1">
                Enter your order ID for live courier tracking.
              </p>

              <form action="/orders" className="mt-3 space-y-2">
                <input
                  type="text"
                  placeholder="e.g. NS126548"
                  defaultValue="NS126548"
                  className="w-full rounded-lg border border-[#E8E3DA] bg-gray-50 px-3 py-2 text-xs font-mono text-gray-900 placeholder:text-gray-400 focus:border-[#1E3F20] focus:bg-white focus:outline-hidden"
                />
                <button
                  type="button"
                  className="w-full rounded-lg bg-[#1E3F20] py-2 text-xs font-semibold text-white hover:bg-[#2A572D] transition"
                >
                  Track Order
                </button>
              </form>
            </div>

            {/* Vertical Milestone Timeline */}
            <div className="border-t border-[#E8E3DA] pt-5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-700">
                Shipment Milestones
              </span>

              <div className="mt-4 space-y-5 text-xs">
                {/* 1. Order Placed */}
                <div className="flex items-start gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white mt-0.5">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-900">Order Placed</h5>
                    <p className="text-[10px] text-gray-500">20 Jan, 10:24 AM</p>
                  </div>
                </div>

                {/* 2. Packed */}
                <div className="flex items-start gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white mt-0.5">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-900">Packed</h5>
                    <p className="text-[10px] text-gray-500">20 Jan, 04:12 PM</p>
                  </div>
                </div>

                {/* 3. Shipped */}
                <div className="flex items-start gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white mt-0.5">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-900">Shipped</h5>
                    <p className="text-[10px] text-gray-500">21 Jan, 09:30 AM</p>
                  </div>
                </div>

                {/* 4. Out for Delivery */}
                <div className="flex items-start gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-400 mt-0.5">
                    <Clock className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-500">Out for Delivery</h5>
                    <p className="text-[10px] text-gray-400">Expected by 24 Jan</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
