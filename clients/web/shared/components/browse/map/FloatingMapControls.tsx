// src/components/browse/FloatingMapControls.tsx
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Lock, MapPin, SlidersHorizontal, Megaphone, Plus, ChevronDown, Check, X, Calendar, DollarSign, Building } from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
  status: string;
  createdAt: Date;
}

interface FloatingMapControlsProps {
  campaigns: Campaign[];
  selectedCampaignId: string | null;
  isLocked: boolean;
  onCampaignChange: (campaignId: string) => void;
  onCreateCampaign: () => void;
  cartCount: number;
  spacesCount: number;
  showFilters: boolean;
  onToggleFilters: () => void;
  activeFilterCount: number;
  isPublicView?: boolean;
  filters?: {
    maxPrice?: number;
    spaceTypes?: string[];
  };
  onFilterChange?: (filters: Partial<{ maxPrice: number; spaceTypes: string[] }>) => void;
}

// All Campaigns Modal Component
const AllCampaignsModal: React.FC<{
  campaigns: Campaign[];
  selectedCampaignId: string | null;
  onSelect: (campaignId: string) => void;
  onClose: () => void;
  onCreateNew: () => void;
}> = ({ campaigns, selectedCampaignId, onSelect, onClose, onCreateNew }) => {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-white">All Campaigns</h2>
            <p className="text-sm text-slate-400 mt-1">Select a campaign to work with</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Campaign List */}
        <div className="overflow-y-auto max-h-[calc(80vh-200px)] p-4">
          <div className="space-y-2">
            {campaigns.map((campaign) => (
              <button
                key={campaign.id}
                onClick={() => {
                  onSelect(campaign.id);
                  onClose();
                }}
                className={`w-full px-4 py-4 flex items-center gap-4 rounded-lg transition-all text-left ${
                  selectedCampaignId === campaign.id
                    ? 'bg-blue-600 border-2 border-blue-500'
                    : 'bg-slate-800 border-2 border-transparent hover:bg-slate-700'
                }`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/20 flex-shrink-0 border border-blue-400/20">
                  <Megaphone className="h-6 w-6 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-semibold text-white truncate">
                    {campaign.name}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-slate-400 capitalize">
                      {campaign.status.toLowerCase()}
                    </span>
                    <span className="text-xs text-slate-500">•</span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(campaign.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                {selectedCampaignId === campaign.id && (
                  <Check className="h-5 w-5 text-white flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-800/50">
          <button
            onClick={() => {
              onCreateNew();
              onClose();
            }}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
          >
            <Plus className="h-5 w-5" />
            Create New Campaign
          </button>
        </div>
      </div>
    </div>
  );
};

export const FloatingMapControls: React.FC<FloatingMapControlsProps> = ({
  campaigns,
  selectedCampaignId,
  isLocked,
  onCampaignChange,
  onCreateCampaign,
  cartCount,
  spacesCount,
  showFilters,
  onToggleFilters,
  activeFilterCount,
  isPublicView = false,
  filters,
  onFilterChange,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showAllCampaignsModal, setShowAllCampaignsModal] = useState(false);
  const [showCampaignPicker, setShowCampaignPicker] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const sortedCampaigns = [...campaigns].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const displayedCampaigns = sortedCampaigns.slice(0, 5);
  const hasMoreCampaigns = sortedCampaigns.length > 5;
  const selectedCampaign = campaigns.find(c => c.id === selectedCampaignId);

  // PUBLIC VIEW: Show simplified controls (no campaign selector)
  if (isPublicView) {
    return (
      <div className="absolute top-4 left-4 z-40">
        <div className="flex flex-col gap-3 max-w-md">
          {/* Bottom Row: Spaces Count + Filters */}
          <div className="flex gap-3">
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-900/95 backdrop-blur-xl rounded-lg shadow-lg border border-slate-800">
              <MapPin className="h-4 w-4 text-slate-400" />
              <span className="text-sm font-medium text-white">
                {spacesCount} {spacesCount === 1 ? 'space' : 'spaces'}
              </span>
            </div>

            <button
              onClick={onToggleFilters}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all shadow-lg text-sm font-medium ${
                showFilters || activeFilterCount > 0
                  ? 'bg-blue-600 text-white border border-blue-500'
                  : 'bg-slate-900/95 backdrop-blur-xl text-white border border-slate-800 hover:bg-slate-800'
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold ${
                  showFilters || activeFilterCount > 0
                    ? 'bg-white text-blue-600'
                    : 'bg-blue-600 text-white'
                }`}>
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // AUTHENTICATED VIEW: Show full controls with campaign selector
  // No campaigns - show warning notification
  if (campaigns.length === 0) {
    return (
      <div className="absolute top-4 left-4 z-40 max-w-md">
        <div className="bg-amber-600/90 backdrop-blur-md text-white shadow-2xl rounded-xl p-4 border border-amber-500/20">
          <div className="flex items-start gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/20 flex-shrink-0">
              <Megaphone className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-base mb-1">Create a campaign to book spaces</h3>
              <p className="text-xs text-amber-100">
                You can browse the map, but you'll need a campaign to add spaces to your cart
              </p>
            </div>
          </div>
          <button
            onClick={onCreateCampaign}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all font-medium text-sm backdrop-blur-sm border border-white/10"
          >
            <Plus className="h-4 w-4" />
            Create Campaign
          </button>
        </div>

        {/* Bottom Row: Spaces Count + Filters */}
        <div className="flex gap-3 mt-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-900/95 backdrop-blur-xl rounded-lg shadow-lg border border-slate-800">
            <MapPin className="h-4 w-4 text-slate-400" />
            <span className="text-sm font-medium text-white">
              {spacesCount} {spacesCount === 1 ? 'space' : 'spaces'}
            </span>
          </div>

          <button
            onClick={onToggleFilters}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all shadow-lg text-sm font-medium ${
              showFilters || activeFilterCount > 0
                ? 'bg-blue-600 text-white border border-blue-500'
                : 'bg-slate-900/95 backdrop-blur-xl text-white border border-slate-800 hover:bg-slate-800'
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold ${
                showFilters || activeFilterCount > 0
                  ? 'bg-white text-blue-600'
                  : 'bg-blue-600 text-white'
              }`}>
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* MOBILE LAYOUT - Horizontal Scrollable Filter Chips */}
      {isMobile && (
        <>
          {/* Horizontal Scrollable Filter Chips Row */}
          <div className="md:hidden absolute top-[76px] left-0 right-0 z-40">
            <div className="flex gap-2 overflow-x-auto px-4 pb-2 scrollbar-hide">

              {/* Campaign Chip - Primary Action */}
              <button
                onClick={() => setShowCampaignPicker(true)}
                className="shrink-0 h-10 px-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-full flex items-center gap-2 transition-all active:scale-95 shadow-lg"
              >
                <Megaphone className="h-4 w-4 text-white" />
                <span className="text-sm font-semibold text-white whitespace-nowrap">
                  {selectedCampaign?.name || 'Select Campaign'}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-white/80" />
              </button>

              {/* All Filters Chip */}
              <button
                onClick={onToggleFilters}
                className="shrink-0 h-10 px-3 bg-slate-800/95 backdrop-blur-xl hover:bg-slate-700 active:bg-slate-600 border border-slate-700 rounded-full flex items-center gap-2 transition-all active:scale-95"
              >
                <SlidersHorizontal className="h-4 w-4 text-slate-300" />
                <span className="text-sm font-medium text-white whitespace-nowrap">
                  Filters
                </span>
                {activeFilterCount > 0 && (
                  <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Price Filter Chip */}
              {filters?.maxPrice && filters.maxPrice < 500 && (
                <button
                  onClick={() => onFilterChange?.({ maxPrice: 500 })}
                  className="shrink-0 h-10 px-3 bg-slate-800/95 backdrop-blur-xl border border-blue-500/30 rounded-full flex items-center gap-2 transition-all active:scale-95 hover:bg-slate-700"
                >
                  <DollarSign className="h-4 w-4 text-blue-400" />
                  <span className="text-sm font-medium text-white whitespace-nowrap">
                    Under ${filters.maxPrice}
                  </span>
                  <X className="h-3.5 w-3.5 text-slate-400 hover:text-white" />
                </button>
              )}

              {/* Space Types Filter Chip */}
              {filters?.spaceTypes && filters.spaceTypes.length > 0 && (
                <button
                  onClick={() => onFilterChange?.({ spaceTypes: [] })}
                  className="shrink-0 h-10 px-3 bg-slate-800/95 backdrop-blur-xl border border-blue-500/30 rounded-full flex items-center gap-2 transition-all active:scale-95 hover:bg-slate-700"
                >
                  <Building className="h-4 w-4 text-blue-400" />
                  <span className="text-sm font-medium text-white whitespace-nowrap">
                    {filters.spaceTypes.length} {filters.spaceTypes.length === 1 ? 'type' : 'types'}
                  </span>
                  <X className="h-3.5 w-3.5 text-slate-400 hover:text-white" />
                </button>
              )}

              {/* Space Count Info Chip (Non-interactive) */}
              <div className="shrink-0 h-10 px-3 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-full flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-400" />
                <span className="text-sm font-medium text-white whitespace-nowrap">
                  {spacesCount} {spacesCount === 1 ? 'space' : 'spaces'}
                </span>
              </div>
            </div>
          </div>

          {/* Campaign Picker Bottom Sheet Modal */}
          {showCampaignPicker && (
            <div
              className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
              onClick={() => setShowCampaignPicker(false)}
            >
              <div
                className="absolute bottom-0 left-0 right-0 bg-slate-900 rounded-t-2xl border-t border-slate-800 animate-in slide-in-from-bottom duration-300"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Drag Handle */}
                <div className="w-12 h-1 bg-slate-700 rounded-full mx-auto mt-3 mb-4" />

                <div className="px-6 pb-6">
                  <h3 className="text-lg font-bold text-white mb-4">Select Campaign</h3>

                  <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                    {campaigns.length > 0 ? (
                      campaigns.map((campaign) => (
                        <button
                          key={campaign.id}
                          onClick={() => {
                            onCampaignChange(campaign.id);
                            setShowCampaignPicker(false);
                          }}
                          className={`w-full p-4 rounded-xl text-left transition-all ${
                            selectedCampaignId === campaign.id
                              ? 'bg-blue-600 text-white shadow-lg'
                              : 'bg-slate-800 text-slate-300 hover:bg-slate-700 active:scale-98'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-base mb-1 truncate">
                                {campaign.name}
                              </div>
                              {campaign.status && (
                                <div className={`text-sm ${
                                  selectedCampaignId === campaign.id
                                    ? 'text-blue-100'
                                    : 'text-slate-500'
                                }`}>
                                  Status: {campaign.status}
                                </div>
                              )}
                            </div>
                            {selectedCampaignId === campaign.id && (
                              <div className="ml-3 w-6 h-6 rounded-full bg-white flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-blue-600" />
                              </div>
                            )}
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <Megaphone className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                        <p className="text-slate-400 mb-4">No campaigns yet</p>
                        <button
                          onClick={() => {
                            onCreateCampaign();
                            setShowCampaignPicker(false);
                          }}
                          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all"
                        >
                          Create Your First Campaign
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* DESKTOP LAYOUT: Traditional vertical stack */}
      <div className="hidden md:block absolute top-4 left-4 z-40">
        <div className="flex flex-col gap-3 max-w-md">
          {/* Campaign Selector - Desktop (Always Expanded) */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => !isLocked && setDropdownOpen(!dropdownOpen)}
              disabled={isLocked}
              className="w-full bg-slate-900/95 backdrop-blur-md text-white shadow-2xl rounded-xl px-4 py-3 border border-slate-800 transition-all hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-75"
              data-testid="campaign-selector-desktop"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/20 shrink-0 border border-blue-400/20">
                  <Megaphone className="h-4 w-4 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-xs font-medium text-slate-400">Active Campaign</p>
                  <p className="text-sm font-semibold text-white truncate">
                    {selectedCampaign?.name || sortedCampaigns[0]?.name || 'Select Campaign'}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {isLocked && (
                    <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-800 border border-slate-700">
                      <Lock className="h-3 w-3 text-slate-400" />
                    </div>
                  )}
                  {!isLocked && (
                    <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                  )}
                </div>
              </div>
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && !isLocked && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900/95 backdrop-blur-xl rounded-xl shadow-2xl border border-slate-800 overflow-hidden z-50">
                <div className="py-2">
                  {displayedCampaigns.map((campaign) => (
                    <button
                      key={campaign.id}
                      onClick={() => {
                        onCampaignChange(campaign.id);
                        setDropdownOpen(false);
                      }}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-800 transition-colors text-left"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20 flex-shrink-0 border border-blue-400/20">
                        <Megaphone className="h-4 w-4 text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">
                          {campaign.name}
                        </p>
                        <p className="text-xs text-slate-400">
                          {campaign.status.toLowerCase()}
                        </p>
                      </div>
                      {selectedCampaignId === campaign.id && (
                        <Check className="h-4 w-4 text-blue-400 flex-shrink-0" />
                      )}
                    </button>
                  ))}

                  {hasMoreCampaigns && (
                    <>
                      <div className="my-2 border-t border-slate-800" />
                      <button
                        onClick={() => {
                          setShowAllCampaignsModal(true);
                          setDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2.5 flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors"
                      >
                        <p className="text-sm font-medium text-white">
                          View All Campaigns ({sortedCampaigns.length})
                        </p>
                      </button>
                    </>
                  )}

                  <div className="my-2 border-t border-slate-800" />

                  <button
                    onClick={() => {
                      onCreateCampaign();
                      setDropdownOpen(false);
                    }}
                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-800 transition-colors text-left"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20 flex-shrink-0 border border-blue-400/20">
                      <Plus className="h-4 w-4 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-blue-400">
                        Create New Campaign
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Row: Spaces Count + Filters */}
          <div className="flex gap-3">
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-900/95 backdrop-blur-xl rounded-lg shadow-lg border border-slate-800">
              <MapPin className="h-4 w-4 text-slate-400" />
              <span className="text-sm font-medium text-white">
                {spacesCount} {spacesCount === 1 ? 'space' : 'spaces'}
              </span>
            </div>

            <button
              onClick={onToggleFilters}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all shadow-lg text-sm font-medium ${
                showFilters || activeFilterCount > 0
                  ? 'bg-blue-600 text-white border border-blue-500'
                  : 'bg-slate-900/95 backdrop-blur-xl text-white border border-slate-800 hover:bg-slate-800'
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold ${
                  showFilters || activeFilterCount > 0
                    ? 'bg-white text-blue-600'
                    : 'bg-blue-600 text-white'
                }`}>
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {showAllCampaignsModal && (
        <AllCampaignsModal
          campaigns={sortedCampaigns}
          selectedCampaignId={selectedCampaignId}
          onSelect={onCampaignChange}
          onClose={() => setShowAllCampaignsModal(false)}
          onCreateNew={onCreateCampaign}
        />
      )}
    </>
  );
};