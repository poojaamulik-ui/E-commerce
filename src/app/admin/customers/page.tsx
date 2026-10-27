import React from "react";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/formatters";
import { Users, Mail, Phone, ShoppingCart } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true,
      _count: {
        select: { orders: true },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-serif text-gray-950 sm:text-3xl">
          Customer Management
        </h1>
        <p className="mt-1 text-xs text-gray-500">
          View registered customer accounts, order frequency, and contact records.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/80 text-gray-500 uppercase tracking-wider text-[10px] border-b border-gray-100">
              <tr>
                <th className="py-3 px-5 font-semibold">Customer</th>
                <th className="py-3 px-5 font-semibold">Email</th>
                <th className="py-3 px-5 font-semibold">Phone</th>
                <th className="py-3 px-5 font-semibold text-center">Role</th>
                <th className="py-3 px-5 font-semibold text-center">Orders</th>
                <th className="py-3 px-5 font-semibold text-right">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50/60 transition">
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-900">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-semibold text-gray-900">{u.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-5 text-gray-600 font-mono text-[11px]">{u.email}</td>
                  <td className="py-3.5 px-5 text-gray-600 font-mono text-[11px]">
                    {u.phone ? `+91 ${u.phone}` : "—"}
                  </td>
                  <td className="py-3.5 px-5 text-center">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                        u.role === "ADMIN"
                          ? "bg-purple-100 text-purple-800"
                          : u.role === "STAFF"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-center font-bold text-gray-950">
                    {u._count.orders}
                  </td>
                  <td className="py-3.5 px-5 text-right text-gray-500">
                    {formatDate(u.createdAt)}
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
