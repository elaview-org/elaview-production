// src/app/(space-owner)/spaces/[id]/edit/page.tsx - WITH PROPER CLOUDINARY UPLOAD
"use client";

import { useParams, useRouter } from 'next/navigation';
import { api } from '../../../../../../../elaview-mvp/src/trpc/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  AlertCircle,
  Lock,
  Save,
  Loader2,
  Users,
  Info,
  ArrowLeft
} from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MultiImageUpload } from '../../../../../../../elaview-mvp/src/components/forms/MultiImageUpload';

const SPACE_TYPE_OPTIONS = [
  { value: 'BILLBOARD', label: 'Billboard' },
  { value: 'STOREFRONT', label: 'Storefront' },
  { value: 'TRANSIT', label: 'Transit' },
  { value: 'DIGITAL_DISPLAY', label: 'Digital Display' },
  { value: 'WINDOW_DISPLAY', label: 'Window Display' },
  { value: 'VEHICLE_WRAP', label: 'Vehicle Wrap' },
  { value: 'OTHER', label: 'Other' },
];

const editSpaceSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  type: z.enum(['BILLBOARD', 'STOREFRONT', 'TRANSIT', 'DIGITAL_DISPLAY', 'WINDOW_DISPLAY', 'VEHICLE_WRAP', 'OTHER']),
  pricePerDay: z.number().min(1, 'Price must be at least $1'),
  installationFee: z.number().min(0, 'Installation fee cannot be negative'),
  width: z.number().min(0.1, 'Width must be greater than 0'),
  height: z.number().min(0.1, 'Height must be greater than 0'),
  traffic: z.string().optional(),
});

type EditSpaceForm = z.infer<typeof editSpaceSchema>;

