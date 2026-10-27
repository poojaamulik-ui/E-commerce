"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

export interface CartItemType {
  id: string;
  productId: string;
  variantId?: string | null;
  quantity: number;
  effectiveUnitPrice: number;
  lineTotal: number;
  isAvailable: boolean;
  maxAvailable: number;
  product: {
    id: string;
    name: string;
    slug: string;
    sku: string;
    basePrice: number;
    salePrice?: number | null;
    images: Array<{ url: string; altText?: string | null }>;
  };
  variant?: {
    id: string;
    name: string;
    sku: string;
    price?: number | null;
    salePrice?: number | null;
  } | null;
}

export interface CartData {
  id: string;
  items: CartItemType[];
  subtotalPaise: number;
  totalItemCount: number;
}

interface CartContextType {
  cart: CartData | null;
  isLoading: boolean;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  refreshCart: () => Promise<void>;
  addItem: (productId: string, variantId?: string | null, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const refreshCart = useCallback(async () => {
    try {
      const res = await fetch("/api/cart");
      if (res.ok) {
        const data = await res.json();
        setCart(data.cart);
      }
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addItem = async (productId: string, variantId?: string | null, quantity = 1) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/cart/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, variantId, quantity }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to add to cart");
      }

      const data = await res.json();
      setCart(data.cart);
      setIsOpen(true); // Open drawer on successful add
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/cart/items/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update quantity");
      }

      const data = await res.json();
      setCart(data.cart);
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (itemId: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/cart/items/${itemId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to remove item");
      }

      const data = await res.json();
      setCart(data.cart);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        refreshCart,
        addItem,
        updateQuantity,
        removeItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
