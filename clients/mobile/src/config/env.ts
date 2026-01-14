/**
 * Environment Configuration
 *
 * Accesses environment variables from devbox/Doppler via expo-constants.
 * Variables are read from process.env.ELAVIEW_MOBILE_* in app.config.js
 * and injected into the app at build time.
 */

import Constants from 'expo-constants';

type EnvConfig = {
  // Clerk Authentication
  clerkPublishableKey: string;

  // API Configuration
  apiUrl: string;
  appUrl: string;
  graphqlEndpoint: string;

  // Cloudinary
  cloudinaryCloudName: string;
  cloudinaryUploadPresetCampaigns: string;
  cloudinaryUploadPresetSpaces: string;
  cloudinaryUploadPresetVerification: string;

  // Google Maps
  googleMapsApiKey: string;
  googleMapsMapId: string;

  // Stripe
  stripePublishableKey: string;

  // Feature Flags
  enableNewBookingFlow: boolean;
  enablePushNotifications: boolean;
  enableAnalytics: boolean;

  // Environment & Debug
  environment: 'development' | 'staging' | 'production';
  debug: boolean;
};

// Get environment variables from app.config.js extra field
const expoConfig = Constants.expoConfig;
const env = expoConfig?.extra?.env as EnvConfig | undefined;

if (!env) {
  throw new Error(
    'Environment configuration not found. Make sure devbox shell is running and variables are exported.'
  );
}

// Export individual values for convenience
export const ENV = env.environment;
export const IS_DEV = env.environment === 'development';
export const IS_STAGING = env.environment === 'staging';
export const IS_PROD = env.environment === 'production';
export const DEBUG = env.debug;

// API Configuration
export const API_URL = env.apiUrl;
export const APP_URL = env.appUrl;
export const GRAPHQL_ENDPOINT = env.graphqlEndpoint;

// Clerk
export const CLERK_PUBLISHABLE_KEY = env.clerkPublishableKey;

// Cloudinary
export const CLOUDINARY_CLOUD_NAME = env.cloudinaryCloudName;
export const CLOUDINARY_UPLOAD_PRESET_CAMPAIGNS = env.cloudinaryUploadPresetCampaigns;
export const CLOUDINARY_UPLOAD_PRESET_SPACES = env.cloudinaryUploadPresetSpaces;
export const CLOUDINARY_UPLOAD_PRESET_VERIFICATION = env.cloudinaryUploadPresetVerification;

// Google Maps
export const GOOGLE_MAPS_API_KEY = env.googleMapsApiKey;
export const GOOGLE_MAPS_MAP_ID = env.googleMapsMapId;

// Stripe
export const STRIPE_PUBLISHABLE_KEY = env.stripePublishableKey;

// Feature Flags
export const ENABLE_NEW_BOOKING_FLOW = env.enableNewBookingFlow;
export const ENABLE_PUSH_NOTIFICATIONS = env.enablePushNotifications;
export const ENABLE_ANALYTICS = env.enableAnalytics;

// Export the full config object
export default env;
