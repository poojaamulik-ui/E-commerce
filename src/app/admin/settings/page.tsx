import React from "react";
import { prisma } from "@/lib/db";
import { getPublicStoreSettings } from "@/lib/services/settingsService";
import { razorpayService } from "@/lib/payments/razorpay";
import { storageService } from "@/lib/storage";
import { emailService } from "@/lib/email";
import { formatINR } from "@/lib/formatters";
import {
  Settings,
  ShieldCheck,
  CreditCard,
  HardDrive,
  Mail,
  Store,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getPublicStoreSettings();
  const isRazorpayReady = razorpayService.isConfigured();
  const isStorageReady = storageService.isRemoteConfigured();
  const isEmailReady = emailService.isConfigured();

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold font-serif text-gray-950 sm:text-3xl">
          Store Configuration & Environment Health
        </h1>
        <p className="mt-1 text-xs text-gray-500">
          Manage public business identity, announcement messages, shipping thresholds, and verify live integrations.
        </p>
      </div>

      {/* Integration Providers Health Status */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-gray-950 uppercase tracking-wider border-b border-gray-100 pb-3 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-amber-700" /> Integration & Credential Status
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Payment Gateway */}
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-900 mb-2">
              <CreditCard className="h-4 w-4 text-amber-700" />
              <span>Razorpay Payments</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              {isRazorpayReady ? (
                <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                  <CheckCircle2 className="h-4 w-4" /> Live Credentials Active
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-amber-800 font-semibold">
                  <AlertCircle className="h-4 w-4" /> Test / Sandbox Mode
                </span>
              )}
            </div>
            <p className="mt-1.5 text-[10px] text-gray-500">
              Key ID: {razorpayService.getKeyId() ? `${razorpayService.getKeyId().slice(0, 10)}...` : "Not Set"}
            </p>
          </div>

          {/* Cloudflare R2 / S3 */}
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-900 mb-2">
              <HardDrive className="h-4 w-4 text-amber-700" />
              <span>Object Storage</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              {isStorageReady ? (
                <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                  <CheckCircle2 className="h-4 w-4" /> Cloudflare R2 / S3
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-amber-800 font-semibold">
                  <AlertCircle className="h-4 w-4" /> Local Disk Fallback
                </span>
              )}
            </div>
            <p className="mt-1.5 text-[10px] text-gray-500">
              {isStorageReady ? "S3-compatible bucket active" : "Stores uploads in /public/uploads"}
            </p>
          </div>

          {/* Resend Email */}
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-900 mb-2">
              <Mail className="h-4 w-4 text-amber-700" />
              <span>Transactional Email</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              {isEmailReady ? (
                <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                  <CheckCircle2 className="h-4 w-4" /> Resend API Active
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-amber-800 font-semibold">
                  <AlertCircle className="h-4 w-4" /> Console Logger Mode
                </span>
              )}
            </div>
            <p className="mt-1.5 text-[10px] text-gray-500">
              Sender: orders@bharatbazaar.in
            </p>
          </div>
        </div>
      </div>

      {/* Store Identity Settings */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-gray-950 uppercase tracking-wider border-b border-gray-100 pb-3 flex items-center gap-2">
          <Store className="h-4 w-4 text-amber-700" /> Public Business Details
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
          <div>
            <label className="block font-semibold text-gray-700">Store Brand Name</label>
            <input
              type="text"
              readOnly
              value={settings.storeName}
              className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-xs text-gray-900 font-bold"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700">Store Tagline</label>
            <input
              type="text"
              readOnly
              value={settings.storeTagline}
              className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-xs text-gray-900"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700">Customer Support Phone</label>
            <input
              type="text"
              readOnly
              value={settings.supportPhone}
              className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-xs font-mono text-gray-900"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700">Customer Support Email</label>
            <input
              type="text"
              readOnly
              value={settings.supportEmail}
              className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-xs font-mono text-gray-900"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-semibold text-gray-700">Business Address</label>
            <input
              type="text"
              readOnly
              value={settings.businessAddress}
              className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-xs text-gray-900"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-semibold text-gray-700">Storefront Announcement Banner</label>
            <input
              type="text"
              readOnly
              value={settings.announcementText}
              className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-xs text-gray-900"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700">Store Currency</label>
            <input
              type="text"
              readOnly
              value="INR (Indian Rupee - ₹)"
              className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-xs text-gray-900 font-bold"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700">Free Delivery Threshold</label>
            <input
              type="text"
              readOnly
              value={formatINR(settings.freeShippingThresholdPaise)}
              className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-xs text-gray-900 font-bold text-emerald-800"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
