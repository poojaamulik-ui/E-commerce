import React from "react";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/formatters";
import { Layers, Plus, ExternalLink } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { displayOrder: "asc" },
    include: {
      _count: {
        select: { products: true },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-gray-950 sm:text-3xl">
            Category Taxonomy
          </h1>
          <p className="mt-1 text-xs text-gray-500">
            Organize craft disciplines, regional weaving clusters, and product collections.
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/80 text-gray-500 uppercase tracking-wider text-[10px] border-b border-gray-100">
              <tr>
                <th className="py-3 px-5 font-semibold">Category</th>
                <th className="py-3 px-5 font-semibold">Slug</th>
                <th className="py-3 px-5 font-semibold">Description</th>
                <th className="py-3 px-5 font-semibold text-center">Products</th>
                <th className="py-3 px-5 font-semibold text-center">Order</th>
                <th className="py-3 px-5 font-semibold text-center">Status</th>
                <th className="py-3 px-5 font-semibold text-center">Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50/60 transition">
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-gray-100 border border-gray-200" style={{ position: "relative" }}>
                        {cat.imageUrl ? (
                          <Image src={cat.imageUrl} alt={cat.name} fill className="object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs font-bold text-amber-800">
                            {cat.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <span className="font-semibold text-gray-900">{cat.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-5 font-mono text-gray-500">{cat.slug}</td>
                  <td className="py-3.5 px-5 text-gray-600 max-w-xs truncate">
                    {cat.description || "—"}
                  </td>
                  <td className="py-3.5 px-5 text-center font-bold text-gray-900">
                    {cat._count.products}
                  </td>
                  <td className="py-3.5 px-5 text-center font-mono text-gray-500">
                    {cat.displayOrder}
                  </td>
                  <td className="py-3.5 px-5 text-center">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        cat.isActive ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {cat.isActive ? "Active" : "Hidden"}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-center">
                    <Link
                      href={`/categories/${cat.slug}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 text-xs text-amber-800 font-semibold hover:underline"
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
    </div>
  );
}
