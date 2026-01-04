// src/components/browse/ImageCarousel.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ImageLightbox } from '../../ui/ImageLightbox';

interface ImageCarouselProps {
  images: string[];
  alt: string;
  height?: string;
  onImageChange?: (index: number) => void;
}

/**
 * High-performance image carousel with native-feeling swipe gestures
 *
 * Features:
 * - Horizontal swipe with spring physics (mimics iOS/Android)
 * - Velocity-based gesture detection for natural flicks
 * - Image preloading for instant transitions
 * - Pagination dots with active state
 * - Keyboard navigation (arrow keys)
 * - Touch and mouse drag support
 * - WCAG 2.1 AA compliant (44px touch targets)
 */
export function ImageCarousel({
  images,
  alt,
  height = 'h-48',
  onImageChange,
}: ImageCarouselProps) {
  const [[currentIndex, direction], setPage] = useState([0, 0]);
  const [dragStartX, setDragStartX] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Preload adjacent images for instant transitions
  useEffect(() => {
    const preloadImage = (src: string) => {
      const img = new Image();
      img.src = src;
    };

    // Preload next and previous images
    const nextIndex = (currentIndex + 1) % images.length;
    const prevIndex = (currentIndex - 1 + images.length) % images.length;

    if (images[nextIndex]) preloadImage(images[nextIndex]);
    if (images[prevIndex]) preloadImage(images[prevIndex]);
  }, [currentIndex, images]);

  // Notify parent of image changes
  useEffect(() => {
    onImageChange?.(currentIndex);
  }, [currentIndex, onImageChange]);

  const paginate = (newDirection: number) => {
    const newIndex = currentIndex + newDirection;

    // Wrap around: -1 -> last image, images.length -> first image
    const wrappedIndex = ((newIndex % images.length) + images.length) % images.length;

    setPage([wrappedIndex, newDirection]);
  };

  const handleDragStart = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setDragStartX(info.point.x);
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const dragDistance = info.point.x - dragStartX;
    const velocity = info.velocity.x;

    // Velocity-based detection: Fast flicks work even with small distance
    const isFlick = Math.abs(velocity) > 500;
    const threshold = 50; // Minimum drag distance for slow swipes

    if (isFlick || Math.abs(dragDistance) > threshold) {
      // Negative velocity/distance = swipe left = next image
      // Positive velocity/distance = swipe right = previous image
      if (dragDistance < 0 || velocity < 0) {
        paginate(1);
      } else {
        paginate(-1);
      }
    }
  };

  const goToImage = (index: number) => {
    const newDirection = index > currentIndex ? 1 : -1;
    setPage([index, newDirection]);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        paginate(-1);
      } else if (e.key === 'ArrowRight') {
        paginate(1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  // Single image: No carousel needed
  if (images.length === 1) {
    return (
      <>
        <div
          className={`relative ${height} bg-slate-800 rounded-xl overflow-hidden cursor-pointer group`}
          data-testid="image-carousel"
          onClick={() => setIsLightboxOpen(true)}
        >
          <img
            src={images[0]}
            alt={alt}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
            loading="eager"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800';
            }}
          />
          {/* Hover indicator */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-sm font-medium">
              Click to enlarge
            </div>
          </div>
        </div>

        {/* Lightbox for full-size view */}
        <ImageLightbox
          images={images[0]!}
          alt={alt}
          isOpen={isLightboxOpen}
          onClose={() => setIsLightboxOpen(false)}
        />
      </>
    );
  }

  // Animation variants with spring physics (iOS/Android-like feel)
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
    }),
  };

  // Spring configuration for natural motion
  const spring = {
    type: 'spring' as const,
    stiffness: 300,
    damping: 30,
    mass: 0.5,
  };

  return (
    <>
      <div className={`relative ${height} bg-slate-800 rounded-xl overflow-hidden group cursor-pointer`} data-testid="image-carousel">
        {/* Image Container with AnimatePresence for smooth transitions */}
        <div
          className="relative w-full h-full overflow-hidden"
          onClick={() => setIsLightboxOpen(true)}
        >
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.img
              key={currentIndex}
              src={images[currentIndex]}
              alt={`${alt} - Image ${currentIndex + 1} of ${images.length}`}
              className="absolute inset-0 w-full h-full object-cover"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={spring}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              loading="eager"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800';
              }}
              data-testid={`carousel-image-${currentIndex}`}
            />
          </AnimatePresence>

          {/* Hover indicator */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-sm font-medium">
              Click to enlarge
            </div>
          </div>
        </div>

      {/* Navigation Arrows (Desktop) - Hidden on mobile, visible on hover */}
      <motion.button
        onClick={(e) => {
          e.stopPropagation();
          paginate(-1);
        }}
        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-all opacity-0 group-hover:opacity-100 hidden sm:block z-10"
        aria-label="Previous image"
        initial={{ opacity: 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <ChevronLeft className="h-5 w-5" />
      </motion.button>

      <motion.button
        onClick={(e) => {
          e.stopPropagation();
          paginate(1);
        }}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-all opacity-0 group-hover:opacity-100 hidden sm:block z-10"
        aria-label="Next image"
        initial={{ opacity: 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <ChevronRight className="h-5 w-5" />
      </motion.button>

      {/* Pagination Dots - WCAG 2.1 AA compliant (44px touch targets) */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1 z-10" data-testid="carousel-pagination">
        {images.map((_, index) => (
          <motion.button
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              goToImage(index);
            }}
            className="p-2 min-w-11 min-h-11 flex items-center justify-center"
            aria-label={`Go to image ${index + 1} of ${images.length}`}
            aria-current={index === currentIndex ? 'true' : 'false'}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            data-testid={`carousel-dot-${index}`}
          >
            <motion.span
              className={`rounded-full transition-all ${
                index === currentIndex ? 'bg-white' : 'bg-white/60'
              }`}
              animate={{
                width: index === currentIndex ? 24 : 6,
                height: 6,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          </motion.button>
        ))}
      </div>

      {/* Image Counter (Screen Readers) */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Image {currentIndex + 1} of {images.length}
      </div>
    </div>

    {/* Lightbox for full-size gallery view */}
    <ImageLightbox
      images={images}
      alt={alt}
      isOpen={isLightboxOpen}
      onClose={() => setIsLightboxOpen(false)}
      initialIndex={currentIndex}
      onIndexChange={(index) => setPage([index, index > currentIndex ? 1 : -1])}
    />
  </>
  );
}
