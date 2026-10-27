import React from "react";

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 space-y-8">
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold font-serif text-gray-950 sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-2 text-xs text-gray-500">
          Last updated: October 2026 • Compliant with Indian IT Rules & DPDP Principles
        </p>
      </div>

      <div className="prose prose-stone text-xs text-gray-600 leading-relaxed space-y-6">
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
            1. Information Collection & Usage
          </h2>
          <p>
            BharatBazaar collects customer details solely necessary to fulfill online orders and provide
            order updates: your name, contact phone number, delivery address, and email.
          </p>
          <p>
            We <strong>never</strong> store sensitive credit/debit card numbers, CVVs, or bank PINs on our servers.
            All monetary transactions are processed through RBI-authorized payment aggregator Razorpay with
            bank-grade 256-bit encryption.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
            2. Non-Disclosure & Security
          </h2>
          <p>
            Your personal information is never sold, leased, or rented to third-party marketing companies.
            Data is strictly shared only with verified logistics partners solely for delivering your parcels.
          </p>
        </section>
      </div>
    </div>
  );
}
