import React from "react";
import Link from "next/link";
import { ArrowLeft, Compass, ShoppingBag, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-[#FAF7F2]">
      <div className="max-w-xl w-full text-center">
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-[#EBF2EC] text-[#1E3F20] mb-6 shadow-xs">
          <Compass className="h-10 w-10 animate-pulse" />
        </div>

        <p className="text-xs font-bold uppercase tracking-widest text-[#1E3F20]">404 Error</p>
        <h1 className="mt-2 font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#1C1F1C]">
          Page Not Found
        </h1>
        <p className="mt-4 text-xs sm:text-sm text-gray-600 leading-relaxed max-w-md mx-auto">
          The page or product you are looking for might have been moved, renamed, or is currently unavailable in the catalog.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-[#1E3F20] px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white shadow-xs transition hover:bg-[#142E16]"
          >
            <Home className="h-4 w-4" /> Back to Home
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-xl border border-[#D5CEC2] bg-white px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-800 shadow-xs transition hover:bg-gray-50"
          >
            <ShoppingBag className="h-4 w-4" /> Browse Catalog
          </Link>
        </div>

        {/* Quick Links */}
        <div className="mt-12 border-t border-[#EBE6DF] pt-8">
          <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-4">
            Popular Categories
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-xs">
            <Link
              href="/categories/home-living"
              className="rounded-full bg-white border border-[#E8E3DA] px-4 py-1.5 text-gray-700 hover:border-[#1E3F20] hover:text-[#1E3F20] transition"
            >
              Home &amp; Living
            </Link>
            <Link
              href="/categories/kitchen-dining"
              className="rounded-full bg-white border border-[#E8E3DA] px-4 py-1.5 text-gray-700 hover:border-[#1E3F20] hover:text-[#1E3F20] transition"
            >
              Kitchen &amp; Dining
            </Link>
            <Link
              href="/categories/decor-accents"
              className="rounded-full bg-white border border-[#E8E3DA] px-4 py-1.5 text-gray-700 hover:border-[#1E3F20] hover:text-[#1E3F20] transition"
            >
              Decor &amp; Accents
            </Link>
            <Link
              href="/categories/gifts"
              className="rounded-full bg-white border border-[#E8E3DA] px-4 py-1.5 text-gray-700 hover:border-[#1E3F20] hover:text-[#1E3F20] transition"
            >
              Gifts &amp; Sets
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
