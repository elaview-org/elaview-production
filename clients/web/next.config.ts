import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.ELAVIEW_WEB_NEXT_PUBLIC_API_URL,
    AUTH_COOKIE_NAME: process.env.ELAVIEW_WEB_AUTH_COOKIE_NAME,
  },
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
