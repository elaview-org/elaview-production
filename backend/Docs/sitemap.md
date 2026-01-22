# Elaview Web App Sitemap

## 🔐 Authentication Flow

- Splash / Landing Page (optional)
- Login Page
    - Forgot Password Modal/Form
- Sign Up Page
    - Role Selection (Advertiser / Space Owner) — stored in Clerk metadata
- → Redirects to role-based dashboard after authentication

## 📱 ADVERTISER DASHBOARD

**Main Navigation** (Header + Sidebar or Top Nav)  
[ 🔍 Discover ] [ 📋 Bookings ] [ 🔔 Notifications ] [ 👤 Profile ]

### 🔍 Discover Section

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

### 📋 Bookings Section

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

### 🔔 Notifications Section

- Notifications Center Page
    - List with Read/Unread Indicators
    - Pull-to-Refresh / Infinite Scroll
    - Notification Types:
        - Request Accepted
        - Verification Uploaded (needs review)
        - Dispute Update
        - Payment Confirmation
    - Click → Routes to relevant page (deep linking)

### 👤 Profile Section

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

## 📱 SPACE OWNER DASHBOARD

**Main Navigation** (Header + Sidebar or Top Nav)  
[ 🏠 Listings ] [ 📋 Bookings ] [ 💰 Earnings ] [ 👤 Profile ]

### 🏠 Listings Section

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

### 📋 Bookings Section

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

### 💰 Earnings Section

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

### 👤 Profile Section

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

## 🔔 In-App Notification Routing

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