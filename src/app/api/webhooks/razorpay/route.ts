import { NextResponse } from "next/server";
import { razorpayService } from "@/lib/payments/razorpay";
import { prisma } from "@/lib/db";
import { OrderStatus, PaymentStatus, WebhookStatus } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing webhook signature" }, { status: 400 });
    }

    // Cryptographic signature check
    const isValid = razorpayService.verifyWebhookSignature(rawBody, signature);
    if (!isValid) {
      console.warn("[WEBHOOK] Invalid Razorpay webhook signature rejected.");
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const eventId = payload.event_id || payload.id || `evt_${Date.now()}`;
    const eventType = payload.event || "unknown";

    // Idempotency check: Check if event was already recorded or processed
    const existingEvent = await prisma.webhookEvent.findUnique({
      where: { eventId },
    });

    if (existingEvent && existingEvent.status === WebhookStatus.PROCESSED) {
      return NextResponse.json({ status: "ignored", reason: "duplicate_event" });
    }

    // Record webhook event in DB
    const recordedEvent = await prisma.webhookEvent.upsert({
      where: { eventId },
      update: {
        payload,
      },
      create: {
        eventId,
        eventType,
        provider: "RAZORPAY",
        payload,
        status: WebhookStatus.PENDING,
      },
    });

    // Handle supported payment events
    if (eventType === "payment.captured" || eventType === "order.paid") {
      const paymentEntity = payload.payload?.payment?.entity;
      const orderEntity = payload.payload?.order?.entity;

      const providerOrderId = paymentEntity?.order_id || orderEntity?.id;
      const providerPaymentId = paymentEntity?.id;

      if (providerOrderId) {
        await prisma.$transaction(async (tx) => {
          const payment = await tx.payment.findFirst({
            where: { providerOrderId },
          });

          if (payment) {
            await tx.payment.update({
              where: { id: payment.id },
              data: {
                providerPaymentId: providerPaymentId || payment.providerPaymentId,
                status: PaymentStatus.PAID,
              },
            });

            await tx.order.update({
              where: { id: payment.orderId },
              data: {
                status: OrderStatus.CONFIRMED,
                paymentStatus: PaymentStatus.PAID,
              },
            });
          }
        });
      }
    } else if (eventType === "payment.failed") {
      const paymentEntity = payload.payload?.payment?.entity;
      const providerOrderId = paymentEntity?.order_id;

      if (providerOrderId) {
        await prisma.payment.updateMany({
          where: { providerOrderId },
          data: { status: PaymentStatus.FAILED },
        });
      }
    }

    // Mark event processed
    await prisma.webhookEvent.update({
      where: { id: recordedEvent.id },
      data: {
        status: WebhookStatus.PROCESSED,
        processedAt: new Date(),
      },
    });

    return NextResponse.json({ status: "ok" });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Webhook processing error";
    console.error("[WEBHOOK ERROR]", errorMsg);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
