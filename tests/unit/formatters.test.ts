import { describe, it, expect } from "vitest";
import {
  formatINR,
  formatINRCompact,
  isValidIndianPincode,
  isValidIndianPhone,
  normalizeIndianPhone,
} from "@/lib/formatters";

describe("Indian Currency and Formatters", () => {
  it("formats paise into Indian Rupee format correctly", () => {
    // 149900 paise = ₹1,499.00
    const formatted = formatINR(149900);
    expect(formatted).toContain("1,499.00");
    expect(formatted).toMatch(/₹|INR/);
  });

  it("handles zero and fractional amounts in paise", () => {
    expect(formatINR(0)).toContain("0.00");
    expect(formatINR(50)).toContain("0.50");
  });

  it("formats compact amounts without decimal if whole", () => {
    const compact = formatINRCompact(150000);
    expect(compact).toContain("1,500");
  });

  it("validates 6-digit Indian PIN codes", () => {
    expect(isValidIndianPincode("560001")).toBe(true);
    expect(isValidIndianPincode("110001")).toBe(true);
    expect(isValidIndianPincode("012345")).toBe(false); // cannot start with 0
    expect(isValidIndianPincode("56000")).toBe(false); // 5 digits
    expect(isValidIndianPincode("5600012")).toBe(false); // 7 digits
    expect(isValidIndianPincode("abcde")).toBe(false);
  });

  it("validates Indian mobile numbers", () => {
    expect(isValidIndianPhone("9876543210")).toBe(true);
    expect(isValidIndianPhone("+919876543210")).toBe(true);
    expect(isValidIndianPhone("919876543210")).toBe(true);
    expect(isValidIndianPhone("5123456789")).toBe(false); // does not start with 6,7,8,9
    expect(isValidIndianPhone("12345")).toBe(false);
  });

  it("normalizes phone numbers to 10 digits", () => {
    expect(normalizeIndianPhone("+91-9876543210")).toBe("9876543210");
    expect(normalizeIndianPhone("919876543210")).toBe("9876543210");
  });
});
