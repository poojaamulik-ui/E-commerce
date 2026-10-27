"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid, Heart, User } from "lucide-react";

export function MobileBottomNav() {
  const pathname = usePathname();

  // Hide on admin routes
  if (pathname.startsWith("/admin")) {
    return null;
  }

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Shop", href: "/products", icon: Grid },
    { label: "Wishlist", href: "/account", icon: Heart },
    { label: "Account", href: "/account", icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 flex h-16 items-center justify-around border-t border-[#EBE6DF] bg-white/95 px-2 backdrop-blur-md md:hidden shadow-lg">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center justify-center gap-1 py-1 px-3 text-[11px] font-medium transition ${
              isActive ? "text-[#1E3F20] font-bold" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <Icon className={`h-5 w-5 ${isActive ? "stroke-[2.5]" : "stroke-[1.75]"}`} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
