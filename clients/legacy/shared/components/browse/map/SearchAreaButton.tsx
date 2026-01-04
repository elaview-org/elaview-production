// src/components/browse/SearchAreaButton.tsx
"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin } from 'lucide-react';

interface SearchAreaButtonProps {
  isVisible: boolean;
  onClick: () => void;
  isSearching?: boolean;
}

export const SearchAreaButton: React.FC<SearchAreaButtonProps> = ({
  isVisible,
  onClick,
  isSearching = false
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          onClick={onClick}
          disabled={isSearching}
          className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-full shadow-lg border border-slate-700 hover:border-slate-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm min-h-[44px]"
          aria-label="Search this area"
        >
          {isSearching ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-white" />
              <span>Searching...</span>
            </>
          ) : (
            <>
              <Search className="h-4 w-4" />
              <span>Search this area</span>
              <MapPin className="h-4 w-4" />
            </>
          )}
        </motion.button>
      )}
    </AnimatePresence>
  );
};

SearchAreaButton.displayName = 'SearchAreaButton';
