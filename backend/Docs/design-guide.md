# Elaview Web App Design Guide

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
- Currently, uses Google Ads, Instagram, Yelp
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

| Tab / Section | Advertiser       | Space Owner |
|---------------|------------------|-------------|
| 1             | 🗺 Discover      | 🏠 Listings |
| 2             | 📅 Bookings      | 📅 Bookings |
| 3             | 🔔 Notifications | 💰 Earnings |
| 4             | 👤 Profile       | 👤 Profile  |

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

## Revision Log

| Date             | Changes                                                                |
|------------------|------------------------------------------------------------------------|
| January 06, 2026 | Initial web version created from mobile guide                          |
| January 06, 2026 | Adapted flows for desktop affordances (drag-and-drop, larger previews) |
| January 06, 2026 | Emphasized consistent lifecycle messaging across platforms             |

**When in doubt: align with mobile intent, leverage web real estate wisely, prioritize trust and speed.**