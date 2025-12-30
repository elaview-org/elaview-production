// src/components/browse/MapErrorState.tsx
"use client";

import React from 'react';
import { MapPinOff, RefreshCw, AlertTriangle } from 'lucide-react';

interface MapErrorStateProps {
  error: string;
  onRetry: () => void;
  isRetrying?: boolean;
  errorType?: 'API_KEY' | 'NETWORK' | 'PERMISSION' | 'UNKNOWN';
}

export function MapErrorState({
  error,
  onRetry,
  isRetrying = false,
  errorType = 'UNKNOWN'
}: MapErrorStateProps) {
  const getErrorDetails = () => {
    switch (errorType) {
      case 'API_KEY':
        return {
          title: 'Map Configuration Error',
          description: 'Unable to load Google Maps. Please check your API key configuration.',
          showRetry: false,
        };
      case 'NETWORK':
        return {
          title: 'Network Connection Error',
          description: 'Unable to load the map. Please check your internet connection.',
          showRetry: true,
        };
      case 'PERMISSION':
        return {
          title: 'Location Permission Denied',
          description: 'Unable to access your location. Please enable location services.',
          showRetry: true,
        };
      default:
        return {
          title: 'Map Loading Failed',
          description: error || 'An unexpected error occurred while loading the map.',
          showRetry: true,
        };
    }
  };

  const details = getErrorDetails();

  return (
    <div
      className="absolute inset-0 flex items-center justify-center bg-slate-950 z-40 p-4"
      data-testid="map-error-state"
      data-error-type={errorType}
    >
      <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-orange-500/20 max-w-md w-full">
        <div className="flex flex-col items-center gap-4 text-center">
          {/* Error Icon */}
          <div className="h-14 w-14 rounded-full bg-orange-500/20 flex items-center justify-center">
            {errorType === 'API_KEY' || errorType === 'PERMISSION' ? (
              <AlertTriangle className="h-7 w-7 text-orange-400" />
            ) : (
              <MapPinOff className="h-7 w-7 text-orange-400" />
            )}
          </div>

          {/* Error Message */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">
              {details.title}
            </h3>
            <p className="text-sm text-orange-300">
              {details.description}
            </p>
          </div>

          {/* Retry Button */}
          {details.showRetry && (
            <button
              onClick={onRetry}
              disabled={isRetrying}
              className="w-full px-4 py-2.5 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-700 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
              aria-label="Retry loading map"
            >
              <RefreshCw className={`h-4 w-4 ${isRetrying ? 'animate-spin' : ''}`} />
              <span>{isRetrying ? 'Retrying...' : 'Try Again'}</span>
            </button>
          )}

          {/* Help Text */}
          <p className="text-xs text-slate-500">
            {errorType === 'API_KEY'
              ? 'Contact support if this persists'
              : 'You can still view spaces in list view below'}
          </p>
        </div>
      </div>
    </div>
  );
}

MapErrorState.displayName = 'MapErrorState';
