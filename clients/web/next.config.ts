import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.ELAVIEW_WEB_NEXT_PUBLIC_API_URL,
    AUTH_COOKIE_NAME: process.env.ELAVIEW_WEB_AUTH_COOKIE_NAME,
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.ELAVIEW_WEB_NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID: process.env.ELAVIEW_WEB_NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID
  },
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
};

export default nextConfig;
