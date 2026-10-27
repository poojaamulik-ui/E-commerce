"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart/CartContext";
import {
  ShoppingBag,
  Zap,
  Check,
  Truck,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";

interface Variant {
  id: string;
  name: string;
  price: number;
  salePrice: number | null;
  stockQuantity: number;
}

interface ProductDetailActionsProps {
  productId: string;
  stockQuantity: number;
  productName: string;
  variants?: Variant[];
}

export function ProductDetailActions({
  productId,
  stockQuantity,
  productName,
  variants = [],
}: ProductDetailActionsProps) {
  const router = useRouter();
  const { addItem, isLoading } = useCart();
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    variants.length > 0 ? variants[0].id : null
  );
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const isOutOfStock = stockQuantity <= 0;

  const handleAddToCart = async () => {
    if (isOutOfStock || isAdding) return;
    setIsAdding(true);
    try {
      await addItem(productId, selectedVariantId, quantity);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (isOutOfStock) return;
    setIsAdding(true);
    try {
      await addItem(productId, selectedVariantId, quantity);
      router.push("/checkout");
    } catch (err) {
      console.error(err);
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Shade Color / Variants Pill Selection */}
      {variants.length > 0 && (
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
            Shade Color
          </label>
          <div className="flex flex-wrap gap-2.5">
            {variants.map((v) => {
              const isSelected = selectedVariantId === v.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelectedVariantId(v.id)}
                  className={`rounded-lg px-4 py-2 text-xs font-semibold transition border ${
                    isSelected
                      ? "border-[#1E3F20] bg-[#FAF7F2] text-[#1E3F20] shadow-xs ring-1 ring-[#1E3F20]"
                      : "border-[#E8E3DA] bg-white text-gray-700 hover:border-gray-400"
                  }`}
                >
                  {v.name.replace(" Shade", "")}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quantity Stepper */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
          Quantity
        </label>
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-lg border border-[#E8E3DA] bg-white">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1 || isLoading}
              className="px-3.5 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 disabled:opacity-40"
            >
              -
            </button>
            <span className="w-10 text-center text-xs font-bold text-gray-900">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(stockQuantity, q + 1))}
              disabled={quantity >= stockQuantity || isLoading}
              className="px-3.5 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 disabled:opacity-40"
            >
              +
            </button>
          </div>
          <span className="text-xs text-emerald-800 font-medium">
            In Stock ✓
          </span>
        </div>
      </div>

      {/* Dual CTA Buttons (Solid Forest Green Add to Cart + Terracotta Buy Now) */}
      <div className="space-y-3 pt-2">
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock || isAdding || isLoading}
          className={`flex w-full items-center justify-center gap-2 rounded-lg py-3.5 px-6 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition ${
            justAdded
              ? "bg-emerald-700"
              : isOutOfStock
              ? "bg-gray-300 cursor-not-allowed text-gray-600"
              : "bg-[#1E3F20] hover:bg-[#2A572D] shadow-[#1E3F20]/20"
          }`}
        >
          {justAdded ? (
            <>
              <Check className="h-4 w-4" /> Added to Cart
            </>
          ) : (
            <>
              <ShoppingBag className="h-4 w-4" /> Add to Cart
            </>
          )}
        </button>

        <button
          onClick={handleBuyNow}
          disabled={isOutOfStock || isAdding || isLoading}
          className={`flex w-full items-center justify-center gap-2 rounded-lg py-3.5 px-6 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition ${
            isOutOfStock
              ? "bg-gray-200 cursor-not-allowed text-gray-400"
              : "bg-[#A0522D] hover:bg-[#8B4513] shadow-[#A0522D]/20"
          }`}
        >
          <Zap className="h-4 w-4" /> Buy Now
        </button>
      </div>

      {/* 3 Trust Features Strip from Reference Board Screen 3 */}
      <div className="mt-8 rounded-2xl border border-[#E8E3DA] bg-[#F8F6F0] p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center divide-y sm:divide-y-0 sm:divide-x divide-[#E8E3DA]">
          <div className="flex flex-col items-center justify-center gap-1 py-1">
            <Truck className="h-4 w-4 text-[#1E3F20]" />
            <span className="text-xs font-bold text-gray-900">Free Shipping</span>
            <span className="text-[10px] text-gray-500">on orders above ₹999</span>
          </div>

          <div className="flex flex-col items-center justify-center gap-1 py-1 pt-3 sm:pt-1">
            <RotateCcw className="h-4 w-4 text-[#1E3F20]" />
            <span className="text-xs font-bold text-gray-900">Easy Returns</span>
            <span className="text-[10px] text-gray-500">7-day policy</span>
          </div>

          <div className="flex flex-col items-center justify-center gap-1 py-1 pt-3 sm:pt-1">
            <ShieldCheck className="h-4 w-4 text-[#1E3F20]" />
            <span className="text-xs font-bold text-gray-900">1 Year Warranty</span>
            <span className="text-[10px] text-gray-500">on this product</span>
          </div>
        </div>
      </div>
    </div>
  );
}
