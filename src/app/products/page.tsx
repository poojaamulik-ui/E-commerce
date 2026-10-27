import React from "react";
import Link from "next/link";
import { getProducts, getCategories } from "@/lib/services/productService";
import { ProductCard } from "@/components/product/ProductCard";
import { Filter, X, ChevronRight, SlidersHorizontal, ChevronDown } from "lucide-react";

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    sort?: "newest" | "price_asc" | "price_desc" | "name_asc";
    inStock?: string;
    page?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const currentCategory = params.category;
  const currentSearch = params.search;
  const currentSort = params.sort || "newest";
  const inStockOnly = params.inStock === "true";
  const currentPage = parseInt(params.page || "1", 10);

  const [productsData, categories] = await Promise.all([
    getProducts({
      categorySlug: currentCategory,
      search: currentSearch,
      sort: currentSort,
      inStockOnly,
      page: currentPage,
      limit: 12,
    }),
    getCategories(),
  ]);

  const activeCategory = categories.find((c) => c.slug === currentCategory);

  return (
    <div className="mx-auto max-w-7xl 2xl:max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8 2xl:px-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6">
        <Link href="/" className="hover:text-[#1E3F20] transition">
          Home
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-gray-900 font-medium">
          {activeCategory ? activeCategory.name : "Shop All"}
        </span>
      </nav>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-[#E8E3DA] pb-6">
        <div>
          <h1 className="text-3xl font-bold font-serif text-[#1C1F1C]">
            {activeCategory ? activeCategory.name : "All Home Essentials"}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-gray-600">
            {activeCategory?.description ||
              "Thoughtful artisanal table lamps, hand-braided jute rugs, ceramic dinnerware, and organic linen."}
          </p>
        </div>
        <p className="text-xs font-semibold text-gray-600">
          {productsData.totalCount} {productsData.totalCount === 1 ? "Product" : "Products"} found
        </p>
      </div>

      {/* Active Filter Pills */}
      {(currentCategory || currentSearch || inStockOnly) && (
        <div className="mt-4 flex flex-wrap items-center gap-2 pt-2">
          <span className="text-xs font-medium text-gray-500">Active filters:</span>
          {activeCategory && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#FAF7F2] border border-[#1E3F20]/30 px-3 py-1 text-xs font-semibold text-[#1E3F20]">
              Category: {activeCategory.name}
              <Link href={`/products?sort=${currentSort}${currentSearch ? `&search=${currentSearch}` : ""}`}>
                <X className="h-3 w-3 hover:text-red-600" />
              </Link>
            </span>
          )}
          {currentSearch && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#FAF7F2] border border-[#1E3F20]/30 px-3 py-1 text-xs font-semibold text-[#1E3F20]">
              Search: &quot;{currentSearch}&quot;
              <Link href={`/products?sort=${currentSort}${currentCategory ? `&category=${currentCategory}` : ""}`}>
                <X className="h-3 w-3 hover:text-red-600" />
              </Link>
            </span>
          )}
          {inStockOnly && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#FAF7F2] border border-[#1E3F20]/30 px-3 py-1 text-xs font-semibold text-[#1E3F20]">
              In Stock Only
              <Link
                href={`/products?sort=${currentSort}${currentCategory ? `&category=${currentCategory}` : ""}${
                  currentSearch ? `&search=${currentSearch}` : ""
                }`}
              >
                <X className="h-3 w-3 hover:text-red-600" />
              </Link>
            </span>
          )}
          <Link href="/products" className="text-xs font-semibold text-[#1E3F20] underline hover:text-[#2A572D] ml-2">
            Clear all
          </Link>
        </div>
      )}

      {/* Main Layout: Filters Sidebar + Product Grid */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Sidebar Filters */}
        <aside className="space-y-6">
          <div className="rounded-2xl border border-[#E8E3DA] bg-white p-5 shadow-xs">
            <div className="flex items-center gap-2 pb-4 border-b border-[#E8E3DA] text-gray-900 font-semibold text-sm">
              <SlidersHorizontal className="h-4 w-4 text-[#1E3F20]" />
              <span>Filters</span>
            </div>

            {/* Categories List */}
            <div className="mt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                Categories
              </h4>
              <div className="space-y-1.5">
                <Link
                  href={`/products?sort=${currentSort}${currentSearch ? `&search=${currentSearch}` : ""}`}
                  className={`block rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
                    !currentCategory
                      ? "bg-[#FAF7F2] text-[#1E3F20] font-bold border border-[#1E3F20]/20"
                      : "text-gray-600 hover:bg-[#F5F2EB] hover:text-gray-900"
                  }`}
                >
                  All Categories
                </Link>
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/products?category=${cat.slug}&sort=${currentSort}${
                      currentSearch ? `&search=${currentSearch}` : ""
                    }`}
                    className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
                      currentCategory === cat.slug
                        ? "bg-[#FAF7F2] text-[#1E3F20] font-bold border border-[#1E3F20]/20"
                        : "text-gray-600 hover:bg-[#F5F2EB] hover:text-gray-900"
                    }`}
                  >
                    <span className="truncate">{cat.name}</span>
                    <span className="text-[10px] text-gray-400 font-mono">
                      {cat._count.products}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Stock Filter */}
            <div className="mt-6 pt-6 border-t border-[#E8E3DA]">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                Availability
              </h4>
              <Link
                href={`/products?${currentCategory ? `category=${currentCategory}&` : ""}${
                  currentSearch ? `search=${currentSearch}&` : ""
                }sort=${currentSort}&inStock=${!inStockOnly}`}
                className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  readOnly
                  className="rounded border-gray-300 text-[#1E3F20] focus:ring-[#1E3F20] cursor-pointer"
                />
                <span>In Stock items only</span>
              </Link>
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <div className="lg:col-span-3">
          {productsData.products.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
              <Filter className="h-10 w-10 text-gray-300" />
              <h3 className="mt-4 text-base font-bold text-gray-900">No products match your criteria</h3>
              <p className="mt-1 text-xs text-gray-500 max-w-sm">
                Try clearing selected filters or searching for another keyword like &quot;lamp&quot; or &quot;cushion&quot;.
              </p>
              <Link
                href="/products"
                className="mt-6 inline-flex rounded-lg bg-[#1E3F20] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#2A572D]"
              >
                Clear all filters
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
                  categoryName={product.categories[0]?.category.name}
                  imageUrl={product.images[0]?.url}
                  badge="Bestseller"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
