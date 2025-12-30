// src/components/forms/MultiImageUpload.tsx
"use client";

import { useState, useRef, useEffect } from 'react';
import { Upload, X, Loader2, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { CldUploadWidget } from 'next-cloudinary';

interface MultiImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  maxImages?: number;
  disabled?: boolean;
  className?: string;
}

export function MultiImageUpload({
  value = [],
  onChange,
  maxImages = 5,
  disabled = false,
  className = ''
}: MultiImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string>('');
  
  // ✅ FIX: Use ref to always have latest value
  const valueRef = useRef(value);
  
  // ✅ Update ref whenever value changes
  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const handleRemove = (indexToRemove: number) => {
    const newImages = value.filter((_, index) => index !== indexToRemove);
    onChange(newImages);
  };

  const handleUploadSuccess = (result: any) => {
    console.log('Upload success:', result);
    // ✅ FIX: Use ref to get latest value, not closure
    const currentImages = valueRef.current;
    console.log('Current value from ref:', currentImages);
    const newUrl = result.info.secure_url;
    
    if (currentImages.length < maxImages) {
      const updatedImages = [...currentImages, newUrl];
      console.log('New array after adding:', updatedImages);
      onChange(updatedImages);
      setIsUploading(false);
      setError('');
    } else {
      setError(`Maximum ${maxImages} images allowed`);
      setIsUploading(false);
    }
  };

  const canUploadMore = value.length < maxImages;

  return (
    <div className={className}>
      <div className="space-y-4">
        {/* Show uploaded images */}
        {value.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {value.map((url, index) => (
              <div key={url} className="relative group">
                <img
                  src={url}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border-2 border-slate-700"
                />
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1.5 shadow-md hover:bg-red-700 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                  {index === 0 ? '📸 Cover Photo' : `Photo ${index + 1}`}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upload button */}
        {canUploadMore && (
          <CldUploadWidget
            uploadPreset="elaview-spaces"
            onSuccess={handleUploadSuccess}
            onError={(error: any) => {
              console.error('Upload error:', error);
              setError('Failed to upload image. Please try again.');
              setIsUploading(false);
            }}
            onOpen={() => {
              setIsUploading(true);
              setError('');
            }}
            onClose={() => {
              setIsUploading(false);
            }}
            options={{
              maxFiles: 1,
              maxFileSize: 5000000,
              clientAllowedFormats: ['jpg', 'png', 'gif', 'webp', 'jpeg'],
              folder: 'spaces',
              resourceType: 'image',
            }}
          >
            {({ open }) => (
              <button
                type="button"
                onClick={() => open()}
                disabled={disabled || isUploading}
                className="flex flex-col items-center justify-center w-full h-40 border-2 border-slate-700 border-dashed rounded-lg cursor-pointer bg-slate-800/50 hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-10 w-10 text-green-500 mb-3 animate-spin" />
                    <p className="text-sm text-slate-300">Uploading to Cloudinary...</p>
                  </>
                ) : (
                  <>
                    <Upload className="h-10 w-10 text-slate-400 mb-3" />
                    <p className="mb-2 text-sm text-slate-300">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-slate-500">
                      PNG, JPG, GIF up to 5MB • {value.length}/{maxImages} uploaded
                    </p>
                    {value.length === 0 && (
                      <p className="text-xs text-green-400 mt-2">
                        📸 Tip: First image will be the cover photo
                      </p>
                    )}
                  </>
                )}
              </button>
            )}
          </CldUploadWidget>
        )}

        {/* Max images reached message */}
        {!canUploadMore && (
          <div className="flex items-center justify-center p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
            <ImageIcon className="h-5 w-5 text-green-400 mr-2" />
            <p className="text-sm text-green-300">
              ✅ Maximum {maxImages} images uploaded. Remove an image to add another.
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-2 flex items-center text-sm text-red-400">
          <AlertCircle className="h-4 w-4 mr-1" />
          {error}
        </div>
      )}
    </div>
  );
}