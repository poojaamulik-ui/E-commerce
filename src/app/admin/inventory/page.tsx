import React from "react";
import { prisma } from "@/lib/db";
import { AdminInventoryManager } from "@/components/admin/AdminInventoryManager";

export const dynamic = "force-dynamic";

export default async function AdminInventoryPage() {
  const [products, movements] = await Promise.all([
    prisma.product.findMany({
      where: { isArchived: false },
      orderBy: { stockQuantity: "asc" },
      select: {
        id: true,
        name: true,
        sku: true,
        stockQuantity: true,
        lowStockThreshold: true,
        isPublished: true,
      },
    }),
    prisma.inventoryMovement.findMany({
      take: 30,
      orderBy: { createdAt: "desc" },
      include: {
        product: {
          select: { name: true, sku: true },
        },
      },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-serif text-gray-950 sm:text-3xl">
          Inventory Control & Stock Movements
        </h1>
        <p className="mt-1 text-xs text-gray-500">
          Track unit counts, configure low stock replenishment warnings, and record manual or supplier inventory movements.
        </p>
      </div>

      <AdminInventoryManager initialProducts={products} movements={movements} />
    </div>
  );
}
