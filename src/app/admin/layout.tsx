import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import {
  LayoutDashboard,
  Package,
  Layers,
  Boxes,
  ShoppingCart,
  Users,
  Tag,
  Settings,
  ExternalLink,
  ShieldCheck,
  LogOut,
} from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session || (session.role !== "ADMIN" && session.role !== "STAFF")) {
    redirect("/account/login?redirect=/admin");
  }

  const navLinks = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/orders", label: "Orders & Fulfillment", icon: ShoppingCart },
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/categories", label: "Categories", icon: Layers },
    { href: "/admin/inventory", label: "Inventory & Alerts", icon: Boxes },
    { href: "/admin/customers", label: "Customers", icon: Users },
    { href: "/admin/coupons", label: "Coupons & Discounts", icon: Tag },
    { href: "/admin/settings", label: "Store Configuration", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-gray-950 text-gray-300 flex flex-col shrink-0 border-r border-gray-800">
        {/* Brand */}
        <div className="p-5 border-b border-gray-800 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-600 text-white font-bold">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-white tracking-tight">BharatBazaar</span>
              <span className="block text-[10px] font-semibold text-amber-400 uppercase tracking-wider">
                Admin Control
              </span>
            </div>
          </Link>
        </div>

        {/* User Badge */}
        <div className="px-5 py-3 border-b border-gray-800/80 bg-gray-900/40 text-xs">
          <p className="text-gray-400">Signed in as:</p>
          <p className="font-semibold text-white truncate">{session.name}</p>
          <span className="inline-block rounded-md bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300 mt-1 uppercase">
            {session.role}
          </span>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3.5 py-2.5 text-xs font-medium rounded-xl text-gray-300 hover:bg-gray-800 hover:text-white transition"
              >
                <Icon className="h-4 w-4 text-amber-500" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-800 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 text-xs font-semibold text-gray-400 hover:text-white rounded-lg hover:bg-gray-800/60 transition"
          >
            <span>View Live Storefront</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-7xl 2xl:max-w-[1600px] overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
