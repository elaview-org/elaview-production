# Elaview Mobile App Development Playbook

> Complete development roadmap for the Elaview mobile app (Expo SDK 54, React Native)

**Last Updated:** January 7, 2026  
**Status:** Phase 1 - Navigation & Auth (Complete) | Phase 2 - API Integration (Pending)

---

## Pre-Development Setup

### Project Initialization
- [x] Create new Expo project with TypeScript template
- [x] Initialize git repository and connect to GitHub
- [x] Configure path aliases in tsconfig.json
- [x] Create folder structure: src/screens, src/components, src/hooks, src/services, src/types, src/utils, src/constants

### Environment & Configuration
- [x] Install expo-constants for environment variables
- [x] Create app.config.js to read ELAVIEW_MOBILE_* variables from devbox/Doppler
- [x] Create src/config/env.ts for typed environment variable access
- [x] Create src/config/api.ts for API endpoint configuration
- [x] Document environment setup in API-INTEGRATION-GUIDE.md and src/config/README.md
- [ ] Configure EAS Build for iOS and Android
- [ ] Set up development, staging, and production environment profiles

**Note:** Environment variables are managed via Doppler and loaded through devbox shell. No .env files needed. See `src/config/README.md` for usage.

### Core Dependencies
- [x] Navigation: expo-router@6.0.21
- [ ] State management: @tanstack/react-query
- [ ] Forms: react-hook-form + zod
- [ ] UI: Choose component library (Tamagui, NativeWind, or custom)
- [ ] HTTP client: Configured fetch or axios instance
- [ ] Authentication: @clerk/clerk-expo (commented out, TODO)
- [ ] Payments: @stripe/stripe-react-native
- [ ] Maps: react-native-maps
- [ ] Camera: expo-camera + expo-image-picker
- [ ] Location: expo-location
- [ ] Notifications: expo-notifications
- [x] Secure storage: expo-secure-store

---

## Phase 1: Authentication & Core Navigation ✅ COMPLETE

### Authentication Flow
- [x] Build Login screen (email/password)
- [x] Build Signup screen with role selection
- [x] Implement "Forgot Password" flow
- [x] Create authenticated vs unauthenticated navigation stacks
- [x] Store role securely with expo-secure-store
- [x] Create auth types (User, LoginRequest, LoginResponse, etc.)
- [x] Create auth service with REST API integration
- [x] Create AuthContext for managing user state
- [x] Add AuthProvider to root layout
- [x] Update login.tsx to use auth service
- [x] Update register.tsx to use auth service
- [x] Add input validation (email format, password length, etc.)
- [x] Add loading states and error handling
- [ ] Handle token refresh and session expiration
- [ ] Implement GraphQL getCurrentUser query

**Note:** Authentication now uses the backend REST API at `/api/auth/login`, `/api/auth/signup`, `/api/auth/logout`. See `AUTHENTICATION.md` for complete documentation.

### Navigation Structure ✅ COMPLETE
- [x] Create role-based route groups: (advertiser)/ and (owner)/
- [x] Bottom tab navigator with role-specific tabs
- [x] TopNavBar component (logo, cart, hamburger)
- [x] DrawerMenu component (Settings, Help, Switch Role, Logout)
- [x] RoleContext with persistent storage
- [x] ThemeContext for light/dark mode
- [ ] Deep linking configuration for notifications

### Shared Screens ✅ COMPLETE
- [x] Profile/Settings screen (payment methods, payout settings, preferences)
- [x] Notifications list screen (MVP on Alerts tab)
- [x] Settings screen
- [x] Help screen
- [ ] Edit profile screen (full implementation)

### Shared UI Components ✅ COMPLETE
- [x] ScreenContainer - Consistent screen wrapper with theme
- [x] Button - Primary/secondary/outline/ghost variants
- [x] Card - Reusable card with shadow/border
- [x] Input - Styled text input with icons
- [x] ListItem - Settings/menu row component
- [x] Avatar - User avatar with initials fallback
- [x] StatusBadge - Booking status indicators
- [x] EmptyState - Generic empty state component

