import { prisma } from "@/lib/db";
import { getCart, clearCart } from "./cartService";
import { validateCoupon } from "./couponService";
import { shippingService } from "@/lib/shipping";
import { razorpayService } from "@/lib/payments/razorpay";
import { emailService } from "@/lib/email";
import { formatINR } from "@/lib/formatters";
import { OrderStatus, PaymentStatus, Role } from "@prisma/client";

export interface CreateOrderInput {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  street: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  customerNotes?: string;
  couponCode?: string;
  userId?: string | null;
}

export function generateOrderNumber(): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomStr = Math.floor(1000 + Math.random() * 9000).toString();
  return `BB-${dateStr}-${randomStr}`;
}

export async function createOrderFromCart(input: CreateOrderInput) {
  const cart = await getCart();

  if (!cart.items || cart.items.length === 0) {
    throw new Error("Your cart is empty.");
  }

  // 1. Authoritative price and stock verification
  let subtotalPaise = 0;
  for (const item of cart.items) {
    const liveProduct = await prisma.product.findUnique({
      where: { id: item.productId, isPublished: true, isArchived: false },
    });
    if (!liveProduct) {
      throw new Error(`Product "${item.product.name}" is no longer available.`);
    }

    const availableStock = item.variant ? item.variant.stockQuantity : liveProduct.stockQuantity;
    if (availableStock < item.quantity) {
      throw new Error(
        `Insufficient stock for "${item.product.name}". Only ${availableStock} left.`
      );
    }

    const unitPrice = item.variant?.salePrice || item.variant?.price || liveProduct.salePrice || liveProduct.basePrice;
    subtotalPaise += unitPrice * item.quantity;
  }

  // 2. Coupon discount verification
  let discountPaise = 0;
  let appliedCouponId: string | null = null;
  if (input.couponCode) {
    const couponValidation = await validateCoupon(input.couponCode, subtotalPaise, input.userId || undefined);
    if (couponValidation.isValid && couponValidation.coupon) {
      discountPaise = couponValidation.coupon.discountAmountPaise;
      appliedCouponId = couponValidation.coupon.id;
    }
  }

  // 3. Shipping fee calculation
  const subtotalAfterDiscount = Math.max(0, subtotalPaise - discountPaise);
  const shippingCalculation = shippingService.calculateShipping(subtotalAfterDiscount);
  const shippingPaise = shippingCalculation.shippingAmountPaise;

  // 4. Final authoritative payable total
  const totalAmountPaise = subtotalAfterDiscount + shippingPaise;
  const orderNumber = generateOrderNumber();

  const shippingAddressSnapshot = {
    name: input.customerName,
    phone: input.customerPhone,
    street: input.street,
    landmark: input.landmark || null,
    city: input.city,
    state: input.state,
    pincode: input.pincode,
  };

  // 5. Execute atomic database transaction for order, inventory deduction, and audit log
  const newOrder = await prisma.$transaction(async (tx) => {
    // A. Deduct stock and log inventory movement
    for (const item of cart.items) {
      if (item.variantId) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stockQuantity: { decrement: item.quantity } },
        });
      }

      await tx.product.update({
        where: { id: item.productId },
        data: { stockQuantity: { decrement: item.quantity } },
      });

      await tx.inventoryMovement.create({
        data: {
          productId: item.productId,
          delta: -item.quantity,
          reason: "ORDER_FULFILLMENT",
          referenceId: orderNumber,
        },
      });
    }

    // B. Create the Order with immutable item snapshots
    const order = await tx.order.create({
      data: {
        orderNumber,
        userId: input.userId || null,
        customerName: input.customerName,
        customerEmail: input.customerEmail,
        customerPhone: input.customerPhone,
        status: OrderStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
        subtotalAmount: subtotalPaise,
        discountAmount: discountPaise,
        shippingAmount: shippingPaise,
        taxAmount: 0,
        totalAmount: totalAmountPaise,
        shippingAddress: shippingAddressSnapshot,
        customerNotes: input.customerNotes || null,
        couponCode: input.couponCode || null,
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            productName: item.product.name,
            sku: item.variant?.sku || item.product.sku,
            variantName: item.variant?.name || null,
            unitPrice: item.effectiveUnitPrice,
            quantity: item.quantity,
            totalPrice: item.lineTotal,
            imageUrl: item.product.images[0]?.url || null,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    // C. Record coupon redemption if coupon used
    if (appliedCouponId) {
      await tx.coupon.update({
        where: { id: appliedCouponId },
        data: { usageCount: { increment: 1 } },
      });

      await tx.couponRedemption.create({
        data: {
          couponId: appliedCouponId,
          orderId: order.id,
          userId: input.userId || null,
        },
      });
    }

    return order;
  });

  // 6. Create Razorpay gateway order
  let razorpayOrder;
  try {
    razorpayOrder = await razorpayService.createOrder({
      amountPaise: totalAmountPaise,
      orderNumber,
      notes: {
        orderId: newOrder.id,
        customerEmail: input.customerEmail,
      },
    });
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    // Return order with local order id
    razorpayOrder = {
      id: `order_local_${newOrder.id}`,
      amount: totalAmountPaise,
      currency: "INR",
      status: "created",
    };
  }

  // 7. Record payment attempt
  await prisma.payment.create({
    data: {
      orderId: newOrder.id,
      provider: "RAZORPAY",
      providerOrderId: razorpayOrder.id,
      amount: totalAmountPaise,
      currency: "INR",
      status: PaymentStatus.PENDING,
    },
  });

  // 8. Empty the user's cart now that order is placed
  await clearCart(cart.id);

  return {
    order: newOrder,
    razorpayOrder,
    razorpayKeyId: razorpayService.getKeyId(),
  };
}

