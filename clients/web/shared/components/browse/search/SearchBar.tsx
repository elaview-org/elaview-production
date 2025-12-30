// src/components/browse/SearchBar.tsx - Phase 3A: Basic Search Infrastructure
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowLeft, Loader2, MapPin, ChevronRight } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  onClear: () => void;
  placeholder?: string;
  isLoading?: boolean;
  searchResults?: SearchResult[];
  onSelectResult?: (result: SearchResult) => void;
}

export interface SearchResult {
  type: 'space' | 'location';
  id: string;
  title: string;
  subtitle?: string;
  score: number;
  data: any;
}

export function SearchBar({
  value,
  onChange,
  onSearch,
  onClear,
  placeholder = "Search locations or spaces...",
  isLoading = false,
  searchResults = [],
  onSelectResult,
}: SearchBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClose = () => {
    setIsExpanded(false);
  };

  return (
    <>
      {/* Collapsed floating bar */}
      <motion.button
        onClick={() => setIsExpanded(true)}
        className="absolute top-3 left-1/2 -translate-x-1/2 w-[90%] max-w-[600px] h-12
                   bg-slate-900/95 backdrop-blur-xl rounded-full shadow-lg border border-slate-800
                   flex items-center gap-3 px-4 z-50"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        data-testid="search-bar-collapsed"
      >
        <Search className="h-5 w-5 text-slate-400" />
        <span className="text-sm text-slate-400 flex-1 text-left truncate">
          {value || placeholder}
        </span>
        {value && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
            className="p-1 hover:bg-slate-800 rounded-full transition-colors"
            aria-label="Clear search"
          >
            <X className="h-4 w-4 text-slate-400" />
          </button>
        )}
      </motion.button>

      {/* Expanded full-screen search */}
      <AnimatePresence>
        {isExpanded && (
          <SearchModal
            value={value}
            onChange={onChange}
            onSearch={onSearch}
            onClose={handleClose}
            isLoading={isLoading}
            searchResults={searchResults}
            onSelectResult={onSelectResult}
          />
        )}
      </AnimatePresence>
    </>
  );
}

interface SearchModalProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  onClose: () => void;
  isLoading: boolean;
  searchResults: SearchResult[];
  onSelectResult?: (result: SearchResult) => void;
}

function SearchModal({
  value,
  onChange,
  onSearch,
  onClose,
  isLoading,
  searchResults,
  onSelectResult,
}: SearchModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    // Auto-focus on open
    inputRef.current?.focus();
  }, []);

  // Sync external value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Debounce local input to parent (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue);
    }, 300);
    return () => clearTimeout(timer);
  }, [localValue, onChange]);

  const handleSelectResult = (result: SearchResult) => {
    onSelectResult?.(result);
    onClose();
  };

  const highlightMatch = (text: string, query: string): string => {
    if (!query) return text;
    const index = text.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return text;

    return text.slice(0, index) +
      '<mark class="bg-yellow-400/30 text-white font-semibold">' +
      text.slice(index, index + query.length) +
      '</mark>' +
      text.slice(index + query.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] bg-slate-950"
    >
      {/* Header with search input */}
      <div className="sticky top-0 bg-slate-900 border-b border-slate-800 p-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors min-h-11 min-w-11 flex items-center justify-center"
            aria-label="Close search"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>

          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={localValue}
              onChange={(e) => setLocalValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && localValue.trim()) {
                  onSearch(localValue);
                  onClose();
                } else if (e.key === 'Escape') {
                  onClose();
                }
              }}
              placeholder="Search locations or spaces..."
              className="w-full pl-10 pr-10 py-3 bg-slate-800 text-white rounded-lg
                         border border-slate-700 focus:border-blue-500 focus:ring-2
                         focus:ring-blue-500/20 outline-none text-base transition-all"
              data-testid="search-input"
            />
            {localValue && (
              <button
                onClick={() => setLocalValue('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-700 rounded transition-colors"
                aria-label="Clear input"
              >
                <X className="h-4 w-4 text-slate-400" />
              </button>
            )}
          </div>

          {isLoading && (
            <Loader2 className="h-5 w-5 text-blue-400 animate-spin flex-shrink-0" />
          )}
        </div>
      </div>

      {/* Results area */}
      <div className="overflow-y-auto h-[calc(100vh-88px)] overscroll-contain">
        <div className="p-4">
          {localValue && searchResults.length > 0 ? (
            <div className="space-y-2">
              <div className="text-xs text-slate-500 mb-3 px-1">
                {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
              </div>

              {searchResults.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleSelectResult(result)}
                  className="w-full p-4 bg-slate-800/50 hover:bg-slate-800 rounded-xl
                             text-left transition-all flex items-start gap-3 group min-h-16"
                  data-testid="search-result-item"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-500/20
                                  flex items-center justify-center group-hover:bg-blue-500/30
                                  transition-colors border border-blue-400/20">
                    <MapPin className="h-5 w-5 text-blue-400" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div
                      className="font-medium text-white mb-1"
                      dangerouslySetInnerHTML={{
                        __html: highlightMatch(result.title, localValue)
                      }}
                    />
                    {result.subtitle && (
                      <div className="text-sm text-slate-400 truncate">
                        {result.subtitle}
                      </div>
                    )}
                  </div>

                  <ChevronRight className="h-5 w-5 text-slate-500 group-hover:text-slate-400
                                           transition-colors flex-shrink-0 mt-1" />
                </button>
              ))}
            </div>
          ) : localValue ? (
            <div className="flex flex-col items-center justify-center h-64 text-center px-4">
              <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-slate-500" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No results found</h3>
              <p className="text-sm text-slate-400">
                Try searching for a different location or space name
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center px-4">
              <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-slate-500" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Search for spaces</h3>
              <p className="text-sm text-slate-400">
                Find spaces by location, name, or type
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

SearchBar.displayName = 'SearchBar';
