// src/components/layout/AppLayout.tsx
"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { PublicLayout } from "./PublicLayout";
import { LoadingLayout } from "./LoadingLayout";
import { api } from "../../../../elaview-mvp/src/trpc/react";

/**
 * AppLayout Component
 *
 * Handles role-based layout rendering with proper webhook synchronization.
 *
 * IMPORTANT: After OAuth, there's a slight delay before the Clerk webhook
 * creates the user in our database. This component handles that gracefully
 * by retrying the user query until the webhook completes.
 */
export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoaded: clerkLoaded } = useUser();
  const [retryCount, setRetryCount] = useState(0);
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const maxRetries = 10; // Max 10 retries = ~5 seconds

  // Fetch user from database with retry logic
  const { data: userData, isLoading: userLoading } = api.user.getCurrentUser.useQuery(undefined, {
    enabled: clerkLoaded && !!user?.id,
    retry: false, // We handle retries manually
    // Refetch every 500ms if we don't have user data yet (webhook delay)
    refetchInterval: shouldRefetch ? 500 : false,
  });

  // Track retry attempts and control refetching
  useEffect(() => {
    if (clerkLoaded && user && !userData && !userLoading && retryCount < maxRetries) {
      setRetryCount((prev) => prev + 1);
      setShouldRefetch(true);
    } else if (userData || retryCount >= maxRetries) {
      setShouldRefetch(false);
    }
  }, [clerkLoaded, user, userData, userLoading, retryCount, maxRetries]);

  // Show loading while Clerk is loading
  if (!clerkLoaded) {
    return <LoadingLayout />;
  }

  // Show public layout for unauthenticated users
  if (!user) {
    return <PublicLayout>{children}</PublicLayout>;
  }

  // User is authenticated but we're waiting for webhook to create DB record
  if (!userData && retryCount < maxRetries) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12">
            <div className="h-full w-full animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
          </div>
          <h2 className="mb-2 text-xl font-semibold text-white">Setting up your account...</h2>
          <p className="text-sm text-slate-400">This should only take a moment</p>
        </div>
      </div>
    );
  }

  // User is authenticated but still no DB record after max retries
  if (!userData && retryCount >= maxRetries) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950">
        <div className="mx-auto max-w-md p-8 text-center">
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-6">
            <h2 className="mb-2 text-xl font-bold text-red-400">Account Setup Issue</h2>
            <p className="mb-4 text-slate-400">
              We&apos;re having trouble setting up your account. This usually resolves itself in a
              few seconds.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }
}
