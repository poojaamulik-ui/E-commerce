"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/components/cart/CartContext";
import { formatINR } from "@/lib/formatters";
import { FREE_SHIPPING_THRESHOLD_PAISE, STANDARD_SHIPPING_FEE_PAISE } from "@/lib/shipping";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Truck,
} from "lucide-react";

export default function CartPage() {
  const { cart, updateQuantity, removeItem, isLoading } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [couponResult, setCouponResult] = useState<{
    code: string;
    discountAmountPaise: number;
    description?: string;
  } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const subtotal = cart?.subtotalPaise || 0;
  const discount = couponResult?.discountAmountPaise || 0;
  const subtotalAfterDiscount = Math.max(0, subtotal - discount);

  const isFreeShipping = subtotalAfterDiscount >= FREE_SHIPPING_THRESHOLD_PAISE;
  const shippingAmount = isFreeShipping ? 0 : STANDARD_SHIPPING_FEE_PAISE;
  const totalAmount = subtotalAfterDiscount + shippingAmount;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setIsApplyingCoupon(true);
    setCouponError(null);

    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode }),
      });

      const data = await res.json();
      if (!res.ok) {
        setCouponError(data.error || "Failed to apply coupon.");
        setCouponResult(null);
      } else {
        setCouponResult(data.coupon);
        setCouponError(null);
      }
    } catch {
      setCouponError("Unable to validate coupon. Please try again.");
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  if (!cart?.items || cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl 2xl:max-w-[1600px] px-4 py-20 text-center sm:px-6 lg:px-8 2xl:px-12">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#FAF7F2] text-[#1E3F20]">
          <ShoppingBag className="h-10 w-10 stroke-[1.5]" />
        </div>
        <h1 className="mt-6 font-serif text-2xl sm:text-3xl font-bold text-[#1C1F1C]">
          Your Shopping Cart is Empty
        </h1>
        <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
          Thoughtful home essentials, table lamps, organic throws, and handcrafted ceramics are waiting for you.
        </p>
        <Link
          href="/products"
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#1E3F20] px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-white shadow-sm transition hover:bg-[#2A572D]"
        >
          Explore Collection <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl 2xl:max-w-[1600px] px-4 py-10 sm:px-6 lg:px-8 2xl:px-12">
      {/* Title matching Screen 4: Your Cart (2 Items) */}
      <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1F1C]">
        Your Cart ({cart.totalItemCount} {cart.totalItemCount === 1 ? "Item" : "Items"})
      </h1>

      <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-12 2xl:gap-16">
        {/* Left Column: Cart Table */}
        <div className="lg:col-span-8 space-y-4">
          <div className="overflow-hidden rounded-2xl border border-[#E8E3DA] bg-white shadow-xs">
            {/* Table Header matching Screen 4 */}
            <div className="hidden sm:grid grid-cols-12 gap-4 border-b border-[#E8E3DA] bg-[#FAF7F2] px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-600">
              <span className="col-span-6">Product</span>
              <span className="col-span-2 text-center">Price</span>
              <span className="col-span-2 text-center">Quantity</span>
              <span className="col-span-2 text-right">Total</span>
            </div>

            {/* Cart Items Rows */}
            <div className="divide-y divide-gray-100">
              {cart.items.map((item) => (
                <div key={item.id} className="p-4 sm:px-6 sm:py-5 flex flex-col sm:grid sm:grid-cols-12 gap-4 items-center">
                  {/* Product Info */}
                  <div className="col-span-6 flex items-center gap-4 w-full">
                    <div
                      className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-50 border border-gray-100"
                      style={{ position: "relative", width: "4rem", height: "4rem" }}
                    >
                      {item.product.images[0]?.url ? (
                        <Image
                          src={item.product.images[0].url}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                          Item
                        </div>
                      )}
                    </div>
                    <div>
                      <Link
                        href={`/products/${item.product.slug}`}
                        className="text-xs sm:text-sm font-semibold text-gray-900 hover:text-[#1E3F20] line-clamp-1"
                      >
                        {item.product.name}
                      </Link>
                      {item.variant && (
                        <p className="text-[11px] text-gray-500">{item.variant.name}</p>
                      )}
                      <button
                        onClick={() => removeItem(item.id)}
                        disabled={isLoading}
                        className="mt-1 flex items-center gap-1 text-[11px] text-gray-400 hover:text-red-600 transition"
                      >
                        <Trash2 className="h-3 w-3" /> Remove
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="col-span-2 text-center text-xs text-gray-700 font-medium">
                    {formatINR(item.product.salePrice || item.product.basePrice)}
                  </div>

                  {/* Quantity Stepper */}
                  <div className="col-span-2 flex justify-center">
                    <div className="flex items-center rounded-lg border border-[#E8E3DA] bg-white">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={isLoading}
                        className="px-2.5 py-1 text-gray-600 hover:text-gray-900 disabled:opacity-40"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-7 text-center text-xs font-bold text-gray-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={isLoading || item.quantity >= item.maxAvailable}
                        className="px-2.5 py-1 text-gray-600 hover:text-gray-900 disabled:opacity-40"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  {/* Line Total */}
                  <div className="col-span-2 text-right text-xs sm:text-sm font-bold text-gray-900">
                    {formatINR(item.lineTotal)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Continue Shopping Link */}
          <div className="pt-2">
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-[#1E3F20] transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Continue Shopping
            </Link>
          </div>
        </div>

        {/* Right Column: Order Summary matching Screen 4 */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl border border-[#E8E3DA] bg-white p-6 shadow-xs">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#1C1F1C] border-b border-[#E8E3DA] pb-3">
              Order Summary
            </h3>

            <div className="mt-4 space-y-3 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({cart.totalItemCount} {cart.totalItemCount === 1 ? "Item" : "Items"})</span>
                <span className="font-semibold text-gray-900">{formatINR(subtotal)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Coupon Discount ({couponResult?.code})</span>
                  <span className="font-semibold">-{formatINR(discount)}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="font-semibold text-gray-900">
                  {isFreeShipping ? (
                    <span className="text-emerald-700 font-bold uppercase text-[10px]">FREE</span>
                  ) : (
                    formatINR(shippingAmount)
                  )}
                </span>
              </div>

              {isFreeShipping && (
                <p className="text-[11px] text-emerald-700">
                  Free shipping on orders above ₹999
                </p>
              )}

              <div className="border-t border-[#E8E3DA] pt-4 flex justify-between items-baseline text-sm">
                <span className="font-bold text-[#1C1F1C]">Total</span>
                <span className="text-lg font-extrabold text-[#1E3F20]">
                  {formatINR(totalAmount)}
                </span>
              </div>
            </div>

            {/* Forest Green CTA matching Screen 4 */}
            <Link
              href="/checkout"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#1E3F20] py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-[#2A572D]"
            >
              Proceed to Checkout <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Coupon Code Drawer */}
          <div className="rounded-2xl border border-[#E8E3DA] bg-white p-4 shadow-xs">
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input
                type="text"
                placeholder="Enter Promo Code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                className="flex-1 rounded-lg border border-[#E8E3DA] bg-gray-50 px-3 py-2 text-xs uppercase placeholder:normal-case focus:border-[#1E3F20] focus:bg-white focus:outline-hidden"
              />
              <button
                type="submit"
                disabled={isApplyingCoupon || !couponCode.trim()}
                className="rounded-lg bg-[#1E3F20] px-4 py-2 text-xs font-semibold text-white hover:bg-[#2A572D] transition disabled:opacity-50"
              >
                Apply
              </button>
            </form>

            {couponError && <p className="mt-2 text-xs text-red-600">{couponError}</p>}
            {couponResult && (
              <p className="mt-2 text-xs text-emerald-700 font-medium">
                ✓ Coupon &quot;{couponResult.code}&quot; applied: Saved {formatINR(couponResult.discountAmountPaise)}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
