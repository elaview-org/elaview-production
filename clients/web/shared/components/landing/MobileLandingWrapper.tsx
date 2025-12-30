// src/components/landing/MobileLandingWrapper.tsx
"use client";

import { useEffect, useState } from 'react';
import { Monitor, Smartphone } from 'lucide-react';
import LandingPage from './LandingPage';

export function MobileLandingWrapper() {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Check if device is mobile
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const mobileKeywords = ['android', 'webos', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone'];
      const isMobileUserAgent = mobileKeywords.some(keyword => userAgent.includes(keyword));

      // Also check screen size
      const isMobileScreen = window.innerWidth < 768;

      // Device is mobile if either user agent OR screen size indicates mobile
      return isMobileUserAgent || isMobileScreen;
    };

    setIsMobile(checkMobile());

    // Add resize listener to handle screen size changes
    const handleResize = () => {
      setIsMobile(checkMobile());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ✅ FIXED: Return consistent loading skeleton instead of null to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500 mb-4 animate-pulse">
            <span className="text-white font-bold text-2xl">E</span>
          </div>
          <div className="h-4 w-32 bg-slate-700 rounded animate-pulse mx-auto"></div>
        </div>
      </div>
    );
  }

  // Show construction message on mobile
  if (isMobile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500 mb-4">
              <span className="text-white font-bold text-2xl">E</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Elaview</h1>
            <p className="text-slate-400 text-sm">Physical Advertising Marketplace</p>
          </div>

          {/* Main Card */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-2xl">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="h-20 w-20 rounded-full bg-slate-700/50 flex items-center justify-center">
                  <Smartphone className="h-10 w-10 text-slate-400" />
                </div>
                <div className="absolute -top-1 -right-1 h-8 w-8 rounded-full bg-yellow-500/20 border-2 border-yellow-500 flex items-center justify-center">
                  <span className="text-yellow-500 text-lg">⚠️</span>
                </div>
              </div>
            </div>

            {/* Message */}
            <h2 className="text-xl font-bold text-white text-center mb-3">
              Mobile Experience Coming Soon
            </h2>
            <p className="text-slate-300 text-center mb-6 leading-relaxed">
              Elaview mobile is currently under construction. To start finding advertising spaces near you, please visit us on a desktop or laptop.
            </p>

            {/* Features Coming Soon */}
            <div className="bg-slate-900/50 rounded-lg p-4 mb-6">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3 text-center">
                Coming to Mobile
              </p>
              <div className="space-y-2 text-sm text-slate-300">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-cyan-500"></div>
                  <span>Browse advertising spaces on the go</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-cyan-500"></div>
                  <span>Manage campaigns from anywhere</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-cyan-500"></div>
                  <span>Real-time notifications</span>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <a
              href="https://elaview.com"
              className="flex items-center justify-center gap-2 w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              <Monitor className="h-5 w-5" />
              Open on Desktop
            </a>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-slate-500 text-sm">
            <p>Need help? Contact us at</p>
            <a 
              href="mailto:support@elaview.com" 
              className="text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              support@elaview.com
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Show full landing page on desktop
  return <LandingPage />;
}