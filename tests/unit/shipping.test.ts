import { describe, it, expect } from "vitest";
import {
  shippingService,
  FREE_SHIPPING_THRESHOLD_PAISE,
  STANDARD_SHIPPING_FEE_PAISE,
} from "@/lib/shipping";

describe("Shipping Service Calculation", () => {
  it("applies standard shipping fee for orders below threshold", () => {
    const result = shippingService.calculateShipping(50000); // ₹500
    expect(result.shippingAmountPaise).toBe(STANDARD_SHIPPING_FEE_PAISE);
    expect(result.isFreeShipping).toBe(false);
  });

  it("grants free shipping for orders at or above ₹999", () => {
    const result = shippingService.calculateShipping(FREE_SHIPPING_THRESHOLD_PAISE); // ₹999
    expect(result.shippingAmountPaise).toBe(0);
    expect(result.isFreeShipping).toBe(true);

    const highOrderResult = shippingService.calculateShipping(250000); // ₹2500
    expect(highOrderResult.shippingAmountPaise).toBe(0);
    expect(highOrderResult.isFreeShipping).toBe(true);
  });

  it("generates formatted tracking numbers", () => {
    const tracking = shippingService.generateTrackingNumber();
    expect(tracking).toMatch(/^BB-EXP-\d{6}-[A-Z0-9]+$/);
  });
});
