import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getProducts, getCategories } from "@/lib/services/productService";
import { ProductCard } from "@/components/product/ProductCard";
import {
  ArrowRight,
  Truck,
  RotateCcw,
  ShieldCheck,
  Star,
  ChevronRight,
} from "lucide-react";

export const revalidate = 60; // ISR cache revalidation every 60s

export default async function HomePage() {
  const [productsData, categories] = await Promise.all([
    getProducts({ limit: 8 }),
    getCategories(),
  ]);

  return (
    <div className="space-y-16 pb-20">
      {/* 1. Hero Section - Make Your Home More You */}
      <section className="relative overflow-hidden bg-[#F5F2EB]">
        <div className="mx-auto max-w-7xl 2xl:max-w-[1600px] px-4 sm:px-6 lg:px-8 2xl:px-12">
          <div className="relative min-h-[520px] 2xl:min-h-[640px] rounded-3xl overflow-hidden my-4 sm:my-6">
            {/* Background Image */}
            <div
              className="absolute inset-0"
              style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, width: "100%", height: "100%" }}
            >
              <Image
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1600&auto=format&fit=crop"
                alt="Cozy Modern Living Room with Sofa and Coffee Table"
                fill
                priority
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent sm:w-2/3" />
            </div>

            {/* Hero Copy & CTA */}
            <div className="relative z-10 flex flex-col justify-center min-h-[520px] 2xl:min-h-[640px] max-w-xl 2xl:max-w-2xl px-6 py-12 sm:px-12 2xl:px-16 2xl:py-16">
              <span className="text-[11px] 2xl:text-xs font-bold tracking-[0.2em] uppercase text-[#60665E]">
                HOME • LIVING • DECOR
              </span>

              <h1 className="mt-3 font-serif text-4xl sm:text-5xl lg:text-6xl 2xl:text-7xl font-bold tracking-tight text-[#1C1F1C] leading-[1.12]">
                Make Your <br />
                Home More You
              </h1>

              <p className="mt-4 text-sm sm:text-base 2xl:text-lg text-[#525750] leading-relaxed max-w-md 2xl:max-w-lg">
                Thoughtful essentials for a cozier, happier home. Crafted from natural materials, made to endure.
              </p>

              <div className="mt-7 2xl:mt-9">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#1E3F20] px-7 py-3.5 2xl:px-9 2xl:py-4 text-xs 2xl:text-sm font-semibold uppercase tracking-wider text-white shadow-md transition hover:bg-[#2A572D] hover:shadow-lg"
                >
                  Shop Now
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Slider Dots */}
              <div className="mt-10 2xl:mt-12 flex items-center gap-2">
                <span className="h-2 w-6 rounded-full bg-[#1E3F20]" />
                <span className="h-2 w-2 rounded-full bg-gray-300" />
                <span className="h-2 w-2 rounded-full bg-gray-300" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Shop by Category */}
      <section className="mx-auto max-w-7xl 2xl:max-w-[1600px] px-4 sm:px-6 lg:px-8 2xl:px-12">
        <div className="flex items-baseline justify-between border-b border-[#E8E3DA] pb-4">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1F1C]">
            Shop by Category
          </h2>
          <Link
            href="/products"
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#1E3F20] hover:text-[#2A572D] transition uppercase tracking-wider"
          >
            View All <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 2xl:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="group flex flex-col items-center text-center transition"
            >
              <div
                className="relative aspect-square w-full overflow-hidden rounded-2xl bg-[#F5F2EB] border border-[#E8E3DA] transition duration-300 group-hover:shadow-md group-hover:border-[#C4BDB1]"
                style={{ position: "relative", width: "100%", aspectRatio: "1 / 1" }}
              >
                {cat.imageUrl ? (
                  <Image
                    src={cat.imageUrl}
                    alt={cat.name}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-[#1E3F20]">
                    {cat.name}
                  </div>
                )}
              </div>
              <h3 className="mt-3 text-xs sm:text-sm font-semibold text-[#1C1F1C] group-hover:text-[#1E3F20] line-clamp-1">
                {cat.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Featured Picks */}
      <section className="mx-auto max-w-7xl 2xl:max-w-[1600px] px-4 sm:px-6 lg:px-8 2xl:px-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E8E3DA] pb-4">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1F1C]">
              Featured Picks
            </h2>
          </div>

          {/* Interactive Category Tabs */}
          <div className="flex gap-6 text-xs font-semibold uppercase tracking-wider">
            <button className="text-[#1E3F20] border-b-2 border-[#1E3F20] pb-2 font-bold cursor-pointer">
              Best Sellers
            </button>
            <button className="text-gray-400 hover:text-gray-800 pb-2 cursor-pointer transition">
              New Arrivals
            </button>
            <button className="text-gray-400 hover:text-gray-800 pb-2 cursor-pointer transition">
              Top Rated
            </button>
          </div>
        </div>

        {/* 4-column Product Grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 2xl:gap-8">
          {productsData.products.slice(0, 8).map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              slug={product.slug}
              basePrice={product.basePrice}
              salePrice={product.salePrice}
              stockQuantity={product.stockQuantity}
              categoryName={product.categories[0]?.category.name}
              imageUrl={product.images[0]?.url}
              badge="Bestseller"
            />
          ))}
        </div>
      </section>

      {/* 4. Value Proposition Strip */}
      <section className="mx-auto max-w-7xl 2xl:max-w-[1600px] px-4 sm:px-6 lg:px-8 2xl:px-12">
        <div className="rounded-2xl border border-[#E8E3DA] bg-[#F8F6F0] p-6 sm:p-8 2xl:p-10">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#E8E3DA]">
            {/* Free Shipping */}
            <div className="flex items-center gap-4 px-3 py-2">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white border border-[#E8E3DA] text-[#1E3F20]">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#1C1F1C]">Free Shipping</h4>
                <p className="text-[11px] text-gray-500">on orders above ₹999</p>
              </div>
            </div>

            {/* Easy Returns */}
            <div className="flex items-center gap-4 px-3 py-2 pt-4 sm:pt-2">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white border border-[#E8E3DA] text-[#1E3F20]">
                <RotateCcw className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#1C1F1C]">Easy Returns</h4>
                <p className="text-[11px] text-gray-500">7-day return policy</p>
              </div>
            </div>

            {/* Secure Payments */}
            <div className="flex items-center gap-4 px-3 py-2 pt-4 sm:pt-2">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white border border-[#E8E3DA] text-[#1E3F20]">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#1C1F1C]">Secure Payments</h4>
                <p className="text-[11px] text-gray-500">100% safe &amp; encrypted</p>
              </div>
            </div>

            {/* Trusted by */}
            <div className="flex items-center gap-4 px-3 py-2 pt-4 sm:pt-2">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white border border-[#E8E3DA] text-[#1E3F20]">
                <Star className="h-5 w-5 fill-[#1E3F20]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#1C1F1C]">Trusted by</h4>
                <p className="text-[11px] text-gray-500">50,000+ Happy customers</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
