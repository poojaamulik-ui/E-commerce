import React from "react";
import { getProducts, getCategories } from "@/lib/services/productService";
import { AdminProductManager } from "@/components/admin/AdminProductManager";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const [productsData, categories] = await Promise.all([
    getProducts({ limit: 100, includeUnpublished: true }),
    getCategories(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-serif text-gray-950 sm:text-3xl">
          Product Catalogue Management
        </h1>
        <p className="mt-1 text-xs text-gray-500">
          Create, edit, price, and manage live products across all Indian craft collections.
        </p>
      </div>

      <AdminProductManager
        initialProducts={productsData.products}
        categories={categories}
      />
    </div>
  );
}
