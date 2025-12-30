// src/components/forms/PlacesAutocompleteInput.tsx
"use client";

import React, { useRef, useEffect, useState } from 'react';
import { Loader2, MapPin, CheckCircle, AlertCircle } from 'lucide-react';

interface AddressComponents {
  streetNumber?: string;
  route?: string;
  city?: string;
  state?: string;
  stateCode?: string;
  zipCode?: string;
  country?: string;
}

interface PlaceData {
  address: string;
  city: string;
  state: string;
  zipCode?: string;
  latitude: number;
  longitude: number;
  formattedAddress: string;
  placeId: string;
}

interface PlacesAutocompleteInputProps {
  onPlaceSelected: (place: PlaceData) => void;
  defaultValue?: string;
  disabled?: boolean;
  className?: string;
}

export const PlacesAutocompleteInput: React.FC<PlacesAutocompleteInputProps> = ({
  onPlaceSelected,
  defaultValue = '',
  disabled = false,
  className = ''
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isValidated, setIsValidated] = useState(false);
  const [error, setError] = useState<string>('');
  const [inputValue, setInputValue] = useState(defaultValue);

  useEffect(() => {
    // Load Google Maps Places library
    const loadGoogleMaps = async () => {
      if (typeof window === 'undefined') return;

      // Check if already loaded
      if (window.google?.maps?.places) {
        initializeAutocomplete();
        return;
      }

      // Wait for script to load
      const checkGoogle = setInterval(() => {
        if (window.google?.maps?.places) {
          clearInterval(checkGoogle);
          initializeAutocomplete();
        }
      }, 100);

      // Timeout after 10 seconds
      setTimeout(() => {
        clearInterval(checkGoogle);
        if (!window.google?.maps?.places) {
          setError('Failed to load Google Maps. Please refresh the page.');
          setIsLoading(false);
        }
      }, 10000);
    };

    loadGoogleMaps();

    return () => {
      // Cleanup
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, []);

  const initializeAutocomplete = () => {
    if (!inputRef.current) return;

    try {
      // Initialize autocomplete
      autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
        componentRestrictions: { country: 'us' }, // Restrict to US
        fields: ['address_components', 'formatted_address', 'geometry', 'place_id'], // Only request necessary fields
        types: ['address'] // Only show full addresses
      });

      // Listen for place selection
      autocompleteRef.current.addListener('place_changed', handlePlaceSelect);
      
      setIsLoading(false);
      setError('');
    } catch (err) {
      console.error('Failed to initialize autocomplete:', err);
      setError('Failed to initialize address search');
      setIsLoading(false);
    }
  };

  const handlePlaceSelect = () => {
    if (!autocompleteRef.current) return;

    const place = autocompleteRef.current.getPlace();

    if (!place.geometry?.location) {
      setError('Please select a valid address from the dropdown');
      setIsValidated(false);
      return;
    }

    try {
      // Parse address components
      const components: AddressComponents = {};
      
      if (place.address_components) {
        for (const component of place.address_components) {
          const types = component.types;
          
          if (types.includes('street_number')) {
            components.streetNumber = component.long_name;
          }
          if (types.includes('route')) {
            components.route = component.long_name;
          }
          if (types.includes('locality')) {
            components.city = component.long_name;
          }
          if (types.includes('administrative_area_level_1')) {
            components.state = component.long_name;
            components.stateCode = component.short_name;
          }
          if (types.includes('postal_code')) {
            components.zipCode = component.long_name;
          }
          if (types.includes('country')) {
            components.country = component.long_name;
          }
        }
      }

      // Verify it's in the US
      if (components.country !== 'United States') {
        setError('Please select a US address');
        setIsValidated(false);
        return;
      }

      // Build street address
      const streetAddress = [components.streetNumber, components.route]
        .filter(Boolean)
        .join(' ');

      if (!streetAddress || !components.city || !components.stateCode) {
        setError('Please select a complete street address');
        setIsValidated(false);
        return;
      }

      // Get coordinates
      const latitude = place.geometry.location.lat();
      const longitude = place.geometry.location.lng();

      // Prepare place data
      const placeData: PlaceData = {
        address: streetAddress,
        city: components.city,
        state: components.stateCode,
        zipCode: components.zipCode,
        latitude,
        longitude,
        formattedAddress: place.formatted_address || '',
        placeId: place.place_id || ''
      };

      setIsValidated(true);
      setError('');
      setInputValue(place.formatted_address || '');
      
      // Notify parent component
      onPlaceSelected(placeData);

    } catch (err) {
      console.error('Error processing place:', err);
      setError('Error processing address. Please try again.');
      setIsValidated(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setIsValidated(false);
    setError('');
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          disabled={disabled || isLoading}
          placeholder={isLoading ? 'Loading...' : 'Start typing your address...'}
          className={`w-full px-3 py-2 pr-10 bg-slate-800 border rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all ${
            error ? 'border-red-500' : isValidated ? 'border-green-500' : 'border-slate-700'
          } ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
          autoComplete="off"
        />
        
        {/* Status icon */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {isLoading && (
            <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
          )}
          {!isLoading && isValidated && (
            <CheckCircle className="h-5 w-5 text-green-400" />
          )}
          {!isLoading && error && (
            <AlertCircle className="h-5 w-5 text-red-400" />
          )}
          {!isLoading && !isValidated && !error && (
            <MapPin className="h-5 w-5 text-slate-400" />
          )}
        </div>
      </div>

      {/* Success message */}
      {isValidated && !error && (
        <div className="flex items-start gap-2 p-2 rounded-lg bg-green-500/10 border border-green-500/20">
          <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-green-300">Address validated successfully</p>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="flex items-start gap-2 p-2 rounded-lg bg-red-500/10 border border-red-500/20">
          <AlertCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      {/* Helper text */}
      {!isLoading && !isValidated && !error && (
        <p className="text-xs text-slate-500">
          Start typing and select your address from the dropdown for automatic validation
        </p>
      )}
    </div>
  );
};