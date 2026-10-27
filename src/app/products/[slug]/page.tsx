import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getProductBySlug, getProducts } from "@/lib/services/productService";
import { formatINR } from "@/lib/formatters";
import { ProductDetailActions } from "@/components/product/ProductDetailActions";
import { ProductCard } from "@/components/product/ProductCard";
import { ChevronRight, Star, Heart, CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Product Not Found | Nestora" };
  }

  return {
    title: `${product.name} | Nestora`,
    description: product.shortDescription || product.description.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 160),
      images: product.images[0]?.url ? [product.images[0].url] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product || !product.isPublished) {
    notFound();
  }

  const category = product.categories[0]?.category;
  const effectivePrice = product.salePrice || product.basePrice;
  const hasDiscount = product.salePrice && product.salePrice < product.basePrice;
  const discountPercent = hasDiscount
    ? Math.round(((product.basePrice - product.salePrice!) / product.basePrice) * 100)
    : 0;

  // Fetch related products in the same category
  const relatedData = category
    ? await getProducts({ categorySlug: category.slug, limit: 5 })
    : { products: [] };
  const relatedProducts = relatedData.products.filter((p) => p.id !== product.id).slice(0, 4);

  const specs = (product.specifications as Record<string, string>) || {};

  return (
    <div className="mx-auto max-w-7xl 2xl:max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8 2xl:px-12">
      {/* Breadcrumbs matching reference Screen 3: Home > Home & Living > Lamps & Lighting > Wooden Table Lamp */}
      <nav className="flex items-center gap-2 text-xs text-gray-500 mb-8 overflow-x-auto whitespace-nowrap">
        <Link href="/" className="hover:text-[#1E3F20] transition">
          Home
        </Link>
        <ChevronRight className="h-3 w-3 shrink-0" />
        <Link href="/products" className="hover:text-[#1E3F20] transition">
          Shop
        </Link>
        {category && (
          <>
            <ChevronRight className="h-3 w-3 shrink-0" />
            <Link href={`/categories/${category.slug}`} className="hover:text-[#1E3F20] transition">
              {category.name}
            </Link>
          </>
        )}
        <ChevronRight className="h-3 w-3 shrink-0" />
        <span className="text-[#1C1F1C] font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Grid: Gallery + Details */}
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 2xl:gap-16">
        {/* Left: Product Images Gallery with Thumbnails */}
        <div className="flex flex-col-reverse sm:flex-row gap-4">
          {/* Vertical Thumbnails Stack */}
          {product.images.length > 1 && (
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto max-h-[500px]">
              {product.images.map((img) => (
                <div
                  key={img.id}
                  className="relative h-18 w-18 shrink-0 overflow-hidden rounded-xl border-2 border-transparent hover:border-[#1E3F20] bg-white cursor-pointer shadow-xs transition"
                  style={{ position: "relative", width: "4.5rem", height: "4.5rem" }}
                >
                  <Image src={img.url} alt={img.altText || product.name} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}

          {/* Main Large Image */}
          <div
            className="relative aspect-square w-full flex-1 overflow-hidden rounded-3xl border border-[#E8E3DA] bg-white shadow-sm"
            style={{ position: "relative", width: "100%", aspectRatio: "1 / 1" }}
          >
            {product.images[0]?.url ? (
              <Image
                src={product.images[0].url}
                alt={product.name}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-50 text-gray-400 text-sm">
                No product image
              </div>
            )}
          </div>
        </div>

        {/* Right: Product Purchase Matrix */}
        <div className="flex flex-col space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1C1F1C] leading-snug">
                {product.name}
              </h1>

              {/* Star Rating Badge */}
              <div className="mt-2.5 flex items-center gap-2">
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="text-xs font-bold text-[#1C1F1C]">4.8</span>
                </div>
                <span className="text-xs text-gray-500">(328 reviews)</span>
              </div>
            </div>

            {/* Wishlist Button */}
            <button
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#E8E3DA] bg-white text-gray-500 hover:text-red-500 hover:border-red-200 transition"
              aria-label="Add to wishlist"
            >
              <Heart className="h-5 w-5" />
            </button>
          </div>

          {/* Price Bar */}
          <div className="flex items-baseline gap-3 border-b border-[#E8E3DA] pb-5">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#1C1F1C]">
              {formatINR(effectivePrice)}
            </span>
            {hasDiscount && (
              <>
                <span className="text-base text-gray-400 line-through">
                  {formatINR(product.basePrice)}
                </span>
                <span className="text-sm font-bold text-[#A0522D]">
                  ({discountPercent}% off)
                </span>
              </>
            )}
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            {product.description}
          </p>

          {/* Actions: Variant Selection, Stepper, Add to Cart, Buy Now, Features */}
          <ProductDetailActions
            productId={product.id}
            stockQuantity={product.stockQuantity}
            productName={product.name}
            variants={product.variants.map((v) => ({
              id: v.id,
              name: v.name,
              price: v.price || product.basePrice,
              salePrice: v.salePrice,
              stockQuantity: v.stockQuantity,
            }))}
          />

          {/* Specifications Accordion / Grid */}
          {Object.keys(specs).length > 0 && (
            <div className="mt-6 border-t border-[#E8E3DA] pt-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-3">
                Product Specifications
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {Object.entries(specs).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-1.5 border-b border-gray-100">
                    <span className="text-gray-500">{key}:</span>
                    <span className="font-medium text-gray-900 text-right">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* You May Also Like / Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-20 border-t border-[#E8E3DA] pt-12">
          <h2 className="font-serif text-2xl font-bold text-[#1C1F1C] mb-8">
            Complete the Look
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                name={p.name}
                slug={p.slug}
                basePrice={p.basePrice}
                salePrice={p.salePrice}
                stockQuantity={p.stockQuantity}
                categoryName={category?.name}
                imageUrl={p.images[0]?.url}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
