// src/components/layout/MobileTopNav.tsx
"use client";

import Link from "next/link";
import { Menu, ShoppingCart } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { NotificationCenter } from "../notifications/NotificationCenter";
import { NotificationBadge } from "../notifications/NotificationBadge";

interface MobileTopNavProps {
  /** Brand color for logo background */
  brandColor: string;
  /** Icon component for logo */
  icon: React.ComponentType<{ className?: string }>;
  /** Home link (where logo navigates to) */
  homeHref: string;
  /** User's first name for display */
  userName?: string;
  /** Role label (e.g., "Advertiser", "Space Owner") */
  roleLabel: string;
  /** Whether to show cart icon (Advertiser only) */
  showCart?: boolean;
  /** Cart item count */
  cartCount?: number;
  /** Callback when hamburger menu is clicked */
  onMenuClick: () => void;
}

/**
 * Mobile Top Navigation Component
 *
 * Shared top navigation for mobile layouts with:
 * - Hamburger menu (left)
 * - Logo (center-left)
 * - Cart icon (Advertiser only, right)
 * - Notifications (right)
 * - User profile (right)
 *
 * Only visible on mobile (<768px)
 * Desktop uses the existing TopNav in each layout
 */
export function MobileTopNav({
  brandColor,
  icon: Icon,
  homeHref,
  userName,
  roleLabel,
  showCart = false,
  cartCount = 0,
  onMenuClick,
}: MobileTopNavProps) {
  return (
    <div className="md:hidden fixed top-0 left-0 right-0 z-[80] h-16 border-b border-slate-800 bg-slate-900/95 backdrop-blur-sm">
      <div className="flex h-full items-center px-4 gap-3">
        {/* Left: Hamburger Menu */}
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Center-Left: Logo */}
        <Link href={homeHref} className="flex items-center gap-2">
          <div className={`w-8 h-8 ${brandColor} rounded-lg flex items-center justify-center`}>
            <Icon className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-white">
            Elaview
          </span>
        </Link>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Cart Icon - Advertiser only */}
          {showCart && (
            <Link href="/cart">
              <button
                className="relative p-2 rounded-lg transition-colors text-slate-400 hover:bg-slate-800 hover:text-white"
                aria-label={`Shopping cart${cartCount > 0 ? ` with ${cartCount} items` : ''}`}
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <div className="absolute -top-1 -right-1">
                    <NotificationBadge count={cartCount} size="sm" />
                  </div>
                )}
              </button>
            </Link>
          )}

          {/* Notifications */}
          <div className="relative">
            <NotificationCenter />
          </div>

          {/* User Profile */}
          <div className="flex items-center pl-2 border-l border-slate-700">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8"
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
