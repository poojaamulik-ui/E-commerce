import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/login", destination: "/account/login", permanent: true },
      { source: "/register", destination: "/account/register", permanent: true },
      { source: "/orders", destination: "/account", permanent: false },
      { source: "/terms", destination: "/policies/terms", permanent: true },
      { source: "/privacy", destination: "/policies/privacy", permanent: true },
      { source: "/shipping", destination: "/policies/shipping", permanent: true },
      { source: "/returns", destination: "/policies/returns", permanent: true },
      { source: "/faq", destination: "/contact", permanent: false },
    ];
  },
};

export default nextConfig;
