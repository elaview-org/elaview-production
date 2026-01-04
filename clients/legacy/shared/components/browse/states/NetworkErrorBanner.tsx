// src/components/browse/NetworkErrorBanner.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { WifiOff, Wifi } from 'lucide-react';

export function NetworkErrorBanner() {
  const [isOnline, setIsOnline] = useState(true);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      // Hide reconnected message after 3 seconds
      setTimeout(() => setShowReconnected(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnected(false);
    };

    // Set initial state
    setIsOnline(navigator.onLine);

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Don't render if online and not showing reconnected message
  if (isOnline && !showReconnected) {
    return null;
  }

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[100] pointer-events-none"
      data-testid="network-error-banner"
    >
      <div
        className={`mx-auto max-w-2xl mt-4 px-4 py-3 rounded-lg shadow-lg border pointer-events-auto transition-all duration-300 ${
          isOnline
            ? 'bg-green-900/90 border-green-500/30 backdrop-blur-sm'
            : 'bg-orange-900/90 border-orange-500/30 backdrop-blur-sm'
        }`}
        role="alert"
        aria-live="polite"
      >
        <div className="flex items-center gap-3">
          <div className={`flex-shrink-0 h-5 w-5 ${isOnline ? 'text-green-400' : 'text-orange-400'}`}>
            {isOnline ? <Wifi className="h-5 w-5" /> : <WifiOff className="h-5 w-5" />}
          </div>
          <div className="flex-1">
            <p className={`text-sm font-medium ${isOnline ? 'text-green-100' : 'text-orange-100'}`}>
              {isOnline ? 'Connection restored' : 'No internet connection'}
            </p>
            {!isOnline && (
              <p className="text-xs text-orange-200 mt-0.5">
                Some features may not work until you reconnect
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

NetworkErrorBanner.displayName = 'NetworkErrorBanner';
