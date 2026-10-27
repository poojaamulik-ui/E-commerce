import { describe, it, expect } from "vitest";

describe("Coupon Discount Mathematics", () => {
  it("calculates percentage discount accurately", () => {
    const subtotalPaise = 100000; // ₹1,000
    const discountPercent = 10; // 10%
    const calculated = Math.round((subtotalPaise * discountPercent) / 100);
    expect(calculated).toBe(10000); // ₹100
  });

  it("enforces maximum discount caps for percentage coupons", () => {
    const subtotalPaise = 500000; // ₹5,000
    const discountPercent = 10; // 10% = ₹500 (50000 paise)
    const maxDiscountAmountPaise = 30000; // Cap at ₹300 (30000 paise)

    let discount = Math.round((subtotalPaise * discountPercent) / 100);
    if (maxDiscountAmountPaise && discount > maxDiscountAmountPaise) {
      discount = maxDiscountAmountPaise;
    }

    expect(discount).toBe(30000);
  });

  it("never allows discount to exceed subtotal", () => {
    const subtotalPaise = 20000; // ₹200
    const fixedDiscountPaise = 25000; // ₹250
    const finalDiscount = Math.min(fixedDiscountPaise, subtotalPaise);

    expect(finalDiscount).toBe(20000); // capped at subtotal
    expect(subtotalPaise - finalDiscount).toBe(0); // non-negative payable
  });
});
