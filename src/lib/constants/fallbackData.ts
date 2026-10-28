export interface FallbackCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  displayOrder: number;
  isActive: boolean;
  _count: {
    products: number;
  };
}

export interface FallbackProduct {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  shortDescription: string;
  basePrice: number;
  salePrice: number | null;
  stockQuantity: number;
  lowStockThreshold: number;
  isPublished: boolean;
  categorySlug: string;
  specifications: Record<string, string>;
  images: Array<{
    id: string;
    url: string;
    altText?: string;
    displayOrder: number;
    isPrimary: boolean;
  }>;
  categories: Array<{
    category: {
      id: string;
      name: string;
      slug: string;
    };
  }>;
  variants: Array<{
    id: string;
    name: string;
    sku: string;
    price: number | null;
    salePrice: number | null;
    stockQuantity: number;
    attributes: Record<string, string>;
  }>;
}

export const FALLBACK_CATEGORIES: FallbackCategory[] = [
  {
    id: "cat_1",
    name: "Home & Living",
    slug: "home-living",
    description: "Refine your space with everyday essentials, rugs, throws, and living accents.",
    imageUrl: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=800&auto=format&fit=crop",
    displayOrder: 1,
    isActive: true,
    _count: { products: 4 },
  },
  {
    id: "cat_2",
    name: "Kitchen & Dining",
    slug: "kitchen-dining",
    description: "Artisan ceramics, tableware, runners, and thoughtful dining essentials.",
    imageUrl: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=800&auto=format&fit=crop",
    displayOrder: 2,
    isActive: true,
    _count: { products: 2 },
  },
  {
    id: "cat_3",
    name: "Decor & Accents",
    slug: "decor-accents",
    description: "Handcrafted table lamps, ceramic vases, candle holders, and organic accents.",
    imageUrl: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=800&auto=format&fit=crop",
    displayOrder: 3,
    isActive: true,
    _count: { products: 3 },
  },
  {
    id: "cat_4",
    name: "Bedding & Linen",
    slug: "bedding-linen",
    description: "Pure cotton throws, waffle blankets, cushions, and organic bed covers.",
    imageUrl: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=800&auto=format&fit=crop",
    displayOrder: 4,
    isActive: true,
    _count: { products: 1 },
  },
  {
    id: "cat_5",
    name: "Storage & Organization",
    slug: "storage-organization",
    description: "Natural wicker baskets, wooden desktop organizers, and minimal trays.",
    imageUrl: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=800&auto=format&fit=crop",
    displayOrder: 5,
    isActive: true,
    _count: { products: 1 },
  },
  {
    id: "cat_6",
    name: "Gifts",
    slug: "gifts",
    description: "Curated housewarming bundles, artisanal ceramics, and thoughtful gift sets.",
    imageUrl: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop",
    displayOrder: 6,
    isActive: true,
    _count: { products: 1 },
  },
];

