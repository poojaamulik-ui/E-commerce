import React from "react";

export default function ReturnsPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 space-y-8">
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold font-serif text-gray-950 sm:text-4xl">
          Returns, Replacements & Refund Policy
        </h1>
        <p className="mt-2 text-xs text-gray-500">
          Last updated: October 2026 • 7-Day Hassle-Free Returns
        </p>
      </div>

      <div className="prose prose-stone text-xs text-gray-600 leading-relaxed space-y-6">
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
            1. 7-Day Return & Replacement Guarantee
          </h2>
          <p>
            We take immense pride in the craftsmanship of our artisanal goods. If your received item is
            damaged in transit, defective, or noticeably different from the product description, you may
            initiate a replacement or refund request within <strong>7 days</strong> of delivery receipt.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
            2. Eligible Return Conditions
          </h2>
          <p>
            • The product must be unused, unwashed, and in its original condition with all artisan tags and
            protective packaging intact.
          </p>
          <p>
            • For fragile artisanal products (brassware, ceramics, copper vessels), please notify our support
            team within 48 hours of delivery if any transit damage is discovered.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
            3. Refund Process
          </h2>
          <p>
            Once the returned parcel is received at our fulfillment center and verified, refunds are
            initiated directly to the original payment source via Razorpay within <strong>3 to 5 business days</strong>.
          </p>
        </section>
      </div>
    </div>
  );
}
