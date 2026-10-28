import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { getSession } from "@/lib/auth/session";

const CART_COOKIE_NAME = "bb_cart_session";

export async function getOrCreateCartId(): Promise<string> {
  const cookieStore = await cookies();
  let cartSessionId = cookieStore.get(CART_COOKIE_NAME)?.value;

  if (!cartSessionId) {
    cartSessionId = `cart_sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    cookieStore.set(CART_COOKIE_NAME, cartSessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });
  }

  return cartSessionId;
}

export async function getCart() {
  const emptyCart = {
    id: "guest-empty",
    items: [],
    subtotalPaise: 0,
    totalItemCount: 0,
  };

  try {
    const session = await getSession();
    const sessionId = await getOrCreateCartId();

    // Find user cart or session cart
    let cart = await prisma.cart.findFirst({
      where: session?.userId
        ? { OR: [{ userId: session.userId }, { sessionId }] }
        : { sessionId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: {
                  where: { isPrimary: true },
                  take: 1,
                },
              },
            },
            variant: true,
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: session?.userId || null,
          sessionId,
        },
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: {
                    where: { isPrimary: true },
                    take: 1,
                  },
                },
              },
              variant: true,
            },
            orderBy: { createdAt: "asc" },
          },
        },
      });
    } else if (session?.userId && !cart.userId) {
      // Associate guest cart with user upon login
      cart = await prisma.cart.update({
        where: { id: cart.id },
        data: { userId: session.userId },
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: {
                    where: { isPrimary: true },
                    take: 1,
                  },
                },
              },
              variant: true,
            },
            orderBy: { createdAt: "asc" },
          },
        },
      });
    }

    // Calculate live authoritative totals
    let subtotalPaise = 0;
    let totalItemCount = 0;

    const enrichedItems = cart.items.map((item) => {
      const unitPrice =
        item.variant?.salePrice ||
        item.variant?.price ||
        item.product.salePrice ||
        item.product.basePrice;
      const lineTotal = unitPrice * item.quantity;
      const maxAvailable = item.variant
        ? item.variant.stockQuantity
        : item.product.stockQuantity;

      subtotalPaise += lineTotal;
      totalItemCount += item.quantity;

      return {
        ...item,
        effectiveUnitPrice: unitPrice,
        lineTotal,
        isAvailable: maxAvailable >= item.quantity,
        maxAvailable,
      };
    });

    return {
      id: cart.id,
      items: enrichedItems,
      subtotalPaise,
      totalItemCount,
    };
  } catch (err) {
    console.warn("Database cart lookup error:", err instanceof Error ? err.message : err);
    return emptyCart;
  }
}

export async function addToCart(params: {
  productId: string;
  variantId?: string | null;
  quantity?: number;
}) {
  const { productId, variantId, quantity = 1 } = params;
  const cart = await getCart();

  // Validate product existence and stock
  const product = await prisma.product.findUnique({
    where: { id: productId, isPublished: true, isArchived: false },
    include: { variants: true },
  });

  if (!product) {
    throw new Error("Product not found or currently unavailable.");
  }

  let availableStock = product.stockQuantity;
  if (variantId) {
    const variant = product.variants.find((v) => v.id === variantId);
    if (!variant) throw new Error("Selected variant not found.");
    availableStock = variant.stockQuantity;
  }

  const existingItem = cart.items.find(
    (item) => item.productId === productId && item.variantId === (variantId || null)
  );

  const desiredQuantity = (existingItem?.quantity || 0) + quantity;

  if (desiredQuantity > availableStock) {
    throw new Error(`Only ${availableStock} units available in stock.`);
  }

  if (existingItem) {
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: desiredQuantity },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        variantId: variantId || null,
        quantity,
      },
    });
  }

  return getCart();
}

export async function updateCartItemQuantity(itemId: string, quantity: number) {
  if (quantity <= 0) {
    return removeCartItem(itemId);
  }

  const item = await prisma.cartItem.findUnique({
    where: { id: itemId },
    include: { product: true, variant: true },
  });

  if (!item) {
    throw new Error("Item not found in cart.");
  }

  const availableStock = item.variant
    ? item.variant.stockQuantity
    : item.product.stockQuantity;

  if (quantity > availableStock) {
    throw new Error(`Only ${availableStock} units available in stock.`);
  }

  await prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity },
  });

  return getCart();
}

export async function removeCartItem(itemId: string) {
  await prisma.cartItem.deleteMany({
    where: { id: itemId },
  });
  return getCart();
}

export async function clearCart(cartId: string) {
  await prisma.cartItem.deleteMany({
    where: { cartId },
  });
}
