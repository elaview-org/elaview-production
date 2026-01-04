// src/components/ui/ImageLightbox.tsx
"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageLightboxProps {
  /** Single image URL or array of image URLs for gallery */
  images: string | string[];
  /** Alt text for accessibility */
  alt: string;
  /** Whether the lightbox is open */
  isOpen: boolean;
  /** Callback when lightbox should close */
  onClose: () => void;
  /** Initial index for gallery mode (default: 0) */
  initialIndex?: number;
  /** Optional callback when image index changes in gallery mode */
  onIndexChange?: (index: number) => void;
}

/**
 * Reusable image lightbox component with full-screen modal view
 *
 * Features:
 * - Full-screen overlay with backdrop blur
 * - object-contain to show complete image (no cropping)
 * - Handles both portrait and landscape orientations
 * - Gallery mode with prev/next navigation
 * - Keyboard support (ESC to close, arrows for gallery)
 * - Click backdrop to close
 * - Smooth animations with Framer Motion
 *
 * @example
 * // Single image
 * <ImageLightbox
 *   images="https://example.com/image.jpg"
 *   alt="Product photo"
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 * />
 *
 * @example
 * // Gallery mode
 * <ImageLightbox
 *   images={['img1.jpg', 'img2.jpg', 'img3.jpg']}
 *   alt="Space photos"
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   initialIndex={0}
 * />
 */
export function ImageLightbox({
  images,
  alt,
  isOpen,
  onClose,
  initialIndex = 0,
  onIndexChange,
}: ImageLightboxProps) {
  const imageArray = Array.isArray(images) ? images : [images];
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [imageLoaded, setImageLoaded] = useState(false);
  const isGallery = imageArray.length > 1;

  // Reset loaded state when image changes
  useEffect(() => {
    setImageLoaded(false);
  }, [currentIndex]);

  // Sync initial index
  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  // Notify parent of index changes
  useEffect(() => {
    if (isOpen && onIndexChange) {
      onIndexChange(currentIndex);
    }
  }, [currentIndex, isOpen, onIndexChange]);

  // Navigation functions
  const goToNext = useCallback(() => {
    if (isGallery) {
      setCurrentIndex((prev) => (prev + 1) % imageArray.length);
    }
  }, [isGallery, imageArray.length]);

  const goToPrev = useCallback(() => {
    if (isGallery) {
      setCurrentIndex((prev) => (prev - 1 + imageArray.length) % imageArray.length);
    }
  }, [isGallery, imageArray.length]);

  // Keyboard support
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          goToPrev();
          break;
        case 'ArrowRight':
          e.preventDefault();
          goToNext();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, goToNext, goToPrev]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const currentImage = imageArray[currentIndex];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm"
          onClick={onClose}
        >
          {/* Close button */}
          <motion.button
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors backdrop-blur-sm border border-white/20"
            aria-label="Close lightbox"
          >
            <X className="h-6 w-6 text-white" />
          </motion.button>

          {/* Image counter for galleries */}
          {isGallery && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="absolute top-4 left-4 z-10 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20"
            >
              <span className="text-sm font-medium text-white">
                {currentIndex + 1} / {imageArray.length}
              </span>
            </motion.div>
          )}

          {/* Main image container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative max-w-7xl max-h-[90vh] w-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Loading skeleton */}
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin" />
              </div>
            )}

            {/* Image */}
            <motion.img
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: imageLoaded ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              src={currentImage}
              alt={`${alt} - Image ${currentIndex + 1} of ${imageArray.length}`}
              className="max-w-full max-h-[90vh] w-auto h-auto object-contain rounded-xl border border-white/10 shadow-2xl"
              onLoad={() => setImageLoaded(true)}
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800';
                setImageLoaded(true);
              }}
            />

            {/* Gallery navigation - Previous */}
            {isGallery && imageArray.length > 1 && (
              <>
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  onClick={goToPrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all backdrop-blur-sm border border-white/20 group"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
                </motion.button>

                {/* Gallery navigation - Next */}
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all backdrop-blur-sm border border-white/20 group"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
                </motion.button>
              </>
            )}
          </motion.div>

          {/* Gallery thumbnails/dots */}
          {isGallery && imageArray.length <= 10 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 px-4 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20"
            >
              {imageArray.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(index);
                  }}
                  className={`h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? 'w-8 bg-white'
                      : 'w-2 bg-white/40 hover:bg-white/60'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                  aria-current={index === currentIndex ? 'true' : 'false'}
                />
              ))}
            </motion.div>
          )}

          {/* Keyboard hints */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute bottom-4 right-4 px-3 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 text-xs text-white/60"
          >
            Press <kbd className="px-1.5 py-0.5 bg-white/20 rounded mx-1">ESC</kbd> to close
            {isGallery && (
              <>
                {' • '}
                <kbd className="px-1.5 py-0.5 bg-white/20 rounded mx-1">←</kbd>
                <kbd className="px-1.5 py-0.5 bg-white/20 rounded mx-1">→</kbd>
                {' to navigate'}
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
