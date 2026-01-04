// src/components/landing/MobileLandingPage.tsx
"use client";

import React, { useState } from "react";
import { ArrowRight, MapPin, Menu, TrendingUp, X, Zap } from "lucide-react";
import Image from "next/image";
import Logo from "@/public/images/logos/logo-v1-white.png";

interface MobileLandingPageProps {
  onSignIn: () => void;
  onGetStarted: () => void;
}

/**
 * Premium Mobile Landing Page for Elaview
 *
 * Features:
 * - Top nav with hamburger menu, logo, and login button
 * - Dark premium aesthetic matching desktop site
 * - Compact, conversion-focused design
 * - High-impact value proposition
 * - Premium gradient accents
 */
export function MobileLandingPage({
  onSignIn,
  onGetStarted,
}: MobileLandingPageProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-slate-950">
      {/* Premium Top Navigation */}
      <nav className="fixed top-0 right-0 left-0 z-50 border-b border-slate-800 bg-slate-900/95 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-2">
          {/* Left section: Hamburger + Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="rounded-lg p-2 transition-colors hover:bg-slate-800"
              aria-label="Menu"
            >
              <Menu className="h-6 w-6 text-slate-300" />
            </button>
            <Image src={Logo} alt="Elaview" className="h-12 w-auto" priority />
          </div>

          {/* Login Button */}
          <button
            onClick={onSignIn}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Log In
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {menuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />

          {/* Menu Content */}
          <div className="fixed top-0 bottom-0 left-0 z-50 w-80 transform border-r border-slate-800 bg-slate-900 transition-transform duration-300">
            <div className="p-6">
              {/* Close Button */}
              <button
                onClick={() => setMenuOpen(false)}
                className="absolute top-4 right-4 rounded-lg p-2 transition-colors hover:bg-slate-800"
                aria-label="Close menu"
              >
                <X className="h-6 w-6 text-slate-300" />
              </button>

              {/* Menu Logo */}
              <div className="mb-8 pt-2">
                <Image src={Logo} alt="Elaview" className="h-12 w-auto" />
              </div>

              {/* Menu Items */}
              <nav className="space-y-2">
                <a
                  href="MobileLandingPage.tsx#features"
                  className="block rounded-lg px-4 py-3 text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
                  onClick={() => setMenuOpen(false)}
                >
                  Features
                </a>
                <a
                  href="/how-it-works"
                  className="block rounded-lg px-4 py-3 text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
                  onClick={() => setMenuOpen(false)}
                >
                  How It Works
                </a>
                <a
                  href="MobileLandingPage.tsx#pricing"
                  className="block rounded-lg px-4 py-3 text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
                  onClick={() => setMenuOpen(false)}
                >
                  Pricing
                </a>
                <div className="border-t border-slate-800 pt-4">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onGetStarted();
                    }}
                    className="w-full rounded-lg bg-linear-to-r from-blue-600 to-cyan-600 px-4 py-3 font-semibold text-white transition-all hover:from-blue-700 hover:to-cyan-700"
                  >
                    Get Started Free
                  </button>
                </div>
              </nav>
            </div>
          </div>
        </>
      )}

      {/* Spacer to account for fixed nav height */}
      <div className="h-[72px]" aria-hidden="true" />

      {/* Main Content */}
      <main className="flex-1 px-6 pt-6 pb-6">
        {/* Hero Section - Premium Value Proposition */}
        <div className="mx-auto max-w-md">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1.5">
            <div className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />
            <span className="text-sm font-medium text-blue-400">
              Launch campaigns in minutes
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="mb-4 text-4xl leading-tight font-bold text-white md:text-5xl">
            Turn Real Estate Into
            <span className="block bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Revenue Streams
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mb-8 text-lg leading-relaxed text-slate-400">
            Connect advertisers with premium physical spaces. Launch campaigns,
            manage bookings, and scale your advertising business—all in one
            platform.
          </p>

          {/* CTA Buttons */}
          <div className="mb-12 space-y-3">
            <button
              onClick={onGetStarted}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4 font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-200 hover:from-blue-700 hover:to-cyan-700"
            >
              Get Started Free
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>

          {/* Key Features - Compact Icons */}
          <div className="mb-8 grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl border border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-cyan-500/10">
                <MapPin className="h-6 w-6 text-blue-400" />
              </div>
              <p className="text-xs font-medium text-slate-400">
                Browse
                <br />
                Spaces
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-pink-500/10">
                <Zap className="h-6 w-6 text-purple-400" />
              </div>
              <p className="text-xs font-medium text-slate-400">
                Launch
                <br />
                Campaigns
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl border border-green-500/20 bg-gradient-to-br from-green-500/10 to-emerald-500/10">
                <TrendingUp className="h-6 w-6 text-green-400" />
              </div>
              <p className="text-xs font-medium text-slate-400">
                Track
                <br />
                Results
              </p>
            </div>
          </div>

          {/* Social Proof */}
          <div className="border-t border-slate-800 py-6 text-center">
            <p className="mb-2 text-sm text-slate-500">
              Trusted by advertisers nationwide
            </p>
            <div className="flex items-center justify-center gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">500+</p>
                <p className="text-xs text-slate-500">Active Spaces</p>
              </div>
              <div className="h-8 w-px bg-slate-800" />
              <div className="text-center">
                <p className="text-2xl font-bold text-white">50+</p>
                <p className="text-xs text-slate-500">Cities</p>
              </div>
              <div className="h-8 w-px bg-slate-800" />
              <div className="text-center">
                <p className="text-2xl font-bold text-white">$2M+</p>
                <p className="text-xs text-slate-500">Ad Spend</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Hint */}
      <div className="border-t border-slate-800 py-6 text-center">
        <p className="text-xs text-slate-500">
          💡 View on desktop for full map browsing experience
        </p>
      </div>
    </div>
  );
}
