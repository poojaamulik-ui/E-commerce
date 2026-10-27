"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "./CartContext";
import { formatINR } from "@/lib/formatters";
import { FREE_SHIPPING_THRESHOLD_PAISE } from "@/lib/shipping";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";

export function CartDrawer() {
  const { cart, isOpen, closeCart, updateQuantity, removeItem, isLoading } = useCart();

  if (!isOpen) return null;

  const subtotal = cart?.subtotalPaise || 0;
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD_PAISE - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD_PAISE) * 100));

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
        onClick={closeCart}
      />

      {/* Drawer Panel */}
      <div className="relative z-10 flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-amber-600" />
            <h2 className="text-lg font-semibold text-gray-900">Your Shopping Bag</h2>
            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700">
              {cart?.totalItemCount || 0}
            </span>
          </div>
          <button
            onClick={closeCart}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close cart drawer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Free Shipping Indicator */}
        <div className="border-b border-gray-100 bg-amber-50/50 px-6 py-3">
          {remainingForFreeShipping > 0 ? (
            <div>
              <p className="text-xs text-amber-800">
                Add <span className="font-semibold">{formatINR(remainingForFreeShipping)}</span> more for{" "}
                <span className="font-semibold text-emerald-700">FREE Delivery across India</span>
              </p>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-amber-200/50">
                <div
                  className="h-full rounded-full bg-emerald-600 transition-all duration-300"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <p className="text-xs font-medium text-emerald-700">
              🎉 Congratulations! You have unlocked <span className="font-semibold">FREE Delivery</span>!
            </p>
          )}
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {!cart?.items || cart.items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="rounded-full bg-amber-50 p-6 text-amber-600">
                <ShoppingBag className="h-10 w-10 stroke-[1.5]" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-gray-900">Your bag is empty</h3>
              <p className="mt-1 text-sm text-gray-500">Explore authentic Indian heritage collections.</p>
              <button
                onClick={closeCart}
                className="mt-6 rounded-lg bg-amber-700 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-amber-800"
              >
                Browse Products
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 rounded-xl border border-gray-100 p-3 transition hover:border-gray-200"
                >
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-50" style={{ position: "relative", width: "5rem", height: "5rem" }}>
                    {item.product.images[0]?.url ? (
                      <Image
                        src={item.product.images[0].url}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gray-100 text-xs text-gray-400">
                        No image
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h4 className="line-clamp-1 text-sm font-semibold text-gray-900">
                        {item.product.name}
                      </h4>
                      {item.variant && (
                        <p className="text-xs text-gray-500">{item.variant.name}</p>
                      )}
                      <p className="mt-1 text-sm font-bold text-amber-900">
                        {formatINR(item.effectiveUnitPrice)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={isLoading}
                          className="p-1 text-gray-500 hover:text-gray-900 disabled:opacity-50"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-semibold text-gray-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={isLoading || item.quantity >= item.maxAvailable}
                          className="p-1 text-gray-500 hover:text-gray-900 disabled:opacity-50"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        disabled={isLoading}
                        className="text-gray-400 hover:text-red-500"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with Subtotal & Checkout */}
        {cart?.items && cart.items.length > 0 && (
          <div className="border-t border-gray-100 bg-gray-50/50 p-6">
            <div className="flex items-center justify-between pb-4">
              <span className="text-sm text-gray-600">Subtotal</span>
              <span className="text-lg font-bold text-gray-900">{formatINR(subtotal)}</span>
            </div>
            <p className="text-xs text-gray-500 pb-4">
              Shipping & applicable discounts will be calculated at checkout.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/cart"
                onClick={closeCart}
                className="flex items-center justify-center rounded-xl border border-gray-300 bg-white py-3 text-center text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                View Bag
              </Link>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#1E3F20] py-3 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-[#2A572D]"
              >
                Checkout <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
