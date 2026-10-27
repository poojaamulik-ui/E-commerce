import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function AnnouncementBar({ text }: { text?: string }) {
  const message =
    text || "Free Shipping on Orders Above ₹999 | Easy Returns | Secure Payments";

  return (
    <div className="bg-[#1E3F20] px-4 py-2 text-center text-xs font-medium text-emerald-50">
      <div className="mx-auto flex max-w-7xl 2xl:max-w-[1600px] 2xl:px-12 items-center justify-center gap-1.5 hover:text-white transition">
        <span>{message}</span>
        <ChevronRight className="h-3.5 w-3.5 opacity-80" />
      </div>
    </div>
  );
}
