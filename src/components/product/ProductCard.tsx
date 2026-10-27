"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatINR } from "@/lib/formatters";
import { useCart } from "@/components/cart/CartContext";
import { ShoppingBag, Check, Heart } from "lucide-react";

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  basePrice: number;
  salePrice: number | null;
  stockQuantity: number;
  categoryName?: string;
  imageUrl?: string | null;
  rating?: number;
  reviewsCount?: number;
  badge?: string;
}

export function ProductCard({
  id,
  name,
  slug,
  basePrice,
  salePrice,
  stockQuantity,
  categoryName,
  imageUrl,
  rating = 4.8,
  badge = "Bestseller",
}: ProductCardProps) {
  const { addItem, openCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const effectivePrice = salePrice && salePrice < basePrice ? salePrice : basePrice;
  const hasDiscount = salePrice && salePrice < basePrice;
  const discountPercent = hasDiscount
    ? Math.round(((basePrice - salePrice!) / basePrice) * 100)
    : 0;

  const isOutOfStock = stockQuantity <= 0;

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock || isAdding) return;

    try {
      setIsAdding(true);
      await addItem(id, null, 1);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
      openCart();
    } catch (err) {
      console.error("Failed to quick-add product", err);
    } finally {
      setIsAdding(false);
    }
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#EBE6DF] bg-white transition-all duration-300 hover:shadow-lg hover:border-[#D5CDC2]">
      {/* Thumbnail Container */}
      <Link
        href={`/products/${slug}`}
        className="relative block aspect-square w-full overflow-hidden bg-[#F6F4EF]"
        style={{ position: "relative", display: "block", width: "100%", aspectRatio: "1 / 1" }}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#F6F4EF] text-xs text-gray-400">
            No image available
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {badge && (
            <span className="rounded bg-[#A0522D] px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white shadow-xs">
              {badge}
            </span>
          )}
          {isOutOfStock && (
            <span className="rounded bg-gray-900 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
              Sold Out
            </span>
          )}
        </div>

        {/* Wishlist Heart Toggle */}
        <button
          onClick={toggleWishlist}
          className={`absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 shadow-sm transition hover:scale-110 ${
            isWishlisted ? "text-red-500" : "text-gray-500 hover:text-red-500"
          }`}
          aria-label="Save to Wishlist"
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`} />
        </button>
      </Link>

      {/* Info & Purchase CTA */}
      <div className="flex flex-1 flex-col p-4">
        {categoryName && (
          <p className="text-[11px] font-medium text-gray-500">
            {categoryName}
          </p>
        )}

        <Link href={`/products/${slug}`} className="mt-1">
          <h3 className="line-clamp-2 text-sm font-semibold text-[#1C1F1C] transition group-hover:text-[#1E3F20]">
            {name}
          </h3>
        </Link>

        {/* Pricing */}
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-base font-bold text-[#1C1F1C]">
            {formatINR(effectivePrice)}
          </span>
          {hasDiscount && (
            <>
              <span className="text-xs text-gray-400 line-through">
                {formatINR(basePrice)}
              </span>
              <span className="text-xs font-semibold text-emerald-700">
                ({discountPercent}% off)
              </span>
            </>
          )}
        </div>

        {/* Solid Forest Green Add to Cart Button */}
        <button
          onClick={handleQuickAdd}
          disabled={isOutOfStock || isAdding}
          className={`mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg py-2.5 text-xs font-semibold transition ${
            justAdded
              ? "bg-emerald-700 text-white"
              : isOutOfStock
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-[#1E3F20] text-white hover:bg-[#2A572D] shadow-sm"
          }`}
          aria-label={`Add ${name} to cart`}
        >
          {justAdded ? (
            <>
              <Check className="h-4 w-4" /> Added
            </>
          ) : (
            <>
              <ShoppingBag className="h-4 w-4" /> Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
}