export const FALLBACK_PRODUCTS: FallbackProduct[] = [
  {
    id: "prod_1",
    name: "Wooden Table Lamp (Warm White)",
    slug: "wooden-table-lamp",
    sku: "NES-LMP-001",
    description: "Solid natural beechwood tripod table lamp with a hand-tailored linen drum shade. Features gentle warm 2700K ambient illumination and a braided vintage fabric cord.",
    shortDescription: "Minimalist wooden tripod lamp with natural linen shade.",
    basePrice: 249900,
    salePrice: 199900,
    stockQuantity: 40,
    lowStockThreshold: 10,
    isPublished: true,
    categorySlug: "decor-accents",
    specifications: {
      Material: "Solid Beechwood & Linen Shade",
      Dimensions: "Height: 45 cm, Shade Diameter: 25 cm",
      LightSource: "E27 Warm LED Bulb included",
      Warranty: "1 Year Manufacturer Warranty",
    },
    images: [
      { id: "img_1_1", url: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=800&auto=format&fit=crop", displayOrder: 1, isPrimary: true },
      { id: "img_1_2", url: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=800&auto=format&fit=crop", displayOrder: 2, isPrimary: false },
      { id: "img_1_3", url: "https://images.unsplash.com/photo-1540932239986-30128078f3c5?q=80&w=800&auto=format&fit=crop", displayOrder: 3, isPrimary: false },
    ],
    categories: [{ category: { id: "cat_3", name: "Decor & Accents", slug: "decor-accents" } }],
    variants: [
      { id: "var_1_1", name: "Beige Shade", sku: "NES-LMP-001-BGE", price: 249900, salePrice: 199900, stockQuantity: 20, attributes: { Shade: "Beige" } },
      { id: "var_1_2", name: "Off-White Shade", sku: "NES-LMP-001-WHT", price: 249900, salePrice: 199900, stockQuantity: 12, attributes: { Shade: "Off-White" } },
      { id: "var_1_3", name: "Green Shade", sku: "NES-LMP-001-GRN", price: 249900, salePrice: 199900, stockQuantity: 8, attributes: { Shade: "Green" } },
    ],
  },
  {
    id: "prod_2",
    name: "Handcrafted Ceramic Mug Set (2 Pcs)",
    slug: "handcrafted-ceramic-mug-set",
    sku: "NES-MUG-002",
    description: "Wheel-thrown artisanal stoneware coffee mugs with hand-painted organic geometric motifs and comfortable wide-grip loop handles. Microwave and dishwasher safe.",
    shortDescription: "Pair of wheel-thrown ceramic mugs with natural reactive glaze.",
    basePrice: 89900,
    salePrice: 69900,
    stockQuantity: 65,
    lowStockThreshold: 15,
    isPublished: true,
    categorySlug: "kitchen-dining",
    specifications: {
      Material: "High-fire Ceramic Stoneware",
      Capacity: "320 ml each",
      Care: "Microwave & Dishwasher Safe",
      Set: "Includes 2 handcrafted mugs",
    },
    images: [
      { id: "img_2_1", url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop", displayOrder: 1, isPrimary: true },
    ],
    categories: [{ category: { id: "cat_2", name: "Kitchen & Dining", slug: "kitchen-dining" } }],
    variants: [],
  },
  {
    id: "prod_3",
    name: "Cotton Woven Throw (120 x 180 cm)",
    slug: "cotton-woven-throw",
    sku: "NES-THR-003",
    description: "100% organic combed cotton waffle throw with gentle fringe edge. Delivers cozy breathable warmth for armchairs, living sofas, and bedding.",
    shortDescription: "Ultra-soft textured organic cotton throw blanket.",
    basePrice: 159900,
    salePrice: 129900,
    stockQuantity: 35,
    lowStockThreshold: 8,
    isPublished: true,
    categorySlug: "bedding-linen",
    specifications: {
      Fabric: "100% Pre-washed Organic Cotton",
      Dimensions: "120 cm x 180 cm",
      Care: "Machine wash cold on gentle cycle",
      Weight: "850 grams",
    },
    images: [
      { id: "img_3_1", url: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=800&auto=format&fit=crop", displayOrder: 1, isPrimary: true },
    ],
    categories: [{ category: { id: "cat_4", name: "Bedding & Linen", slug: "bedding-linen" } }],
    variants: [],
  },
  {
    id: "prod_4",
    name: "Indoor Areca Palm with Pot",
    slug: "indoor-areca-palm-with-pot",
    sku: "NES-PLT-004",
    description: "Lush tropical air-purifying Areca Palm, potted in nutrient-rich organic soil blend inside a handcrafted matte stoneware planter with drainage saucer.",
    shortDescription: "Air-purifying live indoor palm in minimalist ceramic pot.",
    basePrice: 109900,
    salePrice: 89900,
    stockQuantity: 28,
    lowStockThreshold: 6,
    isPublished: true,
    categorySlug: "home-living",
    specifications: {
      PlantType: "Live Areca Palm (Dypsis lutescens)",
      Height: "40 - 50 cm with pot",
      PotMaterial: "Matte Ceramic Planter with Base Saucer",
      LightRequirement: "Bright indirect sunlight",
    },
    images: [
      { id: "img_4_1", url: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?q=80&w=800&auto=format&fit=crop", displayOrder: 1, isPrimary: true },
    ],
    categories: [{ category: { id: "cat_1", name: "Home & Living", slug: "home-living" } }],
    variants: [],
  },
  {
    id: "prod_5",
    name: "Leaf Print Cushion Cover (16 x 16 in)",
    slug: "leaf-print-cushion-cover",
    sku: "NES-CSH-005",
    description: "Heavyweight slub cotton-linen cushion cover adorned with botanical sage and forest green leaf prints. Features an invisible bottom brass zipper.",
    shortDescription: "Botanical leaf print textured cotton-linen cushion cover.",
    basePrice: 59900,
    salePrice: 49900,
    stockQuantity: 70,
    lowStockThreshold: 20,
    isPublished: true,
    categorySlug: "home-living",
    specifications: {
      Fabric: "70% Cotton, 30% Natural Linen",
      Dimensions: "40 cm x 40 cm (16 x 16 inches)",
      Closure: "Concealed YKK zipper",
      Care: "Cold machine wash with like colors",
    },
    images: [
      { id: "img_5_1", url: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=800&auto=format&fit=crop", displayOrder: 1, isPrimary: true },
    ],
    categories: [{ category: { id: "cat_1", name: "Home & Living", slug: "home-living" } }],
    variants: [],
  },
  {
    id: "prod_6",
    name: "Woven Table Runner (180 x 33 cm)",
    slug: "woven-table-runner",
    sku: "NES-RUN-006",
    description: "Hand-braided natural jute and unbleached cotton dining table runner with fringed ends. Adds an organic Scandinavian touch to dining tables and consoles.",
    shortDescription: "Hand-braided jute and cotton runner for dining tables.",
    basePrice: 99900,
    salePrice: 79900,
    stockQuantity: 45,
    lowStockThreshold: 12,
    isPublished: true,
    categorySlug: "kitchen-dining",
    specifications: {
      Material: "60% Golden Jute, 40% Raw Cotton",
      Dimensions: "180 cm x 33 cm",
      Care: "Spot clean with damp cloth",
    },
    images: [
      { id: "img_6_1", url: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?q=80&w=800&auto=format&fit=crop", displayOrder: 1, isPrimary: true },
    ],
    categories: [{ category: { id: "cat_2", name: "Kitchen & Dining", slug: "kitchen-dining" } }],
    variants: [],
  },
  {
    id: "prod_7",
    name: "Ceramic Vase (Medium)",
    slug: "ceramic-vase-medium",
    sku: "NES-VAS-007",
    description: "Minimalist fluted ceramic bud vase with matte cream stoneware finish. Perfectly proportioned for dried pampas grass, eucalyptus, or fresh garden stems.",
    shortDescription: "Fluted matte ceramic vase with modern architectural silhouette.",
    basePrice: 139900,
    salePrice: 109900,
    stockQuantity: 30,
    lowStockThreshold: 8,
    isPublished: true,
    categorySlug: "decor-accents",
    specifications: {
      Material: "Matte Glazed Stoneware",
      Height: "22 cm, Neck Diameter: 7 cm",
      Watertight: "100% Watertight for fresh blooms",
    },
    images: [
      { id: "img_7_1", url: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?q=80&w=800&auto=format&fit=crop", displayOrder: 1, isPrimary: true },
    ],
    categories: [{ category: { id: "cat_3", name: "Decor & Accents", slug: "decor-accents" } }],
    variants: [],
  },
  {
    id: "prod_8",
    name: "Rattan Table Lamp",
    slug: "rattan-table-lamp",
    sku: "NES-RAT-008",
    description: "Artisan handwoven natural wicker and rattan dome bedside lamp casting soothing intricate shadows. Features a warm dimmable inline toggle switch.",
    shortDescription: "Handwoven natural rattan dome lamp for ambient warmth.",
    basePrice: 219900,
    salePrice: 179900,
    stockQuantity: 24,
    lowStockThreshold: 6,
    isPublished: true,
    categorySlug: "decor-accents",
    specifications: {
      Material: "Natural Indonesian Rattan & Iron Frame",
      Dimensions: "Diameter: 28 cm, Height: 34 cm",
      BulbType: "E27 Warm Filament LED Bulb included",
    },
    images: [
      { id: "img_8_1", url: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=800&auto=format&fit=crop", displayOrder: 1, isPrimary: true },
    ],
    categories: [{ category: { id: "cat_3", name: "Decor & Accents", slug: "decor-accents" } }],
    variants: [],
  },
  {
    id: "prod_9",
    name: "Jute Area Rug (3 x 5 ft)",
    slug: "jute-area-rug",
    sku: "NES-RUG-009",
    description: "Hand-braided 100% natural golden jute floor rug with organic circular concentric weave. Durable, eco-friendly, and perfect for entryways and coffee nooks.",
    shortDescription: "Natural hand-braided circular jute floor accent rug.",
    basePrice: 349900,
    salePrice: 299900,
    stockQuantity: 18,
    lowStockThreshold: 5,
    isPublished: true,
    categorySlug: "home-living",
    specifications: {
      Material: "100% Natural Golden Jute",
      Size: "90 cm x 150 cm (3 ft x 5 ft)",
      Thickness: "10 mm hand-braided profile",
      Reversible: "Fully reversible dual-sided weave",
    },
    images: [
      { id: "img_9_1", url: "https://images.unsplash.com/photo-1600121848594-d8644e57abab?q=80&w=800&auto=format&fit=crop", displayOrder: 1, isPrimary: true },
    ],
    categories: [{ category: { id: "cat_1", name: "Home & Living", slug: "home-living" } }],
    variants: [],
  },
  {
    id: "prod_10",
    name: "Indoor Money Plant with Pot",
    slug: "indoor-money-plant-with-pot",
    sku: "NES-MON-010",
    description: "Healthy trailing Golden Pothos indoor vine in a contemporary ivory ceramic pot with wooden drainage tripod stand. Renowned for thriving in indirect home light.",
    shortDescription: "Trailing indoor Golden Pothos with ceramic pot & wooden stand.",
    basePrice: 69900,
    salePrice: 59900,
    stockQuantity: 50,
    lowStockThreshold: 12,
    isPublished: true,
    categorySlug: "home-living",
    specifications: {
      PlantType: "Golden Pothos (Epipremnum aureum)",
      Height: "30 - 40 cm with pot",
      PotMaterial: "Ivory Ceramic Pot with Wooden Tripod Stand",
      Care: "Low maintenance, water once weekly",
    },
    images: [
      { id: "img_10_1", url: "https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=800&auto=format&fit=crop", displayOrder: 1, isPrimary: true },
    ],
    categories: [{ category: { id: "cat_1", name: "Home & Living", slug: "home-living" } }],
    variants: [],
  },
];
