"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed.");
      }

      // Check role - if admin, redirect to admin
      if (data.user?.role === "ADMIN" || data.user?.role === "STAFF") {
        router.push("/admin");
      } else {
        router.push("/account");
      }
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Invalid login credentials";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-xs">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-800">
            <Lock className="h-6 w-6 stroke-[1.75]" />
          </div>
          <h1 className="mt-4 text-2xl font-bold font-serif text-gray-950">Welcome Back</h1>
          <p className="mt-1 text-xs text-gray-500">
            Sign in to track orders, manage addresses, or access administrative tools.
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700">Email Address</label>
            <div className="relative mt-1">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.in"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-9 pr-3.5 py-2.5 text-xs focus:border-amber-700 focus:bg-white focus:outline-hidden"
              />
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700">Password</label>
            <div className="relative mt-1">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-9 pr-3.5 py-2.5 text-xs focus:border-amber-700 focus:bg-white focus:outline-hidden"
              />
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-amber-800 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-amber-900 disabled:opacity-50"
          >
            {isLoading ? "Signing In..." : "Sign In"} <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="mt-6 border-t border-gray-100 pt-4 text-center text-xs text-gray-500">
          New to BharatBazaar?{" "}
          <Link href="/account/register" className="font-semibold text-amber-800 hover:underline">
            Create an Account
          </Link>
        </div>

        <div className="mt-4 rounded-xl bg-amber-50/60 p-3 text-[11px] text-amber-800">
          <p className="font-bold">Test Credentials:</p>
          <p>Admin: admin@bharatbazaar.in / BharatAdmin@2026</p>
          <p>Customer: customer@example.in / Customer@2026</p>
        </div>
      </div>
    </div>
  );
}
