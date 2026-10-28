import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getCategories } from "@/lib/services/productService";
import { ChevronRight, ArrowRight, Sparkles } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "All Categories | Nestora Home & Living",
  description: "Browse all curated collections of home decor, kitchenware, bedding, and artisan crafts.",
};

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="mx-auto max-w-7xl 2xl:max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8 2xl:px-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6">
        <Link href="/" className="hover:text-[#1E3F20] transition">
          Home
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-gray-900 font-medium">Categories</span>
      </nav>

      {/* Header */}
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EBF2EC] px-3 py-1 text-[11px] font-semibold text-[#1E3F20] tracking-wide uppercase mb-3">
          <Sparkles className="h-3 w-3" /> Curated Collections
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl 2xl:text-5xl font-bold tracking-tight text-[#1C1F1C]">
          Explore by Category
        </h1>
        <p className="mt-3 text-xs sm:text-sm text-gray-600 leading-relaxed">
          From warm ambient lighting to handwoven linen and handcrafted tableware, discover mindful designs crafted for everyday comfort.
        </p>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat: any) => (
          <Link
            key={cat.id || cat.slug}
            href={`/categories/${cat.slug}`}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#E8E3DA] bg-white shadow-xs transition duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="relative aspect-4/3 w-full overflow-hidden bg-gray-100">
              <Image
                src={cat.imageUrl || "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=800&auto=format&fit=crop"}
                alt={cat.name}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="text-[11px] font-medium uppercase tracking-wider text-amber-200">
                  {cat._count?.products || 12}+ Items
                </p>
                <h2 className="font-serif text-2xl font-bold tracking-tight">
                  {cat.name}
                </h2>
              </div>
            </div>
            <div className="flex flex-1 flex-col justify-between p-5">
              <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                {cat.description || "Thoughtfully designed essentials for a warm, welcoming interior."}
              </p>
              <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 text-xs font-semibold text-[#1E3F20]">
                <span>Browse Collection</span>
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
