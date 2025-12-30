// src/components/layout/LoadingLayout.tsx
"use client";

import { Loader2 } from "lucide-react";

interface LoadingLayoutProps {
  message?: string;
  subtitle?: string;
}

export function LoadingLayout({ 
  message = "Loading...", 
  subtitle 
}: LoadingLayoutProps = {}) {
  return (
    <div className="flex h-screen items-center justify-center bg-slate-950">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">
          {message}
        </h2>
        {subtitle && (
          <p className="text-sm text-slate-400">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}