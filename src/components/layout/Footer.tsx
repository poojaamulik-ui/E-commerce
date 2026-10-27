"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Leaf, ArrowRight } from "lucide-react";

interface FooterProps {
  storeName?: string;
  supportEmail?: string;
  supportPhone?: string;
  businessAddress?: string;
}

export function Footer({
  storeName = "Nestora",
  supportEmail = "care@nestora.com",
}: FooterProps) {
  return (
    <footer className="border-t border-[#1C3E20] bg-[#142E16] text-[#D4E0D6] pb-16 md:pb-0">
      <div className="mx-auto max-w-7xl 2xl:max-w-[1600px] px-4 py-16 sm:px-6 lg:px-8 2xl:px-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-5">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#2A572D] text-amber-200">
                <Leaf className="h-4 w-4 fill-current" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                Nestora
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-[#A9BBAA]">
              Everyday essentials for a more beautiful home. Thoughtful, natural, and timeless design.
            </p>
            <div className="flex items-center gap-3 pt-2 text-[#C0D1C2]">
              <a href="#" className="p-1.5 rounded-full bg-[#1C3E20] hover:text-white transition" aria-label="Instagram">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="#" className="p-1.5 rounded-full bg-[#1C3E20] hover:text-white transition" aria-label="Facebook">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="p-1.5 rounded-full bg-[#1C3E20] hover:text-white transition" aria-label="Pinterest">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0a12 12 0 0 0-4.37 23.17c-.07-.94-.13-2.39.03-3.42l1.1-4.67s-.28-.56-.28-1.39c0-1.3.75-2.27 1.7-2.27.8 0 1.19.6 1.19 1.33 0 .8-.52 2.01-.78 3.12-.22.94.47 1.7 1.4 1.7 1.68 0 2.97-1.77 2.97-4.33 0-2.26-1.63-3.84-3.95-3.84-2.69 0-4.27 2.02-4.27 4.1 0 .81.31 1.68.7 2.16.08.1.09.18.07.28l-.26 1.07c-.04.18-.14.22-.33.13-1.22-.57-1.98-2.35-1.98-3.79 0-3.09 2.25-5.93 6.48-5.93 3.4 0 6.05 2.43 6.05 5.67 0 3.38-2.13 6.1-5.09 6.1-1 0-1.93-.52-2.25-1.12l-.61 2.33c-.22.86-.82 1.94-1.22 2.6A12 12 0 1 0 12 0z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">Shop</h4>
            <ul className="mt-4 space-y-2.5 text-xs text-[#A9BBAA]">
              <li>
                <Link href="/products" className="hover:text-white transition">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/categories/home-living" className="hover:text-white transition">
                  Home &amp; Living
                </Link>
              </li>
              <li>
                <Link href="/categories/kitchen-dining" className="hover:text-white transition">
                  Kitchen &amp; Dining
                </Link>
              </li>
              <li>
                <Link href="/categories/decor-accents" className="hover:text-white transition">
                  Decor &amp; Accents
                </Link>
              </li>
              <li>
                <Link href="/categories/gifts" className="hover:text-white transition">
                  Gifts &amp; Sets
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">Help</h4>
            <ul className="mt-4 space-y-2.5 text-xs text-[#A9BBAA]">
              <li>
                <Link href="/account" className="hover:text-white transition">
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="/policies/returns" className="hover:text-white transition">
                  Returns &amp; Refunds
                </Link>
              </li>
              <li>
                <Link href="/policies/shipping" className="hover:text-white transition">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">About</h4>
            <ul className="mt-4 space-y-2.5 text-xs text-[#A9BBAA]">
              <li>
                <Link href="/about" className="hover:text-white transition">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition">
                  Sustainability
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition">
                  Artisans &amp; Craft
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter / Get Home Inspiration */}
          <div className="md:col-span-1 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Get Home Inspiration
            </h4>
            <p className="text-xs text-[#A9BBAA] leading-relaxed">
              Join our newsletter for new arrivals, exclusive offers, and interior styling tips.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="relative flex items-center">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-lg border border-[#2A572D] bg-[#1C3E20] px-3.5 py-2.5 text-xs text-white placeholder:text-[#8AA08B] focus:border-amber-300 focus:outline-hidden"
              />
              <button
                type="submit"
                className="absolute right-1.5 flex h-7 w-7 items-center justify-center rounded-md bg-[#2A572D] text-white hover:bg-emerald-700 transition"
                aria-label="Subscribe"
              >
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Credits & Legal */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#1C3E20] pt-8 text-xs text-[#8AA08B] sm:flex-row">
          <p>© {new Date().getFullYear()} Nestora. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/policies/privacy" className="hover:text-white transition">
              Privacy Policy
            </Link>
            <Link href="/policies/terms" className="hover:text-white transition">
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