### Shared Feature Components ✅ COMPLETE
- [x] ProfileContent - Shared profile screen content
- [x] MessagesList - Conversation list component
- [x] BookingCard - Booking display with status
- [x] SpaceCard - Space listing display

### Mock Data ✅ COMPLETE
- [x] User mock data
- [x] Spaces mock data
- [x] Bookings mock data
- [x] Messages mock data
- [x] Earnings mock data
- [x] Notifications mock data

**Milestone:** ✅ Users can select role and see role-appropriate dashboard with full UI shells

---

## Phase 2: API Integration Layer

### tRPC/API Client Setup
- [ ] Configure API client to communicate with .NET backend
- [ ] Set up React Query provider with default options
- [ ] Create typed API hooks for each endpoint domain
- [ ] Implement error handling wrapper
- [ ] Add request/response interceptors for auth headers
- [ ] Set up offline detection and queuing for critical actions

### Data Types & Validation
- [ ] Import/sync types from backend
- [ ] Create Zod schemas for form validation
- [ ] Define booking status enum and lifecycle types
- [ ] Create reusable type utilities

**Milestone:** Mobile app can authenticate and fetch data from production API

---

## Phase 3: Advertiser Core Flows

### Map-Based Discovery
- [ ] Integrate react-native-maps with custom markers
- [ ] Display spaces as pins with price badges
- [ ] Implement map clustering for dense areas
- [ ] Create bottom sheet for space preview on marker tap
- [ ] Add "current location" button with permission handling
- [ ] Implement smooth animations for marker selection

### Search & Filters
- [ ] Build filter modal/sheet
- [ ] Implement location search with autocomplete
- [ ] Create search results list view
- [ ] Save recent searches to local storage
- [ ] Add "no results" empty state

### Space Detail Screen
- [ ] Photo gallery with swipe/zoom
- [ ] Space specifications display
- [ ] Owner info card with rating
- [ ] Availability calendar
- [ ] "Request Booking" CTA button
- [ ] Share space functionality

### Booking Request Flow
- [ ] Date range picker for campaign duration
- [ ] Price calculation display
- [ ] Creative upload component with file picker
- [ ] File validation (type, dimensions, size, resolution)
- [ ] Special notes/instructions text input
- [ ] Request summary and confirmation screen

### Creative Upload
- [ ] File picker supporting PDF, PNG, JPG
- [ ] Display required specs from space listing
- [ ] Client-side validation with clear error messages
- [ ] Upload progress indicator
- [ ] Preview uploaded creative
- [ ] Link to Canva templates
- [ ] Link to spec sheet download

### Booking Management
- [ ] Bookings list with status filters
- [ ] Booking detail screen with status timeline
- [ ] Installation review screen with owner's photos
- [ ] Approve/Dispute installation buttons
- [ ] Contact owner functionality

### Payment Flow
- [ ] Integrate Stripe React Native SDK
- [ ] Saved payment methods list
- [ ] Add new payment method flow
- [ ] Payment confirmation screen
- [ ] Handle payment success/failure states
- [ ] Receipt display

**Milestone:** Advertiser can discover spaces, submit bookings, pay, and approve installations

---

## Phase 3.5: In-App Messaging

### Why Messaging is MVP
- High-value transactions require Q&A before commitment
- Creative coordination (specs, file formats, installation timing)
- Trust building through direct communication
- Prevent leakage (users exchanging contact info off-platform)

### Data Model
- Messages table with booking relation
- Sender/recipient tracking
- Read receipts
- Timestamp tracking

### API Endpoints (tRPC)
- [ ] getByBooking - Get all messages for a booking
- [ ] send - Send a message
- [ ] markAsRead - Mark messages as read
- [ ] getUnreadCount - Badge count
- [ ] getConversations - List with last message preview

