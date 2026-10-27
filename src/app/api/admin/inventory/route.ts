import { NextResponse } from "next/server";
import { requireStaffOrAdmin } from "@/lib/auth/guard";
import { adjustInventory } from "@/lib/services/adminService";
import { z } from "zod";

const adjustSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  delta: z.number().int().refine((val) => val !== 0, "Delta cannot be zero"),
  reason: z.string().min(2, "Reason is required"),
});

export async function POST(request: Request) {
  try {
    const session = await requireStaffOrAdmin();
    const body = await request.json();
    const parsed = adjustSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid adjustment request", details: parsed.error.flatten() }, { status: 400 });
    }

    const updated = await adjustInventory({
      productId: parsed.data.productId,
      delta: parsed.data.delta,
      reason: parsed.data.reason,
      actorId: session.userId,
    });

    return NextResponse.json({ success: true, product: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Inventory adjustment failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
