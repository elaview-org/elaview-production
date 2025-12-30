"use client";

import { Navigation } from "./Navigation";
import { Footer } from "./Footer";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation variant="solid" />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}