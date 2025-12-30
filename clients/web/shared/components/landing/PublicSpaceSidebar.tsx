"use client";

import React from 'react';
import { X, Star, MapPin, DollarSign, Eye, Calendar, Image as ImageIcon } from 'lucide-react';
import type { RouterOutputs } from '../../../../elaview-mvp/src/trpc/react';

type SpaceFromAPI = RouterOutputs['spaces']['browsePublic']['spaces'][number];

interface PublicSpaceSidebarProps {
  space: SpaceFromAPI;
  onClose: () => void;
  onSignUp: () => void;
}

export function PublicSpaceSidebar({ space, onClose, onSignUp }: PublicSpaceSidebarProps) {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const hasMultipleImages = space.images && space.images.length > 1;

  const nextImage = () => {
    if (space.images && space.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % space.images.length);
    }
  };

  const prevImage = () => {
    if (space.images && space.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + space.images.length) % space.images.length);
    }
  };

  return (
    <div className="absolute right-4 top-4 bottom-4 w-full max-w-md z-40">
      <div className="h-full bg-slate-900 border border-slate-800 shadow-2xl overflow-y-auto rounded-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all z-10"
        >
          <X className="h-5 w-5" />
        </button>
        
        {/* Image Gallery */}
        <div className="relative h-64 bg-slate-800 group">
          {space.images && space.images.length > 0 ? (
            <>
              <img
                src={space.images[currentImageIndex]}
                alt={`${space.title} - Image ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
              />
              
              {/* Image Navigation */}
              {hasMultipleImages && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all opacity-0 group-hover:opacity-100"
                  >
                    ‹
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all opacity-0 group-hover:opacity-100"
                  >
                    ›
                  </button>
                  
                  {/* Image Counter */}
                  <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 backdrop-blur-sm rounded-md text-xs font-medium text-white flex items-center gap-1 border border-white/20">
                    <ImageIcon className="h-3 w-3" />
                    {currentImageIndex + 1} / {space.images.length}
                  </div>
                  
                  {/* Dots Indicator */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                    {space.images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          idx === currentImageIndex ? 'bg-white w-4' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <MapPin className="h-12 w-12 text-slate-600" />
            </div>
          )}
          
          <div className="absolute top-4 left-4 px-3 py-1 bg-slate-900/90 backdrop-blur-sm rounded-md text-sm font-medium text-white border border-slate-700">
            {space.type.replace('_', ' ')}
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            {space.title}
          </h2>
          
          <div className="flex items-center gap-2 text-slate-400 mb-4">
            <MapPin className="h-4 w-4" />
            <span>{space.city}, {space.state}</span>
          </div>
          
          {/* Price */}
          <div className="flex items-baseline gap-2 mb-6">
            <DollarSign className="h-5 w-5 text-slate-400" />
            <span className="text-3xl font-bold text-white">
              ${Number(space.pricePerDay)}
            </span>
            <span className="text-slate-400">/day</span>
          </div>
          
          {/* Description */}
          {space.description && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-white mb-2">Description</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                {space.description}
              </p>
            </div>
          )}
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Always show estimated impressions placeholder */}
            <div className="bg-slate-800 rounded-lg p-4">
              <div className="text-slate-400 text-sm mb-1 flex items-center gap-1">
                <Eye className="h-4 w-4" />
                Impressions
              </div>
              <div className="text-white font-semibold">
                50K+/day
              </div>
            </div>
            
            {/* Show rating if available */}
            {space.averageRating !== null && space.averageRating > 0 && (
              <div className="bg-slate-800 rounded-lg p-4">
                <div className="text-slate-400 text-sm mb-1">Rating</div>
                <div className="text-white font-semibold flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  {space.averageRating.toFixed(1)}
                </div>
              </div>
            )}
            
            {/* Show bookings count if available */}
            {space.totalBookings > 0 && (
              <div className="bg-slate-800 rounded-lg p-4">
                <div className="text-slate-400 text-sm mb-1 flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Bookings
                </div>
                <div className="text-white font-semibold">
                  {space.totalBookings}
                </div>
              </div>
            )}
          </div>
          
          {/* Dimensions */}
          {(space.width || space.height) && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-white mb-2">Dimensions</h3>
              <p className="text-slate-300 text-sm">
                {space.width && space.height 
                  ? `${space.width}" W × ${space.height}" H`
                  : space.width 
                  ? `${space.width}" Wide`
                  : `${space.height}" High`
                }
              </p>
            </div>
          )}
          
          {/* CTA */}
          <button
            onClick={onSignUp}
            className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold shadow-lg"
          >
            Sign Up to Book This Space
          </button>
          
          <p className="text-center text-slate-500 text-sm mt-3">
            No credit card required
          </p>
        </div>
      </div>
    </div>
  );
}