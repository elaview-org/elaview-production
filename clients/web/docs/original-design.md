# Elaview Web App - Original Design Document

This document combines the original development playbook, sitemap, and design guide for reference.

---

# Part 1: Development Playbook

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

- [ ] Create `.env.local` and `.env.example` with required variables (API_URL, NEXT_PUBLIC_STRIPE_KEY,
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

---

# Part 2: Sitemap

## Authentication Flow

- Splash / Landing Page (optional)
- Login Page
    - Forgot Password Modal/Form
- Sign Up Page
    - Role Selection (Advertiser / Space Owner) — stored in Clerk metadata
- → Redirects to role-based dashboard after authentication

## Advertiser Dashboard

**Main Navigation** (Header + Sidebar or Top Nav)
[ Discover ] [ Bookings ] [ Notifications ] [ Profile ]

### Discover Section

- Discover Page (default: Map View)
    - Interactive Map (clustered markers with price badges)
    - Marker Click → Space Preview Modal
    - Geolocation Button (browser permission)
    - Toggle to List/Grid View
    - Filter Drawer/Modal
        - Location Search / Radius
        - Price Range Slider
        - Space Type Selector
        - Availability Filters
- Space Detail Page (`/discover/[spaceId]`)
    - Photo Gallery Carousel (swipe/zoom)
    - Specifications Section
    - Owner Info Card (with rating if available)
    - Availability Display
    - Share Button
    - [Request Booking] Button →
        - Booking Request Flow (multi-step modal or dedicated page)
            - Date Range Picker
            - Dynamic Price Calculation
            - Creative Upload
                - Drag-and-drop / File Input (PDF, PNG, JPG)
                - Real-time Spec Validation
                - Upload Progress Bar
                - Preview Modal
            - Special Notes Textarea
            - Request Summary Review
            - [Submit Request] →
                - Payment Page (Stripe Elements)
                    - Saved Payment Methods
                    - Add New Card Form
                    - Order Summary
                - Booking Confirmation Page

### Bookings Section

- Bookings List Page
    - Filter Tabs: Active / Pending / Completed / Cancelled
    - Booking Cards (status badge, space thumbnail, dates)
- Booking Detail Page (`/bookings/[bookingId]`)
    - Status Timeline / Checklist
    - Space & Campaign Info
    - Payment Summary
    - Contact Owner Button (if messaging enabled)
    - Installation Review Section
        - Owner's Verification Photos Grid
        - [Approve Installation] Button → Confirmation Modal
        - [Open Dispute] Button → Dispute Form Modal

### Notifications Section

- Notifications Center Page
    - List with Read/Unread Indicators
    - Pull-to-Refresh / Infinite Scroll
    - Notification Types:
        - Request Accepted
        - Verification Uploaded (needs review)
        - Dispute Update
        - Payment Confirmation
    - Click → Routes to relevant page (deep linking)

### Profile Section

- Profile Overview
    - Name / Email / Avatar
    - [Edit Profile] Link
- Payment Methods Page
    - Saved Cards List
    - [Add Payment Method]
- Notification Preferences
    - In-app Notification Toggles
    - Email Preferences
- Help & Support
- Terms of Service
- Privacy Policy
- [Log Out]

## Space Owner Dashboard

**Main Navigation** (Header + Sidebar or Top Nav)
[ Listings ] [ Bookings ] [ Earnings ] [ Profile ]

### Listings Section

- My Listings Page
    - Listing Cards (status badge, key stats)
    - [Add New Listing] Button
- Create / Edit Listing Page (`/listings/new` or `/listings/[listingId]/edit`)
    - Multi-Photo Upload (drag-and-drop, reorder)
    - Space Type Selector (auto-suggests print+install fee)
    - Dimensions Input (with common presets)
    - Pricing Input
    - Location Picker (interactive map)
    - Availability Settings
    - Preview Mode
    - [Publish] / [Save Changes] Button

### Bookings Section

- Incoming Requests Page
    - Request Cards (advertiser info, dates, creative preview)
- Request Detail Page (`/bookings/requests/[requestId]`)
    - Advertiser's Creative Preview/Download
    - Campaign Details
    - [Accept] Button → Confirmation Modal
    - [Decline] Button → Optional Reason Input
- Active Booking Detail Page (`/bookings/[bookingId]`)
    - Status Timeline / Checklist
        - ✓ Request Accepted
        - ○ File Downloaded
        - ○ Installation Complete
        - ○ Verified & Paid
    - [Download Print File] Button → Triggers first payout
    - [Printing Guide] Link/Modal
    - Installation Deadline Banner
    - [Upload Verification Photos] Button →
        - Verification Upload Flow
            - Upload 3 Guided Photos (wide, close-up, angle)
            - Progress Indicator
            - Individual Photo Review/Replace
            - Client-side Validation Feedback
            - [Submit for Verification] → Success Message

### Earnings Section

- Earnings Dashboard Page
    - Available Balance
    - Pending Payouts
    - Stripe Connect Status
    - [View Stripe Dashboard] External Link
- Payout History Page
    - Payout List (date, amount, status)
    - Payout Detail Modal/Page
        - Associated Booking Link
        - Payout Type (print+install / rental)
        - Transaction ID

### Profile Section

- Profile Overview
    - Name / Email / Avatar
    - [Edit Profile] Link
- Payout Settings
    - Stripe Connect Account Management
    - Bank Account Status
- Notification Preferences
- Help & Support
- Terms of Service
- Privacy Policy
- [Log Out]

## In-App Notification Routing

| Notification Type     | User Role   | Links To                    |
|-----------------------|-------------|-----------------------------|
| New booking request   | Space Owner | Request Detail Page         |
| Request accepted      | Advertiser  | Booking Detail Page         |
| Payment received      | Space Owner | Earnings Dashboard          |
| File downloaded       | Space Owner | Active Booking Detail       |
| Installation reminder | Space Owner | Active Booking Detail       |
| Verification uploaded | Advertiser  | Installation Review Section |
| Verification approved | Space Owner | Payout Detail               |
| Auto-approved         | Space Owner | Payout Detail               |
| Dispute opened        | Both        | Booking Detail Page         |

---

# Part 3: Design Guide

**Purpose:** Reference document for UI/UX design and development of the Elaview web experience. Web allows more
information density than mobile, but we must maintain clarity and focus — every page should answer: "What's the ONE
thing this user needs to do right now?"

## Core Philosophy

### The Problem We Solve

Local advertisers want hyper-local visibility but digital ads are crowded and expensive. Storefront owners have valuable
empty window/wall space. Elaview connects them efficiently.

### Phase 1 Focus

- Space type: Storefronts, windows, walls, bulletin boards (NOT billboards or vehicles)
- Advertisers: Local businesses — restaurants, gyms, salons, realtors, dentists
- Geography: Orange County / LA (seed locally, prove the model)
- Campaign length: 1–4 weeks typical

### Web Advantages & Constraints

- More screen real estate → richer previews, side-by-side comparisons, desktop file uploads
- Users often on larger screens → support drag-and-drop, keyboard shortcuts
- Assume better connectivity but still handle offline gracefully
- Primary action must still be prominent (not buried in modals or secondary columns)

## Target Personas

**Advertiser: "Local Larry"**

- Owns 1–3 location business
- Marketing budget: $500–2,000/month
- Currently uses: Google Ads, Instagram, Yelp
- Pain: Wants tangible local visibility
- Tech comfort: Comfortable uploading files from desktop, uses Canva occasionally

**Space Owner: "Storefront Steve"**

- Owns/manages retail location with street visibility
- Wants: Passive income with minimal hassle
- Concern: Trust and reliable payment
- Tech comfort: Can upload multiple photos, manage listings from laptop/desktop

## User Types & Primary Jobs

1. **Advertiser**
   Core job: Find a space, book it, get ad installed
   Key flows: Browse/search → View details → Submit request with creative → Pay → Approve installation

2. **Space Owner**
   Core job: List space, accept bookings, get paid
   Key flows: Create/edit listing → Review requests → Download creative → Upload verification → Receive payouts

3. **Admin** (Web-only for MVP)
   Review disputes, monitor platform

## The Booking Lifecycle

(This remains identical to mobile — design all web views to clearly reflect current stage)

```
1. DISCOVERY → Advertiser browses spaces
2. REQUEST → Advertiser submits booking + creative
3. ACCEPTANCE → Owner approves/declines
4. PAYMENT → Advertiser pays (escrow)
5. PRINT + INSTALL → Owner prints locally + installs
6. VERIFICATION → Owner uploads photos
7. APPROVAL → Advertiser reviews/approves (or auto-approve)
8. PAYOUT → Funds released to owner (two-stage)
```

## Payment & Payout Flow (Unchanged)

- **Two-stage payout** (event-driven, no cron jobs)
- Print + Install Fee by Space Type (platform-set, baked into total for advertiser)

| Space Type     | Print + Install Fee |
|----------------|---------------------|
| Bulletin board | $10                 |
| Window poster  | $20                 |
| Window vinyl   | $35                 |
| Wall mount     | $30                 |
| A-frame sign   | $25                 |

**Advertiser sees:** Single total price (fee baked in)
**Owner sees:** Breakdown of two payouts

## Page-by-Page Breakdown

### Shared / Global

| Page                            | Purpose            | Key Elements                                    |
|---------------------------------|--------------------|-------------------------------------------------|
| Login / Sign Up                 | Authentication     | Email/password, OAuth, role selection on signup |
| Dashboard (Landing after login) | At-a-glance status | Active bookings, pending actions, quick stats   |
| Notifications Center            | Stay informed      | List with filters, unread indicators            |
| Profile / Settings              | Account management | Payment methods, payout settings, preferences   |

### Advertiser Pages

| Page                  | Purpose               | Key Elements                                                                             |
|-----------------------|-----------------------|------------------------------------------------------------------------------------------|
| Discover (Map + List) | Find spaces           | Interactive map (left/right layout), clustered pins, list/grid toggle, prominent filters |
| Space Detail          | Evaluate space        | Large photo gallery, specs table, owner card, pricing breakdown, [Request Booking] CTA   |
| Booking Request Flow  | Submit campaign       | Multi-step or single-page: date range, creative upload (drag-and-drop), notes, summary   |
| Creative Upload       | Provide artwork       | Drag-and-drop zone, real-time validation, preview, spec sheet download                   |
| Payment               | Complete transaction  | Stripe Elements, saved cards, order summary, confirm button                              |
| Bookings List         | Overview of campaigns | Tab filters (Active/Pending/etc.), card grid with status badges                          |
| Booking Detail        | Track progress        | Status timeline, checklist, creative preview, contact owner                              |
| Installation Review   | Verify install        | Large verification photos, approve/dispute buttons, comments field                       |

### Space Owner Pages

| Page                  | Purpose                | Key Elements                                                                                       |
|-----------------------|------------------------|----------------------------------------------------------------------------------------------------|
| My Listings           | Manage spaces          | Grid/list of listings, status badges, [Add New Listing] CTA                                        |
| Create / Edit Listing | Define or update space | Multi-photo upload (drag-and-drop + reorder), space type selector, dimensions, pricing, map picker |
| Incoming Requests     | Respond to interest    | Request cards with creative preview, accept/decline buttons                                        |
| Request Detail        | Review request         | Full creative preview/download, campaign dates, notes                                              |
| Active Booking Detail | Track booking          | Timeline/checklist, [Download File] button, printing guide link, deadline banner                   |
| Verification Upload   | Prove installation     | Upload 3 guided photos (wide, close-up, angle), progress indicator, review/replace                 |
| Earnings Dashboard    | Track income           | Available balance, pending, payout history table                                                   |

## Installation Verification Flow (Web Adaptation)

- Allow file upload from device (no camera requirement — web cannot force in-app camera)
- Strongly recommend recent photos
- Still perform server-side checks: timestamp, EXIF data
- UI: Dedicated upload zone for exactly 3 photos with labels (Wide Shot, Close-up, Angle Shot)

## Status States & Messaging

(Identical to mobile — use consistent copy across platforms)

## Material Handoff

Owner prints locally (unchanged). Provide same printing guide and spec sheet download.

## Ad Creative Guidance

- Auto-generated spec sheet
- Links to Canva pre-sized templates
- Robust client-side validation (type, dimensions, DPI, size)
- Clear error messaging

## Navigation Structure (Web)

**Primary Navigation** (Persistent header + optional sidebar on desktop)

| Tab / Section | Advertiser  | Space Owner |
|---------------|-------------|-------------|
| 1             | Discover    | Listings    |
| 2             | Bookings    | Bookings    |
| 3             | Notifications | Earnings  |
| 4             | Profile     | Profile     |

**Principles**

- Max 2 clicks to any primary flow
- Breadcrumbs for deep pages
- Keyboard navigation support
- Responsive: collapse to mobile-like layout on smaller screens

## Notification Triggers

(Same events as mobile — deliver via in-app toast + notifications center + email fallback)

## Edge Cases to Design For

**Empty States**

- No results → helpful suggestions + map zoom out tip
- No bookings/listings → prominent CTA to create first one

**Error States**

- Upload failed, payment declined, validation errors → inline + toast feedback

**Offline Handling**

- React Query caching for recent data
- Offline banner
- Queue mutations when possible

## MVP Scope Checklist

(Identical to mobile — web must deliver same core functionality)

## Design Checklist Per Page

As you design:

1. What's the #1 action? Make it the largest/highest-contrast button.
2. How does this page reflect the current booking lifecycle stage?
3. What if data fails to load? Design skeleton + error states.
4. Is it scannable in <10 seconds?
5. Does it match mobile intent while leveraging web advantages?

## Quick Reference: Space Types & Specs

(Unchanged from mobile)

---

## Revision Log

| Date             | Changes                                                                |
|------------------|------------------------------------------------------------------------|
| January 06, 2026 | Initial web version created from mobile guide                          |
| January 06, 2026 | Adapted flows for desktop affordances (drag-and-drop, larger previews) |
| January 06, 2026 | Emphasized consistent lifecycle messaging across platforms             |
| January 23, 2026 | Combined playbook, sitemap, and design guide into single document      |

**When in doubt: align with mobile intent, leverage web real estate wisely, prioritize trust and speed.**