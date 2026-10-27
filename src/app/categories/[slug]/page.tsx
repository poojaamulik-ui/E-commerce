import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getCategoryBySlug, getProducts } from "@/lib/services/productService";
import { ProductCard } from "@/components/product/ProductCard";
import { ChevronRight, ChevronDown, SlidersHorizontal } from "lucide-react";
import type { Metadata } from "next";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return { title: "Category Not Found | Nestora" };
  }

  return {
    title: `${category.name} | Nestora Home & Living`,
    description: category.description || `Explore thoughtful ${category.name} for your home.`,
  };
}

export default async function CategoryDetailPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const productsData = await getProducts({ categorySlug: slug, limit: 24 });

  return (
    <div className="mx-auto max-w-7xl 2xl:max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8 2xl:px-12">
      {/* Breadcrumb matching Screen 2: Home > Home & Living */}
      <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6">
        <Link href="/" className="hover:text-[#1E3F20] transition">
          Home
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-gray-900 font-medium">{category.name}</span>
      </nav>

      {/* Category Header Banner with Image */}
      <div className="relative overflow-hidden rounded-2xl bg-[#F5F2EB] border border-[#E8E3DA] p-6 sm:p-10 mb-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="max-w-lg">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1F1C]">
            {category.name}
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-gray-600 leading-relaxed">
            {category.description || "Refine your space with everyday essentials and thoughtful natural design."}
          </p>
        </div>

        {category.imageUrl && (
          <div
            className="relative h-28 w-44 sm:h-36 sm:w-56 shrink-0 overflow-hidden rounded-xl shadow-xs"
            style={{ position: "relative" }}
          >
            <Image
              src={category.imageUrl}
              alt={category.name}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
      </div>

      {/* Main Grid: Filters Sidebar on Left + Products on Right (Screen 2 Layout) */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Filter Sidebar */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="rounded-2xl border border-[#E8E3DA] bg-white p-5 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-[#E8E3DA] pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#1C1F1C]">
                Filters
              </span>
              <button className="text-[11px] font-semibold text-gray-400 hover:text-[#1E3F20] transition">
                Clear All
              </button>
            </div>

            {/* Sub-Category Checkboxes */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-gray-900 block">Category</label>
              <div className="space-y-2 text-xs text-gray-600">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded text-[#1E3F20] focus:ring-[#1E3F20]" />
                    <span>Cushions &amp; Covers</span>
                  </span>
                  <span className="text-gray-400 text-[10px]">(24)</span>
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="flex items-center gap-2">
                    <input type="checkbox" className="rounded text-[#1E3F20] focus:ring-[#1E3F20]" />
                    <span>Throws &amp; Blankets</span>
                  </span>
                  <span className="text-gray-400 text-[10px]">(18)</span>
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="flex items-center gap-2">
                    <input type="checkbox" className="rounded text-[#1E3F20] focus:ring-[#1E3F20]" />
                    <span>Rugs</span>
                  </span>
                  <span className="text-gray-400 text-[10px]">(12)</span>
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="flex items-center gap-2">
                    <input type="checkbox" className="rounded text-[#1E3F20] focus:ring-[#1E3F20]" />
                    <span>Lamps &amp; Lighting</span>
                  </span>
                  <span className="text-gray-400 text-[10px]">(16)</span>
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="flex items-center gap-2">
                    <input type="checkbox" className="rounded text-[#1E3F20] focus:ring-[#1E3F20]" />
                    <span>Plants &amp; Pots</span>
                  </span>
                  <span className="text-gray-400 text-[10px]">(20)</span>
                </label>
              </div>
            </div>

            {/* Price Slider */}
            <div className="border-t border-[#E8E3DA] pt-4 space-y-3">
              <label className="text-xs font-bold text-gray-900 block">Price Range</label>
              <input
                type="range"
                min="500"
                max="5000"
                defaultValue="3000"
                className="w-full accent-[#1E3F20] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-gray-500 font-mono">
                <span>₹500</span>
                <span>₹5,000</span>
              </div>
            </div>

            {/* Material Filter */}
            <div className="border-t border-[#E8E3DA] pt-4 space-y-3">
              <label className="text-xs font-bold text-gray-900 block">Material</label>
              <div className="space-y-2 text-xs text-gray-600">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="flex items-center gap-2">
                    <input type="checkbox" className="rounded text-[#1E3F20]" />
                    <span>Cotton</span>
                  </span>
                  <span className="text-gray-400 text-[10px]">(28)</span>
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="flex items-center gap-2">
                    <input type="checkbox" className="rounded text-[#1E3F20]" />
                    <span>Wood</span>
                  </span>
                  <span className="text-gray-400 text-[10px]">(14)</span>
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="flex items-center gap-2">
                    <input type="checkbox" className="rounded text-[#1E3F20]" />
                    <span>Ceramic</span>
                  </span>
                  <span className="text-gray-400 text-[10px]">(10)</span>
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="flex items-center gap-2">
                    <input type="checkbox" className="rounded text-[#1E3F20]" />
                    <span>Metal</span>
                  </span>
                  <span className="text-gray-400 text-[10px]">(9)</span>
                </label>
              </div>
            </div>

            {/* Color Swatches matching Screen 2 */}
            <div className="border-t border-[#E8E3DA] pt-4 space-y-3">
              <label className="text-xs font-bold text-gray-900 block">Color</label>
              <div className="flex gap-2.5">
                <button className="h-5 w-5 rounded-full bg-[#3B5338] border border-black/10 ring-1 ring-offset-1 ring-[#1E3F20]" />
                <button className="h-5 w-5 rounded-full bg-[#C2A676] border border-black/10" />
                <button className="h-5 w-5 rounded-full bg-[#D48C68] border border-black/10" />
                <button className="h-5 w-5 rounded-full bg-[#E6DDD1] border border-black/10" />
              </div>
            </div>
          </div>
        </aside>

        {/* Right Products Area */}
        <main className="lg:col-span-9 space-y-6">
          {/* Top Sort & Count Bar */}
          <div className="flex items-center justify-between border-b border-[#E8E3DA] pb-3 text-xs">
            <span className="font-bold text-gray-900">
              {productsData.totalCount} Products
            </span>

            <div className="flex items-center gap-2 text-gray-600">
              <span>Sort by:</span>
              <button className="flex items-center gap-1 font-bold text-gray-900 hover:text-[#1E3F20]">
                Popularity <ChevronDown className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* Product Cards Grid (3 columns on desktop matching Screen 2) */}
          {productsData.products.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 p-12 text-center bg-white">
              <p className="text-sm font-semibold text-gray-700">No products found in this category.</p>
              <Link
                href="/products"
                className="mt-4 inline-block text-xs font-bold text-[#1E3F20] underline"
              >
                Browse all products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:gap-8">
              {productsData.products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  slug={product.slug}
                  basePrice={product.basePrice}
                  salePrice={product.salePrice}
                  stockQuantity={product.stockQuantity}
                  categoryName={category.name}
                  imageUrl={product.images[0]?.url}
                  badge="Bestseller"
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
