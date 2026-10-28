import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";

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

  if (!process.env.DATABASE_URL && !process.env.DATABASE_PRIVATE_URL) {
    return { products: [], totalCount: 0, totalPages: 0, currentPage: page };
  }

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

    return {
      products,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    };
  } catch (err) {
    return {
      products: [],
      totalCount: 0,
      totalPages: 0,
      currentPage: page,
    };
  }
}

export async function getProductBySlug(slug: string) {
  if (!process.env.DATABASE_URL && !process.env.DATABASE_PRIVATE_URL) return null;
  try {
    return await prisma.product.findUnique({
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
  } catch {
    return null;
  }
}

export async function getProductById(id: string) {
  return prisma.product.findUnique({
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
}

export async function getCategories() {
  if (!process.env.DATABASE_URL && !process.env.DATABASE_PRIVATE_URL) return [];
  try {
    return await prisma.category.findMany({
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
  } catch {
    return [];
  }
}

export async function getCategoryBySlug(slug: string) {
  if (!process.env.DATABASE_URL && !process.env.DATABASE_PRIVATE_URL) return null;
  try {
    return await prisma.category.findUnique({
      where: { slug },
    });
  } catch {
    return null;
  }
}
