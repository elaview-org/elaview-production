import localFont from "next/font/local";

export const inter = localFont({
  src: [
    {
      path: "../../public/fonts/inter-v20-latin-regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/inter-v20-latin-500.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/inter-v20-latin-600.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/inter-v20-latin-700.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-inter",
  display: "swap",
  preload: true,
  fallback: [
    "system-ui",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "sans-serif",
  ],
});
