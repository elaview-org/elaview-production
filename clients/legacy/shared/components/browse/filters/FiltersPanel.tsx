// src/components/browse/FiltersPanel.tsx - CENTERED ON MAP, NO LAYOUT BLUR
"use client";

import React, { useState, useEffect } from 'react';
import { X, RotateCcw, Check, DollarSign, Tag, Building } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FilterState {
  maxPrice: number;
  spaceTypes: string[];
}

interface FiltersPanelProps {
  isOpen: boolean;
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  onApply: () => void;
  onReset: () => void;
  onClose: () => void;
}

const SPACE_TYPE_OPTIONS = [
  { value: 'BILLBOARD', label: 'Billboard', icon: '🏢' },
  { value: 'STOREFRONT', label: 'Storefront', icon: '🏪' },
  { value: 'TRANSIT', label: 'Transit', icon: '🚌' },
  { value: 'DIGITAL_DISPLAY', label: 'Digital Display', icon: '📺' },
  { value: 'WINDOW_DISPLAY', label: 'Window Display', icon: '🪟' },
  { value: 'VEHICLE_WRAP', label: 'Vehicle Wrap', icon: '🚗' },
  { value: 'OTHER', label: 'Other', icon: '📌' }
];

const MIN_PRICE = 0;
const MAX_PRICE = 500;
const PRICE_STEP = 10;

