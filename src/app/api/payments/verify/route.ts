import { NextResponse } from "next/server";
import { verifyPaymentAndConfirmOrder } from "@/lib/services/orderService";
import { z } from "zod";

const verifySchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  razorpayOrderId: z.string().min(1, "Razorpay Order ID is required"),
  razorpayPaymentId: z.string().min(1, "Razorpay Payment ID is required"),
  razorpaySignature: z.string().min(1, "Razorpay Signature is required"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = verifySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payment verification payload", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = parsed.data;

    const confirmedOrder = await verifyPaymentAndConfirmOrder({
      orderId,
      providerOrderId: razorpayOrderId,
      providerPaymentId: razorpayPaymentId,
      signature: razorpaySignature,
    });

    return NextResponse.json({
      success: true,
      message: "Payment successfully verified and order confirmed.",
      orderNumber: confirmedOrder.orderNumber,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Payment verification failed";
    console.error("Payment verification route error:", err);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
