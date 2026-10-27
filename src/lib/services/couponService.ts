import { prisma } from "@/lib/db";
import { DiscountType } from "@prisma/client";

export interface ValidateCouponResult {
  isValid: boolean;
  message?: string;
  coupon?: {
    id: string;
    code: string;
    description: string | null;
    discountType: DiscountType;
    discountValue: number;
    discountAmountPaise: number;
  };
}

export async function validateCoupon(
  code: string,
  subtotalPaise: number,
  userId?: string
): Promise<ValidateCouponResult> {
  const cleanCode = code.trim().toUpperCase();

  const coupon = await prisma.coupon.findUnique({
    where: { code: cleanCode },
  });

  if (!coupon || !coupon.isActive) {
    return { isValid: false, message: "Invalid or inactive coupon code." };
  }

  // Check start and expiry dates
  const now = new Date();
  if (coupon.startsAt && coupon.startsAt > now) {
    return { isValid: false, message: "This coupon is not active yet." };
  }
  if (coupon.expiresAt && coupon.expiresAt < now) {
    return { isValid: false, message: "This coupon code has expired." };
  }

  // Check total usage limit
  if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
    return { isValid: false, message: "This coupon has reached its maximum redemptions." };
  }

  // Check minimum order amount
  if (subtotalPaise < coupon.minOrderAmount) {
    const minRupees = coupon.minOrderAmount / 100;
    return {
      isValid: false,
      message: `Minimum order value of ₹${minRupees} required for this coupon.`,
    };
  }

  // Check per-user redemption limit (1 per customer)
  if (userId) {
    const previousRedemption = await prisma.couponRedemption.findFirst({
      where: { couponId: coupon.id, userId },
    });
    if (previousRedemption) {
      return {
        isValid: false,
        message: "You have already used this coupon code.",
      };
    }
  }

  // Calculate discount amount in paise
  let discountAmountPaise = 0;
  if (coupon.discountType === DiscountType.PERCENTAGE) {
    discountAmountPaise = Math.round((subtotalPaise * coupon.discountValue) / 100);
    if (coupon.maxDiscountAmount && discountAmountPaise > coupon.maxDiscountAmount) {
      discountAmountPaise = coupon.maxDiscountAmount;
    }
  } else {
    discountAmountPaise = coupon.discountValue;
  }

  // Never exceed subtotal
  discountAmountPaise = Math.min(discountAmountPaise, subtotalPaise);

  return {
    isValid: true,
    coupon: {
      id: coupon.id,
      code: coupon.code,
      description: coupon.description,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discountAmountPaise,
    },
  };
}