export const FiltersPanel: React.FC<FiltersPanelProps> = ({
  isOpen,
  filters,
  onFilterChange,
  onApply,
  onReset,
  onClose,
}) => {
  const [localMaxPrice, setLocalMaxPrice] = useState(filters.maxPrice);

  useEffect(() => {
    setLocalMaxPrice(filters.maxPrice);
  }, [filters.maxPrice]);

  const toggleSpaceType = (type: string) => {
    const newTypes = filters.spaceTypes.includes(type)
      ? filters.spaceTypes.filter(t => t !== type)
      : [...filters.spaceTypes, type];
    onFilterChange({ spaceTypes: newTypes });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setLocalMaxPrice(value);
  };

  const handlePriceCommit = () => {
    onFilterChange({ maxPrice: localMaxPrice });
  };

  const hasActiveFilters = 
    filters.maxPrice < MAX_PRICE || 
    filters.spaceTypes.length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Mobile: Full-screen overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed inset-0 bg-slate-950 z-[100] overflow-y-auto"
          >
            {/* Mobile Header */}
            <div className="sticky top-0 bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-blue-400" />
                <h2 className="text-base font-bold text-white">Filters</h2>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                aria-label="Close filters"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Mobile Content */}
            <div className="p-4 space-y-5 pb-28">
              <PriceSliderSection 
                maxPrice={localMaxPrice}
                onPriceChange={handlePriceChange}
                onPriceCommit={handlePriceCommit}
              />
              <SpaceTypesSection 
                filters={filters} 
                toggleSpaceType={toggleSpaceType} 
              />
            </div>

            {/* Mobile Footer */}
            <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 p-4 z-10">
              <div className="flex gap-2">
                {hasActiveFilters && (
                  <button
                    onClick={onReset}
                    className="flex-1 px-4 py-2.5 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-all font-medium text-sm flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Reset
                  </button>
                )}
                <button
                  onClick={onApply}
                  className={`${hasActiveFilters ? 'flex-1' : 'w-full'} px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold text-sm flex items-center justify-center gap-2 shadow-lg`}
                >
                  <Check className="h-4 w-4" />
                  Apply Filters
                </button>
              </div>
            </div>
          </motion.div>

          {/* Desktop: Centered on MAP (not page), backdrop only over map */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="hidden md:block absolute inset-0 z-[100] bg-black/60"
            onClick={onClose}
          >
            {/* Centered panel */}
            <div className="flex items-center justify-center h-full p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-3xl bg-slate-900/98 backdrop-blur-xl border border-slate-800 rounded-xl shadow-2xl overflow-hidden"
              >
                {/* Desktop Header */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Tag className="h-5 w-5 text-blue-400" />
                    <h2 className="text-sm font-bold text-white">Filter Spaces</h2>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    aria-label="Close filters"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Desktop Content */}
                <div className="p-5 flex items-start gap-6">
                  <div className="flex-1">
                    <PriceSliderSection 
                      maxPrice={localMaxPrice}
                      onPriceChange={handlePriceChange}
                      onPriceCommit={handlePriceCommit}
                    />
                  </div>
                  <div className="flex-1">
                    <SpaceTypesSection 
                      filters={filters} 
                      toggleSpaceType={toggleSpaceType} 
                    />
                  </div>
                </div>

                {/* Desktop Footer */}
                <div className="flex items-center justify-between px-5 py-3 bg-slate-800/50 border-t border-slate-800">
                  {hasActiveFilters ? (
                    <button
                      onClick={onReset}
                      className="px-3 py-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-all font-medium text-xs flex items-center gap-1.5"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      Reset
                    </button>
                  ) : (
                    <div />
                  )}
                  <button
                    onClick={onApply}
                    className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold text-sm flex items-center gap-2 shadow-lg"
                  >
                    <Check className="h-4 w-4" />
                    Apply Filters
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Price Slider Section (unchanged)
const PriceSliderSection: React.FC<{
  maxPrice: number;
  onPriceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPriceCommit: () => void;
}> = ({ maxPrice, onPriceChange, onPriceCommit }) => {
  const percentage = (maxPrice / MAX_PRICE) * 100;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-blue-400" />
          <label className="text-sm font-semibold text-white">Max Price/Day</label>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-bold text-blue-400">
            ${maxPrice}
          </span>
          <span className="text-xs text-slate-400">
            {maxPrice >= MAX_PRICE ? '+' : ''}
          </span>
        </div>
      </div>

      <div className="relative pt-1 pb-0.5">
        <div className="absolute top-1/2 left-0 right-0 h-1.5 -translate-y-1/2 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-600 to-blue-500 transition-all duration-150"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <input
          type="range"
          min={MIN_PRICE}
          max={MAX_PRICE}
          step={PRICE_STEP}
          value={maxPrice}
          onChange={onPriceChange}
          onMouseUp={onPriceCommit}
          onTouchEnd={onPriceCommit}
          className="relative w-full h-11 bg-transparent appearance-none cursor-pointer z-10
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-11
            [&::-webkit-slider-thumb]:h-11
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-white
            [&::-webkit-slider-thumb]:border-4
            [&::-webkit-slider-thumb]:border-blue-500
            [&::-webkit-slider-thumb]:shadow-lg
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:transition-all
            [&::-webkit-slider-thumb]:duration-150
            [&::-webkit-slider-thumb]:hover:scale-110
            [&::-webkit-slider-thumb]:hover:shadow-xl
            [&::-webkit-slider-thumb]:active:scale-105
            [&::-webkit-slider-thumb]:focus-visible:ring-4
            [&::-webkit-slider-thumb]:focus-visible:ring-blue-400/50
            [&::-moz-range-thumb]:w-11
            [&::-moz-range-thumb]:h-11
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-white
            [&::-moz-range-thumb]:border-4
            [&::-moz-range-thumb]:border-blue-500
            [&::-moz-range-thumb]:shadow-lg
            [&::-moz-range-thumb]:cursor-pointer
            [&::-moz-range-thumb]:transition-all
            [&::-moz-range-thumb]:duration-150
            [&::-moz-range-thumb]:hover:scale-110
            [&::-moz-range-thumb]:hover:shadow-xl
            [&::-moz-range-thumb]:active:scale-105"
        />
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>${MIN_PRICE}</span>
        <span>${MAX_PRICE}+</span>
      </div>
    </div>
  );
};

