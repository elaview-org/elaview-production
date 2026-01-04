import "@/shared/styles/globals.css";

import React from "react";

import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "next-themes";
import { Geist } from "next/font/google";
import { type Metadata } from "next";
import Script from "next/script";

import { ErrorBoundary } from "@/shared/components/ErrorBoundary";
import { Toaster } from "sonner";
// import { Analytics } from "@vercel/analytics/next";
// import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: "Elaview - Advertising Marketplace",
  description: "Connect advertisers with prime advertising spaces",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: undefined,
        variables: {
          colorPrimary: "#3b82f6",
          colorBackground: "#0f172a",
          colorInputBackground: "rgba(255, 255, 255, 0.05)",
          colorInputText: "#ffffff",
          colorText: "#ffffff",
          colorTextSecondary: "#9ca3af",
          borderRadius: "0.75rem",
          fontFamily: "var(--font-geist-sans)",
        },
        elements: {
          rootBox: "!bg-slate-900",
          card: "!bg-slate-900 !border !border-slate-800 !shadow-2xl !rounded-xl",
          headerTitle: "!text-white !text-2xl !font-bold",
          headerSubtitle: "!text-slate-400 !text-sm",
          formFieldLabel: "!text-slate-300 !font-medium !text-sm",
          formFieldInput:
            "!bg-slate-800/50 !border !border-slate-700 !text-white !placeholder-slate-500 focus:!border-blue-500 focus:!ring-2 focus:!ring-blue-500/20 !rounded-lg !transition-all !duration-200",
          formButtonPrimary:
            "!bg-gradient-to-r !from-blue-500 !to-cyan-500 hover:!from-blue-600 hover:!to-cyan-600 !text-white !font-semibold !shadow-lg hover:!shadow-blue-500/25 !transition-all !duration-200 !rounded-lg",
          formButtonReset:
            "!text-slate-400 hover:!text-white hover:!bg-slate-800/50 !rounded-lg !transition-all",
          formFieldSuccessText: "!text-green-400 !text-sm",
          formFieldErrorText: "!text-red-400 !text-sm",
          otpCodeFieldInput:
            "!bg-slate-800/50 !border !border-slate-700 !text-white !text-2xl !rounded-xl focus:!border-blue-500 focus:!ring-2 focus:!ring-blue-500/20",
          footerActionLink:
            "!text-blue-400 hover:!text-blue-300 !transition-colors",
          footerActionText: "!text-slate-400 !text-sm",
          formResendCodeLink: "!text-blue-400 hover:!text-blue-300",
          identityPreviewText: "!text-white !font-medium",
          identityPreviewEditButton:
            "!text-blue-400 hover:!text-blue-300 !transition-colors",
          identityPreviewEditButtonIcon: "!text-blue-400",
          alert: "!bg-red-500/10 !border-red-500/20 !text-red-400",
          alertText: "!text-red-400",
          badge:
            "!bg-blue-500/10 !text-blue-400 !border !border-blue-500/20 !rounded-full !px-3 !py-1 !text-xs !font-medium",
          avatarBox:
            "!bg-gradient-to-br !from-blue-500 !to-cyan-500 !shadow-lg",
          userButtonBox: "!bg-transparent !rounded-full",
          userButtonTrigger:
            "!bg-transparent hover:!bg-transparent focus:!bg-transparent active:!bg-transparent !shadow-none",
          userButtonAvatarBox:
            "!w-10 !h-10 !rounded-full !ring-2 !ring-slate-700 hover:!ring-blue-500/50 !transition-all !duration-200 !z-50",
          userButtonAvatarImage: "!rounded-full",
          userButtonPopoverCard:
            "!bg-slate-900 !border !border-slate-700 !shadow-2xl !rounded-xl !overflow-hidden",
          userButtonPopoverMain: "!bg-slate-900 !p-4",
          userPreviewMainIdentifier: "!text-white !font-semibold !text-base",
          userPreviewSecondaryIdentifier: "!text-slate-400 !text-sm",
          userButtonPopoverActions:
            "!bg-slate-900 !border-t !border-slate-800 !pt-2 !pb-2",
          userButtonPopoverActionButton:
            "!text-slate-300 hover:!text-white hover:!bg-slate-800/60 !transition-all !duration-200 !rounded-lg !mx-2 !my-0.5",
          userButtonPopoverActionButtonIcon: "!text-slate-400 !w-4 !h-4",
          userButtonPopoverActionButtonText: "!text-sm !font-medium",
          userButtonPopoverFooter: "!hidden",
          navbar: "!bg-slate-900/50 !border-b !border-slate-800",
          navbarButton:
            "!text-slate-400 hover:!text-white hover:!bg-slate-800/50 !transition-all !rounded-lg",
          navbarButtonIcon: "!text-slate-500",
          profileSection:
            "!bg-slate-800/30 !border !border-slate-700/50 !rounded-xl !p-6",
          profileSectionTitle: "!text-white !font-semibold !text-base",
          profileSectionTitleText: "!text-white",
          profileSectionContent:
            "!text-slate-300 !bg-slate-800/50 !border !border-slate-700 !rounded-lg !p-4",
          profileSectionPrimaryButton:
            "!bg-gradient-to-r !from-blue-500 !to-cyan-500 hover:!from-blue-600 hover:!to-cyan-600 !text-white !font-semibold !shadow-lg hover:!shadow-blue-500/25 !transition-all !duration-200 !rounded-lg",
          accordionTriggerButton:
            "!text-slate-300 hover:!text-white hover:!bg-slate-800/50 !rounded-lg !transition-all",
          accordionContent: "!bg-slate-800/30 !border-t !border-slate-700/50",
          modalBackdrop: "!bg-black/80 !backdrop-blur-sm",
          modalContent:
            "!bg-slate-900 !border !border-slate-800 !shadow-2xl !rounded-xl",
          modalCloseButton:
            "!text-slate-400 hover:!text-white hover:!bg-slate-800/50 !rounded-lg !transition-all",
          footer: "!hidden",
          footerPages: "!hidden",
          footerAction: "!hidden",
        },
      }}
      signInFallbackRedirectUrl="/browse"
      signUpFallbackRedirectUrl="/browse"
    >
      <html lang="en" className={`${geist.variable}`} suppressHydrationWarning>
        <head>
          {/* Load Google Maps API before interactive for better stability */}
          <Script
            src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places,marker&loading=async`}
            strategy="beforeInteractive"
          />
        </head>
        <body className="bg-slate-900" suppressHydrationWarning>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <ErrorBoundary>{children}</ErrorBoundary>

            {/* Toast notifications for immediate action feedback */}
            <Toaster
              position="top-right"
              expand={false}
              richColors
              closeButton
              duration={4000}
              visibleToasts={3}
              toastOptions={{
                style: {
                  maxWidth: "calc(100vw - 32px)",
                },
                classNames: {
                  toast:
                    "text-base sm:text-sm rounded-2xl sm:rounded-xl shadow-2xl",
                },
              }}
            />
          </ThemeProvider>

          {/* Vercel */}
          {/* <Analytics /> */}
          {/* <SpeedInsights /> */}
        </body>
      </html>
    </ClerkProvider>
  );
}
