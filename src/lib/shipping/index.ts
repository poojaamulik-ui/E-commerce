export interface ShippingCalculation {
  carrier: string;
  shippingAmountPaise: number;
  isFreeShipping: boolean;
  estimatedDays: string;
}

export const FREE_SHIPPING_THRESHOLD_PAISE = 99900; // Free delivery above ₹999
export const STANDARD_SHIPPING_FEE_PAISE = 7900; // ₹79 standard delivery

export class ShippingService {
  /**
   * Calculates delivery fee based on order subtotal after discounts
   */
  calculateShipping(subtotalPaise: number): ShippingCalculation {
    if (subtotalPaise >= FREE_SHIPPING_THRESHOLD_PAISE) {
      return {
        carrier: "India Post Speed Post / Delhivery Express",
        shippingAmountPaise: 0,
        isFreeShipping: true,
        estimatedDays: "3-5 business days",
      };
    }

    return {
      carrier: "Standard Surface Express",
      shippingAmountPaise: STANDARD_SHIPPING_FEE_PAISE,
      isFreeShipping: false,
      estimatedDays: "4-6 business days",
    };
  }

  /**
   * Generates a formal tracking number for dispatch
   */
  generateTrackingNumber(): string {
    const randomHex = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `BB-EXP-${Date.now().toString().slice(-6)}-${randomHex}`;
  }
}

export const shippingService = new ShippingService();
