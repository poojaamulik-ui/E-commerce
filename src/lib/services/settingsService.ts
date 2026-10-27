import { prisma } from "@/lib/db";

export interface PublicStoreSettings {
  storeName: string;
  storeTagline: string;
  supportEmail: string;
  supportPhone: string;
  businessAddress: string;
  announcementText: string;
  maintenanceMode: boolean;
  freeShippingThresholdPaise: number;
}

const DEFAULT_SETTINGS: PublicStoreSettings = {
  storeName: "Nestora",
  storeTagline: "Home • Living • Decor",
  supportEmail: "care@nestora.com",
  supportPhone: "+91 98765 43210",
  businessAddress: "Indiranagar 100ft Road, Bengaluru, Karnataka 560038",
  announcementText: "Free Shipping on Orders Above ₹999 | Easy Returns | Secure Payments",
  maintenanceMode: false,
  freeShippingThresholdPaise: 99900,
};

export async function getPublicStoreSettings(): Promise<PublicStoreSettings> {
  if (!process.env.DATABASE_URL) {
    return DEFAULT_SETTINGS;
  }

  try {
    const settings = await prisma.storeSetting.findMany({
      where: { isPublic: true },
    });

    const map = new Map<string, string>();
    for (const s of settings) {
      map.set(s.key, s.value);
    }

    return {
      storeName: map.get("store_name") || DEFAULT_SETTINGS.storeName,
      storeTagline: map.get("store_tagline") || DEFAULT_SETTINGS.storeTagline,
      supportEmail: map.get("support_email") || DEFAULT_SETTINGS.supportEmail,
      supportPhone: map.get("support_phone") || DEFAULT_SETTINGS.supportPhone,
      businessAddress: map.get("business_address") || DEFAULT_SETTINGS.businessAddress,
      announcementText: map.get("announcement_text") || DEFAULT_SETTINGS.announcementText,
      maintenanceMode: map.get("maintenance_mode") === "true",
      freeShippingThresholdPaise: parseInt(
        map.get("free_shipping_threshold") || String(DEFAULT_SETTINGS.freeShippingThresholdPaise),
        10
      ),
    };
  } catch (err) {
    return DEFAULT_SETTINGS;
  }
}

export async function updateStoreSetting(key: string, value: string, isPublic = true) {
  return prisma.storeSetting.upsert({
    where: { key },
    update: { value, isPublic },
    create: { key, value, isPublic },
  });
}