export default function EditSpacePage() {
  const params = useParams();
  const router = useRouter();
  const spaceId = params.id as string;

  const [images, setImages] = useState<string[]>([]);

  const { data: space, isLoading } = api.spaces.getById.useQuery({ id: spaceId });
  const { data: activeBookings } = api.bookings.getActiveBookingsBySpace.useQuery({ spaceId });

  const updateSpaceMutation = api.spaces.update.useMutation({
    onSuccess: () => {
      router.push(`/spaces/${spaceId}`);
    },
    onError: (error) => {
      alert(`Error updating space: ${error.message}`);
    },
  });

  const form = useForm<EditSpaceForm>({
    resolver: zodResolver(editSpaceSchema),
  });

  // Pre-fill form when space data loads
  useEffect(() => {
    if (space) {
      form.reset({
        title: space.title,
        description: space.description || '',
        type: space.type as any,
        pricePerDay: Number(space.pricePerDay),
        installationFee: Number(space.installationFee || 0),
        width: space.width ?? 0,
        height: space.height ?? 0,
        traffic: space.traffic || '',
      });
      // Set existing images
      setImages(space.images || []);
    }
  }, [space, form]);

  const hasActiveBookings = (activeBookings?.length ?? 0) > 0;

  // Calculate dimensions preview
  const watchWidth = form.watch('width');
  const watchHeight = form.watch('height');
  const dimensionsPreview = watchWidth && watchHeight
    ? `${watchWidth}' × ${watchHeight}' (${(watchWidth * watchHeight).toFixed(1)} sq ft)`
    : '';

  const onSubmit = (data: EditSpaceForm) => {
    if (images.length === 0) {
      alert('❌ At least one image is required');
      return;
    }

    const updates: any = {
      id: spaceId,
      title: data.title,
      description: data.description,
      pricePerDay: data.pricePerDay,
      installationFee: data.installationFee,
      traffic: data.traffic || null,
      images: images,
    };

    // Only allow type/dimension changes if no active bookings
    if (!hasActiveBookings) {
      updates.type = data.type;
      updates.width = data.width;
      updates.height = data.height;
      updates.dimensionsText = `${data.width}' × ${data.height}'`;
    }

    // If rejected, also update status to pending
    if (space?.status === 'REJECTED') {
      updates.status = 'PENDING_APPROVAL';
      updates.rejectionReason = null;
    }

    updateSpaceMutation.mutate(updates);
  };

  if (isLoading) {
    return (
      <div className="h-full w-full p-4">
        <div className="h-full bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden flex flex-col">
          <div className="flex-shrink-0 p-6 border-b border-slate-700">
            <h1 className="text-3xl font-bold text-white">Edit Space</h1>
            <p className="text-slate-400 mt-2">Update your space information</p>
          </div>
          <div className="flex-1 overflow-y-auto p-6 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-10 w-10 animate-spin text-green-500" />
              <p className="text-sm text-slate-400">Loading space...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!space) {
    return (
      <div className="h-full w-full p-4">
        <div className="h-full bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden flex flex-col">
          <div className="flex-shrink-0 p-6 border-b border-slate-700">
            <h1 className="text-3xl font-bold text-white">Space Not Found</h1>
            <p className="text-slate-400 mt-2">The space you're looking for doesn't exist</p>
          </div>
          <div className="flex-1 overflow-y-auto p-6 flex items-center justify-center">
            <div className="text-center">
              <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Space Not Found</h2>
              <Link
                href="/spaces"
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
              >
                Back to My Spaces
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full p-4">
      <div className="h-full bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden flex flex-col">
        {/* Header - Fixed */}
        <div className="flex-shrink-0 p-6 border-b border-slate-700">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push(`/spaces/${spaceId}`)}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">Edit Space</h1>
              <p className="text-slate-400">Update your space information</p>
            </div>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Rejection Notice */}
            {space.status === 'REJECTED' && space.rejectionReason && (
              <div className="bg-red-500/10 border-2 border-red-500/30 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-6 w-6 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-red-400 font-semibold text-lg mb-2">Space Rejected</h3>
                    <p className="text-slate-300 mb-3">{space.rejectionReason}</p>
                    <p className="text-sm text-slate-400">
                      Please fix the issues above and save your changes. Your space will be re-submitted for approval automatically.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Active Bookings Warning */}
            {hasActiveBookings && (
              <div className="bg-orange-500/10 border-2 border-orange-500/30 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <Users className="h-6 w-6 text-orange-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-orange-400 font-semibold text-lg mb-2">
                      Active Bookings ({activeBookings?.length})
                    </h3>
                    <p className="text-slate-300 mb-3">
                      This space has {activeBookings?.length} active booking{activeBookings?.length !== 1 ? 's' : ''}.
                      Some fields are locked to protect advertisers.
                    </p>
                    <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3 mt-3">
                      <p className="text-sm text-slate-300 font-medium mb-2">🔒 Locked Fields:</p>
                      <ul className="text-sm text-slate-400 space-y-1 ml-4">
                        <li>• Space Type (affects campaign compatibility)</li>
                        <li>• Dimensions (affects ad size and visibility)</li>
                      </ul>
                    </div>
                    <p className="text-xs text-slate-500 mt-3">
                      💡 To modify locked fields, contact support or wait until active campaigns complete.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 shadow-xl">
                <h2 className="text-xl font-semibold text-white mb-6">Basic Information</h2>

                <div className="space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Space Title *
                    </label>
                    <input
                      type="text"
                      {...form.register('title')}
                      className={`w-full px-3 py-2 bg-slate-900 border rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all ${
                        form.formState.errors.title ? 'border-red-500' : 'border-slate-600'
                      }`}
                      placeholder="e.g., Downtown Billboard on Main Street"
                    />
                    {form.formState.errors.title && (
                      <p className="text-red-400 text-sm mt-1">{form.formState.errors.title.message}</p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Description *
                    </label>
                    <textarea
                      {...form.register('description')}
                      rows={4}
                      className={`w-full px-3 py-2 bg-slate-900 border rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all resize-none ${
                        form.formState.errors.description ? 'border-red-500' : 'border-slate-600'
                      }`}
                      placeholder="Describe your advertising space, its visibility, and any unique features..."
                    />
                    {form.formState.errors.description && (
                      <p className="text-red-400 text-sm mt-1">{form.formState.errors.description.message}</p>
                    )}
                  </div>

                  {/* Space Type - Conditionally Locked */}
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2 flex items-center gap-2">
                      Space Type *
                      {hasActiveBookings && (
                        <span className="flex items-center gap-1 text-xs font-normal text-orange-400">
                          <Lock className="h-3 w-3" />
                          Locked (active bookings)
                        </span>
                      )}
                    </label>
                    <select
                      {...form.register('type')}
                      disabled={hasActiveBookings}
                      className={`w-full px-3 py-2 bg-slate-900 border rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all ${
                        hasActiveBookings ? 'opacity-60 cursor-not-allowed' : ''
                      } ${form.formState.errors.type ? 'border-red-500' : 'border-slate-600'}`}
                    >
                      {SPACE_TYPE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {hasActiveBookings && (
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                        <Info className="h-3 w-3" />
                        Cannot change space type while campaigns are active
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 shadow-xl">
                <h2 className="text-xl font-semibold text-white mb-6">Pricing</h2>

                {hasActiveBookings && (
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
                    <p className="text-sm text-blue-300 flex items-center gap-2">
                      <Info className="h-4 w-4" />
                      Price changes only affect future bookings. Active bookings keep their original price.
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Price per Day * ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      {...form.register('pricePerDay', { valueAsNumber: true })}
                      className={`w-full px-3 py-2 bg-slate-900 border rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all ${
                        form.formState.errors.pricePerDay ? 'border-red-500' : 'border-slate-600'
                      }`}
                      placeholder="50.00"
                    />
                    {form.formState.errors.pricePerDay && (
                      <p className="text-red-400 text-sm mt-1">{form.formState.errors.pricePerDay.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Installation Fee ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      {...form.register('installationFee', { valueAsNumber: true })}
                      className={`w-full px-3 py-2 bg-slate-900 border rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all ${
                        form.formState.errors.installationFee ? 'border-red-500' : 'border-slate-600'
                      }`}
                      placeholder="0.00"
                    />
                    {form.formState.errors.installationFee && (
                      <p className="text-red-400 text-sm mt-1">{form.formState.errors.installationFee.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Dimensions - Conditionally Locked */}
              <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 shadow-xl">
                <h2 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
                  Dimensions
                  {hasActiveBookings && (
                    <span className="flex items-center gap-1 text-sm font-normal text-orange-400">
                      <Lock className="h-4 w-4" />
                      Locked (active bookings)
                    </span>
                  )}
                </h2>
                <p className="text-sm text-slate-400 mb-6">
                  Specify your space dimensions in feet
                </p>

                {hasActiveBookings && (
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4 mb-6">
                    <p className="text-sm text-orange-300 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      Dimensions are locked because they affect advertiser campaigns. Contact support to request changes.
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Width * (feet)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      disabled={hasActiveBookings}
                      {...form.register('width', { valueAsNumber: true })}
                      className={`w-full px-3 py-2 bg-slate-900 border rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all ${
                        hasActiveBookings ? 'opacity-60 cursor-not-allowed' : ''
                      } ${form.formState.errors.width ? 'border-red-500' : 'border-slate-600'}`}
                      placeholder="4.0"
                    />
                    {form.formState.errors.width && (
                      <p className="text-red-400 text-sm mt-1">{form.formState.errors.width.message}</p>
                    )}
                    <p className="text-xs text-slate-500 mt-1">
                      Enter width in feet (e.g., 4.0 for 4 feet)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Height * (feet)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      disabled={hasActiveBookings}
                      {...form.register('height', { valueAsNumber: true })}
                      className={`w-full px-3 py-2 bg-slate-900 border rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all ${
                        hasActiveBookings ? 'opacity-60 cursor-not-allowed' : ''
                      } ${form.formState.errors.height ? 'border-red-500' : 'border-slate-600'}`}
                      placeholder="2.0"
                    />
                    {form.formState.errors.height && (
                      <p className="text-red-400 text-sm mt-1">{form.formState.errors.height.message}</p>
                    )}
                    <p className="text-xs text-slate-500 mt-1">
                      Enter height in feet (e.g., 2.0 for 2 feet)
                    </p>
                  </div>
                </div>

                {dimensionsPreview && !hasActiveBookings && (
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 mt-4">
                    <p className="text-sm text-green-400">
                      <strong>Dimensions:</strong> {dimensionsPreview}
                    </p>
                  </div>
                )}
              </div>

              {/* Additional Details */}
              <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 shadow-xl">
                <h2 className="text-xl font-semibold text-white mb-6">Additional Details</h2>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Estimated Traffic
                  </label>
                  <input
                    type="text"
                    {...form.register('traffic')}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    placeholder="e.g., 50,000 daily impressions"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Optional: Help advertisers understand your space's visibility
                  </p>
                </div>
              </div>

              {/* Images - NOW USING MultiImageUpload COMPONENT */}
              <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 shadow-xl">
                <h2 className="text-xl font-semibold text-white mb-2">
                  Space Images * (Max 5 images)
                </h2>
                <p className="text-sm text-slate-400 mb-6">
                  Upload high-quality photos of your advertising space. First image will be the cover photo.
                </p>

                <MultiImageUpload
                  value={images}
                  onChange={setImages}
                  maxImages={5}
                  disabled={updateSpaceMutation.isPending}
                />

                {images.length === 0 && (
                  <p className="text-xs text-red-400 mt-2">
                    ⚠️ At least one image is required
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-between pt-6 border-t border-slate-700">
                <Link
                  href={`/spaces/${spaceId}`}
                  className="px-4 py-2 text-slate-300 border border-slate-600 rounded-lg hover:bg-slate-900/50 transition-all"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={updateSpaceMutation.isPending || images.length === 0}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium flex items-center"
                >
                  {updateSpaceMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {space.status === 'REJECTED' ? 'Save & Re-submit for Approval' : 'Save Changes'}
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Help Text */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-blue-400 mb-1">Pro Tip</h3>
                  <p className="text-sm text-blue-300">
                    {hasActiveBookings
                      ? "Some fields are locked to protect active campaigns. Price changes will only affect new bookings."
                      : "All changes are subject to review if your space was previously rejected. Make sure all information is accurate before saving."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
