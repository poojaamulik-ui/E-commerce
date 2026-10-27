import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart/CartContext";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { getPublicStoreSettings } from "@/lib/services/settingsService";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nestora | Everyday Essentials for a More Beautiful Home",
  description:
    "Thoughtful home essentials, artisanal lighting, linen throws, natural jute rugs, handcrafted ceramics, and indoor greenery for a cozier, happier home.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getPublicStoreSettings();

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#FAF7F2] text-[#1C1F1C] font-sans">
        <CartProvider>
          <AnnouncementBar text={settings.announcementText} />
          <Navbar storeName={settings.storeName} />
          <main className="flex-1">{children}</main>
          <Footer
            storeName={settings.storeName}
            supportEmail={settings.supportEmail}
            supportPhone={settings.supportPhone}
            businessAddress={settings.businessAddress}
          />
          <MobileBottomNav />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
