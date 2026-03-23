import Link from "next/link";
import { IconInnerShadowTop } from "@tabler/icons-react";
import { Separator } from "@/components/primitives/separator";

const footerLinks = [
  { href: "/about", label: "About" },
  { href: "/careers", label: "Careers" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/contact", label: "Contact" },
  { href: "/help", label: "Help" },
  { href: "/terms-of-service", label: "Terms" },
  { href: "/privacy-policy", label: "Privacy" },
] as const;

export default function Default() {
  return (
    <footer className="mt-auto">
      <Separator />
      <div className="px-public flex flex-col gap-6 py-8">
        <div className="flex items-center gap-2">
          <IconInnerShadowTop className="size-5" />
          <span className="text-base font-semibold">Elaview</span>
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <p className="text-muted-foreground text-sm">
          &copy; 2026 Elaview. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
