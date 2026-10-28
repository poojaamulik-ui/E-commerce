import React from "react";
import Link from "next/link";
import { ChevronRight, Heart, ShoppingBag, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Wishlist | Nestora",
  description: "View and manage items saved to your personal wishlist.",
};

export default function WishlistPage() {
  return (
    <div className="mx-auto max-w-7xl 2xl:max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8 2xl:px-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6">
        <Link href="/" className="hover:text-[#1E3F20] transition">
          Home
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-gray-900 font-medium">Wishlist</span>
      </nav>

      <div className="mx-auto max-w-2xl py-12 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#EBF2EC] text-[#1E3F20] mb-6">
          <Heart className="h-10 w-10 fill-current opacity-80" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#1C1F1C]">
          Your Wishlist is Empty
        </h1>
        <p className="mt-3 text-sm text-gray-600 leading-relaxed max-w-md mx-auto">
          Explore our handcrafted collections and click the heart icon on any product to save your favorite decor pieces here.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-xl bg-[#1E3F20] px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white shadow-xs transition hover:bg-[#142E16]"
          >
            <ShoppingBag className="h-4 w-4" /> Explore Catalog
          </Link>
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 rounded-xl border border-[#D5CEC2] bg-white px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-800 shadow-xs transition hover:bg-gray-50"
          >
            Browse Categories <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
