import { NextResponse } from "next/server";
import { validateCoupon } from "@/lib/services/couponService";
import { getCart } from "@/lib/services/cartService";
import { getSession } from "@/lib/auth/session";
import { z } from "zod";

const validateSchema = z.object({
  code: z.string().min(1, "Coupon code is required"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = validateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid coupon code" }, { status: 400 });
    }

    const session = await getSession();
    const cart = await getCart();

    const result = await validateCoupon(
      parsed.data.code,
      cart.subtotalPaise,
      session?.userId
    );

    if (!result.isValid) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      coupon: result.coupon,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Coupon validation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
