# Elaview Web App Development Playbook

## Pre-Development Setup

### Project Initialization

- [ ] Create new Next.js project with App Router and TypeScript:
  `npx create-next-app@latest elaview-web --typescript --tailwind --app --eslint`
- [ ] Initialize git repository and connect to GitHub
- [ ] Set up ESLint + Prettier configuration
- [ ] Configure path aliases in tsconfig.json and next.config.js (e.g., `@/components`, `@/lib`)
- [ ] Create folder structure: src/app (for routes), src/components, src/lib, src/hooks, src/server (for tRPC),
  src/types, src/utils, src/constants

### Environment & Configuration

- [ ] Create `.env.local` and `.env.example` with required variables (NEXT_PUBLIC_API_URL, NEXT_PUBLIC_STRIPE_KEY,
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY)
- [ ] Configure Clerk middleware for protected routes
- [ ] Set up Vercel deployment with environment variables for staging and production

### Core Dependencies

- [ ] UI: shadcn/ui (built on Radix UI + Tailwind CSS) or Tamagui for advanced styling
- [ ] State management: @tanstack/react-query (matches backend pattern)
- [ ] Forms: react-hook-form + zod for validation
- [ ] HTTP client: tRPC for type-safe API calls
- [ ] Authentication: @clerk/nextjs
- [ ] Payments: @stripe/stripe-js + Stripe Elements
- [ ] Maps: react-leaflet or Google Maps JavaScript API
- [ ] File uploads: native input or libraries like uploadthing
- [ ] Notifications: browser notifications API or toast library (sonner)

## Phase 1: Authentication & Core Layout

### Authentication Flow

- [ ] Configure ClerkProvider in root layout
- [ ] Build Sign In and Sign Up pages with Clerk components (email/password + OAuth options)
- [ ] Implement role selection during signup (Advertiser vs Space Owner) via Clerk metadata
- [ ] Implement "Forgot Password" flow with Clerk
- [ ] Create protected vs public route groups using middleware
- [ ] Handle session management with Clerk hooks
- [ ] Redirect based on role after sign in

### Layout & Navigation Structure

- [ ] Create root layout with header navigation (role-based menu items)
    - Advertiser: Discover, Bookings, Alerts, Profile
    - Space Owner: Listings, Bookings, Earnings, Profile
- [ ] Implement nested layouts for authenticated sections
- [ ] Add responsive sidebar or top nav for dashboard
- [ ] Implement loading UI during auth check

### Shared Pages

- [ ] Profile/Settings page (payment methods, payout settings, preferences)
- [ ] Notifications center page
- [ ] Edit profile page

**Milestone:** Users can sign up, log in, and see role-appropriate dashboard

## Phase 2: API Integration Layer

### tRPC Setup

- [ ] Configure tRPC with Next.js App Router (/app/api/trpc/[trpc]/route.ts)
- [ ] Set up React Query provider
- [ ] Integrate Clerk auth context into tRPC for protected procedures
- [ ] Create typed routers for each domain (spaces, bookings, users, payments)
- [ ] Implement error handling and auth middleware
- [ ] Add server-side caching with React Query options

### Data Types & Validation

- [ ] Sync Prisma types or create shared types
- [ ] Create Zod schemas for validation matching backend
- [ ] Define booking status enum and lifecycle types
- [ ] Create reusable type utilities (e.g., BookingWithSpace)

**Milestone:** Web app can authenticate and fetch/mutate data via tRPC

## Phase 3: Advertiser Core Flows

### Map-Based Discovery

- [ ] Integrate map library (e.g., react-leaflet) with custom markers
- [ ] Display spaces as pins with price badges
- [ ] Implement marker clustering
- [ ] Create modal/dialog for space preview on marker click
- [ ] Add geolocation button with browser permissions

### Search & Filters

- [ ] Build filter drawer/modal (location radius, price range, space type, availability)
- [ ] Implement location search with autocomplete (Google Places API)
- [ ] Create search results grid/list view
- [ ] Save recent searches to localStorage
- [ ] Add empty state with suggestions

### Space Detail Page

- [ ] Photo gallery carousel
- [ ] Space specifications display
- [ ] Owner info card with rating
- [ ] Availability display
- [ ] "Request Booking" CTA
- [ ] Share functionality

