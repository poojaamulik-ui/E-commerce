import { NextResponse } from "next/server";
import { addToCart } from "@/lib/services/cartService";
import { z } from "zod";

const addToCartSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  variantId: z.string().optional().nullable(),
  quantity: z.number().int().min(1, "Quantity must be at least 1").default(1),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = addToCartSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid item data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { productId, variantId, quantity } = parsed.data;
    const updatedCart = await addToCart({ productId, variantId, quantity });

    return NextResponse.json({ success: true, cart: updatedCart });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to add item to cart";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
