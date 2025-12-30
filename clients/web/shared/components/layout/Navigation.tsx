// src/components/layout/Navigation.tsx
import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Building, MapPin } from "lucide-react";
import { UserButton, useUser } from "@clerk/nextjs";

interface NavigationProps {
  spacesCount?: number;
  onSignInClick?: () => void;
  onSignUpClick?: () => void;
  variant?: string;
}

export function Navigation({
  spacesCount = 0,
  onSignInClick = () => {
    /* empty */
  },
  onSignUpClick = () => {
    /* empty */
  },
  variant,
}: NavigationProps) {
  const router = useRouter();
  const { isSignedIn, user } = useUser();

  return (
    <nav
      className={`fixed top-0 right-0 left-0 z-50 border-b ${
        variant === "solid"
          ? "border-slate-800 bg-slate-900"
          : "border-white/10 bg-slate-900/80 backdrop-blur-lg"
      }`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center">
          <div className="flex items-center gap-8">
            <button onClick={() => router.push("/")} className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-blue-500 to-cyan-500">
                <Building className="h-5 w-5 text-white" />
              </div>
              <span className="bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-2xl font-bold text-transparent">
                Elaview
              </span>
            </button>

            {/* Spaces count badge */}
            {spacesCount > 0 && (
              <div className="hidden items-center rounded-full border border-blue-400/30 bg-blue-500/20 px-3 py-1 text-sm font-medium text-blue-300 md:flex">
                <MapPin className="mr-1.5 h-3.5 w-3.5" />
                {spacesCount} spaces
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <div className="ml-8 hidden items-center gap-6 md:flex">
            <Link
              href="/how-it-works"
              className="font-medium text-slate-300 transition-colors hover:text-white"
            >
              How It Works
            </Link>
          </div>

          {/* Spacer to push auth buttons to the right */}
          <div className="flex-1" />

          {/* Auth Section */}
          {isSignedIn ? (
            // Logged in - Show User Profile
            <div className="flex items-center gap-4">
              {/* Dashboard Link */}
              <Link
                href="/overview"
                className="hidden font-medium text-slate-300 transition-colors hover:text-white sm:inline-flex"
              >
                Dashboard
              </Link>

              {/* User Profile */}
              <div className="flex items-center gap-3 border-l border-slate-700 pl-3">
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8",
                    },
                  }}
                  afterSignOutUrl="/"
                />
                <span className="hidden text-sm font-medium text-white md:inline">
                  {user?.firstName ?? "User"}
                </span>
              </div>
            </div>
          ) : (
            // Logged out - Show Auth Buttons
            <div className="flex items-center space-x-4">
              <Link
                href="/request-demo"
                className="hidden rounded-lg px-4 py-2 font-medium text-cyan-400 transition-colors hover:text-cyan-300 sm:inline-flex"
              >
                Request Demo
              </Link>
              <button
                onClick={onSignInClick}
                className="rounded-lg px-4 py-2 text-gray-300 transition-colors hover:text-white"
              >
                Sign In
              </button>
              <button
                onClick={onSignUpClick}
                className="rounded-lg bg-linear-to-r from-blue-500 to-cyan-500 px-6 py-2 font-medium text-white shadow-lg transition-all duration-200 hover:from-blue-600 hover:to-cyan-600 hover:shadow-blue-500/25"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
