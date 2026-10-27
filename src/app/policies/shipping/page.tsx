import React from "react";
import Link from "next/link";
import { Truck, ShieldCheck, Clock, CheckCircle } from "lucide-react";

export default function ShippingPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 space-y-8">
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold font-serif text-gray-950 sm:text-4xl">
          Shipping & Delivery Policy
        </h1>
        <p className="mt-2 text-xs text-gray-500">
          Last updated: October 2026 • Valid for deliveries across India
        </p>
      </div>

      <div className="prose prose-stone text-xs text-gray-600 leading-relaxed space-y-6">
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
            1. Pan-India Delivery Coverage
          </h2>
          <p>
            BharatBazaar delivers to over 19,000 PIN codes across all Indian States and Union Territories
            through our verified logistics partners, including India Post Speed Post, Delhivery Express,
            and Blue Dart.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
            2. Shipping Rates & Free Delivery
          </h2>
          <p>
            • <strong className="text-gray-900">Free Express Delivery:</strong> Orders with a net cart value of{" "}
            <strong>₹999.00 and above</strong> qualify for complimentary free shipping throughout India.
          </p>
          <p>
            • <strong className="text-gray-900">Standard Shipping:</strong> For orders under ₹999.00, a flat
            nominal shipping charge of <strong>₹79.00</strong> is applied to cover specialized protective
            packaging for delicate handicrafts and liquids.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
            3. Processing & Delivery Timelines
          </h2>
          <p>
            • Orders are processed, quality-inspected, and dispatched within <strong>24 to 48 hours</strong> of
            payment confirmation (excluding Sundays and National Holidays).
          </p>
          <p>
            • <strong>Metro Cities</strong> (Bengaluru, Mumbai, Delhi NCR, Chennai, Hyderabad, Kolkata): Estimated 2 to 4 business days.
          </p>
          <p>
            • <strong>Rest of India</strong>: Estimated 4 to 6 business days.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
            4. Real-Time Order Tracking
          </h2>
          <p>
            As soon as your shipment is dispatched, an automated confirmation containing your official
            consignment tracking number and tracking link will be sent to your registered email and mobile number.
          </p>
        </section>
      </div>
    </div>
  );
}
