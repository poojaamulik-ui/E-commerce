import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";
import { FALLBACK_CATEGORIES, FALLBACK_PRODUCTS } from "@/lib/constants/fallbackData";

export interface GetProductsParams {
  categorySlug?: string;
  search?: string;
  sort?: "newest" | "price_asc" | "price_desc" | "name_asc";
  minPricePaise?: number;
  maxPricePaise?: number;
  inStockOnly?: boolean;
  page?: number;
  limit?: number;
  includeUnpublished?: boolean;
}

export async function getProducts(params: GetProductsParams = {}) {
  const {
    categorySlug,
    search,
    sort = "newest",
    minPricePaise,
    maxPricePaise,
    inStockOnly,
    page = 1,
    limit = 12,
    includeUnpublished = false,
  } = params;

  const where: Prisma.ProductWhereInput = {
    isArchived: false,
    ...(!includeUnpublished && { isPublished: true }),
  };

  if (categorySlug) {
    where.categories = {
      some: {
        category: {
          slug: categorySlug,
        },
      },
    };
  }

  if (search && search.trim().length > 0) {
    const q = search.trim();
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { sku: { contains: q, mode: "insensitive" } },
    ];
  }

  if (minPricePaise !== undefined || maxPricePaise !== undefined) {
    where.basePrice = {
      ...(minPricePaise !== undefined && { gte: minPricePaise }),
      ...(maxPricePaise !== undefined && { lte: maxPricePaise }),
    };
  }

  if (inStockOnly) {
    where.stockQuantity = { gt: 0 };
  }

  const orderBy: Prisma.ProductOrderByWithRelationInput = (() => {
    switch (sort) {
      case "price_asc":
        return { basePrice: "asc" };
      case "price_desc":
        return { basePrice: "desc" };
      case "name_asc":
        return { name: "asc" };
      case "newest":
      default:
        return { createdAt: "desc" };
    }
  })();

  const skip = (page - 1) * limit;

  if (process.env.DATABASE_URL || process.env.DATABASE_PRIVATE_URL) {
    try {
      const [products, totalCount] = await Promise.all([
        prisma.product.findMany({
          where,
          orderBy,
          skip,
          take: limit,
          include: {
            images: {
              orderBy: { displayOrder: "asc" },
            },
            categories: {
              include: {
                category: true,
              },
            },
            variants: true,
          },
        }),
        prisma.product.count({ where }),
      ]);

      if (totalCount > 0) {
        return {
          products,
          totalCount,
          totalPages: Math.ceil(totalCount / limit),
          currentPage: page,
        };
      }
    } catch {
      // Fall through to fallback catalog
    }
  }

  // Fallback catalog filtering
  let filtered = [...FALLBACK_PRODUCTS];
  if (categorySlug) {
    filtered = filtered.filter((p) => p.categorySlug === categorySlug);
  }
  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q)
    );
  }
  if (minPricePaise !== undefined) {
    filtered = filtered.filter((p) => (p.salePrice || p.basePrice) >= minPricePaise);
  }
  if (maxPricePaise !== undefined) {
    filtered = filtered.filter((p) => (p.salePrice || p.basePrice) <= maxPricePaise);
  }
  if (inStockOnly) {
    filtered = filtered.filter((p) => p.stockQuantity > 0);
  }

  const totalFallback = filtered.length;
  const paginated = filtered.slice(skip, skip + limit);

  return {
    products: paginated as unknown as any[],
    totalCount: totalFallback,
    totalPages: Math.ceil(totalFallback / limit) || 1,
    currentPage: page,
  };
}

export async function getProductBySlug(slug: string) {
  if (process.env.DATABASE_URL || process.env.DATABASE_PRIVATE_URL) {
    try {
      const product = await prisma.product.findUnique({
        where: { slug },
        include: {
          images: {
            orderBy: { displayOrder: "asc" },
          },
          categories: {
            include: {
              category: true,
            },
          },
          variants: true,
        },
      });
      if (product) return product;
    } catch {
      // Fall through to fallback
    }
  }
  const fallback = FALLBACK_PRODUCTS.find((p) => p.slug === slug);
  return (fallback as unknown as any) || null;
}

export async function getProductById(id: string) {
  if (process.env.DATABASE_URL || process.env.DATABASE_PRIVATE_URL) {
    try {
      const product = await prisma.product.findUnique({
        where: { id },
        include: {
          images: {
            orderBy: { displayOrder: "asc" },
          },
          categories: {
            include: {
              category: true,
            },
          },
          variants: true,
        },
      });
      if (product) return product;
    } catch {
      // Fall through to fallback
    }
  }
  const fallback = FALLBACK_PRODUCTS.find((p) => p.id === id);
  return (fallback as unknown as any) || null;
}

export async function getCategories() {
  if (process.env.DATABASE_URL || process.env.DATABASE_PRIVATE_URL) {
    try {
      const categories = await prisma.category.findMany({
        where: { isActive: true },
        orderBy: { displayOrder: "asc" },
        include: {
          _count: {
            select: {
              products: {
                where: {
                  product: {
                    isPublished: true,
                    isArchived: false,
                  },
                },
              },
            },
          },
        },
      });
      if (categories.length > 0) return categories;
    } catch {
      // Fall through to fallback
    }
  }
  return FALLBACK_CATEGORIES as unknown as any[];
}

export async function getCategoryBySlug(slug: string) {
  if (process.env.DATABASE_URL || process.env.DATABASE_PRIVATE_URL) {
    try {
      const category = await prisma.category.findUnique({
        where: { slug },
      });
      if (category) return category;
    } catch {
      // Fall through to fallback
    }
  }
  const fallback = FALLBACK_CATEGORIES.find((c) => c.slug === slug);
  return (fallback as unknown as any) || null;
}
