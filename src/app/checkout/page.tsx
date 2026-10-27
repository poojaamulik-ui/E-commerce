"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import Script from "next/script";
import { useCart } from "@/components/cart/CartContext";
import { formatINR, isValidIndianPhone, isValidIndianPincode } from "@/lib/formatters";
import { FREE_SHIPPING_THRESHOLD_PAISE, STANDARD_SHIPPING_FEE_PAISE } from "@/lib/shipping";
import {
  ShieldCheck,
  Lock,
  AlertCircle,
  ArrowLeft,
  Check,
  CreditCard,
  QrCode,
  Building,
  Wallet,
  Banknote,
} from "lucide-react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCoupon = searchParams.get("coupon") || "";

  const { cart, refreshCart } = useCart();

  // Stepper state: 'address' | 'payment' | 'review'
  const [activeStep, setActiveStep] = useState<"address" | "payment" | "review">("payment");

  // Selected payment method
  const [selectedPayment, setSelectedPayment] = useState("upi");

  // Form State
  const [formData, setFormData] = useState({
    customerName: "Aarav Sharma",
    customerEmail: "aarav.sharma@mail.com",
    customerPhone: "9876543210",
    street: "B-084, Green Valley Apartments, Sector 62",
    landmark: "Near City Center",
    city: "Noida",
    state: "Uttar Pradesh",
    pincode: "201301",
    saveAddress: true,
    customerNotes: "",
    couponCode: initialCoupon,
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Prefill logged in user data if available
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setFormData((prev) => ({
            ...prev,
            customerName: data.user.name || prev.customerName,
            customerEmail: data.user.email || prev.customerEmail,
            customerPhone: data.user.phone || prev.customerPhone,
          }));
        }
      })
      .catch(() => {});
  }, []);

  const subtotal = cart?.subtotalPaise || 0;
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD_PAISE;
  const shippingAmount = isFreeShipping ? 0 : STANDARD_SHIPPING_FEE_PAISE;
  const totalPayable = subtotal + shippingAmount;

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.customerName.trim()) {
      errors.customerName = "Full name is required";
    }
    if (!formData.customerEmail.trim() || !formData.customerEmail.includes("@")) {
      errors.customerEmail = "A valid email address is required";
    }
    if (!isValidIndianPhone(formData.customerPhone)) {
      errors.customerPhone = "Enter a valid 10-digit Indian mobile number";
    }
    if (!formData.street.trim() || formData.street.length < 5) {
      errors.street = "House/Flat number and Street address are required";
    }
    if (!formData.city.trim()) {
      errors.city = "City is required";
    }
    if (!formData.state.trim()) {
      errors.state = "State is required";
    }
    if (!isValidIndianPincode(formData.pincode)) {
      errors.pincode = "Enter a valid 6-digit Indian PIN code";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validateForm()) {
      return;
    }

    if (!cart?.items.length) {
      setServerError("Your cart is empty. Add home essentials before proceeding.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: formData.customerName,
          customerEmail: formData.customerEmail,
          customerPhone: formData.customerPhone,
          shippingAddress: {
            name: formData.customerName,
            phone: formData.customerPhone,
            street: formData.street,
            landmark: formData.landmark || undefined,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
          },
          customerNotes: formData.customerNotes,
          couponCode: formData.couponCode || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to initiate order");
      }

      // If mock payment or order created directly
      if (data.orderNumber && !data.razorpayOrderId) {
        await refreshCart();
        router.push(`/orders/${data.orderNumber}`);
        return;
      }

      // Open Razorpay Standard Checkout
      if (data.razorpayOrderId) {
        if (!window.Razorpay) {
          throw new Error("Razorpay SDK not loaded. Please refresh.");
        }

        const options = {
          key: data.razorpayKeyId,
          amount: data.amount,
          currency: data.currency || "INR",
          name: "Nestora Home & Living",
          description: `Order #${data.orderNumber}`,
          order_id: data.razorpayOrderId,
          prefill: {
            name: formData.customerName,
            email: formData.customerEmail,
            contact: formData.customerPhone,
          },
          theme: {
            color: "#1E3F20",
          },
          handler: async function (paymentResponse: {
            razorpay_payment_id: string;
            razorpay_order_id: string;
            razorpay_signature: string;
          }) {
            try {
              const verifyRes = await fetch("/api/payments/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  orderId: data.orderId,
                  orderNumber: data.orderNumber,
                  razorpayPaymentId: paymentResponse.razorpay_payment_id,
                  razorpayOrderId: paymentResponse.razorpay_order_id,
                  razorpaySignature: paymentResponse.razorpay_signature,
                }),
              });

              const verifyData = await verifyRes.json();

              if (!verifyRes.ok) {
                throw new Error(verifyData.error || "Payment verification failed");
              }

              await refreshCart();
              router.push(`/orders/${data.orderNumber}?status=success`);
            } catch (vErr: unknown) {
              const msg =
                vErr instanceof Error ? vErr.message : "Error verifying payment signature";
              setServerError(msg);
              setIsSubmitting(false);
            }
          },
          modal: {
            ondismiss: function () {
              setIsSubmitting(false);
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An error occurred during checkout";
      setServerError(msg);
      setIsSubmitting(false);
    }
  };

  const paymentOptions = [
    {
      id: "upi",
      title: "UPI (Scan & Pay / UPI ID)",
      desc: "Google Pay, PhonePe, Paytm, BHIM",
      icon: QrCode,
    },
    {
      id: "card",
      title: "Credit / Debit Card (Visa, Mastercard, RuPay)",
      desc: "Safe 256-bit encrypted checkout",
      icon: CreditCard,
    },
    {
      id: "netbanking",
      title: "Net Banking",
      desc: "All Indian banks supported",
      icon: Building,
    },
    {
      id: "wallets",
      title: "Wallets",
      desc: "Paytm, PhonePe, Mobikwik",
      icon: Wallet,
    },
    {
      id: "cod",
      title: "Cash on Delivery",
      desc: "Pay in cash at your doorstep",
      icon: Banknote,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl 2xl:max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8 2xl:px-12">
      {/* Razorpay Standard JS */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      {/* Progress Stepper matching Screen 5: Address > Payment > Review */}
      <div className="mb-8 flex items-center justify-center">
        <div className="flex items-center gap-3 text-xs font-semibold">
          <div className="flex items-center gap-1.5 text-[#1E3F20]">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1E3F20] text-white text-[10px]">
              ✓
            </span>
            <span>Address</span>
          </div>

          <span className="h-0.5 w-10 bg-[#1E3F20]" />

          <div className="flex items-center gap-1.5 text-[#1E3F20]">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1E3F20] text-white text-[10px]">
              2
            </span>
            <span>Payment</span>
          </div>

          <span className="h-0.5 w-10 bg-gray-200" />

          <div className="flex items-center gap-1.5 text-gray-400">
            <span className="flex h-5 w-5 items-center justify-center rounded-full border border-gray-300 text-[10px]">
              3
            </span>
            <span>Review</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        {/* Left Column: Delivery Details + Payment Method Selector */}
        <div className="lg:col-span-7">
          <form onSubmit={handleCheckoutSubmit} className="space-y-6">
            {/* 1. Delivery Details */}
            <div className="rounded-2xl border border-[#E8E3DA] bg-white p-6 shadow-xs">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#1C1F1C] border-b border-[#E8E3DA] pb-3">
                1. Delivery Details
              </h2>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700">Full Name *</label>
                  <input
                    type="text"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder="e.g. Aarav Sharma"
                    className="mt-1 w-full rounded-lg border border-[#E8E3DA] bg-gray-50/60 px-3.5 py-2.5 text-xs text-gray-900 focus:border-[#1E3F20] focus:bg-white focus:outline-hidden"
                  />
                  {formErrors.customerName && (
                    <p className="mt-1 text-[11px] text-red-600">{formErrors.customerName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700">Email Address *</label>
                  <input
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    placeholder="aarav.sharma@mail.com"
                    className="mt-1 w-full rounded-lg border border-[#E8E3DA] bg-gray-50/60 px-3.5 py-2.5 text-xs text-gray-900 focus:border-[#1E3F20] focus:bg-white focus:outline-hidden"
                  />
                  {formErrors.customerEmail && (
                    <p className="mt-1 text-[11px] text-red-600">{formErrors.customerEmail}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700">Mobile Number *</label>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-2.5 text-xs font-semibold text-gray-500">
                      +91
                    </span>
                    <input
                      type="tel"
                      maxLength={10}
                      value={formData.customerPhone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          customerPhone: e.target.value.replace(/\D/g, ""),
                        })
                      }
                      placeholder="9876543210"
                      className="w-full rounded-lg border border-[#E8E3DA] bg-gray-50/60 pl-11 pr-3.5 py-2.5 text-xs text-gray-900 focus:border-[#1E3F20] focus:bg-white focus:outline-hidden"
                    />
                  </div>
                  {formErrors.customerPhone && (
                    <p className="mt-1 text-[11px] text-red-600">{formErrors.customerPhone}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700">
                    Address (House No., Building, Street) *
                  </label>
                  <input
                    type="text"
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    placeholder="B-084, Green Valley Apartments, Sector 62"
                    className="mt-1 w-full rounded-lg border border-[#E8E3DA] bg-gray-50/60 px-3.5 py-2.5 text-xs text-gray-900 focus:border-[#1E3F20] focus:bg-white focus:outline-hidden"
                  />
                  {formErrors.street && (
                    <p className="mt-1 text-[11px] text-red-600">{formErrors.street}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700">State *</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="Uttar Pradesh"
                    className="mt-1 w-full rounded-lg border border-[#E8E3DA] bg-gray-50/60 px-3.5 py-2.5 text-xs text-gray-900 focus:border-[#1E3F20] focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700">PIN Code *</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={formData.pincode}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pincode: e.target.value.replace(/\D/g, ""),
                      })
                    }
                    placeholder="201301"
                    className="mt-1 w-full rounded-lg border border-[#E8E3DA] bg-gray-50/60 px-3.5 py-2.5 text-xs text-gray-900 focus:border-[#1E3F20] focus:bg-white focus:outline-hidden"
                  />
                  {formErrors.pincode && (
                    <p className="mt-1 text-[11px] text-red-600">{formErrors.pincode}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700">City *</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Noida"
                    className="mt-1 w-full rounded-lg border border-[#E8E3DA] bg-gray-50/60 px-3.5 py-2.5 text-xs text-gray-900 focus:border-[#1E3F20] focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div className="sm:col-span-2 pt-2">
                  <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.saveAddress}
                      onChange={(e) => setFormData({ ...formData, saveAddress: e.target.checked })}
                      className="rounded border-gray-300 text-[#1E3F20] focus:ring-[#1E3F20]"
                    />
                    <span>Use this address for future orders</span>
                  </label>
                </div>
              </div>
            </div>

            {/* 2. Payment Method Selector from Screen 5 */}
            <div className="rounded-2xl border border-[#E8E3DA] bg-white p-6 shadow-xs">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#1C1F1C] border-b border-[#E8E3DA] pb-3">
                2. Payment Method
              </h2>

              <div className="mt-4 space-y-3">
                {paymentOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = selectedPayment === opt.id;
                  return (
                    <label
                      key={opt.id}
                      onClick={() => setSelectedPayment(opt.id)}
                      className={`flex items-center justify-between rounded-xl border p-3.5 cursor-pointer transition ${
                        isSelected
                          ? "border-[#1E3F20] bg-[#FAF7F2] ring-1 ring-[#1E3F20]"
                          : "border-[#E8E3DA] bg-white hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={isSelected}
                          onChange={() => setSelectedPayment(opt.id)}
                          className="text-[#1E3F20] focus:ring-[#1E3F20]"
                        />
                        <div>
                          <p className="text-xs font-bold text-gray-900">{opt.title}</p>
                          <p className="text-[10px] text-gray-500">{opt.desc}</p>
                        </div>
                      </div>
                      <Icon className={`h-4 w-4 ${isSelected ? "text-[#1E3F20]" : "text-gray-400"}`} />
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Error Message */}
            {serverError && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{serverError}</span>
              </div>
            )}
          </form>
        </div>

        {/* Right Column: Order Summary + Pay Button */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border border-[#E8E3DA] bg-white p-6 shadow-xs">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 border-b border-[#E8E3DA] pb-3">
              Order Summary
            </h3>

            {/* Items with Thumbnails matching Screen 5 */}
            <div className="mt-4 divide-y divide-gray-100 max-h-72 overflow-y-auto">
              {cart?.items.map((item) => (
                <div key={item.id} className="py-3 flex items-center gap-3 text-xs">
                  <div
                    className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-50 border border-gray-100"
                    style={{ position: "relative", width: "3rem", height: "3rem" }}
                  >
                    {item.product.images[0]?.url ? (
                      <Image
                        src={item.product.images[0].url}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[10px] text-gray-400">
                        Item
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{item.product.name}</p>
                    <p className="text-[11px] text-gray-500">
                      Qty: {item.quantity} × {formatINR(item.effectiveUnitPrice)}
                    </p>
                  </div>
                  <span className="font-bold text-gray-900 shrink-0">
                    {formatINR(item.lineTotal)}
                  </span>
                </div>
              ))}
            </div>

            {/* Cost Breakdown */}
            <div className="mt-5 border-t border-[#E8E3DA] pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">{formatINR(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="font-semibold text-gray-900">
                  {isFreeShipping ? (
                    <span className="text-emerald-700 font-bold uppercase text-[10px]">FREE</span>
                  ) : (
                    formatINR(shippingAmount)
                  )}
                </span>
              </div>
              <div className="border-t border-[#E8E3DA] pt-3 flex justify-between items-baseline text-sm">
                <span className="font-bold text-[#1C1F1C]">Total Payable</span>
                <span className="text-lg font-extrabold text-[#1E3F20]">
                  {formatINR(totalPayable)}
                </span>
              </div>
            </div>

            {/* Solid Forest Green Pay Button matching Screen 5: Pay ₹2,997 */}
            <button
              onClick={handleCheckoutSubmit}
              disabled={isSubmitting || !cart?.items?.length}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#1E3F20] py-3.5 text-center text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-[#2A572D] disabled:opacity-50"
            >
              <Lock className="h-4 w-4" />
              {isSubmitting ? "Securing Order..." : `Pay ${formatINR(totalPayable)}`}
            </button>
          </div>

          <div className="rounded-2xl border border-[#E8E3DA] bg-[#FAF7F2] p-4 text-xs text-gray-600 space-y-1.5">
            <div className="flex items-center gap-2 font-semibold text-[#1E3F20]">
              <ShieldCheck className="h-4 w-4" />
              <span>100% Encrypted &amp; Secure Payment</span>
            </div>
            <p className="text-[11px] leading-relaxed text-gray-500">
              Your payment information is processed securely with 256-bit bank-grade encryption via Razorpay.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <React.Suspense
      fallback={
        <div className="mx-auto max-w-7xl 2xl:max-w-[1600px] px-4 py-20 text-center text-xs text-gray-500 2xl:px-12">
          Loading checkout...
        </div>
      }
    >
      <CheckoutContent />
    </React.Suspense>
  );
}