### Booking Request Flow

- [ ] Date range picker
- [ ] Price calculation display
- [ ] File upload for creative (PDF/PNG/JPG)
- [ ] Client-side file validation
- [ ] Special notes input
- [ ] Summary and confirmation modal
- [ ] Submit via tRPC mutation

### Creative Upload

- [ ] Drag-and-drop or file input
- [ ] Display required specs
- [ ] Validation with error messages
- [ ] Upload progress
- [ ] Preview
- [ ] Links to templates/spec sheets

### Booking Management

- [ ] Bookings list with status filters
- [ ] Booking detail with timeline
- [ ] Review installation photos
- [ ] Approve/Dispute buttons

### Payment Flow

- [ ] Integrate Stripe Elements
- [ ] Saved payment methods
- [ ] Add new card flow
- [ ] Confirmation with summary
- [ ] Handle success/failure

**Milestone:** Advertiser can discover spaces, submit bookings, pay, and manage installations

## Phase 4: Space Owner Core Flows

### Listings Management

- [ ] My Listings page with status badges
- [ ] "Add New Listing" CTA

### Create/Edit Listing

- [ ] Multi-photo upload
- [ ] Space type selector
- [ ] Dimensions input with presets
- [ ] Pricing input
- [ ] Location picker with map
- [ ] Preview before publish
- [ ] Edit/deactivate flows

### Booking Requests Management

- [ ] Incoming requests list
- [ ] Detail showing creative preview
- [ ] Accept/Decline with confirmation

### Active Booking Management

- [ ] Booking detail with timeline
- [ ] Download creative file
- [ ] Installation guide
- [ ] Upload verification photos

### Installation Verification

- [ ] File upload for 3 guided photos
- [ ] Progress indicator
- [ ] Photo review/retake
- [ ] Submit for verification

### Earnings Dashboard

- [ ] Balance displays
- [ ] Payout history
- [ ] Stripe Connect status

**Milestone:** Space owner can manage listings, bookings, installations, and earnings

## Phase 5: Notifications & Real-Time Updates

### Notifications Setup

- [ ] Use browser Notification API with permissions
- [ ] Register for push if needed (service workers)
- [ ] Toast notifications for events

### Notification Types

- [ ] Implement in-app toasts/badges for all event types

### In-App Notifications

- [ ] Notifications page with read/unread
- [ ] Badge on nav
- [ ] Mark as read

**Milestone:** Users receive in-app notifications

## Phase 6: Polish & Edge Cases

### Empty/Error/Loading States

- [ ] Implement throughout app

### Offline Handling

- [ ] Use React Query offline support
- [ ] Offline banner

### Form Validation & UX

- [ ] Inline feedback
- [ ] Accessible forms

### Accessibility

- [ ] Semantic HTML
- [ ] ARIA labels
- [ ] Contrast compliance

**Milestone:** App handles edge cases gracefully

## Phase 7: Testing & Quality Assurance

### Testing Setup

- [ ] Jest + React Testing Library for units
- [ ] Cypress for E2E
- [ ] Test core flows

### Manual Testing

- [ ] Cross-browser
- [ ] Responsive sizes
- [ ] Network conditions

**Milestone:** Comprehensive testing complete

## Phase 8: Pre-Launch & Deployment

### Store Preparation

- [ ] Prepare landing page and SEO
- [ ] Privacy policy

### Build & Release

- [ ] Deploy to Vercel production
- [ ] Set up analytics/crash reporting

**Milestone:** App live on web

## Ongoing Maintenance

- [ ] Update Next.js and dependencies
- [ ] Monitor feedback

## Future Enhancements (Post-MVP)

- [ ] In-app messaging
- [ ] Ratings/reviews
- [ ] Full dispute flow
- [ ] Calendar availability
- [ ] Campaign analytics

## Quick Reference

### Git Commit Conventions

- feat(scope): description – New features
- fix(scope): description – Bug fixes
- refactor(scope): desc – Code refactoring
- style(scope): desc – Styling changes
- test(scope): desc – Adding tests
- docs(scope): desc – Documentation
- chore(scope): desc – Maintenance tasks