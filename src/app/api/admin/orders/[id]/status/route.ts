import { NextResponse } from "next/server";
import { requireStaffOrAdmin } from "@/lib/auth/guard";
import { updateOrderStatus } from "@/lib/services/adminService";
import { OrderStatus } from "@prisma/client";
import { z } from "zod";

const statusUpdateSchema = z.object({
  status: z.nativeEnum(OrderStatus),
  adminNotes: z.string().optional(),
});

export async function PATCH(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireStaffOrAdmin();
    const { id } = await props.params;

    const body = await request.json();
    const parsed = statusUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
    }

    const updated = await updateOrderStatus({
      orderId: id,
      status: parsed.data.status,
      adminNotes: parsed.data.adminNotes,
      actorId: session.userId,
    });

    return NextResponse.json({ success: true, order: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update order status";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