// Space Types Section - Mobile Enhanced, Desktop Original
const SpaceTypesSection: React.FC<{
  filters: FilterState;
  toggleSpaceType: (type: string) => void;
}> = ({ filters, toggleSpaceType }) => {
  const spaceTypeConfig = [
    {
      value: 'BILLBOARD',
      label: 'Billboard',
      color: 'blue',
      icon: (
        <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <rect x="3" y="5" width="18" height="14" rx="2" strokeWidth="2"/>
        </svg>
      )
    },
    {
      value: 'STOREFRONT',
      label: 'Storefront',
      color: 'green',
      icon: (
        <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      value: 'TRANSIT',
      label: 'Transit',
      color: 'orange',
      icon: (
        <svg className="w-5 h-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      )
    },
    {
      value: 'DIGITAL_DISPLAY',
      label: 'Digital Display',
      color: 'purple',
      icon: (
        <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <rect x="2" y="3" width="20" height="14" rx="2" strokeWidth="2"/>
          <line x1="8" y1="21" x2="16" y2="21" strokeWidth="2" strokeLinecap="round"/>
          <line x1="12" y1="17" x2="12" y2="21" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    },
    {
      value: 'WINDOW_DISPLAY',
      label: 'Window Display',
      color: 'red',
      icon: (
        <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2"/>
          <line x1="3" y1="12" x2="21" y2="12" strokeWidth="2"/>
          <line x1="12" y1="3" x2="12" y2="21" strokeWidth="2"/>
        </svg>
      )
    },
    {
      value: 'VEHICLE_WRAP',
      label: 'Vehicle Wrap',
      color: 'yellow',
      icon: (
        <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
        </svg>
      )
    },
    {
      value: 'OTHER',
      label: 'Other',
      color: 'gray',
      icon: (
        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <circle cx="12" cy="12" r="10" strokeWidth="2"/>
          <circle cx="12" cy="12" r="3" fill="currentColor"/>
        </svg>
      )
    }
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Building className="h-5 w-5 text-blue-400" />
        <h3 className="text-sm font-semibold text-white">Space Types</h3>
      </div>

      {/* MOBILE: Enhanced checkboxes with icons */}
      <div className="md:hidden space-y-2">
        {spaceTypeConfig.map(({ value, label, color, icon }) => (
          <label
            key={value}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors group"
          >
            <input
              type="checkbox"
              checked={filters.spaceTypes.includes(value)}
              onChange={() => toggleSpaceType(value)}
              className="w-5 h-5 rounded border-2 border-slate-600 bg-slate-800 checked:bg-blue-600 checked:border-blue-600 transition-colors"
            />
            <div className="flex items-center gap-3 flex-1">
              <div className={`w-8 h-8 rounded-lg bg-${color}-500/20 flex items-center justify-center`}>
                {icon}
              </div>
              <span className="text-white font-medium group-hover:text-blue-400 transition-colors text-sm">
                {label}
              </span>
            </div>
          </label>
        ))}
      </div>

      {/* DESKTOP: Original simple grid */}
      <div className="hidden md:grid grid-cols-2 gap-3">
        {/* Billboard */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.spaceTypes.includes('BILLBOARD')}
            onChange={(e) => {
              const newTypes = e.target.checked
                ? [...filters.spaceTypes, 'BILLBOARD']
                : filters.spaceTypes.filter(t => t !== 'BILLBOARD');
              toggleSpaceType('BILLBOARD');
            }}
            className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-blue-600"
          />
          <span className="text-sm text-slate-300">Billboard</span>
        </label>

        {/* Storefront */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.spaceTypes.includes('STOREFRONT')}
            onChange={() => toggleSpaceType('STOREFRONT')}
            className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-blue-600"
          />
          <span className="text-sm text-slate-300">Storefront</span>
        </label>

        {/* Transit */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.spaceTypes.includes('TRANSIT')}
            onChange={() => toggleSpaceType('TRANSIT')}
            className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-blue-600"
          />
          <span className="text-sm text-slate-300">Transit</span>
        </label>

        {/* Digital Display */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.spaceTypes.includes('DIGITAL_DISPLAY')}
            onChange={() => toggleSpaceType('DIGITAL_DISPLAY')}
            className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-blue-600"
          />
          <span className="text-sm text-slate-300">Digital Display</span>
        </label>

        {/* Window Display */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.spaceTypes.includes('WINDOW_DISPLAY')}
            onChange={() => toggleSpaceType('WINDOW_DISPLAY')}
            className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-blue-600"
          />
          <span className="text-sm text-slate-300">Window Display</span>
        </label>

        {/* Vehicle Wrap */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.spaceTypes.includes('VEHICLE_WRAP')}
            onChange={() => toggleSpaceType('VEHICLE_WRAP')}
            className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-blue-600"
          />
          <span className="text-sm text-slate-300">Vehicle Wrap</span>
        </label>

        {/* Other */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.spaceTypes.includes('OTHER')}
            onChange={() => toggleSpaceType('OTHER')}
            className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-blue-600"
          />
          <span className="text-sm text-slate-300">Other</span>
        </label>
      </div>
    </div>
  );
};