/**
 * Formats an amount in paise (1 INR = 100 paise) into a standard Indian Rupee string (₹).
 * e.g., 149900 -> "₹1,499.00"
 */
export function formatINR(paise: number): string {
  const rupees = paise / 100;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(rupees);
}

/**
 * Formats an amount in paise to a compact display without decimals if even.
 * e.g., 149900 -> "₹1,499"
 */
export function formatINRCompact(paise: number): string {
  const rupees = paise / 100;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: rupees % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(rupees);
}

/**
 * Formats a Date object or ISO string in Indian standard date format.
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}

/**
 * Formats a Date object or ISO string in Indian standard date-time format.
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(d);
}

/**
 * Validates a 6-digit Indian PIN code.
 */
export function isValidIndianPincode(pincode: string): boolean {
  return /^[1-9][0-9]{5}$/.test(pincode.trim());
}

/**
 * Validates a 10-digit Indian Mobile number (starts with 6, 7, 8, 9).
 */
export function isValidIndianPhone(phone: string): boolean {
  const cleanPhone = phone.replace(/[\s+-]/g, "");
  return /^(?:\+91|91)?[6-9]\d{9}$/.test(cleanPhone);
}

/**
 * Normalizes an Indian phone number to 10 digits without prefix.
 */
export function normalizeIndianPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) {
    return digits.slice(2);
  }
  return digits;
}
