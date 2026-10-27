import React from "react";
import { getAdminOrders } from "@/lib/services/adminService";
import { AdminOrderManager } from "@/components/admin/AdminOrderManager";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const { orders } = await getAdminOrders({ limit: 50 });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-serif text-gray-950 sm:text-3xl">
          Order & Fulfillment Management
        </h1>
        <p className="mt-1 text-xs text-gray-500">
          Monitor incoming customer orders, verify payments, update fulfillment stages, and issue courier tracking.
        </p>
      </div>

      <AdminOrderManager initialOrders={orders} />
    </div>
  );
}
