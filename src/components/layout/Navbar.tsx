"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart/CartContext";
import {
  ShoppingBag,
  Search,
  User as UserIcon,
  Heart,
  Menu,
  X,
  ChevronDown,
  ShieldCheck,
  Package,
  LogOut,
  Leaf,
} from "lucide-react";

interface NavbarProps {
  storeName?: string;
}

export function Navbar({ storeName = "Nestora" }: NavbarProps) {
  const router = useRouter();
  const { cart, openCart } = useCart();
  const totalItems = cart?.totalItemCount || 0;
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setIsMobileMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setIsUserMenuOpen(false);
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#EBE6DF] bg-[#FAF7F2]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl 2xl:max-w-[1600px] items-center justify-between px-4 py-3 sm:px-6 lg:px-8 2xl:px-12">
        {/* Mobile menu trigger */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-1.5 text-gray-700 md:hidden hover:text-[#1E3F20]"
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1E3F20] text-amber-200">
            <Leaf className="h-5 w-5 fill-current" />
          </div>
          <span className="font-serif text-2xl font-bold tracking-tight text-[#1C1F1C]">
            Nestora
          </span>
        </Link>

        {/* Center Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7">
          <Link
            href="/"
            className="text-xs font-semibold uppercase tracking-wider text-gray-800 transition hover:text-[#1E3F20]"
          >
            Home
          </Link>
          <div className="group relative">
            <Link
              href="/products"
              className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-gray-800 transition hover:text-[#1E3F20]"
            >
              Shop <ChevronDown className="h-3 w-3 opacity-60" />
            </Link>
          </div>
          <Link
            href="/categories/home-living"
            className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-gray-800 transition hover:text-[#1E3F20]"
          >
            Home &amp; Living <ChevronDown className="h-3 w-3 opacity-60" />
          </Link>
          <Link
            href="/categories/kitchen-dining"
            className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-gray-800 transition hover:text-[#1E3F20]"
          >
            Kitchen <ChevronDown className="h-3 w-3 opacity-60" />
          </Link>
          <Link
            href="/categories/decor-accents"
            className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-gray-800 transition hover:text-[#1E3F20]"
          >
            Decor <ChevronDown className="h-3 w-3 opacity-60" />
          </Link>
          <Link
            href="/categories/gifts"
            className="text-xs font-semibold uppercase tracking-wider text-gray-800 transition hover:text-[#1E3F20]"
          >
            Gifts
          </Link>
        </nav>

        {/* Right Utility Icons */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Search Toggle */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-1.5 text-gray-700 hover:text-[#1E3F20] transition"
            aria-label="Search products"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Account Icon */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-1.5 p-1 text-gray-700 hover:text-[#1E3F20]"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1E3F20] text-xs font-medium text-white">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-gray-100 bg-white py-1.5 shadow-xl ring-1 ring-black/5 z-50">
                  <div className="border-b border-gray-100 px-4 py-2">
                    <p className="text-xs font-semibold text-gray-900 truncate">{user.name}</p>
                    <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                  </div>
                  <Link
                    href="/account"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-[#F0F6F1] hover:text-[#1E3F20]"
                  >
                    <Package className="h-3.5 w-3.5" /> My Orders
                  </Link>
                  {(user.role === "ADMIN" || user.role === "STAFF") && (
                    <Link
                      href="/admin"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-[#1E3F20] hover:bg-[#F0F6F1]"
                    >
                      <ShieldCheck className="h-3.5 w-3.5" /> Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-xs font-medium text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-3.5 w-3.5" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/account/login"
              className="p-1.5 text-gray-700 hover:text-[#1E3F20] transition"
              aria-label="Account sign in"
            >
              <UserIcon className="h-5 w-5" />
            </Link>
          )}

          {/* Wishlist Icon */}
          <Link
            href="/account"
            className="p-1.5 text-gray-700 hover:text-[#1E3F20] transition hidden sm:inline-flex"
            aria-label="Wishlist"
          >
            <Heart className="h-5 w-5" />
          </Link>

          {/* Shopping Bag / Cart Drawer */}
          <button
            onClick={openCart}
            className="relative p-1.5 text-gray-800 hover:text-[#1E3F20] transition"
            aria-label="View shopping cart"
          >
            <ShoppingBag className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#1E3F20] text-[10px] font-bold text-white">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Expandable Search Input Bar */}
      {isSearchOpen && (
        <div className="border-t border-[#EBE6DF] bg-white px-4 py-3 shadow-inner">
          <div className="mx-auto max-w-2xl">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <input
                type="text"
                autoFocus
                placeholder="Search lamps, cushion covers, rugs, vases, planters..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-gray-300 bg-gray-50 py-2.5 pl-10 pr-10 text-xs text-gray-900 placeholder:text-gray-400 focus:border-[#1E3F20] focus:bg-white focus:outline-hidden"
              />
              <Search className="absolute left-3.5 h-4 w-4 text-gray-400" />
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="absolute right-3.5 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="border-t border-[#EBE6DF] bg-white px-4 py-6 md:hidden">
          <nav className="flex flex-col space-y-4">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-semibold text-gray-900 hover:text-[#1E3F20]"
            >
              Home
            </Link>
            <Link
              href="/products"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-semibold text-gray-900 hover:text-[#1E3F20]"
            >
              All Products
            </Link>
            <Link
              href="/categories/home-living"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-semibold text-gray-900 hover:text-[#1E3F20]"
            >
              Home &amp; Living
            </Link>
            <Link
              href="/categories/kitchen-dining"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-semibold text-gray-900 hover:text-[#1E3F20]"
            >
              Kitchen &amp; Dining
            </Link>
            <Link
              href="/categories/decor-accents"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-semibold text-gray-900 hover:text-[#1E3F20]"
            >
              Decor &amp; Accents
            </Link>
            <Link
              href="/categories/bedding-linen"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-semibold text-gray-900 hover:text-[#1E3F20]"
            >
              Bedding &amp; Linen
            </Link>
            <Link
              href="/categories/gifts"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-semibold text-gray-900 hover:text-[#1E3F20]"
            >
              Gifts &amp; Sets
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