### Mobile Implementation
- [ ] ConversationsListScreen - List of all message threads
- [ ] ChatScreen - Individual conversation view
- [ ] "Message" button on booking detail screen
- [ ] Unread badge on Messages tab
- [ ] Deep linking from push notifications

### What to Skip for MVP
- ❌ Real-time WebSocket updates (polling is fine)
- ❌ Typing indicators
- ❌ Image/file attachments in chat
- ❌ Message search
- ❌ Message reactions

**Milestone:** Users can message each other about bookings

---

## Phase 4: Space Owner Core Flows

### Listings Management
- [ ] My Listings screen with status badges
- [ ] "Add New Listing" CTA

### Create/Edit Listing
- [ ] Multi-photo upload with reordering
- [ ] Space type selector
- [ ] Dimensions input with common presets
- [ ] Pricing input
- [ ] Location picker with map
- [ ] Availability settings
- [ ] Preview before publish
- [ ] Edit existing listing flow
- [ ] Delete/deactivate listing

### Booking Requests Management
- [ ] Incoming requests list with preview info
- [ ] Request detail screen showing advertiser's creative
- [ ] Accept/Decline buttons with confirmation
- [ ] Decline reason input (optional)

### Active Booking Management
- [ ] Booking detail with timeline/checklist
- [ ] Download print-ready file button
- [ ] "Mark as Downloaded" triggers first payout
- [ ] Printing guide/tips accessible in-app
- [ ] Installation deadline display
- [ ] Upload verification photos CTA

### Installation Verification (Critical Flow)
- [ ] In-app camera only (no gallery access)
- [ ] Guided 3-photo capture flow
- [ ] Progress dots showing 1/3, 2/3, 3/3
- [ ] Auto-capture GPS coordinates
- [ ] Timestamp capture (server-verified)
- [ ] Photo review before submission
- [ ] Retake individual photos
- [ ] Submit all photos for verification
- [ ] Validation checks: GPS, EXIF data, file quality

### Earnings Dashboard
- [ ] Available balance display
- [ ] Pending payouts display
- [ ] Payout history list
- [ ] Individual payout detail
- [ ] Stripe Connect account status
- [ ] Link to Stripe dashboard

**Milestone:** Space owner can list spaces, accept bookings, complete installations, track earnings

---

## Phase 5: Notifications & Real-Time Updates

### Push Notifications Setup
- [ ] Configure expo-notifications with permissions
- [ ] Register device token with backend
- [ ] Handle notification permissions gracefully (soft ask first)
- [ ] Create notification service for local/push handling

### Notification Types Implementation
- [ ] New booking request (Owner)
- [ ] Request accepted (Advertiser)
- [ ] Payment received (Owner)
- [ ] File downloaded / Print+install fee sent (Owner)
- [ ] Installation reminder (Owner)
- [ ] Verification uploaded (Advertiser)
- [ ] Verification approved / Payout sent (Owner)
- [ ] Auto-approved notification (Owner)
- [ ] Dispute opened (Both)

### Deep Linking
- [ ] Configure deep links for each notification type
- [ ] Navigate to relevant screen on notification tap
- [ ] Handle app-opened-from-notification vs app-already-open

### In-App Notifications
- [x] Notifications list screen (Alerts tab - MVP)
- [ ] Mark as read on view
- [ ] Badge count on tab bar
- [ ] Pull-to-refresh

**Milestone:** Users receive timely push notifications and can navigate to relevant screens

---

## Phase 6: Polish & Edge Cases

### Empty States
- [ ] No search results
- [ ] No bookings
- [ ] No listings
- [ ] No earnings
- [x] No notifications

### Error States
- [ ] Upload failed
- [ ] Payment failed
- [ ] GPS unavailable
- [ ] Verification rejected
- [ ] Network error
- [ ] Server error

### Loading States
- [ ] Skeleton loaders for lists
- [ ] Shimmer effects for images
- [ ] Button loading states
- [ ] Full-screen loaders

