// src/components/forms/ImageUpload.tsx
"use client";

import { useState, useRef } from 'react';
import { Upload, X, Loader2, AlertCircle, CheckCircle, Info, Image as ImageIcon, Eye } from 'lucide-react';
import { CldUploadWidget } from 'next-cloudinary';
import { ImageLightbox } from '../ui/ImageLightbox';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  disabled?: boolean;
  className?: string;
}

interface ImageInfo {
  width: number;
  height: number;
  aspectRatio: string;
  fileSize: number;
  meetsMinimum: boolean;
  isRecommended: boolean;
  warnings: string[];
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  disabled = false,
  className = ''
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string>('');
  const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Minimum requirements (hard blocks)
  const MIN_WIDTH = 1920;
  const MIN_HEIGHT = 1080;
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  // Recommended for best quality
  const RECOMMENDED_WIDTH = 3840;
  const RECOMMENDED_HEIGHT = 2160;

  // Common aspect ratios for advertising
  const ASPECT_RATIOS: Record<string, string> = {
    '16:9': 'Widescreen (billboards, digital displays)',
    '4:3': 'Standard (traditional displays)',
    '9:16': 'Portrait (vertical displays, mobile)',
    '1:1': 'Square (storefronts, social)',
    '21:9': 'Ultra-wide (panoramic displays)'
  };

  const calculateAspectRatio = (width: number, height: number): string => {
    const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
    const divisor = gcd(width, height);
    return `${width / divisor}:${height / divisor}`;
  };

  const getAspectRatioName = (ratio: string): string => {
    return ASPECT_RATIOS[ratio] || `Custom (${ratio})`;
  };

  const validateImageDimensions = (file: File): Promise<ImageInfo> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(objectUrl);

        const width = img.width;
        const height = img.height;
        const fileSize = file.size;
        const aspectRatio = calculateAspectRatio(width, height);
        const meetsMinimum = width >= MIN_WIDTH && height >= MIN_HEIGHT;
        const isRecommended = width >= RECOMMENDED_WIDTH && height >= RECOMMENDED_HEIGHT;
        const warnings: string[] = [];

        // Check if below minimum (HARD ERROR)
        if (!meetsMinimum) {
          reject(new Error(
            `Image dimensions too small. Minimum required: ${MIN_WIDTH}x${MIN_HEIGHT}px. Your image: ${width}x${height}px. This ensures your ad looks sharp on all display types.`
          ));
          return;
        }

        // Check if below recommended (WARNING)
        if (!isRecommended) {
          warnings.push(
            `For best quality on large displays, we recommend ${RECOMMENDED_WIDTH}x${RECOMMENDED_HEIGHT}px (4K). Your image is ${width}x${height}px.`
          );
        }

        // Check file size
        if (fileSize > MAX_FILE_SIZE) {
          reject(new Error(
            `File size too large. Maximum: ${MAX_FILE_SIZE / 1024 / 1024}MB. Your file: ${(fileSize / 1024 / 1024).toFixed(2)}MB.`
          ));
          return;
        }

        // Aspect ratio recommendations
        const knownRatio = ASPECT_RATIOS[aspectRatio];
        if (!knownRatio) {
          warnings.push(
            `Unusual aspect ratio detected (${aspectRatio}). Standard advertising ratios are 16:9, 4:3, 9:16, or 1:1. Your image may not fit all display types.`
          );
        }

