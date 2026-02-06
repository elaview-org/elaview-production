import "./global.css";
import type { Metadata } from "next";
import NotFound from "next/dist/client/components/builtin/not-found";
import { inter } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  description: "The page you are looking for does not exist.",
};

export default function GlobalNotFound() {
  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>
        <NotFound />
      </body>
    </html>
  );
}
