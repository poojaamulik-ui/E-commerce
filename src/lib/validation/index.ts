import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please provide a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian mobile number")
    .optional()
    .or(z.literal("")),
});

export const addressSchema = z.object({
  name: z.string().min(2, "Full name is required"),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian mobile number"),
  street: z.string().min(5, "Flat/House No. and Street address are required"),
  landmark: z.string().optional(),
  city: z.string().min(2, "City name is required"),
  state: z.string().min(2, "State is required"),
  pincode: z
    .string()
    .regex(/^[1-9][0-9]{5}$/, "Please enter a valid 6-digit Indian PIN code"),
  isDefault: z.boolean().optional().default(false),
});

export const checkoutSchema = z.object({
  customerName: z.string().min(2, "Full name is required"),
  customerEmail: z.string().email("Please enter a valid email"),
  customerPhone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian mobile number"),
  street: z.string().min(5, "Delivery address is required"),
  landmark: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z
    .string()
    .regex(/^[1-9][0-9]{5}$/, "Please enter a valid 6-digit Indian PIN code"),
  customerNotes: z.string().max(500).optional(),
  couponCode: z.string().optional(),
});

export const productSchema = z.object({
  name: z.string().min(2, "Product title is required"),
  slug: z.string().min(2, "Valid slug is required"),
  sku: z.string().min(2, "SKU is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  shortDescription: z.string().optional(),
  basePrice: z.number().int().positive("Price in paise must be positive"),
  salePrice: z.number().int().positive("Sale price must be positive").optional().nullable(),
  stockQuantity: z.number().int().min(0, "Stock quantity cannot be negative"),
  lowStockThreshold: z.number().int().min(0).default(5),
  isPublished: z.boolean().default(false),
  categoryIds: z.array(z.string()).min(1, "Select at least one category"),
  images: z.array(z.string().url()).optional(),
  specifications: z.record(z.string(), z.string()).optional(),
});

export const categorySchema = z.object({
  name: z.string().min(2, "Category name is required"),
  slug: z.string().min(2, "Slug is required"),
  description: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  displayOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

export const couponSchema = z.object({
  code: z.string().min(3, "Coupon code must be at least 3 characters").toUpperCase(),
  description: z.string().optional(),
  discountType: z.enum(["PERCENTAGE", "FIXED_AMOUNT"]),
  discountValue: z.number().int().positive("Discount value must be positive"),
  minOrderAmount: z.number().int().min(0).default(0),
  maxDiscountAmount: z.number().int().positive().optional().nullable(),
  usageLimit: z.number().int().positive().optional().nullable(),
  isActive: z.boolean().default(true),
  expiresAt: z.string().optional().nullable(),
});

export const inventoryAdjustmentSchema = z.object({
  productId: z.string().uuid(),
  delta: z.number().int().refine((val) => val !== 0, "Adjustment delta cannot be 0"),
  reason: z.string().min(3, "Reason is required"),
  referenceId: z.string().optional(),
});
