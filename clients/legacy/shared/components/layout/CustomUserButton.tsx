// src/components/layout/CustomUserButton.tsx
"use client";

import { UserButton } from "@clerk/nextjs";
import { User, Shield } from "lucide-react";

export function CustomUserButton() {
  return (
    <UserButton
      appearance={{
        elements: {
          // Root button container - make transparent with no background
          userButtonBox: "!bg-transparent",
          
          // Trigger button - remove background and make it seamless
          userButtonTrigger: 
            "!bg-transparent hover:!bg-transparent focus:!bg-transparent active:!bg-transparent !shadow-none",
          
          // Avatar styling with enhanced hover effect
          userButtonAvatarBox: 
            "w-10 h-10 !rounded-full ring-2 ring-slate-700 hover:ring-blue-500/50 transition-all duration-200",
          
          // Avatar image itself
          userButtonAvatarImage: "!rounded-full",
          
          // Popup card - Dark slate with border and shadow
          userButtonPopoverCard: 
            "!bg-slate-900 !border-slate-700 !shadow-2xl !rounded-xl !overflow-hidden",
          
          // User info section at top
          userButtonPopoverMain: "!bg-slate-900 !p-4",
          userPreviewMainIdentifier: "!text-white !font-semibold !text-base",
          userPreviewSecondaryIdentifier: "!text-slate-400 !text-sm",
          
          // Menu actions section with refined spacing
          userButtonPopoverActions: "!bg-slate-900 !border-t !border-slate-800 !pt-2 !pb-2",
          userButtonPopoverActionButton: 
            "!text-slate-300 hover:!text-white hover:!bg-slate-800/60 !transition-all !duration-200 !rounded-lg !mx-2 !my-0.5",
          userButtonPopoverActionButtonIcon: "!text-slate-400 !w-4 !h-4",
          userButtonPopoverActionButtonText: "!text-sm !font-medium",
          
          // Footer - completely hidden to remove "Secured by Clerk" and "Development mode"
          userButtonPopoverFooter: "!hidden",
        },
      }}
    >
      {/* Custom menu items - Sign out is automatically included by Clerk */}
      <UserButton.MenuItems>
        <UserButton.Link
          label="Settings"
          labelIcon={<User className="h-4 w-4" />}
          href="/settings"
        />
        <UserButton.Link
          label="Authentication"
          labelIcon={<Shield className="h-4 w-4" />}
          href="/user"
        />
      </UserButton.MenuItems>
    </UserButton>
  );
}