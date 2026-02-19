"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Home, Eye, AlignJustify, X } from "lucide-react";

const navLinks = [
  { href: "/how-it-works", label: "How It Works", icon: Home },
  { href: "/request-demo", label: "Request Demo", icon: Eye },
  //   { href: '/campaigns', label: 'Campaigns', icon: LayoutTemplate },
  //   { href: '/content', label: 'Content', icon: Film },
];

export default function HeroNavigation() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <nav className="absolute top-0 right-0 left-0 z-50 flex items-center justify-between bg-transparent px-16 py-4">
        {/* Logo + Desktop Nav Links grouped left */}
        <div className="flex items-center gap-10">
          <Link
            href="/public"
            className="text-xl font-bold tracking-widest text-white uppercase"
          >
            Elaview
          </Link>

          <ul className="hidden items-center gap-8 md:flex">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="flex items-center gap-1.5 text-sm font-medium text-white/90 transition-colors duration-200 hover:text-white"
                >
                  <Icon size={16} strokeWidth={1.75} />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Desktop Right Actions */}
        <div className="hidden items-center gap-5 md:flex">
          <Link
            href="/sign-in"
            className="rounded-md border-white/30 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:border-white/60 hover:bg-white/10"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="rounded-md border border-white/30 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:border-white/60 hover:bg-white/10"
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          aria-label="Open mobile menu"
          className="text-white/90 transition-colors duration-200 hover:text-white md:hidden"
          onClick={() => setMenuOpen(true)}
        >
          <AlignJustify size={24} strokeWidth={1.75} />
        </button>
      </nav>

      {/* Full-Screen Mobile Menu */}
      <div
        className={`fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-md transition-opacity duration-300 ease-in-out md:hidden ${
          menuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        aria-label="Mobile navigation"
      >
        {/* Top Bar */}
        <div className="flex items-center justify-between px-6 py-4">
          <Link
            href="/public"
            className="text-xl font-bold tracking-widest text-white uppercase"
            onClick={() => setMenuOpen(false)}
          >
            Elaview
          </Link>
          <button
            aria-label="Close menu"
            className="text-white/70 transition-colors hover:text-white"
            onClick={() => setMenuOpen(false)}
          >
            <X size={24} strokeWidth={1.5} />
          </button>
        </div>

        {/* Centered Nav Links */}
        <ul className="flex flex-1 flex-col items-start justify-center gap-8 px-6">
          {navLinks.map(({ href, label, icon: Icon }, i) => (
            <li
              key={href}
              className={`transition-all duration-300 ${
                menuOpen
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              }`}
              style={{
                transitionDelay: menuOpen ? `${i * 60 + 100}ms` : "0ms",
              }}
            >
              <Link
                href={href}
                className="flex items-center gap-3 text-2xl font-light tracking-widest text-white/70 uppercase transition-colors duration-200 hover:text-white"
                onClick={() => setMenuOpen(false)}
              >
                <Icon size={20} strokeWidth={1.25} />
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Bottom CTAs */}
        <div className="flex flex-col gap-3 px-6 pb-10">
          <div className="flex gap-3">
            <Link
              href="/sign-in"
              className="flex-1 rounded-lg border border-white/20 py-4 text-center text-sm font-semibold tracking-widest text-white uppercase transition-all duration-200 hover:border-white/50 hover:bg-white/5"
              onClick={() => setMenuOpen(false)}
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="flex-1 rounded-lg border border-white/20 py-4 text-center text-sm font-semibold tracking-widest text-white uppercase transition-all duration-200 hover:border-white/50 hover:bg-white/5"
              onClick={() => setMenuOpen(false)}
            >
              Sign Up
            </Link>
          </div>
          <Link
            href="/list-space"
            className="block rounded-lg border border-white/20 py-4 text-center text-sm font-semibold tracking-widest text-white uppercase transition-all duration-200 hover:border-white/50 hover:bg-white/5"
            onClick={() => setMenuOpen(false)}
          >
            Start Listing
          </Link>
        </div>
      </div>
    </>
  );
}