export async function verifyPaymentAndConfirmOrder(params: {
  orderId: string;
  providerOrderId: string;
  providerPaymentId: string;
  signature: string;
}) {
  const { orderId, providerOrderId, providerPaymentId, signature } = params;

  // 1. Verify cryptographic signature
  const isSignatureValid = razorpayService.verifyPaymentSignature({
    orderId: providerOrderId,
    paymentId: providerPaymentId,
    signature,
  });

  if (!isSignatureValid) {
    await prisma.payment.updateMany({
      where: { orderId, providerOrderId },
      data: { status: PaymentStatus.FAILED },
    });
    throw new Error("Payment signature verification failed.");
  }

  // 2. Update payment and order records atomically
  const updatedOrder = await prisma.$transaction(async (tx) => {
    await tx.payment.updateMany({
      where: { orderId, providerOrderId },
      data: {
        providerPaymentId,
        providerSignature: signature,
        status: PaymentStatus.PAID,
      },
    });

    const confirmedOrder = await tx.order.update({
      where: { id: orderId },
      data: {
        status: OrderStatus.CONFIRMED,
        paymentStatus: PaymentStatus.PAID,
      },
      include: {
        items: true,
      },
    });

    // Create initial shipment record
    await tx.shipment.create({
      data: {
        orderId: confirmedOrder.id,
        carrier: "India Post Speed Post / Delhivery Express",
        status: "PENDING",
      },
    });

    return confirmedOrder;
  });

  // 3. Send order confirmation email asynchronously
  try {
    const emailHtml = emailService.getOrderConfirmationTemplate({
      orderNumber: updatedOrder.orderNumber,
      customerName: updatedOrder.customerName,
      totalAmountFormatted: formatINR(updatedOrder.totalAmount),
      items: updatedOrder.items.map((i) => ({
        name: i.productName,
        quantity: i.quantity,
        priceFormatted: formatINR(i.totalPrice),
      })),
    });

    await emailService.sendEmail({
      to: updatedOrder.customerEmail,
      subject: `Order Confirmed - ${updatedOrder.orderNumber} | BharatBazaar`,
      html: emailHtml,
    });
  } catch (emailErr) {
    console.error("Order confirmation email failed:", emailErr);
  }

  return updatedOrder;
}

export async function getOrderForCustomer(orderNumber: string, userId?: string | null) {
  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: {
      items: true,
      payments: true,
      shipments: true,
    },
  });

  if (!order) return null;

  // Enforce customer ownership authorization if logged in
  if (userId && order.userId && order.userId !== userId) {
    return null;
  }

  return order;
}

export async function getUserOrders(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      items: true,
      payments: true,
      shipments: true,
    },
  });
}
