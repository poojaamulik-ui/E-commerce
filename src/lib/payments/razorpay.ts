import crypto from "crypto";

export interface CreateRazorpayOrderInput {
  amountPaise: number;
  orderNumber: string;
  notes?: Record<string, string>;
}

export interface RazorpayOrderResult {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
}

export class RazorpayService {
  private keyId: string;
  private keySecret: string;
  private webhookSecret: string;

  constructor() {
    this.keyId = process.env.RAZORPAY_KEY_ID || "";
    this.keySecret = process.env.RAZORPAY_KEY_SECRET || "";
    this.webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || "";
  }

  isConfigured(): boolean {
    return Boolean(
      this.keyId &&
      this.keySecret &&
      !this.keyId.includes("placeholder") &&
      !this.keySecret.includes("placeholder")
    );
  }

  getKeyId(): string {
    return this.keyId;
  }

  /**
   * Creates an authoritative order on Razorpay servers.
   * If credentials are not yet configured in development, returns a compliant stub for sandbox testing.
   */
  async createOrder(input: CreateRazorpayOrderInput): Promise<RazorpayOrderResult> {
    if (!this.isConfigured()) {
      // In development sandbox mode without external credentials, return structured test order
      const mockId = `order_mock_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      return {
        id: mockId,
        amount: input.amountPaise,
        currency: "INR",
        receipt: input.orderNumber,
        status: "created",
      };
    }

    const auth = Buffer.from(`${this.keyId}:${this.keySecret}`).toString("base64");
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: input.amountPaise,
        currency: "INR",
        receipt: input.orderNumber,
        notes: input.notes,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Razorpay order creation failed (${response.status}): ${errorText}`);
    }

    return response.json() as Promise<RazorpayOrderResult>;
  }

  /**
   * Verifies client payment callback signature using HMAC-SHA256
   */
  verifyPaymentSignature(params: {
    orderId: string;
    paymentId: string;
    signature: string;
  }): boolean {
    if (!this.isConfigured()) {
      // If mock test order, verify matching pattern
      if (params.orderId.startsWith("order_mock_") && params.paymentId.startsWith("pay_mock_")) {
        return true;
      }
    }

    const generatedSignature = crypto
      .createHmac("sha256", this.keySecret)
      .update(`${params.orderId}|${params.paymentId}`)
      .digest("hex");

    return crypto.timingSafeEqual(
      Buffer.from(generatedSignature),
      Buffer.from(params.signature)
    );
  }

  /**
   * Verifies Razorpay webhook event signature using raw request body
   */
  verifyWebhookSignature(rawBody: string, signature: string): boolean {
    if (!this.webhookSecret) {
      return false;
    }

    const expectedSignature = crypto
      .createHmac("sha256", this.webhookSecret)
      .update(rawBody)
      .digest("hex");

    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(signature)
    );
  }
}

export const razorpayService = new RazorpayService();
