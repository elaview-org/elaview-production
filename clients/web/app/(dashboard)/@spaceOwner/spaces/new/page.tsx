// src/app/spaces/new/page.tsx - COMPLETE WITH PRICING GUIDE
"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '../../../../../../elaview-mvp/src/trpc/react';
import {
  spaceSchemaStep1,
  spaceSchemaStep2,
  spaceSchemaStep3,
  spaceSchemaStep4,
  type SpaceStep1Data,
  type SpaceStep2Data,
  type SpaceStep3Data,
  type SpaceStep4Data
} from '../../../../../../elaview-mvp/src/schemas/space.schema';
import {
  ArrowLeft,
  Loader2,
  CheckCircle,
  Info,
  AlertCircle
} from 'lucide-react';
import { MultiImageUpload } from '../../../../../../elaview-mvp/src/components/forms/MultiImageUpload';
import { PlacesAutocompleteInput } from '../../../../../../elaview-mvp/src/components/forms/PlacesAutocompleteInput';
import PricingGuide from '../../../../../../elaview-mvp/src/components/pricing/PricingGuide';

const SPACE_TYPES = [
  { value: 'BILLBOARD', label: 'Billboard' },
  { value: 'STOREFRONT', label: 'Storefront' },
  { value: 'TRANSIT', label: 'Transit Advertising' },
  { value: 'DIGITAL_DISPLAY', label: 'Digital Display' },
  { value: 'WINDOW_DISPLAY', label: 'Window Display' },
  { value: 'VEHICLE_WRAP', label: 'Vehicle Wrap' },
  { value: 'OTHER', label: 'Other' }
] as const;

const US_STATES = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' }
] as const;

interface LocationData {
  latitude: number;
  longitude: number;
  formattedAddress: string;
  isValidated: boolean;
}

