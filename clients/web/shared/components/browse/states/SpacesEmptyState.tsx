// src/components/browse/SpacesEmptyState.tsx
"use client";

import React from 'react';
import { MapPin, SlidersHorizontal, ZoomOut } from 'lucide-react';

interface SpacesEmptyStateProps {
  onAdjustFilters: () => void;
  hasActiveFilters?: boolean;
}

export function SpacesEmptyState({ onAdjustFilters, hasActiveFilters = false }: SpacesEmptyStateProps) {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 p-4"
      data-testid="spaces-empty-state"
    >
      <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-slate-800 max-w-sm w-full pointer-events-auto">
        <div className="flex flex-col items-center gap-4 text-center">
          {/* Icon */}
          <div className="h-14 w-14 rounded-full bg-slate-800 flex items-center justify-center">
            <MapPin className="h-7 w-7 text-slate-400" />
          </div>

          {/* Content */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">
              {hasActiveFilters ? 'No matches found' : 'No spaces in this area'}
            </h3>
            <p className="text-sm text-slate-400">
              {hasActiveFilters
                ? 'Try adjusting your filters to see more results'
                : 'Try zooming out or moving the map to explore other areas'}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            {hasActiveFilters && (
              <button
                onClick={onAdjustFilters}
                className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                aria-label="Adjust filters"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>Adjust Filters</span>
              </button>
            )}
            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500">
              <ZoomOut className="h-3.5 w-3.5" />
              <span>Zoom out to see more areas</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

SpacesEmptyState.displayName = 'SpacesEmptyState';