### Offline Handling
- [ ] Detect offline status
- [ ] Show offline banner
- [ ] Cache active bookings for offline viewing
- [ ] Queue photo uploads, sync when connected
- [ ] Disable actions that require connectivity

### Form Validation & UX
- [ ] Inline validation feedback
- [ ] Keyboard-aware scroll views
- [ ] Input masking
- [ ] Haptic feedback on key actions

### Accessibility
- [ ] Semantic labels on all interactive elements
- [ ] Minimum tap targets 44x44px
- [ ] Screen reader testing
- [ ] Color contrast compliance
- [ ] Reduce motion support

**Milestone:** App handles all edge cases gracefully

---

## Phase 7: Testing & Quality Assurance

### Unit Testing
- [ ] Set up Jest with React Native Testing Library
- [ ] Test utility functions
- [ ] Test form validation schemas
- [ ] Test custom hooks

### Integration Testing
- [ ] Test API integration with mock server
- [ ] Test navigation flows
- [ ] Test authentication flows

### E2E Testing
- [ ] Set up Detox or Maestro
- [ ] Core advertiser flow: discover → book → pay → approve
- [ ] Core owner flow: list → accept → download → install → verify
- [ ] Authentication flows

### Manual Testing Checklist
- [ ] Test on iOS simulator and physical device
- [ ] Test on Android emulator and physical device
- [ ] Test on various screen sizes
- [ ] Test with slow network
- [ ] Test with no network
- [ ] Test camera permissions flow
- [ ] Test location permissions flow
- [ ] Test notification permissions flow

**Milestone:** Comprehensive test coverage

---

## Phase 8: Pre-Launch & Deployment

### App Store Preparation (iOS)
- [ ] Create App Store Connect listing
- [ ] Prepare screenshots for all required device sizes
- [ ] Write app description and keywords
- [ ] Create privacy policy and terms of service URLs
- [ ] Configure app privacy details
- [ ] Prepare for App Review (demo account, notes)

### Play Store Preparation (Android)
- [ ] Create Google Play Console listing
- [ ] Prepare feature graphic and screenshots
- [ ] Write store listing description
- [ ] Complete content rating questionnaire
- [ ] Set up data safety section
- [ ] Configure closed/open testing tracks

### Build & Release
- [ ] Configure production environment variables in EAS
- [ ] Create production build
- [ ] Test production builds on physical devices
- [ ] Submit to App Store for review
- [ ] Submit to Play Store for review
- [ ] Set up crash reporting (Sentry)
- [ ] Set up analytics (Mixpanel/Amplitude)

### Post-Launch Monitoring
- [ ] Monitor crash reports
- [ ] Monitor API error rates
- [ ] Monitor app store reviews
- [ ] Set up alerting for critical issues

**Milestone:** App live on both app stores

---

## Environment Variables

```env
EXPO_PUBLIC_API_URL=
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

---

## Git Commit Conventions

```
feat(scope): description  - New features
fix(scope): description   - Bug fixes
refactor(scope): desc     - Code refactoring
style(scope): desc        - Styling changes
test(scope): desc         - Adding tests
docs(scope): desc         - Documentation
chore(scope): desc        - Maintenance tasks
```

---

## Key Commands

```bash
# Development
pnpm dev                  # Start Expo dev server
pnpm ios                  # Run on iOS
pnpm android              # Run on Android

# Type checking
pnpm typecheck            # Run TypeScript compiler

# Building
npx expo prebuild         # Generate native code
npx expo run:ios          # Build & run on iOS
npx expo run:android      # Build & run on Android
```

---

## Related Documentation

- [NAVIGATION.md](navigation.md) - Navigation architecture
- [commands.md](commands.md) - Command reference
- [MOBILE-SCREENS.md](../../../docs/MOBILE-SCREENS.md) - Screen specifications
- [NOTIFICATIONS.md](../../../docs/NOTIFICATIONS.md) - Push notifications
- [ARCHITECTURE.md](../../../docs/ARCHITECTURE.md) - System architecture