export default function AddSpacePage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  // Check Stripe Connect status
  const { data: stripeStatus } = api.billing.getConnectAccountStatus.useQuery();

  const [currentStep, setCurrentStep] = useState(1);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [locationData, setLocationData] = useState<LocationData | null>(null);

  const [step1Data, setStep1Data] = useState<SpaceStep1Data | null>(null);
  const [step2Data, setStep2Data] = useState<SpaceStep2Data | null>(null);
  const [step3Data, setStep3Data] = useState<SpaceStep3Data | null>(null);

  const form1 = useForm<SpaceStep1Data>({
    resolver: zodResolver(spaceSchemaStep1),
    defaultValues: step1Data || { title: '', description: '', type: 'BILLBOARD' as const }
  });

  const form2 = useForm<SpaceStep2Data>({
    resolver: zodResolver(spaceSchemaStep2),
    defaultValues: step2Data || { address: '', city: '', state: '', zipCode: '', latitude: 0, longitude: 0 }
  });

  const form3 = useForm<SpaceStep3Data>({
    resolver: zodResolver(spaceSchemaStep3),
    defaultValues: step3Data || { pricePerDay: 0, minDuration: 1 }
  });

  const form4 = useForm<SpaceStep4Data>({
    resolver: zodResolver(spaceSchemaStep4),
    defaultValues: { images: [] }
  });

  useEffect(() => {
    form4.setValue('images', imagePreviews, { shouldValidate: true });
  }, [imagePreviews, form4]);

  // Auto-generate dimensions text from width and height
  useEffect(() => {
    const width = form3.watch('width');
    const height = form3.watch('height');

    if (width && height) {
      const dimensionsText = `${width}' × ${height}'`;
      form3.setValue('dimensions', dimensionsText);
    }
  }, [form3.watch('width'), form3.watch('height')]);

  const createSpace = api.spaces.create.useMutation({
    onSuccess: () => {
      router.push('/spaces?created=true');
    },
    onError: (error) => {
      console.error('Error creating space:', error);
      alert(`❌ Failed to create space: ${error.message}`);
    }
  });

  const handlePlaceSelected = useCallback((place: any) => {
    console.log('📍 Place selected:', place);

    form2.setValue('address', place.address);
    form2.setValue('city', place.city);
    form2.setValue('state', place.state);
    form2.setValue('zipCode', place.zipCode || '');
    form2.setValue('latitude', place.latitude);
    form2.setValue('longitude', place.longitude);

    setLocationData({
      latitude: place.latitude,
      longitude: place.longitude,
      formattedAddress: place.formattedAddress,
      isValidated: true
    });

    form2.clearErrors();
  }, [form2]);

  const handleImagesChange = useCallback((urls: string[]) => {
    setImagePreviews(urls);
  }, []);

  const onStep1Submit = (data: SpaceStep1Data) => {
    setStep1Data(data);
    setCurrentStep(2);
  };

  const onStep2Submit = (data: SpaceStep2Data) => {
    if (!locationData?.isValidated) {
      alert('❌ Please select a valid address from the dropdown');
      return;
    }
    setStep2Data(data);
    setCurrentStep(3);
  };

  const onStep3Submit = (data: SpaceStep3Data) => {
    setStep3Data(data);
    setCurrentStep(4);
  };

  const onStep4Submit = async (data: SpaceStep4Data) => {
    if (!step1Data || !step2Data || !step3Data || data.images.length === 0) {
      alert('Please complete all steps and upload at least one image');
      return;
    }

    try {
      const spaceData = { ...step1Data, ...step2Data, ...step3Data, images: data.images };
      await createSpace.mutateAsync(spaceData);
    } catch (error) {
      console.error('Error creating space:', error);
    }
  };

  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  if (!isLoaded) {
    return (
      <div className="h-full w-full p-4">
        <div className="h-full bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden flex flex-col">
          <div className="flex-shrink-0 p-6 border-b border-slate-700">
            <h1 className="text-3xl font-bold text-white">Add New Space</h1>
            <p className="text-slate-400 mt-2">List your advertising space on our marketplace</p>
          </div>
          <div className="flex-1 overflow-y-auto p-6 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-10 w-10 animate-spin text-green-500" />
              <p className="text-sm text-slate-400">Loading...</p>
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
              onClick={() => router.push('/spaces')}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">Add New Space</h1>
              <p className="text-slate-400">List your advertising space on our marketplace</p>
            </div>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Stripe Connect Status Banner */}
            {stripeStatus && stripeStatus.hasAccount && stripeStatus.onboardingComplete && stripeStatus.accountStatus === 'ACTIVE' ? (
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-400">Stripe Status: Connected & Active</p>
                    <p className="text-xs text-green-300/70 mt-0.5">
                      Your payout account is ready to receive earnings
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-400">Stripe Account Required</p>
                    <p className="text-xs text-red-300/70 mt-0.5">
                      You must complete Stripe Connect onboarding before listing spaces. Earnings cannot be paid without a connected account.
                    </p>
                    <button
                      onClick={() => router.push('/settings')}
                      className="mt-3 text-xs font-medium text-red-300 hover:text-red-200 underline"
                    >
                      Complete Stripe Setup →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Progress Steps */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                {[1, 2, 3, 4].map((step) => (
                  <div key={step} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                      step === currentStep ? 'bg-green-600 text-white' :
                      step < currentStep ? 'bg-green-500/20 text-green-400 border border-green-500/20' :
                      'bg-slate-900/50 text-slate-400 border border-slate-600'
                    }`}>
                      {step < currentStep ? <CheckCircle className="h-4 w-4" /> : step}
                    </div>
                    {step < 4 && (
                      <div className={`w-12 h-1 mx-2 rounded ${
                        step < currentStep ? 'bg-green-500/20' : 'bg-slate-700'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
              <div className="text-sm text-slate-400">
                Step {currentStep} of 4: {
                  currentStep === 1 ? 'Basic Information' :
                  currentStep === 2 ? 'Location Details' :
                  currentStep === 3 ? 'Specifications & Pricing' :
                  'Images & Review'
                }
              </div>
            </div>

            {/* Form Content */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 shadow-xl">
              {/* Step 1 - Basic Information */}
              {currentStep === 1 && (
                <form onSubmit={form1.handleSubmit(onStep1Submit)}>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">Space Title *</label>
                      <input
                        type="text"
                        {...form1.register('title')}
                        className={`w-full px-3 py-2 bg-slate-900 border rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all ${
                          form1.formState.errors.title ? 'border-red-500' : 'border-slate-600'
                        }`}
                        placeholder="e.g., Prime Downtown Billboard"
                      />
                      {form1.formState.errors.title && (
                        <p className="text-red-400 text-sm mt-1">{form1.formState.errors.title.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">Description *</label>
                      <textarea
                        {...form1.register('description')}
                        rows={4}
                        className={`w-full px-3 py-2 bg-slate-900 border rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all ${
                          form1.formState.errors.description ? 'border-red-500' : 'border-slate-600'
                        }`}
                        placeholder="Describe your advertising space, visibility, foot traffic, and any special features..."
                      />
                      {form1.formState.errors.description && (
                        <p className="text-red-400 text-sm mt-1">{form1.formState.errors.description.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">Space Type *</label>
                      <select
                        {...form1.register('type')}
                        className={`w-full px-3 py-2 bg-slate-900 border rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all ${
                          form1.formState.errors.type ? 'border-red-500' : 'border-slate-600'
                        }`}
                      >
                        {SPACE_TYPES.map(type => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                      {form1.formState.errors.type && (
                        <p className="text-red-400 text-sm mt-1">{form1.formState.errors.type.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between pt-6 border-t border-slate-700 mt-8">
                    <button
                      type="button"
                      disabled={true}
                      className="px-4 py-2 text-slate-400 border border-slate-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-medium"
                    >
                      Next
                    </button>
                  </div>
                </form>
              )}

              {/* Step 2 - Location with Autocomplete */}
              {currentStep === 2 && (
                <form onSubmit={form2.handleSubmit(onStep2Submit)}>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">
                        Street Address *
                        <span className="text-xs text-slate-400 font-normal ml-2">
                          (Start typing for suggestions)
                        </span>
                      </label>
                      <PlacesAutocompleteInput
                        onPlaceSelected={handlePlaceSelected}
                        disabled={createSpace.isPending}
                      />
                    </div>

                    {locationData?.isValidated && (
                      <div className="bg-slate-900/50 border border-slate-600 rounded-lg p-4 space-y-2">
                        <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-400" />
                          Validated Address
                        </h4>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-slate-400">Address:</span>
                            <p className="text-white">{form2.watch('address')}</p>
                          </div>
                          <div>
                            <span className="text-slate-400">City:</span>
                            <p className="text-white">{form2.watch('city')}</p>
                          </div>
                          <div>
                            <span className="text-slate-400">State:</span>
                            <p className="text-white">
                              {US_STATES.find(s => s.value === form2.watch('state'))?.label}
                            </p>
                          </div>
                          <div>
                            <span className="text-slate-400">ZIP Code:</span>
                            <p className="text-white">{form2.watch('zipCode') || 'N/A'}</p>
                          </div>
                        </div>
                        <div className="pt-2 border-t border-slate-600">
                          <span className="text-xs text-slate-500">Coordinates: {locationData.latitude.toFixed(6)}, {locationData.longitude.toFixed(6)}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between pt-6 border-t border-slate-700 mt-8">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="px-4 py-2 text-slate-300 border border-slate-600 rounded-lg hover:bg-slate-900/50 transition-all"
                    >
                      Previous
                    </button>
                    <button
                      type="submit"
                      disabled={!locationData?.isValidated}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
                    >
                      Next
                    </button>
                  </div>
                </form>
              )}

              {/* Step 3 - Pricing & Specifications */}
              {currentStep === 3 && (
                <form onSubmit={form3.handleSubmit(onStep3Submit)}>
                  <div className="space-y-6">

                    {/* Pricing Guide */}
                    <PricingGuide />

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-white mb-2">
                          Price per Day * ($)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          {...form3.register('pricePerDay', { valueAsNumber: true })}
                          className={`w-full px-3 py-2 bg-slate-900 border rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all ${
                            form3.formState.errors.pricePerDay ? 'border-red-500' : 'border-slate-600'
                          }`}
                          placeholder="25.00"
                        />
                        {form3.formState.errors.pricePerDay && (
                          <p className="text-red-400 text-sm mt-1">{form3.formState.errors.pricePerDay.message}</p>
                        )}
                        <p className="text-xs text-slate-500 mt-1">
                          💡 Use the pricing guide above for market rates
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-white mb-2">Installation Fee ($)</label>
                        <input
                          type="number"
                          step="0.01"
                          {...form3.register('installationFee', { setValueAs: (v) => v === '' || v === 0 ? undefined : Number(v) })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                          placeholder="0.00"
                        />
                        <p className="text-sm text-slate-500 mt-1">One-time fee to cover material installation costs</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-white mb-2">Minimum Duration (days) *</label>
                        <input
                          type="number"
                          {...form3.register('minDuration', { valueAsNumber: true })}
                          className={`w-full px-3 py-2 bg-slate-900 border rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all ${
                            form3.formState.errors.minDuration ? 'border-red-500' : 'border-slate-600'
                          }`}
                          placeholder="1"
                        />
                        {form3.formState.errors.minDuration && (
                          <p className="text-red-400 text-sm mt-1">{form3.formState.errors.minDuration.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-white mb-2">Maximum Duration (days)</label>
                        <input
                          type="number"
                          {...form3.register('maxDuration', { setValueAs: (v) => v === '' || v === 0 ? undefined : Number(v) })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                          placeholder="Optional"
                        />
                        <p className="text-sm text-slate-500 mt-1">Leave blank for no maximum</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-white mb-2">Width (feet)</label>
                        <input
                          type="number"
                          step="0.1"
                          {...form3.register('width', { setValueAs: (v) => v === '' || v === 0 ? undefined : Number(v) })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                          placeholder="4"
                        />
                        <p className="text-xs text-slate-500 mt-1">
                          Enter width in feet (e.g., 4.0 for 4 feet)
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-white mb-2">Height (feet)</label>
                        <input
                          type="number"
                          step="0.1"
                          {...form3.register('height', { setValueAs: (v) => v === '' || v === 0 ? undefined : Number(v) })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                          placeholder="2"
                        />
                        <p className="text-xs text-slate-500 mt-1">
                          Enter height in feet (e.g., 2.0 for 2 feet)
                        </p>
                      </div>
                    </div>

                    {/* Auto-generated dimensions display */}
                    {form3.watch('width') && form3.watch('height') && (
                      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                        <p className="text-sm text-green-400">
                          <strong>Dimensions:</strong> {form3.watch('width')}' × {form3.watch('height')}'
                          <span className="text-slate-400 ml-2">
                            ({Math.round((form3.watch('width') || 0) * (form3.watch('height') || 0))} sq ft)
                          </span>
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-white mb-2">Available From</label>
                        <input
                          type="date"
                          {...form3.register('availableFrom', { setValueAs: (v) => v ? new Date(v) : undefined })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-white mb-2">Available Until</label>
                        <input
                          type="date"
                          {...form3.register('availableTo', { setValueAs: (v) => v ? new Date(v) : undefined })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-6 border-t border-slate-700 mt-8">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="px-4 py-2 text-slate-300 border border-slate-600 rounded-lg hover:bg-slate-900/50 transition-all"
                    >
                      Previous
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-medium"
                    >
                      Next
                    </button>
                  </div>
                </form>
              )}

              {/* Step 4 - Images & Review */}
              {currentStep === 4 && (
                <form onSubmit={form4.handleSubmit(onStep4Submit)}>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">
                        Space Images * (Max 5 images)
                      </label>

                      <MultiImageUpload
                        value={imagePreviews}
                        onChange={handleImagesChange}
                        maxImages={5}
                        disabled={createSpace.isPending}
                      />

                      {form4.formState.errors.images && (
                        <p className="text-red-400 text-sm mt-2">
                          {form4.formState.errors.images.message}
                        </p>
                      )}

                      <p className="text-xs text-slate-500 mt-2">
                        📸 Upload high-quality photos of your advertising space. First image will be the cover photo.
                      </p>
                    </div>

                    {/* Review Summary */}
                    {step1Data && step2Data && step3Data && (
                      <div className="bg-slate-900/50 border border-slate-600 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-white mb-3">Review Your Listing</h3>
                        <div className="space-y-2 text-sm">
                          <div><span className="font-medium text-slate-400">Title:</span> <span className="text-white">{step1Data.title}</span></div>
                          <div><span className="font-medium text-slate-400">Type:</span> <span className="text-white">{SPACE_TYPES.find(t => t.value === step1Data.type)?.label}</span></div>
                          <div><span className="font-medium text-slate-400">Location:</span> <span className="text-white">{step2Data.city}, {step2Data.state}</span></div>
                          <div><span className="font-medium text-slate-400">Price:</span> <span className="text-white">${step3Data.pricePerDay}/day</span></div>
                          {step3Data.installationFee && (
                            <div><span className="font-medium text-slate-400">Installation Fee:</span> <span className="text-white">${step3Data.installationFee}</span></div>
                          )}
                          {step3Data.dimensions && (
                            <div><span className="font-medium text-slate-400">Dimensions:</span> <span className="text-white">{step3Data.dimensions}</span></div>
                          )}
                          <div><span className="font-medium text-slate-400">Images:</span> <span className="text-white">{imagePreviews.length} uploaded</span></div>
                          {locationData && (
                            <div className="pt-2 border-t border-slate-600">
                              <span className="font-medium text-slate-400">Coordinates:</span>
                              <div className="text-xs text-slate-500 mt-1">
                                {locationData.latitude.toFixed(6)}, {locationData.longitude.toFixed(6)}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between pt-6 border-t border-slate-700 mt-8">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="px-4 py-2 text-slate-300 border border-slate-600 rounded-lg hover:bg-slate-900/50 transition-all"
                    >
                      Previous
                    </button>
                    <button
                      type="submit"
                      disabled={createSpace.isPending || imagePreviews.length === 0}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-all font-medium flex items-center"
                    >
                      {createSpace.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Creating...
                        </>
                      ) : (
                        'Create Space'
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Help Text */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-blue-400 mb-1">Pro Tip</h3>
                  <p className="text-sm text-blue-300">
                    Our smart address autocomplete ensures your space appears in the exact location on the map. Use the pricing guide in Step 3 to set competitive rates!
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