        resolve({
          width,
          height,
          aspectRatio,
          fileSize,
          meetsMinimum,
          isRecommended,
          warnings
        });
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Failed to load image. Please ensure the file is a valid image.'));
      };

      img.src = objectUrl;
    });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError('');
    setImageInfo(null);

    try {
      const info = await validateImageDimensions(file);
      setImageInfo(info);
      
      // If validation passes, trigger Cloudinary upload via the widget
      // We'll store the file temporarily and let user confirm
      console.log('Validation passed:', info);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to validate image');
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const formatFileSize = (bytes: number): string => {
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  return (
    <div className={className}>
      {value ? (
        <div className="space-y-3">
          {/* Image Preview */}
          <div className="relative group">
            <div
              className="relative cursor-pointer"
              onClick={() => setIsLightboxOpen(true)}
            >
              <img
                src={value}
                alt="Upload preview"
                className="w-full h-64 object-contain rounded-lg border-2 border-gray-200 bg-slate-50"
              />
              {/* Hover overlay to indicate clickable */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-3">
                  <Eye className="h-6 w-6 text-gray-700" />
                </div>
              </div>
            </div>
            {!disabled && onRemove && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors z-10"
              >
                <X className="h-4 w-4 text-gray-600" />
              </button>
            )}
          </div>

          {/* Lightbox for full-size preview */}
          <ImageLightbox
            images={value}
            alt="Campaign creative preview"
            isOpen={isLightboxOpen}
            onClose={() => setIsLightboxOpen(false)}
          />

          {/* Image Info Display */}
          {imageInfo && (
            <div className="bg-slate-800 rounded-lg p-4 space-y-3">
              <div className="flex items-center text-sm text-slate-300">
                <ImageIcon className="h-4 w-4 mr-2 text-slate-400" />
                <span className="font-medium">Image Details</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-slate-500">Dimensions:</span>
                  <span className="ml-2 text-white font-mono">
                    {imageInfo.width} x {imageInfo.height}px
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">File Size:</span>
                  <span className="ml-2 text-white font-mono">
                    {formatFileSize(imageInfo.fileSize)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Aspect Ratio:</span>
                  <span className="ml-2 text-white">
                    {imageInfo.aspectRatio}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Quality:</span>
                  <span className={`ml-2 font-medium ${
                    imageInfo.isRecommended ? 'text-green-400' : 'text-yellow-400'
                  }`}>
                    {imageInfo.isRecommended ? '4K Quality ✓' : 'HD Quality'}
                  </span>
                </div>
              </div>

              {imageInfo.warnings.length > 0 && (
                <div className="pt-3 border-t border-slate-700">
                  {imageInfo.warnings.map((warning, index) => (
                    <div key={index} className="flex items-start text-xs text-yellow-400 mb-2 last:mb-0">
                      <Info className="h-3 w-3 mr-1.5 mt-0.5 flex-shrink-0" />
                      <span>{warning}</span>
                    </div>
                  ))}
                </div>
              )}

              {imageInfo.meetsMinimum && (
                <div className="flex items-center text-xs text-green-400 pt-2 border-t border-slate-700">
                  <CheckCircle className="h-3 w-3 mr-1.5" />
                  <span>Meets minimum requirements for all advertising spaces</span>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <>
          <CldUploadWidget
            uploadPreset="elaview-campaigns"
            onSuccess={(result: any) => {
              console.log('Upload success:', result);
              onChange(result.info.secure_url);
              setIsUploading(false);
              setError('');
              
              // Set image info from uploaded result
              setImageInfo({
                width: result.info.width,
                height: result.info.height,
                aspectRatio: calculateAspectRatio(result.info.width, result.info.height),
                fileSize: result.info.bytes,
                meetsMinimum: result.info.width >= MIN_WIDTH && result.info.height >= MIN_HEIGHT,
                isRecommended: result.info.width >= RECOMMENDED_WIDTH && result.info.height >= RECOMMENDED_HEIGHT,
                warnings: []
              });
            }}
            onError={(error: any) => {
              console.error('Upload error:', error);
              setError('Failed to upload image. Please try again.');
              setIsUploading(false);
            }}
            onClose={() => {
              // Handle when user closes/cancels the widget
              console.log('Upload widget closed');
              setIsUploading(false);
            }}
            options={{
              maxFiles: 1,
              maxFileSize: MAX_FILE_SIZE,
              clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
              folder: 'campaigns',
              // Cloudinary validation
              minImageWidth: MIN_WIDTH,
              minImageHeight: MIN_HEIGHT,
            }}
          >
            {({ open }) => (
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsUploading(true);
                    setError('');
                    open();
                  }}
                  disabled={disabled || isUploading}
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-10 w-10 text-blue-500 mb-3 animate-spin" />
                      <p className="text-sm text-gray-500">Uploading...</p>
                    </>
                  ) : (
                    <>
                      <Upload className="h-10 w-10 text-gray-400 mb-3" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF, WebP up to 10MB</p>
                    </>
                  )}
                </button>

                {/* Requirements Info Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <Info className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-blue-900">Image Requirements</h4>
                      
                      <div className="text-xs text-blue-800 space-y-1">
                        <div className="flex items-center">
                          <CheckCircle className="h-3 w-3 mr-1.5 text-blue-600" />
                          <span><strong>Minimum:</strong> 1920 x 1080 pixels (Full HD)</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="h-3 w-3 mr-1.5 text-blue-600" />
                          <span><strong>Recommended:</strong> 3840 x 2160 pixels (4K) for best quality</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="h-3 w-3 mr-1.5 text-blue-600" />
                          <span><strong>Aspect Ratios:</strong> 16:9 (landscape), 9:16 (portrait), 4:3, or 1:1</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="h-3 w-3 mr-1.5 text-blue-600" />
                          <span><strong>Max Size:</strong> 10MB</span>
                        </div>
                      </div>

                      <p className="text-xs text-blue-700 pt-2 border-t border-blue-200">
                        💡 <strong>Why these requirements?</strong> Your ad will be displayed on various screens 
                        from digital billboards to storefront displays. These dimensions ensure it looks 
                        sharp everywhere!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CldUploadWidget>
        </>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-red-900">Upload Error</h4>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}