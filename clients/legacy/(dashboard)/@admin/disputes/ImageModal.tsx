"use client";

import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

interface ImageModalProps {
  isOpen: boolean;
  images: string[];
  currentIndex: number;
  title: string;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export function ImageModal({
  isOpen,
  images,
  currentIndex,
  title,
  onClose,
  onNext,
  onPrev,
}: ImageModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 rounded-full bg-slate-800/50 p-2 text-white transition-colors hover:bg-slate-700"
      >
        <X className="h-6 w-6" />
      </button>

      {images.length > 1 && currentIndex > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          className="absolute left-4 z-10 rounded-full bg-slate-800/50 p-2 text-white transition-colors hover:bg-slate-700"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}

      <div className="max-h-full max-w-full" onClick={(e) => e.stopPropagation()}>
        <Image
          src={images[currentIndex]!}
          alt={`${title} ${currentIndex + 1}`}
          className="max-h-[85vh] max-w-full rounded-xl border border-slate-700 shadow-2xl"
        />
      </div>

      {images.length > 1 && currentIndex < images.length - 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="absolute right-4 z-10 rounded-full bg-slate-800/50 p-2 text-white transition-colors hover:bg-slate-700"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      )}

      <div className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-full bg-slate-900/80 px-4 py-2 text-sm text-white backdrop-blur">
        {title}: {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
}
