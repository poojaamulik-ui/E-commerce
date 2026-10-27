import { NextResponse } from "next/server";
import { requireStaffOrAdmin } from "@/lib/auth/guard";
import { updateShipmentTracking } from "@/lib/services/adminService";
import { z } from "zod";

const trackingSchema = z.object({
  carrier: z.string().min(2, "Carrier name is required"),
  trackingNumber: z.string().min(3, "Tracking number is required"),
  trackingUrl: z.string().url().optional().or(z.literal("")),
  notes: z.string().optional(),
});

export async function POST(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireStaffOrAdmin();
    const { id } = await props.params;

    const body = await request.json();
    const parsed = trackingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid tracking details" }, { status: 400 });
    }

    const shipment = await updateShipmentTracking({
      orderId: id,
      carrier: parsed.data.carrier,
      trackingNumber: parsed.data.trackingNumber,
      trackingUrl: parsed.data.trackingUrl || undefined,
      notes: parsed.data.notes,
      actorId: session.userId,
    });

    return NextResponse.json({ success: true, shipment });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to record tracking";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
