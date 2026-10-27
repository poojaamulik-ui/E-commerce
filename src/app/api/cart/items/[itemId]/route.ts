import { NextResponse } from "next/server";
import { updateCartItemQuantity, removeCartItem } from "@/lib/services/cartService";
import { z } from "zod";

const updateQuantitySchema = z.object({
  quantity: z.number().int().min(0),
});

export async function PATCH(
  request: Request,
  props: { params: Promise<{ itemId: string }> }
) {
  try {
    const { itemId } = await props.params;
    const body = await request.json();
    const parsed = updateQuantitySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid quantity specified" }, { status: 400 });
    }

    const updatedCart = await updateCartItemQuantity(itemId, parsed.data.quantity);
    return NextResponse.json({ success: true, cart: updatedCart });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update item quantity";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(
  _request: Request,
  props: { params: Promise<{ itemId: string }> }
) {
  try {
    const { itemId } = await props.params;
    const updatedCart = await removeCartItem(itemId);
    return NextResponse.json({ success: true, cart: updatedCart });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to remove item";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
