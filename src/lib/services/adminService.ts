import { prisma } from "@/lib/db";
import { OrderStatus, PaymentStatus, Prisma } from "@prisma/client";

export async function getAdminDashboardStats() {
  const [
    totalOrdersCount,
    paidOrders,
    pendingFulfillmentCount,
    productsCount,
    lowStockProducts,
    recentOrders,
  ] = await Promise.all([
    // Total orders count
    prisma.order.count(),

    // Orders that are paid (to compute accurate revenue)
    prisma.order.findMany({
      where: { paymentStatus: PaymentStatus.PAID },
      select: { totalAmount: true },
    }),

    // Orders awaiting fulfillment
    prisma.order.count({
      where: {
        status: { in: [OrderStatus.CONFIRMED, OrderStatus.PROCESSING] },
      },
    }),

    // Total products count
    prisma.product.count({
      where: { isArchived: false },
    }),

    // Low stock products (stock <= lowStockThreshold)
    prisma.product.findMany({
      where: {
        isArchived: false,
        stockQuantity: { lte: 5 },
      },
      select: {
        id: true,
        name: true,
        sku: true,
        stockQuantity: true,
        lowStockThreshold: true,
      },
      take: 10,
    }),

    // Recent 10 orders
    prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        items: true,
      },
    }),
  ]);

  const totalRevenuePaise = paidOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const averageOrderValuePaise =
    paidOrders.length > 0 ? Math.round(totalRevenuePaise / paidOrders.length) : 0;

  return {
    totalOrdersCount,
    paidOrdersCount: paidOrders.length,
    totalRevenuePaise,
    averageOrderValuePaise,
    pendingFulfillmentCount,
    productsCount,
    lowStockCount: lowStockProducts.length,
    lowStockProducts,
    recentOrders,
  };
}

export async function getAdminOrders(params: {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  search?: string;
  page?: number;
  limit?: number;
} = {}) {
  const { status, paymentStatus, search, page = 1, limit = 20 } = params;

  const where: Prisma.OrderWhereInput = {};

  if (status) where.status = status;
  if (paymentStatus) where.paymentStatus = paymentStatus;
  if (search && search.trim().length > 0) {
    const q = search.trim();
    where.OR = [
      { orderNumber: { contains: q, mode: "insensitive" } },
      { customerName: { contains: q, mode: "insensitive" } },
      { customerEmail: { contains: q, mode: "insensitive" } },
      { customerPhone: { contains: q, mode: "insensitive" } },
    ];
  }

  const skip = (page - 1) * limit;

  const [orders, totalCount] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        items: true,
        payments: true,
        shipments: true,
      },
    }),
    prisma.order.count({ where }),
  ]);

  return {
    orders,
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
    currentPage: page,
  };
}

export async function updateOrderStatus(params: {
  orderId: string;
  status: OrderStatus;
  adminNotes?: string;
  actorId: string;
}) {
  const { orderId, status, adminNotes, actorId } = params;

  const updated = await prisma.$transaction(async (tx) => {
    const order = await tx.order.update({
      where: { id: orderId },
      data: {
        status,
        ...(adminNotes !== undefined && { adminNotes }),
      },
    });

    await tx.adminActivityLog.create({
      data: {
        actorId,
        action: "ORDER_STATUS_UPDATE",
        entityType: "Order",
        entityId: orderId,
        details: { newStatus: status, adminNotes },
      },
    });

    return order;
  });

  return updated;
}

export async function updateShipmentTracking(params: {
  orderId: string;
  carrier: string;
  trackingNumber: string;
  trackingUrl?: string;
  notes?: string;
  actorId: string;
}) {
  const { orderId, carrier, trackingNumber, trackingUrl, notes, actorId } = params;

  const shipment = await prisma.$transaction(async (tx) => {
    const existing = await tx.shipment.findFirst({ where: { orderId } });

    let updatedShipment;
    if (existing) {
      updatedShipment = await tx.shipment.update({
        where: { id: existing.id },
        data: {
          carrier,
          trackingNumber,
          trackingUrl,
          notes,
          status: "IN_TRANSIT",
          shippedAt: new Date(),
        },
      });
    } else {
      updatedShipment = await tx.shipment.create({
        data: {
          orderId,
          carrier,
          trackingNumber,
          trackingUrl,
          notes,
          status: "IN_TRANSIT",
          shippedAt: new Date(),
        },
      });
    }

    await tx.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.SHIPPED },
    });

    await tx.adminActivityLog.create({
      data: {
        actorId,
        action: "SHIPMENT_DISPATCH",
        entityType: "Shipment",
        entityId: updatedShipment.id,
        details: { carrier, trackingNumber },
      },
    });

    return updatedShipment;
  });

  return shipment;
}

export async function adjustInventory(params: {
  productId: string;
  delta: number;
  reason: string;
  actorId: string;
}) {
  const { productId, delta, reason, actorId } = params;

  const product = await prisma.$transaction(async (tx) => {
    const updated = await tx.product.update({
      where: { id: productId },
      data: { stockQuantity: { increment: delta } },
    });

    if (updated.stockQuantity < 0) {
      throw new Error("Inventory adjustment would result in negative stock.");
    }

    await tx.inventoryMovement.create({
      data: {
        productId,
        delta,
        reason,
        actorId,
      },
    });

    await tx.adminActivityLog.create({
      data: {
        actorId,
        action: "INVENTORY_ADJUSTMENT",
        entityType: "Product",
        entityId: productId,
        details: { delta, reason, finalStock: updated.stockQuantity },
      },
    });

    return updated;
  });

  return product;
}
