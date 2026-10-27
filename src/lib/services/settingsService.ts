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

export async function getPublicStoreSettings(): Promise<PublicStoreSettings> {
  try {
    const settings = await prisma.storeSetting.findMany({
      where: { isPublic: true },
    });

    const map = new Map<string, string>();
    for (const s of settings) {
      map.set(s.key, s.value);
    }

    return {
      storeName: map.get("store_name") || "BharatBazaar",
      storeTagline: map.get("store_tagline") || "Curated Indian Heritage & Sustainable Goods",
      supportEmail: map.get("support_email") || "support@bharatbazaar.in",
      supportPhone: map.get("support_phone") || "+91 98765 43210",
      businessAddress:
        map.get("business_address") || "Indiranagar 100ft Road, Bengaluru, Karnataka 560038",
      announcementText:
        map.get("announcement_text") ||
        "✨ Festive Season Sale: Enjoy Free Shipping on all orders above ₹999 across India!",
      maintenanceMode: map.get("maintenance_mode") === "true",
      freeShippingThresholdPaise: parseInt(map.get("free_shipping_threshold") || "99900", 10),
    };
  } catch (err) {
    console.error("Error loading store settings from DB:", err);
    return {
      storeName: "BharatBazaar",
      storeTagline: "Curated Indian Heritage & Sustainable Goods",
      supportEmail: "support@bharatbazaar.in",
      supportPhone: "+91 98765 43210",
      businessAddress: "Indiranagar 100ft Road, Bengaluru, Karnataka 560038",
      announcementText:
        "✨ Festive Season Sale: Enjoy Free Shipping on all orders above ₹999 across India!",
      maintenanceMode: false,
      freeShippingThresholdPaise: 99900,
    };
  }
}

export async function updateStoreSetting(key: string, value: string, isPublic = true) {
  return prisma.storeSetting.upsert({
    where: { key },
    update: { value, isPublic },
    create: { key, value, isPublic },
  });
}
