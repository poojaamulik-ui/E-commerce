import React from "react";
import { prisma } from "@/lib/db";
import { formatINR, formatDate } from "@/lib/formatters";
import { Tag, Plus, CheckCircle, Percent } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminCouponsPage() {
  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { redemptions: true },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-gray-950 sm:text-3xl">
            Promotions & Coupon Codes
          </h1>
          <p className="mt-1 text-xs text-gray-500">
            Configure seasonal percentage and fixed-rupee discounts, redemption caps, and minimum order values.
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/80 text-gray-500 uppercase tracking-wider text-[10px] border-b border-gray-100">
              <tr>
                <th className="py-3 px-5 font-semibold">Code</th>
                <th className="py-3 px-5 font-semibold">Description</th>
                <th className="py-3 px-5 font-semibold text-center">Type</th>
                <th className="py-3 px-5 font-semibold text-right">Discount Value</th>
                <th className="py-3 px-5 font-semibold text-right">Min Order</th>
                <th className="py-3 px-5 font-semibold text-center">Usage</th>
                <th className="py-3 px-5 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {coupons.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50/60 transition">
                  <td className="py-3.5 px-5 font-mono font-bold text-amber-900">{c.code}</td>
                  <td className="py-3.5 px-5 text-gray-600">{c.description || "—"}</td>
                  <td className="py-3.5 px-5 text-center">
                    <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-mono font-semibold text-gray-700">
                      {c.discountType}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right font-bold text-gray-900">
                    {c.discountType === "PERCENTAGE"
                      ? `${c.discountValue}%`
                      : formatINR(c.discountValue)}
                  </td>
                  <td className="py-3.5 px-5 text-right text-gray-600">
                    {formatINR(c.minOrderAmount)}
                  </td>
                  <td className="py-3.5 px-5 text-center font-mono">
                    <span className="font-bold text-gray-900">{c.usageCount}</span>
                    <span className="text-gray-400">
                      {" "}
                      / {c.usageLimit ? c.usageLimit : "∞"}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-center">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        c.isActive ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {c.isActive ? "Active" : "Disabled"}
                    </span>
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
