'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Home, Eye, AlignJustify, X } from 'lucide-react';

const navLinks = [
  { href: '/how-it-works', label: 'How It Works', icon: Home },
  { href: '/request-demo', label: 'Request Demo', icon: Eye },
//   { href: '/campaigns', label: 'Campaigns', icon: LayoutTemplate },
//   { href: '/content', label: 'Content', icon: Film },
];

export default function HeroNavigation() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <nav className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-16 py-4 bg-transparent">
        {/* Logo + Desktop Nav Links grouped left */}
        <div className="flex items-center gap-10">
          <Link href="/" className="text-white text-xl font-bold tracking-widest uppercase">
            Elaview
          </Link>

          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="flex items-center gap-1.5 text-white/90 hover:text-white text-sm font-medium transition-colors duration-200"
                >
                  <Icon size={16} strokeWidth={1.75} />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Desktop Right Actions */}
        <div className="hidden md:flex items-center gap-5">
          <Link
            href="/sign-in"
            className="text-white text-sm font-medium px-4 py-2 rounded-md border-white/30 hover:border-white/60 hover:bg-white/10 transition-all duration-200"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="text-white text-sm font-medium px-4 py-2 rounded-md border border-white/30 hover:border-white/60 hover:bg-white/10 transition-all duration-200"
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          aria-label="Open mobile menu"
          className="md:hidden text-white/90 hover:text-white transition-colors duration-200"
          onClick={() => setMenuOpen(true)}
        >
          <AlignJustify size={24} strokeWidth={1.75} />
        </button>
      </nav>

      {/* Full-Screen Mobile Menu */}
      <div
        className={`fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-md md:hidden transition-opacity duration-300 ease-in-out ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-label="Mobile navigation"
      >
        {/* Top Bar */}
        <div className="flex items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="text-white text-xl font-bold tracking-widest uppercase"
            onClick={() => setMenuOpen(false)}
          >
            Elaview
          </Link>
          <button
            aria-label="Close menu"
            className="text-white/70 hover:text-white transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            <X size={24} strokeWidth={1.5} />
          </button>
        </div>

        {/* Centered Nav Links */}
        <ul className="flex flex-col items-start justify-center flex-1 gap-8 px-6">
          {navLinks.map(({ href, label, icon: Icon }, i) => (
            <li
              key={href}
              className={`transition-all duration-300 ${
                menuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: menuOpen ? `${i * 60 + 100}ms` : '0ms' }}
            >
              <Link
                href={href}
                className="flex items-center gap-3 text-white/70 hover:text-white text-2xl font-light tracking-widest uppercase transition-colors duration-200"
                onClick={() => setMenuOpen(false)}
              >
                <Icon size={20} strokeWidth={1.25} />
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Bottom CTAs */}
        <div className="px-6 pb-10 flex flex-col gap-3">
          <div className="flex gap-3">
            <Link
              href="/sign-in"
              className="flex-1 text-center text-white text-sm font-semibold tracking-widest uppercase border border-white/20 hover:border-white/50 hover:bg-white/5 rounded-lg py-4 transition-all duration-200"
              onClick={() => setMenuOpen(false)}
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="flex-1 text-center text-white text-sm font-semibold tracking-widest uppercase border border-white/20 hover:border-white/50 hover:bg-white/5 rounded-lg py-4 transition-all duration-200"
              onClick={() => setMenuOpen(false)}
            >
              Sign Up
            </Link>
          </div>
          <Link
            href="/list-space"
            className="block text-center text-white text-sm font-semibold tracking-widest uppercase border border-white/20 hover:border-white/50 hover:bg-white/5 rounded-lg py-4 transition-all duration-200"
            onClick={() => setMenuOpen(false)}
          >
            Start Listing
          </Link>
        </div>
      </div>
    </>
  );
}