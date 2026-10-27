import React from "react";

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 space-y-8">
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold font-serif text-gray-950 sm:text-4xl">
          Terms & Conditions of Service
        </h1>
        <p className="mt-2 text-xs text-gray-500">
          Last updated: October 2026 • Governed by the Laws of India
        </p>
      </div>

      <div className="prose prose-stone text-xs text-gray-600 leading-relaxed space-y-6">
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
            1. Commercial Terms & Pricing
          </h2>
          <p>
            All prices listed on BharatBazaar are quoted in Indian Rupees (INR) and are inclusive of all
            statutory applicable levies. BharatBazaar reserves the right to modify prices or discontinue
            promotional discount codes at its sole discretion prior to order placement.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
            2. Handcrafted Variations
          </h2>
          <p>
            Because our items are genuinely handcrafted by traditional artisans, minor variations in weave,
            shade, hand-hammered texture, or organic aroma are inherent characteristics of authentic artisanal
            works and are not considered defects.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
            3. Governing Law & Jurisdiction
          </h2>
          <p>
            These terms shall be governed by and construed in accordance with the laws of India. Any disputes
            arising hereunder shall be subject to the exclusive jurisdiction of the competent courts in Bengaluru,
            Karnataka, India.
          </p>
        </section>
      </div>
    </div>
  );
}
