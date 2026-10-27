import { PrismaClient, DiscountType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Nestora Home & Living Database...");

  // 1. Seed Roles & Users
  const passwordHash = await bcrypt.hash("NestoraAdmin@2026", 10);
  const customerPasswordHash = await bcrypt.hash("Customer@2026", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@nestora.com" },
    update: { name: "Nestora Admin", passwordHash, role: "ADMIN" },
    create: {
      email: "admin@nestora.com",
      passwordHash,
      name: "Nestora Admin",
      role: "ADMIN",
      phone: "+91 98765 43210",
      emailVerified: new Date(),
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: "aarav.sharma@mail.com" },
    update: { name: "Aarav Sharma", passwordHash: customerPasswordHash },
    create: {
      email: "aarav.sharma@mail.com",
      passwordHash: customerPasswordHash,
      name: "Aarav Sharma",
      role: "CUSTOMER",
      phone: "+91 98765 43210",
      emailVerified: new Date(),
    },
  });

  console.log(`Users seeded: Admin (${admin.email}), Customer (${customer.email})`);

  // 2. Seed Default Customer Address
  const existingAddress = await prisma.address.findFirst({
    where: { userId: customer.id },
  });
  if (!existingAddress) {
    await prisma.address.create({
      data: {
        userId: customer.id,
        name: "Aarav Sharma",
        phone: "+91 98765 43210",
        street: "B-084, Green Valley Apartments, Sector 62",
        landmark: "Near City Center",
        city: "Noida",
        state: "Uttar Pradesh",
        pincode: "201301",
        isDefault: true,
      },
    });
  }

  // 3. Seed Nestora Categories
  const categoriesData = [
    {
      name: "Home & Living",
      slug: "home-living",
      description: "Refine your space with everyday essentials, rugs, throws, and living accents.",
      imageUrl: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=800&auto=format&fit=crop",
      displayOrder: 1,
    },
    {
      name: "Kitchen & Dining",
      slug: "kitchen-dining",
      description: "Artisan ceramics, tableware, runners, and thoughtful dining essentials.",
      imageUrl: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=800&auto=format&fit=crop",
      displayOrder: 2,
    },
    {
      name: "Decor & Accents",
      slug: "decor-accents",
      description: "Handcrafted table lamps, ceramic vases, candle holders, and organic accents.",
      imageUrl: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=800&auto=format&fit=crop",
      displayOrder: 3,
    },
    {
      name: "Bedding & Linen",
      slug: "bedding-linen",
      description: "Pure cotton throws, waffle blankets, cushions, and organic bed covers.",
      imageUrl: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=800&auto=format&fit=crop",
      displayOrder: 4,
    },
    {
      name: "Storage & Organization",
      slug: "storage-organization",
      description: "Natural wicker baskets, wooden desktop organizers, and minimal trays.",
      imageUrl: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=800&auto=format&fit=crop",
      displayOrder: 5,
    },
    {
      name: "Gifts",
      slug: "gifts",
      description: "Curated housewarming bundles, artisanal ceramics, and thoughtful gift sets.",
      imageUrl: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop",
      displayOrder: 6,
    },
  ];

  const categoryMap = new Map<string, string>();
  for (const cat of categoriesData) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    categoryMap.set(cat.slug, created.id);
  }
  console.log(`Seeded ${categoriesData.length} Nestora categories.`);

  // 4. Seed Nestora Products
  const productsData = [
    {
      name: "Wooden Table Lamp (Warm White)",
      slug: "wooden-table-lamp",
      sku: "NES-LMP-001",
      description: "Solid natural beechwood tripod table lamp with a hand-tailored linen drum shade. Features gentle warm 2700K ambient illumination and a braided vintage fabric cord.",
      shortDescription: "Minimalist wooden tripod lamp with natural linen shade.",
      basePrice: 249900, // ₹2,499.00
      salePrice: 199900, // ₹1,999.00 (20% off)
      stockQuantity: 40,
      lowStockThreshold: 10,
      isPublished: true,
      categorySlug: "decor-accents",
      imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=800&auto=format&fit=crop",
      secondaryImages: [
        "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1540932239986-30128078f3c5?q=80&w=800&auto=format&fit=crop"
      ],
      specifications: {
        Material: "Solid Beechwood & Linen Shade",
        Dimensions: "Height: 45 cm, Shade Diameter: 25 cm",
        LightSource: "E27 Warm LED Bulb included",
        Warranty: "1 Year Manufacturer Warranty",
      },
      variants: [
        { name: "Beige Shade", sku: "NES-LMP-001-BGE", price: 249900, salePrice: 199900, stock: 20 },
        { name: "Off-White Shade", sku: "NES-LMP-001-WHT", price: 249900, salePrice: 199900, stock: 12 },
        { name: "Green Shade", sku: "NES-LMP-001-GRN", price: 249900, salePrice: 199900, stock: 8 },
      ],
    },
    {
      name: "Handcrafted Ceramic Mug Set (2 Pcs)",
      slug: "handcrafted-ceramic-mug-set",
      sku: "NES-MUG-002",
      description: "Wheel-thrown artisanal stoneware coffee mugs with hand-painted organic geometric motifs and comfortable wide-grip loop handles. Microwave and dishwasher safe.",
      shortDescription: "Pair of wheel-thrown ceramic mugs with natural reactive glaze.",
      basePrice: 89900, // ₹899.00
      salePrice: 69900, // ₹699.00 (22% off)
      stockQuantity: 65,
      lowStockThreshold: 15,
      isPublished: true,
      categorySlug: "kitchen-dining",
      imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop",
      specifications: {
        Material: "High-fire Ceramic Stoneware",
        Capacity: "320 ml each",
        Care: "Microwave & Dishwasher Safe",
        Set: "Includes 2 handcrafted mugs",
      },
    },
    {
      name: "Cotton Woven Throw (120 x 180 cm)",
      slug: "cotton-woven-throw",
      sku: "NES-THR-003",
      description: "100% organic combed cotton waffle throw with gentle fringe edge. Delivers cozy breathable warmth for armchairs, living sofas, and bedding.",
      shortDescription: "Ultra-soft textured organic cotton throw blanket.",
      basePrice: 159900, // ₹1,599.00
      salePrice: 129900, // ₹1,299.00 (19% off)
      stockQuantity: 35,
      lowStockThreshold: 8,
      isPublished: true,
      categorySlug: "bedding-linen",
      imageUrl: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=800&auto=format&fit=crop",
      specifications: {
        Fabric: "100% Pre-washed Organic Cotton",
        Dimensions: "120 cm x 180 cm",
        Care: "Machine wash cold on gentle cycle",
        Weight: "850 grams",
      },
    },
    {
      name: "Indoor Areca Palm with Pot",
      slug: "indoor-areca-palm-with-pot",
      sku: "NES-PLT-004",
      description: "Lush tropical air-purifying Areca Palm, potted in nutrient-rich organic soil blend inside a handcrafted matte stoneware planter with drainage saucer.",
      shortDescription: "Air-purifying live indoor palm in minimalist ceramic pot.",
      basePrice: 109900, // ₹1,099.00
      salePrice: 89900, // ₹899.00 (18% off)
      stockQuantity: 28,
      lowStockThreshold: 6,
      isPublished: true,
      categorySlug: "home-living",
      imageUrl: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?q=80&w=800&auto=format&fit=crop",
      specifications: {
        PlantType: "Live Areca Palm (Dypsis lutescens)",
        Height: "40 - 50 cm with pot",
        PotMaterial: "Matte Ceramic Planter with Base Saucer",
        LightRequirement: "Bright indirect sunlight",
      },
    },
    {
      name: "Leaf Print Cushion Cover (16 x 16 in)",
      slug: "leaf-print-cushion-cover",
      sku: "NES-CSH-005",
      description: "Heavyweight slub cotton-linen cushion cover adorned with botanical sage and forest green leaf prints. Features an invisible bottom brass zipper.",
      shortDescription: "Botanical leaf print textured cotton-linen cushion cover.",
      basePrice: 59900, // ₹599.00
      salePrice: 49900, // ₹499.00 (17% off)
      stockQuantity: 70,
      lowStockThreshold: 20,
      isPublished: true,
      categorySlug: "home-living",
      imageUrl: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=800&auto=format&fit=crop",
      specifications: {
        Fabric: "70% Cotton, 30% Natural Linen",
        Dimensions: "40 cm x 40 cm (16 x 16 inches)",
        Closure: "Concealed YKK zipper",
        Care: "Cold machine wash with like colors",
      },
    },
    {
      name: "Woven Table Runner (180 x 33 cm)",
      slug: "woven-table-runner",
      sku: "NES-RUN-006",
      description: "Hand-braided natural jute and unbleached cotton dining table runner with fringed ends. Adds an organic Scandinavian touch to dining tables and consoles.",
      shortDescription: "Hand-braided jute and cotton runner for dining tables.",
      basePrice: 99900, // ₹999.00
      salePrice: 79900, // ₹799.00 (20% off)
      stockQuantity: 45,
      lowStockThreshold: 12,
      isPublished: true,
      categorySlug: "kitchen-dining",
      imageUrl: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?q=80&w=800&auto=format&fit=crop",
      specifications: {
        Material: "60% Golden Jute, 40% Raw Cotton",
        Dimensions: "180 cm x 33 cm",
        Care: "Spot clean with damp cloth",
      },
    },
    {
      name: "Ceramic Vase (Medium)",
      slug: "ceramic-vase-medium",
      sku: "NES-VAS-007",
      description: "Minimalist fluted ceramic bud vase with matte cream stoneware finish. Perfectly proportioned for dried pampas grass, eucalyptus, or fresh garden stems.",
      shortDescription: "Fluted matte ceramic vase with modern architectural silhouette.",
      basePrice: 139900, // ₹1,399.00
      salePrice: 109900, // ₹1,099.00 (21% off)
      stockQuantity: 30,
      lowStockThreshold: 8,
      isPublished: true,
      categorySlug: "decor-accents",
      imageUrl: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?q=80&w=800&auto=format&fit=crop",
      specifications: {
        Material: "Matte Glazed Stoneware",
        Height: "22 cm, Neck Diameter: 7 cm",
        Watertight: "100% Watertight for fresh blooms",
      },
    },
    {
      name: "Rattan Table Lamp",
      slug: "rattan-table-lamp",
      sku: "NES-RAT-008",
      description: "Artisan handwoven natural wicker and rattan dome bedside lamp casting soothing intricate shadows. Features a warm dimmable inline toggle switch.",
      shortDescription: "Handwoven natural rattan dome lamp for ambient warmth.",
      basePrice: 219900, // ₹2,199.00
      salePrice: 179900, // ₹1,799.00 (18% off)
      stockQuantity: 24,
      lowStockThreshold: 6,
      isPublished: true,
      categorySlug: "decor-accents",
      imageUrl: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=800&auto=format&fit=crop",
      specifications: {
        Material: "Natural Indonesian Rattan & Iron Frame",
        Dimensions: "Diameter: 28 cm, Height: 34 cm",
        BulbType: "E27 Warm Filament LED Bulb included",
      },
    },
    {
      name: "Jute Area Rug (3 x 5 ft)",
      slug: "jute-area-rug",
      sku: "NES-RUG-009",
      description: "Hand-braided 100% natural golden jute floor rug with organic circular concentric weave. Durable, eco-friendly, and perfect for entryways and coffee nooks.",
      shortDescription: "Natural hand-braided circular jute floor accent rug.",
      basePrice: 349900, // ₹3,499.00
      salePrice: 299900, // ₹2,999.00 (14% off)
      stockQuantity: 18,
      lowStockThreshold: 5,
      isPublished: true,
      categorySlug: "home-living",
      imageUrl: "https://images.unsplash.com/photo-1600121848594-d8644e57abab?q=80&w=800&auto=format&fit=crop",
      specifications: {
        Material: "100% Natural Golden Jute",
        Size: "90 cm x 150 cm (3 ft x 5 ft)",
        Thickness: "10 mm hand-braided profile",
        Reversible: "Fully reversible dual-sided weave",
      },
    },
    {
      name: "Indoor Money Plant with Pot",
      slug: "indoor-money-plant-with-pot",
      sku: "NES-MON-010",
      description: "Healthy trailing Golden Pothos indoor vine in a contemporary ivory ceramic pot with wooden drainage tripod stand. Renowned for thriving in indirect home light.",
      shortDescription: "Trailing indoor Golden Pothos with ceramic pot & wooden stand.",
      basePrice: 69900, // ₹699.00
      salePrice: 59900, // ₹599.00 (14% off)
      stockQuantity: 50,
      lowStockThreshold: 12,
      isPublished: true,
      categorySlug: "home-living",
      imageUrl: "https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=800&auto=format&fit=crop",
      specifications: {
        PlantType: "Golden Pothos (Epipremnum aureum)",
        PotDimensions: "12 cm diameter ceramic planter",
        Stand: "Natural solid pine wood stand included",
      },
    },
  ];

  for (const p of productsData) {
    const categoryId = categoryMap.get(p.categorySlug);

    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        sku: p.sku,
        description: p.description,
        shortDescription: p.shortDescription,
        basePrice: p.basePrice,
        salePrice: p.salePrice,
        stockQuantity: p.stockQuantity,
        lowStockThreshold: p.lowStockThreshold,
        isPublished: p.isPublished,
        specifications: p.specifications,
      },
      create: {
        name: p.name,
        slug: p.slug,
        sku: p.sku,
        description: p.description,
        shortDescription: p.shortDescription,
        basePrice: p.basePrice,
        salePrice: p.salePrice,
        stockQuantity: p.stockQuantity,
        lowStockThreshold: p.lowStockThreshold,
        isPublished: p.isPublished,
        specifications: p.specifications,
      },
    });

    // Link category
    if (categoryId) {
      await prisma.productCategory.upsert({
        where: {
          productId_categoryId: {
            productId: product.id,
            categoryId,
          },
        },
        update: {},
        create: {
          productId: product.id,
          categoryId,
        },
      });
    }

    // Seed primary image
    const existingImg = await prisma.productImage.findFirst({
      where: { productId: product.id, isPrimary: true },
    });
    if (!existingImg) {
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: p.imageUrl,
          altText: p.name,
          displayOrder: 1,
          isPrimary: true,
        },
      });
    } else {
      await prisma.productImage.update({
        where: { id: existingImg.id },
        data: { url: p.imageUrl, altText: p.name },
      });
    }

    // Secondary images
    if (p.secondaryImages) {
      let order = 2;
      for (const imgUrl of p.secondaryImages) {
        const found = await prisma.productImage.findFirst({
          where: { productId: product.id, url: imgUrl },
        });
        if (!found) {
          await prisma.productImage.create({
            data: {
              productId: product.id,
              url: imgUrl,
              altText: `${p.name} detail view`,
              displayOrder: order++,
              isPrimary: false,
            },
          });
        }
      }
    }

    // Seed variants if present
    if (p.variants) {
      for (const v of p.variants) {
        await prisma.productVariant.upsert({
          where: { sku: v.sku },
          update: {
            name: v.name,
            price: v.price,
            salePrice: v.salePrice,
            stockQuantity: v.stock,
          },
          create: {
            productId: product.id,
            name: v.name,
            sku: v.sku,
            price: v.price,
            salePrice: v.salePrice,
            stockQuantity: v.stock,
            attributes: { shadeColor: v.name.split(" ")[0] },
          },
        });
      }
    }
  }
  console.log(`Seeded ${productsData.length} Nestora products.`);

  // 5. Seed Coupons
  const couponsData = [
    {
      code: "WELCOME10",
      description: "10% off on your first home order",
      discountType: DiscountType.PERCENTAGE,
      discountValue: 10,
      minOrderAmount: 99900,
      maxDiscountAmount: 50000,
      usageLimit: 5000,
      isActive: true,
    },
    {
      code: "NESTORA200",
      description: "Flat ₹200 off on orders above ₹1,999",
      discountType: DiscountType.FIXED_AMOUNT,
      discountValue: 20000,
      minOrderAmount: 199900,
      usageLimit: 3000,
      isActive: true,
    },
    {
      code: "FREESHIP",
      description: "Free delivery on all home decor items",
      discountType: DiscountType.FIXED_AMOUNT,
      discountValue: 7900,
      minOrderAmount: 0,
      usageLimit: 2000,
      isActive: true,
    },
  ];

  for (const c of couponsData) {
    await prisma.coupon.upsert({
      where: { code: c.code },
      update: c,
      create: c,
    });
  }
  console.log(`Seeded ${couponsData.length} coupons.`);

  // 6. Seed Nestora Store Settings
  const defaultSettings = [
    { key: "store_name", value: "Nestora", isPublic: true },
    { key: "store_tagline", value: "Thoughtful essentials for a cozier, happier home.", isPublic: true },
    { key: "support_email", value: "care@nestora.com", isPublic: true },
    { key: "support_phone", value: "+91 98765 43210", isPublic: true },
    { key: "business_address", value: "B-084, Sector 62, Noida, Uttar Pradesh 201301", isPublic: true },
    { key: "currency_code", value: "INR", isPublic: true },
    { key: "currency_symbol", value: "₹", isPublic: true },
    { key: "announcement_text", value: "Free Shipping on Orders Above ₹999 | Easy Returns | Secure Payments", isPublic: true },
    { key: "maintenance_mode", value: "false", isPublic: true },
    { key: "free_shipping_threshold", value: "99900", isPublic: true }, // ₹999
    { key: "standard_shipping_fee", value: "7900", isPublic: true },
  ];

  for (const s of defaultSettings) {
    await prisma.storeSetting.upsert({
      where: { key: s.key },
      update: { value: s.value, isPublic: s.isPublic },
      create: s,
    });
  }
  console.log(`Seeded Nestora store settings.`);

  // 7. Seed Sample Order NS126548 for Aarav Sharma (as seen on reference board Screen 6)
  const lampProduct = await prisma.product.findUnique({ where: { slug: "wooden-table-lamp" } });
  const cushionProduct = await prisma.product.findUnique({ where: { slug: "leaf-print-cushion-cover" } });

  if (lampProduct && cushionProduct) {
    const existingOrder = await prisma.order.findUnique({
      where: { orderNumber: "NS126548" },
    });

    if (!existingOrder) {
      const order = await prisma.order.create({
        data: {
          orderNumber: "NS126548",
          user: { connect: { id: customer.id } },
          customerName: "Aarav Sharma",
          customerEmail: customer.email,
          customerPhone: customer.phone || "9876543210",
          shippingAddress: {
            name: "Aarav Sharma",
            phone: "+91 98765 43210",
            street: "B-084, Green Valley Apartments, Sector 62",
            city: "Noida",
            state: "Uttar Pradesh",
            pincode: "201301",
          },
          subtotalAmount: 299700, // ₹1,999 + 2 * ₹499 = ₹2,997
          shippingAmount: 0,
          totalAmount: 299700,
          status: "SHIPPED",
          paymentStatus: "PAID",
          customerNotes: "Estimated Delivery: 24 Jan 2025",
          items: {
            create: [
              {
                productId: lampProduct.id,
                productName: "Wooden Table Lamp (Warm White)",
                sku: "NES-LMP-001",
                quantity: 1,
                unitPrice: 199900,
                totalPrice: 199900,
                imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=800&auto=format&fit=crop",
              },
              {
                productId: cushionProduct.id,
                productName: "Leaf Print Cushion Cover",
                sku: "NES-CSH-005",
                quantity: 2,
                unitPrice: 49900,
                totalPrice: 99800,
                imageUrl: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=800&auto=format&fit=crop",
              },
            ],
          },
          shipments: {
            create: [
              {
                trackingNumber: "TRK-NS126548",
                carrier: "BlueDart Express",
                status: "IN_TRANSIT",
                shippedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                deliveredAt: null,
              },
            ],
          },
        },
      });
      console.log(`Seeded reference sample order: ${order.orderNumber}`);
    }
  }

  console.log("Nestora database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
