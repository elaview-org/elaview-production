// src/components/browse/CreateCampaignBanner.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Megaphone, X, Plus, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CreateCampaignBannerProps {
  onCreateCampaign: () => void;
}

export const CreateCampaignBanner: React.FC<CreateCampaignBannerProps> = ({
  onCreateCampaign,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);

  // Check localStorage on mount
  useEffect(() => {
    const dismissed = localStorage.getItem('campaignBannerDismissed');
    if (dismissed === 'true') {
      setIsVisible(false);
      setIsDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('campaignBannerDismissed', 'true');
    setIsDismissed(true);
  };

  if (isDismissed) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="absolute top-4 left-1/2 -translate-x-1/2 z-50 max-w-md w-full mx-4"
        >
          <div className="relative bg-gradient-to-r from-orange-600 to-orange-500 rounded-xl shadow-2xl border border-orange-400/30 overflow-hidden">
            {/* Animated background effect */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.1),transparent)] pointer-events-none" />
            
            {/* Content */}
            <div className="relative p-4">
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className="flex-shrink-0 mt-0.5">
                  <div className="relative">
                    <div className="absolute inset-0 bg-white/20 blur-md rounded-lg" />
                    <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm border border-white/30">
                      <Megaphone className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </div>

                {/* Text content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                    Create a campaign to book spaces
                    <Sparkles className="h-3.5 w-3.5 text-orange-200" />
                  </h3>
                  <p className="text-xs text-orange-50/90 leading-relaxed">
                    Browse the map freely, but you'll need an active campaign to add spaces to your cart
                  </p>
                </div>

                {/* Dismiss button */}
                <button
                  onClick={handleDismiss}
                  className="flex-shrink-0 p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                  aria-label="Dismiss banner"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* CTA Button */}
              <button
                onClick={() => {
                  onCreateCampaign();
                  handleDismiss();
                }}
                className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-orange-600 rounded-lg hover:bg-orange-50 transition-all font-semibold text-sm shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <Plus className="h-4 w-4" />
                Create Campaign
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};