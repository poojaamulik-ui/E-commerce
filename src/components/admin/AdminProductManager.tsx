"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatINR } from "@/lib/formatters";
import {
  Package,
  Plus,
  Search,
  CheckCircle,
  AlertCircle,
  X,
  ExternalLink,
  Upload,
} from "lucide-react";

interface AdminProductManagerProps {
  initialProducts: any[];
  categories: any[];
}

export function AdminProductManager({
  initialProducts,
  categories,
}: AdminProductManagerProps) {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // New Product Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [sku, setSku] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "");
  const [basePriceRupees, setBasePriceRupees] = useState("");
  const [salePriceRupees, setSalePriceRupees] = useState("");
  const [stockQuantity, setStockQuantity] = useState("10");
  const [imageUrl, setImageUrl] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filtered = products.filter((p) => {
    const q = search.toLowerCase().trim();
    return (
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      p.slug.toLowerCase().includes(q)
    );
  });

  const handleNameChange = (val: string) => {
    setName(val);
    const autoSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setSlug(autoSlug);
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const basePrice = Math.round(parseFloat(basePriceRupees) * 100);
      const salePrice = salePriceRupees ? Math.round(parseFloat(salePriceRupees) * 100) : null;

      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug,
          sku,
          description,
          shortDescription,
          basePrice,
          salePrice,
          stockQuantity: parseInt(stockQuantity, 10),
          categoryIds: [categoryId],
          images: imageUrl ? [imageUrl] : [],
          isPublished,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create product");
      }

      setProducts((prev) => [data.product, ...prev]);
      setIsModalOpen(false);
      setMessage({ type: "success", text: `Product "${name}" created successfully!` });
      setTimeout(() => setMessage(null), 3000);

      // Reset form
      setName("");
      setSlug("");
      setSku("");
      setBasePriceRupees("");
      setSalePriceRupees("");
      setDescription("");
      setImageUrl("");
    } catch (err: unknown) {
      const text = err instanceof Error ? err.message : "Creation failed";
      setMessage({ type: "error", text });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {message && (
        <div
          className={`rounded-xl p-3 text-xs flex items-center gap-2 ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle className="h-4 w-4 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-xs">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by title, SKU, or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-xs focus:border-amber-700 focus:bg-white focus:outline-hidden"
          />
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-xl bg-amber-800 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-amber-900 transition"
        >
          <Plus className="h-4 w-4" /> Add New Product
        </button>
      </div>

      {/* Products Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/80 text-gray-500 uppercase tracking-wider text-[10px] border-b border-gray-100">
              <tr>
                <th className="py-3 px-5 font-semibold">Product</th>
                <th className="py-3 px-5 font-semibold">SKU</th>
                <th className="py-3 px-5 font-semibold">Category</th>
                <th className="py-3 px-5 font-semibold text-right">Base Price</th>
                <th className="py-3 px-5 font-semibold text-right">Sale Price</th>
                <th className="py-3 px-5 font-semibold text-center">Stock</th>
                <th className="py-3 px-5 font-semibold text-center">Status</th>
                <th className="py-3 px-5 font-semibold text-center">Storefront</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/60 transition">
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-gray-100 border border-gray-200" style={{ position: "relative" }}>
                        {p.images[0]?.url ? (
                          <Image src={p.images[0].url} alt={p.name} fill className="object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[10px] text-gray-400">
                            N/A
                          </div>
                        )}
                      </div>
                      <span className="font-semibold text-gray-900 line-clamp-1 max-w-xs">{p.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-5 font-mono text-gray-500">{p.sku}</td>
                  <td className="py-3 px-5 text-gray-600">
                    {p.categories[0]?.category?.name || "General"}
                  </td>
                  <td className="py-3 px-5 text-right font-medium text-gray-600">
                    {formatINR(p.basePrice)}
                  </td>
                  <td className="py-3 px-5 text-right font-bold text-amber-900">
                    {p.salePrice ? formatINR(p.salePrice) : "—"}
                  </td>
                  <td className="py-3 px-5 text-center">
                    <span
                      className={`font-semibold rounded-md px-2 py-0.5 text-[11px] ${
                        p.stockQuantity <= 5
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {p.stockQuantity}
                    </span>
                  </td>
                  <td className="py-3 px-5 text-center">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        p.isPublished
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {p.isPublished ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="py-3 px-5 text-center">
                    <Link
                      href={`/products/${p.slug}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 text-xs text-amber-800 hover:underline font-semibold"
                    >
                      View <ExternalLink className="h-3 w-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setIsModalOpen(false)} />
          <div className="relative z-10 w-full max-w-2xl rounded-2xl bg-white p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="text-base font-bold text-gray-950 flex items-center gap-2">
                <Package className="h-5 w-5 text-amber-700" /> Create New Product
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. Pure Kashmiri Mogra Saffron (1g)"
                    className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2 text-xs focus:border-amber-700 focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700">URL Slug *</label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="kashmiri-mogra-saffron"
                    className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2 text-xs font-mono focus:border-amber-700 focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700">SKU Code *</label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value.toUpperCase())}
                    placeholder="SAF-KSH-001"
                    className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2 text-xs font-mono uppercase focus:border-amber-700 focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700">Category *</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2 text-xs focus:border-amber-700 focus:bg-white focus:outline-hidden"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2 text-xs focus:border-amber-700 focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700">Base Price (in ₹ INR) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={basePriceRupees}
                    onChange={(e) => setBasePriceRupees(e.target.value)}
                    placeholder="e.g. 599.00"
                    className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2 text-xs focus:border-amber-700 focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700">Sale Price (in ₹ INR, optional)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={salePriceRupees}
                    onChange={(e) => setSalePriceRupees(e.target.value)}
                    placeholder="e.g. 499.00"
                    className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2 text-xs focus:border-amber-700 focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700">Primary Image URL</label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2 text-xs focus:border-amber-700 focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700">Short Summary Tagline</label>
                  <input
                    type="text"
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    placeholder="100% certified organic GI-tagged Kashmiri saffron."
                    className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2 text-xs focus:border-amber-700 focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700">Detailed Craft Description *</label>
                  <textarea
                    rows={4}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Detailed craft description, historical origin, material details, etc."
                    className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2 text-xs focus:border-amber-700 focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div className="sm:col-span-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="publishCheck"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="rounded-sm border-gray-300 text-amber-700 focus:ring-amber-500"
                  />
                  <label htmlFor="publishCheck" className="text-xs font-semibold text-gray-800 cursor-pointer">
                    Publish immediately to storefront catalogue
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-amber-800 px-5 py-2 text-xs font-bold text-white hover:bg-amber-900 disabled:opacity-50"
                >
                  {isSubmitting ? "Creating..." : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
