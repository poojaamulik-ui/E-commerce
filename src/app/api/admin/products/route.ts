import { NextResponse } from "next/server";
import { requireStaffOrAdmin } from "@/lib/auth/guard";
import { prisma } from "@/lib/db";
import { productSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const session = await requireStaffOrAdmin();
    const body = await request.json();
    const parsed = productSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const {
      name,
      slug,
      sku,
      description,
      shortDescription,
      basePrice,
      salePrice,
      stockQuantity,
      lowStockThreshold,
      isPublished,
      categoryIds,
      images = [],
      specifications,
    } = parsed.data;

    // Check duplicate slug or SKU
    const existing = await prisma.product.findFirst({
      where: { OR: [{ slug }, { sku }] },
    });

    if (existing) {
      return NextResponse.json(
        { error: "A product with this URL slug or SKU already exists." },
        { status: 409 }
      );
    }

    const createdProduct = await prisma.$transaction(async (tx) => {
      const p = await tx.product.create({
        data: {
          name,
          slug,
          sku,
          description,
          shortDescription: shortDescription || null,
          basePrice,
          salePrice: salePrice || null,
          stockQuantity,
          lowStockThreshold,
          isPublished,
          specifications: specifications ? (specifications as any) : undefined,
          categories: {
            create: categoryIds.map((cId) => ({
              categoryId: cId,
            })),
          },
          images: {
            create: images.map((url, idx) => ({
              url,
              altText: name,
              isPrimary: idx === 0,
              displayOrder: idx,
            })),
          },
        },
        include: {
          categories: {
            include: { category: true },
          },
          images: true,
        },
      });

      await tx.adminActivityLog.create({
        data: {
          actorId: session.userId,
          action: "PRODUCT_CREATE",
          entityType: "Product",
          entityId: p.id,
          details: { name, sku, basePrice, stockQuantity },
        },
      });

      return p;
    });

    return NextResponse.json(
      { success: true, product: createdProduct },
      { status: 201 }
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to create product";
    console.error("Product creation error:", err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
