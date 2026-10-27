import { NextResponse } from "next/server";
import { createOrderFromCart } from "@/lib/services/orderService";
import { checkoutSchema } from "@/lib/validation";
import { getSession } from "@/lib/auth/session";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = checkoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Please check your delivery details.",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const session = await getSession();

    const result = await createOrderFromCart({
      ...parsed.data,
      userId: session?.userId || null,
    });

    return NextResponse.json({
      success: true,
      order: {
        id: result.order.id,
        orderNumber: result.order.orderNumber,
        totalAmount: result.order.totalAmount,
        subtotalAmount: result.order.subtotalAmount,
        discountAmount: result.order.discountAmount,
        shippingAmount: result.order.shippingAmount,
      },
      payment: {
        provider: "RAZORPAY",
        razorpayOrderId: result.razorpayOrder.id,
        razorpayKeyId: result.razorpayKeyId,
        amount: result.razorpayOrder.amount,
        currency: result.razorpayOrder.currency,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Checkout failed";
    console.error("Checkout route error:", err);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
