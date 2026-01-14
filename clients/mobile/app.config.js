/**
 * Expo App Configuration
 *
 * Reads environment variables from devbox/Doppler with ELAVIEW_MOBILE_ prefix
 * and makes them available via expo-constants
 */

module.exports = {
  expo: {
    name: "Elaview",
    slug: "elaview",
    owner: "andersondesigns92",
    scheme: "elaview",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      backgroundColor: "#000000",
      resizeMode: "contain"
    },
    web: {
      bundler: "metro",
      output: "single"
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.elaview.mobile"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#000000"
      },
      package: "com.elaview.mobile"
    },
    plugins: [
      "expo-router",
      "expo-secure-store"
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      eas: {
        projectId: "be86421b-a3b7-4e2d-ac5c-3f3cf89892e6"
      },
      // Environment variables from devbox/Doppler
      env: {
        // Clerk Authentication
        clerkPublishableKey: process.env.ELAVIEW_MOBILE_CLERK_PUBLISHABLE_KEY,

        // API Configuration
        apiUrl: process.env.ELAVIEW_MOBILE_EXPO_PUBLIC_API_URL,
        appUrl: process.env.ELAVIEW_MOBILE_EXPO_PUBLIC_APP_URL,
        graphqlEndpoint: process.env.ELAVIEW_MOBILE_EXPO_PUBLIC_GRAPHQL_ENDPOINT,

        // Cloudinary
        cloudinaryCloudName: process.env.ELAVIEW_MOBILE_EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME,
        cloudinaryUploadPresetCampaigns: process.env.ELAVIEW_MOBILE_EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET_CAMPAIGNS,
        cloudinaryUploadPresetSpaces: process.env.ELAVIEW_MOBILE_EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET_SPACES,
        cloudinaryUploadPresetVerification: process.env.ELAVIEW_MOBILE_EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET_VERIFICATION,

        // Google Maps
        googleMapsApiKey: process.env.ELAVIEW_MOBILE_EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
        googleMapsMapId: process.env.ELAVIEW_MOBILE_EXPO_PUBLIC_GOOGLE_MAPS_MAP_ID,

        // Stripe
        stripePublishableKey: process.env.ELAVIEW_MOBILE_EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY,

        // Feature Flags
        enableNewBookingFlow: process.env.ELAVIEW_MOBILE_EXPO_PUBLIC_ENABLE_NEW_BOOKING_FLOW === 'true',
        enablePushNotifications: process.env.ELAVIEW_MOBILE_EXPO_PUBLIC_ENABLE_PUSH_NOTIFICATIONS === 'true',
        enableAnalytics: process.env.ELAVIEW_MOBILE_EXPO_PUBLIC_ENABLE_ANALYTICS === 'true',

        // Environment & Debug
        environment: process.env.ELAVIEW_MOBILE_EXPO_PUBLIC_ENV || 'development',
        debug: process.env.ELAVIEW_MOBILE_EXPO_PUBLIC_DEBUG === 'true',
      }
    }
  }
};
