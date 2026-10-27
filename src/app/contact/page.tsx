"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Clock, MessageSquare, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 space-y-12">
      <div className="text-center max-w-xl mx-auto space-y-3">
        <h1 className="text-3xl font-bold font-serif text-gray-950 sm:text-4xl">
          Customer Support & Inquiries
        </h1>
        <p className="text-xs sm:text-sm text-gray-600">
          Have questions regarding an order, shipment, or bulk artisan custom orders? Our dedicated team is here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Info Card */}
        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-xs space-y-6">
          <h2 className="text-base font-bold text-gray-950 border-b border-gray-100 pb-3">
            Store Contact Details
          </h2>

          <div className="space-y-4 text-xs text-gray-600">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900">Registered Office & Fulfilment Center</p>
                <p className="mt-0.5">Indiranagar 100ft Road, Bengaluru, Karnataka 560038, India</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900">Phone Support (Call / WhatsApp)</p>
                <p className="mt-0.5">+91 98765 43210</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900">Email Inquiries</p>
                <p className="mt-0.5">support@bharatbazaar.in</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900">Operational Hours</p>
                <p className="mt-0.5">Monday to Saturday: 9:00 AM – 7:00 PM IST</p>
                <p className="text-[11px] text-gray-400">Closed on Sundays and National Holidays</p>
              </div>
            </div>
          </div>
        </div>

        {/* Support Message Form */}
        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-xs">
          <h2 className="text-base font-bold text-gray-950 border-b border-gray-100 pb-3 flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-amber-700" /> Send a Message
          </h2>

          <form className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700">Full Name</label>
              <input
                type="text"
                placeholder="Aarav Sharma"
                className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-xs focus:border-amber-700 focus:bg-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700">Email Address</label>
              <input
                type="email"
                placeholder="you@example.in"
                className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-xs focus:border-amber-700 focus:bg-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700">Order Number (if applicable)</label>
              <input
                type="text"
                placeholder="BB-20261027-1234"
                className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-xs focus:border-amber-700 focus:bg-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700">How can we assist you?</label>
              <textarea
                rows={4}
                placeholder="Enter your message or inquiry..."
                className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-xs focus:border-amber-700 focus:bg-white focus:outline-hidden"
              />
            </div>

            {submitted ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 shrink-0" />
                <span>Thank you! Your message has been received. Our team will contact you within 24 hours.</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setSubmitted(true)}
                className="w-full rounded-xl bg-amber-800 py-3 text-xs font-bold text-white shadow-sm hover:bg-amber-900 transition"
              >
                Submit Support Request
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
