"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { IconInnerShadowTop, IconMenu2 } from "@tabler/icons-react";
import { cn } from "@/lib/core/utils";
import { Button } from "@/components/primitives/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/primitives/sheet";
import { ThemeToggle } from "@/components/composed/theme-toggle";
import storage from "@/lib/core/storage";

const NAV_LINKS = [
  { href: "/help", label: "Help" },
  { href: "/about", label: "About" },
  { href: "/how-it-works", label: "How It Works" },
] as const;

const COOKIE_KEY = storage.authentication.token + "=";
const subscribe = () => () => {};
const getSnapshot = () => document.cookie.includes(COOKIE_KEY);
const getServerSnapshot = () => false;

export default function Header() {
  const authenticated = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 backdrop-blur-sm transition-[border-color,background-color] duration-300",
        scrolled
          ? "bg-background/80 border-b"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="px-public flex h-14 items-center gap-4">
        <Link href="/" className="flex items-center gap-2">
          <IconInnerShadowTop className="size-5" />
          <span className="text-base font-semibold">Elaview</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Button key={link.href} variant="ghost" size="sm" asChild>
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />

          <div className="hidden items-center gap-2 md:flex">
            {authenticated ? (
              <Button size="sm" asChild>
                <Link href="/overview">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden">
                <IconMenu2 className="size-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>
                  <Link
                    href="/"
                    className="flex items-center gap-2"
                    onClick={() => setOpen(false)}
                  >
                    <IconInnerShadowTop className="size-5" />
                    <span className="text-base font-semibold">Elaview</span>
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4">
                {NAV_LINKS.map((link) => (
                  <Button
                    key={link.href}
                    variant="ghost"
                    className="justify-start"
                    asChild
                  >
                    <Link href={link.href} onClick={() => setOpen(false)}>
                      {link.label}
                    </Link>
                  </Button>
                ))}
                {authenticated ? (
                  <Button asChild>
                    <Link href="/overview" onClick={() => setOpen(false)}>
                      Dashboard
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button variant="ghost" className="justify-start" asChild>
                      <Link href="/login" onClick={() => setOpen(false)}>
                        Login
                      </Link>
                    </Button>
                    <Button asChild>
                      <Link href="/signup" onClick={() => setOpen(false)}>
                        Sign Up
                      </Link>
                    </Button>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
