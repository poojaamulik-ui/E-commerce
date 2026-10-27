import { NextResponse } from "next/server";
import { getCart } from "@/lib/services/cartService";

export async function GET() {
  try {
    const cart = await getCart();
    return NextResponse.json({ success: true, cart });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to load cart";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
