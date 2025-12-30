// src/components/forms/GoogleAddressAutocomplete.tsx
"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Loader2, MapPin, CheckCircle, AlertCircle } from 'lucide-react';

interface AddressData {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  latitude: number;
  longitude: number;
  formattedAddress: string;
}

interface GoogleAddressAutocompleteProps {
  onAddressSelect: (addressData: AddressData) => void;
  initialValue?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
}

declare global {
  interface Window {
    google: any;
    initGoogleMaps?: () => void;
  }
}

export default function GoogleAddressAutocomplete({
  onAddressSelect,
  initialValue = '',
  disabled = false,
  error = '',
  className = ''
}: GoogleAddressAutocompleteProps) {
  const autocompleteRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<any>(null);
  const mapInstanceRef = useRef<any>(null);
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState<AddressData | null>(null);
  const [inputValue, setInputValue] = useState(initialValue);

  // Load Google Maps API
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      console.error('Google Maps API key not found');
      setIsLoading(false);
      return;
    }

    // Check if Google Maps is already loaded
    if (window.google?.maps) {
      initializeAutocomplete();
      return;
    }

    // Create script tag
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMaps`;
    script.async = true;
    script.defer = true;

    // Global callback
    window.initGoogleMaps = () => {
      setIsLoaded(true);
      initializeAutocomplete();
    };

    script.onerror = () => {
      console.error('Failed to load Google Maps API');
      setIsLoading(false);
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      delete window.initGoogleMaps;
    };
  }, []);

  const initializeAutocomplete = () => {
    if (!inputRef.current || !window.google?.maps) return;

    try {
      // Initialize map
      if (mapRef.current) {
        mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
          center: { lat: 33.7175, lng: -117.8311 }, // Orange County, CA
          zoom: 11,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          zoomControl: true,
        });

        // Create marker
        markerRef.current = new window.google.maps.Marker({
          map: mapInstanceRef.current,
          position: null,
        });
      }

      // Initialize autocomplete
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          fields: ['address_components', 'geometry', 'formatted_address', 'name'],
          types: ['address'],
          componentRestrictions: { country: 'US' }, // Restrict to US addresses
        }
      );

      // Add place changed listener
      autocompleteRef.current.addListener('place_changed', handlePlaceSelect);
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error initializing Google Places:', error);
      setIsLoading(false);
    }
  };

  const handlePlaceSelect = () => {
    const place = autocompleteRef.current?.getPlace();
    
    if (!place?.geometry) {
      console.error('No geometry found for selected place');
      return;
    }

    // Extract address components
    const addressComponents = place.address_components || [];
    
    const getComponent = (type: string, useShortName = false) => {
      const component = addressComponents.find((comp: any) => 
        comp.types.includes(type)
      );
      return component ? (useShortName ? component.short_name : component.long_name) : '';
    };

    const addressData: AddressData = {
      address: `${getComponent('street_number')} ${getComponent('route')}`.trim(),
      city: getComponent('locality') || getComponent('sublocality'),
      state: getComponent('administrative_area_level_1', true),
      zipCode: getComponent('postal_code'),
      country: getComponent('country', true),
      latitude: place.geometry.location.lat(),
      longitude: place.geometry.location.lng(),
      formattedAddress: place.formatted_address || place.name,
    };

    // Update map
    if (mapInstanceRef.current && markerRef.current) {
      const position = place.geometry.location;
      mapInstanceRef.current.setCenter(position);
      mapInstanceRef.current.setZoom(15);
      markerRef.current.setPosition(position);
    }

    setSelectedAddress(addressData);
    setInputValue(addressData.formattedAddress);
    onAddressSelect(addressData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (!e.target.value) {
      setSelectedAddress(null);
      if (markerRef.current) {
        markerRef.current.setPosition(null);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center py-8 border border-gray-300 rounded-md bg-gray-50">
          <Loader2 className="h-6 w-6 animate-spin text-gray-500 mr-2" />
          <span className="text-gray-500">Loading Google Maps...</span>
        </div>
      </div>
    );
  }

  if (!isLoaded && !window.google?.maps) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center py-8 border border-red-300 rounded-md bg-red-50">
          <AlertCircle className="h-6 w-6 text-red-500 mr-2" />
          <span className="text-red-500">Failed to load Google Maps. Please check your API key.</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Address Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Street Address *
        </label>
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            disabled={disabled}
            placeholder="Start typing your address..."
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
              error ? 'border-red-300' : 'border-gray-300'
            } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
          />
          <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
        {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
      </div>

      {/* Address Confirmation */}
      {selectedAddress && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex items-center mb-2">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <span className="text-sm font-medium text-green-700">Address Confirmed</span>
          </div>
          <div className="text-sm text-green-700 space-y-1">
            <p><strong>Address:</strong> {selectedAddress.address}</p>
            <p><strong>City:</strong> {selectedAddress.city}</p>
            <p><strong>State:</strong> {selectedAddress.state}</p>
            <p><strong>ZIP:</strong> {selectedAddress.zipCode}</p>
            <p><strong>Coordinates:</strong> {selectedAddress.latitude.toFixed(6)}, {selectedAddress.longitude.toFixed(6)}</p>
          </div>
        </div>
      )}

      {/* Map Display */}
      <div className="border border-gray-200 rounded-md overflow-hidden">
        <div 
          ref={mapRef}
          className="w-full h-64 bg-gray-200"
          style={{ minHeight: '256px' }}
        />
      </div>

      {/* Helper Text */}
      <p className="text-xs text-gray-500">
        Start typing your address and select from the dropdown suggestions. The map will show the confirmed location.
      </p>
    </div>
  );
}