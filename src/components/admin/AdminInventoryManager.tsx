"use client";

import React, { useState } from "react";
import { formatDateTime } from "@/lib/formatters";
import { Boxes, AlertTriangle, ArrowUpDown, CheckCircle, AlertCircle, X } from "lucide-react";

interface AdminInventoryManagerProps {
  initialProducts: any[];
  movements: any[];
}

export function AdminInventoryManager({
  initialProducts,
  movements: initialMovements,
}: AdminInventoryManagerProps) {
  const [products, setProducts] = useState(initialProducts);
  const [movements, setMovements] = useState(initialMovements);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [delta, setDelta] = useState("");
  const [reason, setReason] = useState("RESTOCK");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || !delta) return;

    setIsSubmitting(true);
    try {
      const numDelta = parseInt(delta, 10);
      const res = await fetch("/api/admin/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selectedProduct.id,
          delta: numDelta,
          reason,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Inventory adjustment failed");
      }

      setProducts((prev) =>
        prev.map((p) =>
          p.id === selectedProduct.id
            ? { ...p, stockQuantity: p.stockQuantity + numDelta }
            : p
        )
      );

      // Add movement to top
      setMovements((prev) => [
        {
          id: `mov_${Date.now()}`,
          productId: selectedProduct.id,
          delta: numDelta,
          reason,
          createdAt: new Date().toISOString(),
          product: { name: selectedProduct.name, sku: selectedProduct.sku },
        },
        ...prev,
      ]);

      setMessage({
        type: "success",
        text: `Stock for "${selectedProduct.name}" adjusted by ${numDelta > 0 ? `+${numDelta}` : numDelta} units.`,
      });
      setSelectedProduct(null);
      setDelta("");
      setTimeout(() => setMessage(null), 3000);
    } catch (err: unknown) {
      const text = err instanceof Error ? err.message : "Adjustment error";
      setMessage({ type: "error", text });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
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

      {/* Stock Overview Table */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-xs overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-950 uppercase tracking-wider flex items-center gap-2">
            <Boxes className="h-4 w-4 text-amber-700" /> Current Stock & Reorder Levels
          </h2>
          <span className="text-xs text-gray-500">{products.length} Products Monitored</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/80 text-gray-500 uppercase tracking-wider text-[10px] border-b border-gray-100">
              <tr>
                <th className="py-3 px-5 font-semibold">Product Name</th>
                <th className="py-3 px-5 font-semibold">SKU</th>
                <th className="py-3 px-5 font-semibold text-center">Available Stock</th>
                <th className="py-3 px-5 font-semibold text-center">Alert Threshold</th>
                <th className="py-3 px-5 font-semibold text-center">Status</th>
                <th className="py-3 px-5 font-semibold text-center">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((p) => {
                const isLow = p.stockQuantity <= (p.lowStockThreshold || 5);
                const isOut = p.stockQuantity === 0;

                return (
                  <tr key={p.id} className="hover:bg-gray-50/60 transition">
                    <td className="py-3.5 px-5 font-semibold text-gray-900">{p.name}</td>
                    <td className="py-3.5 px-5 font-mono text-gray-500">{p.sku}</td>
                    <td className="py-3.5 px-5 text-center font-bold text-sm text-gray-950">
                      {p.stockQuantity}
                    </td>
                    <td className="py-3.5 px-5 text-center text-gray-500">
                      ≤ {p.lowStockThreshold || 5}
                    </td>
                    <td className="py-3.5 px-5 text-center">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          isOut
                            ? "bg-red-100 text-red-800"
                            : isLow
                            ? "bg-amber-100 text-amber-800"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {isOut ? "Out of Stock" : isLow ? "Low Stock" : "Healthy"}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-center">
                      <button
                        onClick={() => setSelectedProduct(p)}
                        className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-amber-50 hover:text-amber-800"
                      >
                        <ArrowUpDown className="h-3 w-3" /> Adjust
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inventory Movements Audit History */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-xs overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-sm font-bold text-gray-950 uppercase tracking-wider">
            Inventory Movement & Audit History
          </h2>
          <p className="mt-0.5 text-[11px] text-gray-500">
            Immutable log of all automated order deductions, restocks, and manual adjustments.
          </p>
        </div>

        {movements.length === 0 ? (
          <div className="p-8 text-center text-xs text-gray-500">
            No stock movements recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto max-h-96">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/80 text-gray-500 uppercase tracking-wider text-[10px] border-b border-gray-100 sticky top-0">
                <tr>
                  <th className="py-3 px-5 font-semibold">Timestamp</th>
                  <th className="py-3 px-5 font-semibold">Product</th>
                  <th className="py-3 px-5 font-semibold text-center">Change</th>
                  <th className="py-3 px-5 font-semibold">Reason</th>
                  <th className="py-3 px-5 font-semibold">Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {movements.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50/60">
                    <td className="py-2.5 px-5 text-gray-500 font-mono text-[11px]">
                      {formatDateTime(m.createdAt)}
                    </td>
                    <td className="py-2.5 px-5 font-semibold text-gray-900">
                      {m.product?.name || "Product"}
                    </td>
                    <td className="py-2.5 px-5 text-center font-bold">
                      <span
                        className={`rounded-md px-2 py-0.5 text-xs ${
                          m.delta > 0
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {m.delta > 0 ? `+${m.delta}` : m.delta}
                      </span>
                    </td>
                    <td className="py-2.5 px-5 text-gray-700 font-medium">{m.reason}</td>
                    <td className="py-2.5 px-5 font-mono text-gray-400 text-[10px]">
                      {m.referenceId || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Adjust Stock Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setSelectedProduct(null)} />
          <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-sm font-bold text-gray-950">
                Adjust Stock: {selectedProduct.name}
              </h3>
              <button onClick={() => setSelectedProduct(null)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAdjustSubmit} className="mt-4 space-y-4">
              <div className="rounded-xl bg-gray-50 p-3 text-xs flex justify-between">
                <span className="text-gray-600">Current Stock:</span>
                <span className="font-bold text-gray-950">{selectedProduct.stockQuantity} units</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700">
                  Adjustment Units (+ to add, - to deduct) *
                </label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 20 or -5"
                  value={delta}
                  onChange={(e) => setDelta(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-bold focus:border-amber-700 focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700">Reason for Adjustment *</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs focus:border-amber-700 focus:bg-white focus:outline-hidden"
                >
                  <option value="RESTOCK">Restock from Artisan Cluster</option>
                  <option value="DAMAGE">Damaged in Transit / Warehouse</option>
                  <option value="RETURN">Customer Return Restock</option>
                  <option value="AUDIT_CORRECTION">Physical Audit Correction</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !delta}
                  className="rounded-xl bg-amber-800 px-4 py-2 text-xs font-bold text-white hover:bg-amber-900 disabled:opacity-50"
                >
                  {isSubmitting ? "Adjusting..." : "Confirm Adjustment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
