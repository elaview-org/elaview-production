// src/components/browse/SpacesErrorState.tsx
"use client";

import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface SpacesErrorStateProps {
  error: string;
  onRetry: () => void;
  isRetrying?: boolean;
}

export function SpacesErrorState({ error, onRetry, isRetrying = false }: SpacesErrorStateProps) {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 p-4"
      data-testid="spaces-error-state"
    >
      <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-red-500/20 max-w-sm w-full pointer-events-auto">
        <div className="flex flex-col items-center gap-4 text-center">
          {/* Error Icon */}
          <div className="h-14 w-14 rounded-full bg-red-500/20 flex items-center justify-center">
            <AlertCircle className="h-7 w-7 text-red-400" />
          </div>

          {/* Error Message */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">
              Failed to load spaces
            </h3>
            <p className="text-sm text-red-300">
              {error || 'An error occurred while loading advertising spaces'}
            </p>
          </div>

          {/* Retry Button */}
          <button
            onClick={onRetry}
            disabled={isRetrying}
            className="w-full px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-700 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
            aria-label="Retry loading spaces"
          >
            <RefreshCw className={`h-4 w-4 ${isRetrying ? 'animate-spin' : ''}`} />
            <span>{isRetrying ? 'Retrying...' : 'Try Again'}</span>
          </button>

          {/* Help Text */}
          <p className="text-xs text-slate-500">
            Check your internet connection and try again
          </p>
        </div>
      </div>
    </div>
  );
}

SpacesErrorState.displayName = 'SpacesErrorState';
