// src/components/browse/NoCampaignState.tsx
"use client";

import React from 'react';
import { Megaphone, Plus, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface NoCampaignStateProps {
  onCreateCampaign?: () => void;
}

export function NoCampaignState({ onCreateCampaign }: NoCampaignStateProps) {
  return (
    <div
      className="flex items-center justify-center p-8 bg-slate-900/50 rounded-2xl border border-slate-800 backdrop-blur-sm"
      data-testid="no-campaign-state"
    >
      <div className="max-w-md text-center">
        <div className="flex flex-col items-center gap-5">
          {/* Icon */}
          <div className="h-16 w-16 rounded-full bg-blue-500/20 flex items-center justify-center">
            <Megaphone className="h-8 w-8 text-blue-400" />
          </div>

          {/* Content */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Create Your First Campaign
            </h3>
            <p className="text-sm text-slate-400 mb-1">
              Before you can book advertising spaces, you need to create a campaign with your creative content.
            </p>
            <p className="text-xs text-slate-500 mt-3">
              A campaign contains your ad creative (images/videos) and basic information about your advertising goals.
            </p>
          </div>

          {/* Call to Action */}
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            {onCreateCampaign ? (
              <button
                onClick={onCreateCampaign}
                className="flex-1 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                aria-label="Create new campaign"
              >
                <Plus className="h-5 w-5" />
                <span>Create Campaign</span>
              </button>
            ) : (
              <Link
                href="/campaigns/new"
                className="flex-1 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                aria-label="Create new campaign"
              >
                <Plus className="h-5 w-5" />
                <span>Create Campaign</span>
              </Link>
            )}
          </div>

          {/* Secondary Info */}
          <div className="flex items-start gap-2 text-left bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
            <ArrowRight className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-slate-400">
              <span className="font-medium text-slate-300">Quick tip:</span> You can create multiple campaigns to organize different advertising initiatives separately.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

NoCampaignState.displayName = 'NoCampaignState';
