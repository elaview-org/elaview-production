# Discover Page

## Implemented

### Core
- [x] Parallel routes structure (`@map`, `@grid`)
- [x] View toggle (map/grid) with URL param persistence
- [x] View preference saved to localStorage
- [x] Suspense boundaries with skeleton fallbacks
- [x] Route-level loading states (`loading.tsx`)

### Map View
- [x] Interactive Leaflet map with OpenStreetMap tiles
- [x] Price badge markers on space locations
- [x] Marker click opens space preview dialog
- [x] Popup with space thumbnail, type, price, address
- [x] Geolocation button (fly to user location)
- [x] Dynamic import for client-side only rendering

### Grid View
- [x] Responsive grid layout (1-4 columns)
- [x] Space cards with hover effects
- [x] Image with gradient overlay
- [x] Space type badge
- [x] Price and address display
- [x] Like/Share action buttons (UI only)
- [x] Click opens space preview dialog
- [x] Empty state for no results

### Filter Sheet
- [x] Slide-out sheet from right
- [x] Price range slider (dual thumb)
- [x] Space type checkboxes (Storefront, Window Display, Other)
- [x] Active filter count badge
- [x] Reset and Apply buttons
- [x] URL param persistence for filters

### Space Preview Dialog
- [x] Image or dimensions placeholder
- [x] Space type badge
- [x] Title and price display
- [x] Address with map pin icon
- [x] Dimensions display
- [x] Availability indicator
- [x] "View Full Details" link
- [x] "Request Booking" CTA

### Search
- [x] Search input in header
- [x] URL param persistence (`?q=`)

## Pending

### Map View
- [ ] Marker clustering for dense areas
- [ ] Map bounds filtering (fetch spaces in viewport)
- [ ] Custom map style/theming

### Filters
- [ ] Location/radius filter with autocomplete
- [ ] Availability date range picker
- [ ] Sort options (price, distance, rating)

### Grid View
- [ ] Infinite scroll / pagination
- [ ] Like functionality (save to favorites)
- [ ] Share functionality

### Performance
- [ ] Use `next/image` for space images (requires remotePatterns config)
- [ ] Implement `use cache` for space queries
- [ ] Virtual scrolling for large result sets