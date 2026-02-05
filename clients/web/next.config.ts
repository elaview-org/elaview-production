import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  cacheComponents: true,
  output: "standalone",
  serverExternalPackages: ["pino", "pino-pretty"],
  // logging: false,
  env: {
    API_URL: process.env.ELAVIEW_WEB_API_URL,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
      process.env.ELAVIEW_BACKEND_STRIPE_PUBLISHABLE_KEY,
  },
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    globalNotFound: true,
  },
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
