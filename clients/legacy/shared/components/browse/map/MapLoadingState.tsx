// src/components/browse/MapLoadingState.tsx
"use client";

import React from 'react';
import { Loader2, MapPin } from 'lucide-react';

interface MapLoadingStateProps {
  message?: string;
}

export function MapLoadingState({ message = "Loading spaces..." }: MapLoadingStateProps) {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm z-50"
      data-testid="map-loading-state"
    >
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center">
            <MapPin className="h-6 w-6 text-blue-400" />
          </div>
          <Loader2 className="absolute inset-0 h-12 w-12 animate-spin text-blue-400" />
        </div>
        <p className="text-sm font-medium text-white">{message}</p>
      </div>
    </div>
  );
}

MapLoadingState.displayName = 'MapLoadingState';
