# Elaview Digital Signage System — Architecture Analysis

**Date:** March 20, 2026  
**Scope:** Full system design for TV/monitor ad space booking with real-time content delivery  
**Status:** Ready for Phase 2 implementation

---

## 1. CODEBASE AUDIT SUMMARY

### Current Architecture Overview

```
Backend (.NET 10.0)
├── HotChocolate v15.1.11 (GraphQL)
├── EF Core 10.0 with PostgreSQL
├── Feature-based structure (Auth, Marketplace, Payments, Notifications, etc.)
├── Stripe.net for payments
├── Cloudinary for asset storage
└── In-memory subscriptions configured ✅

Frontend (Next.js 15 + React 19)
├── Apollo Client 4.1.3
├── Server Components + Server Actions
├── Tailwind + Radix UI
└── Feature-based component structure

Mobile (Expo SDK 54)
├── React Native + Expo Router
└── Separate from web/backend

Infrastructure
├── PostgreSQL database
├── Cloudinary R2 for asset storage
├── Stripe Connect for payments
├── Docker + Kubernetes ready
└── GitHub Actions CI/CD
```

### Key Findings

✅ **Strengths for Digital Signage:**
- GraphQL subscriptions already configured (`.AddInMemorySubscriptions()`)
- Feature-based architecture scales well
- PostgreSQL can handle device/schedule tables
- Stripe integration proven
- Cloudinary ready for ad creative distribution
- Server Actions pattern suitable for device commands

⚠️ **Current Limitations:**
- No WebSocket real-time bridge service exists yet
- No device authentication/pairing system
- Spaces table is generic (needs signage-specific attributes)
- No scheduling system for content rotations
- No event logging for proof-of-display

### Auth Strategy (Cookie-based)
- Primary: ASP.NET Cookie authentication
- Device pairing should use API tokens (new requirement)

---

## 2. DATABASE SCHEMA — NEW ENTITIES

### New Prisma/EF Models Required

```csharp
// ============================================================================
// DigitalSignageSpace — extends Space for TV/monitor-specific properties
// ============================================================================
[Table("digital_signage_spaces")]
public sealed class DigitalSignageSpace : EntityBase {
    // Foreign key
    public Guid SpaceId { get; set; }
    public Space Space { get; set; } = null!;
    
    // Device info
    [MaxLength(100)]
    public string DeviceName { get; init; } = null!;
    
    [MaxLength(50)]
    public string DeviceType { get; init; } = "MONITOR"; // MONITOR, TV_STICK, RASPBERRY_PI
    
    [MaxLength(100)]
    public string? Resolution { get; init; } = "1920x1080";
    
    // Signaling
    [MaxLength(100)]
    public string WebSocketUrl { get; init; } = null!; // e.g., wss://signaling.elaview.com
    
    // Status tracking
    public DigitalSignageStatus Status { get; set; } = DigitalSignageStatus.Offline;
    
    public DateTime? LastHeartbeat { get; set; }
    
    public DateTime? LastContentUpdate { get; set; }
    
    // Device health
    public double? BatteryLevel { get; set; }
    
    [MaxLength(50)]
    public string? IpAddress { get; set; }
    
    [MaxLength(50)]
    public string? FirmwareVersion { get; set; }
    
    // Relationships
    public ICollection<DigitalSignageSchedule> Schedules { get; init; } = [];
    public ICollection<DigitalSignageEvent> Events { get; init; } = [];
}

// ============================================================================
// DigitalSignageDevice — tracks paired devices and auth tokens
// ============================================================================
[Table("digital_signage_devices")]
public sealed class DigitalSignageDevice : EntityBase {
    public Guid DigitalSignageSpaceId { get; set; }
    public DigitalSignageSpace DigitalSignageSpace { get; set; } = null!;
    
    [MaxLength(100)]
    public string PairingCode { get; init; } = null!; // Temporary, user-facing
    
    [MaxLength(500)]
    public string DeviceToken { get; init; } = null!; // JWT token for auth
    
    public DateTime? PairedAt { get; set; }
    
    public DateTime? TokenExpiresAt { get; set; }
    
    [MaxLength(100)]
    public string? HardwareId { get; init; }; // MAC address, serial #, etc.
    
    public bool IsActive { get; set; } = true;
    
    // Last known location
    public double? LastKnownLatitude { get; set; }
    public double? LastKnownLongitude { get; set; }
}

// ============================================================================
// DigitalSignageSchedule — booking schedule for digital spaces
// ============================================================================
[Table("digital_signage_schedules")]
public sealed class DigitalSignageSchedule : EntityBase {
    public Guid DigitalSignageSpaceId { get; set; }
    public DigitalSignageSpace DigitalSignageSpace { get; set; } = null!;
    
    public Guid BookingId { get; set; }
    public Booking Booking { get; set; } = null!;
    
    // Content rotation
    public int RotationIntervalSeconds { get; init; } = 5; // Duration per creative
    
    public bool IsEnabled { get; set; } = true;
    
    // Playback quality
    [MaxLength(20)]
    public string PlaybackQuality { get; init; } = "HD"; // HD, SD, 4K
    
    public ICollection<DigitalSignageContent> Contents { get; init; } = [];
}

// ============================================================================
// DigitalSignageContent — individual ad creative in rotation
// ============================================================================
[Table("digital_signage_contents")]
public sealed class DigitalSignageContent : EntityBase {
    public Guid ScheduleId { get; set; }
    public DigitalSignageSchedule Schedule { get; set; } = null!;
    
    [MaxLength(500)]
    public string Url { get; init; } = null!; // Cloudinary URL
    
    [MaxLength(20)]
    public string MediaType { get; init; } = "IMAGE"; // IMAGE, VIDEO
    
    public int DurationSeconds { get; init; } = 5; // How long to display
    
    public int OrderIndex { get; init; } // Rotation order
    
    public bool IsActive { get; set; } = true;
    
    // Tracking
    public long ViewCount { get; set; } = 0;
    public DateTime? FirstShownAt { get; set; }
    public DateTime? LastShownAt { get; set; }
}

// ============================================================================
// DigitalSignageEvent — audit trail and proof-of-display
// ============================================================================
[Table("digital_signage_events")]
public sealed class DigitalSignageEvent : EntityBase {
    public Guid DigitalSignageSpaceId { get; set; }
    public DigitalSignageSpace DigitalSignageSpace { get; set; } = null!;
    
    public Guid? ContentId { get; set; }
    public DigitalSignageContent? Content { get; set; }
    
    [MaxLength(50)]
    public string EventType { get; init; } = null!; // CONTENT_DISPLAYED, DEVICE_ONLINE, ERROR, etc.
    
    [MaxLength(1000)]
    public string? Details { get; init; } // JSON metadata
    
    // Proof data
    public DateTime OccurredAt { get; init; }
    
    [MaxLength(500)]
    public string? ScreenshotUrl { get; set; } // Optional: proof screenshot
}

// ============================================================================
// Enums
// ============================================================================
public enum DigitalSignageStatus {
    Offline,
    Online,
    Idle,
    Playing,
    Error
}
```

### Integration with Existing Entities

**Space.cs modifications:**
```csharp
public sealed class Space : EntityBase {
    // ... existing properties ...
    
    // NEW: Support for digital signage
    public SpaceType Type { get; init; } // Already exists
    // Type.DigitalDisplay or Type.Monitor to be added
    
    [MaxLength(20)]
    public string? SignageDeviceType { get; init; } // MONITOR, TV_STICK, etc.
    
    public bool IsDigitalSignage { get; set; } = false;
    
    // NEW: Relationship
    public DigitalSignageSpace? DigitalSignageSpace { get; set; }
}

public enum SpaceType {
    // ... existing types ...
    DigitalDisplay,    // NEW
    Monitor            // NEW
}
```

**Booking.cs — no changes needed**, but schedule created automatically on booking confirmation.

### EF Configuration

```csharp
// In AppDbContext.OnModelCreating:
new DigitalSignageSpaceConfig().Configure(modelBuilder.Entity<DigitalSignageSpace>());
new DigitalSignageDeviceConfig().Configure(modelBuilder.Entity<DigitalSignageDevice>());
new DigitalSignageScheduleConfig().Configure(modelBuilder.Entity<DigitalSignageSchedule>());
new DigitalSignageContentConfig().Configure(modelBuilder.Entity<DigitalSignageContent>());
new DigitalSignageEventConfig().Configure(modelBuilder.Entity<DigitalSignageEvent>());
```

---

## 3. ARCHITECTURE DECISION

### **Recommendation: Integrated + Separate Signaling Service**

A hybrid approach is optimal:

```
┌─────────────────────────────────────────────────────────────────┐
│ .NET Backend (HotChocolate GraphQL)                             │
│ ├─ Digital Signage Mutations & Queries                          │
│ ├─ Device pairing endpoint                                      │
│ ├─ Webhook receiver for Stripe payment → trigger booking       │
│ └─ Database (PostgreSQL) - single source of truth              │
└─────────────────────────────────────────────────────────────────┘
         │
         │ Payment Confirmed
         ▼
┌─────────────────────────────────────────────────────────────────┐
│ Message Queue (Redis Pub/Sub or Azure Service Bus)              │
│ Event: "BookingConfirmed:device-123"                            │
└─────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│ Node.js Signaling Service (NEW - tRPC + WebSockets)            │
│ ├─ Same PostgreSQL (shared EF migrations)                       │
│ ├─ Device connection pool                                       │
│ ├─ Content push logic                                           │
│ ├─ Health check loop                                            │
│ └─ WebSocket server                                             │
└─────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│ Player Apps (React Vite SPA)                                   │
│ ├─ Raspberry Pi (Chromium kiosk mode)                           │
│ ├─ Fire TV Stick (custom launcher)                              │
│ └─ Chrome browser on any device (testing)                       │
└─────────────────────────────────────────────────────────────────┘
```

### Why This Approach?

| Decision | Reasoning |
|----------|-----------|
| **Separate Node.js service** | WebSocket scaling is easier in Node.js; .NET is overkill for connection pooling; can scale independently |
| **Shared PostgreSQL** | Single source of truth; avoid sync complexity; same migrations |
| **tRPC** | Perfect for device-to-service communication; type-safe RPC calls from player app |
| **Redis/Pub-Sub** | Decouple booking confirmation from content push; enables retry logic |
| **Vite React** | Minimal, fast; Chromium kiosk mode doesn't need Next.js complexity |

---

## 4. FILE-BY-FILE IMPLEMENTATION PLAN

### Phase 1: Database Schema + Backend Signaling Service Setup (2 weeks)

#### Backend Changes (.NET)

**1. `backend/Data/Entities/DigitalSignage*.cs`** (5 new files)
```
Create:
├── DigitalSignageSpace.cs
├── DigitalSignageDevice.cs
├── DigitalSignageSchedule.cs
├── DigitalSignageContent.cs
├── DigitalSignageEvent.cs
├── Enums.cs (add DigitalSignageStatus, update SpaceType)
└── Configs/ (5 new IEntityTypeConfiguration files)

Modify:
├── Space.cs (add IsDigitalSignage, SignageDeviceType, relationship)
├── SpaceConfig.cs (configure new relationship)
└── Enums.cs (add DigitalSignageStatus enum)
```

**2. `backend/Features/DigitalSignage/` (new feature module)**
```
Create:
├── DigitalSignageQueries.cs
│   ├── Query GetDigitalSignageSpace(spaceId)
│   ├── Query ListDigitalSignageSpaces(filters)
│   ├── Query GetDeviceHealthStatus(spaceId)
│   └── Query GetProofOfDisplay(bookingId) - event logs
│
├── DigitalSignageMutations.cs
│   ├── Mutation RegisterDigitalSignageSpace
│   ├── Mutation PairDevice (returns pairing code)
│   ├── Mutation ConfirmDevicePairing (validates code → generates JWT)
│   ├── Mutation UpdateDeviceStatus (heartbeat)
│   ├── Mutation CreateScheduleForBooking (triggered on payment)
│   ├── Mutation AddContentToSchedule
│   ├── Mutation RemoveContent
│   └── Mutation LogSignageEvent
│
├── DigitalSignageRepository.cs
│   ├── CreateDigitalSignageSpace()
│   ├── GetDeviceByToken(token)
│   ├── UpdateDeviceHeartbeat()
│   ├── GetActiveSchedules()
│   └── LogEvent()
│
├── DigitalSignageService.cs
│   ├── GeneratePairingCode() - 6-digit code
│   ├── GenerateDeviceToken() - JWT with space+device scope
│   ├── PublishToQueue(event) - send to Redis
│   ├── ValidateDeviceAuth(token)
│   └── GetProofOfDisplayReport(booking)
│
├── PairingCodeGenerator.cs
│   └── GenerateCode() - alphanumeric 6-char
│
└── BookingPaymentListener.cs (Stripe webhook handler)
    └── OnPaymentSucceeded() - create schedule if digital space
```

**3. `backend/Bootstrap/Services.cs` modifications**
```csharp
// Add to Services.AddServices():
.AddScoped<IDigitalSignageService, DigitalSignageService>()
.AddScoped<IDigitalSignageRepository, DigitalSignageRepository>()
.AddSingleton<BookingPaymentListener>()
.AddStackExchangeRedisCache(options => {
    options.Configuration = envVars["REDIS_CONNECTION"]!.ToString();
})
```

**4. Database Migrations**
```
Create: `backend/Data/Migrations/AddDigitalSignageSchema.cs`
- CreateTable digital_signage_spaces
- CreateTable digital_signage_devices
- CreateTable digital_signage_schedules
- CreateTable digital_signage_contents
- CreateTable digital_signage_events
- AddColumn IsDigitalSignage to spaces
- AddIndex on spaces(IsDigitalSignage, Status)
- AddIndex on devices(PairingCode, TokenExpiresAt)
```

---

#### **Node.js Signaling Service (NEW Project)**

**5. Create `services/signaling/` directory**
```
services/
└── signaling/
    ├── package.json
    ├── tsconfig.json
    ├── .env.example
    ├── Dockerfile
    ├── src/
    │   ├── index.ts (entry point)
    │   ├── trpc/
    │   │   ├── router.ts (device auth, heartbeat, command handlers)
    │   │   └── context.ts (device context from token)
    │   ├── websocket/
    │   │   ├── handler.ts (connection/message/close)
    │   │   ├── pool.ts (DeviceConnectionPool class)
    │   │   └── types.ts (IDeviceConnection interface)
    │   ├── services/
    │   │   ├── ContentPushService.ts
    │   │   ├── DeviceHealthService.ts
    │   │   ├── DatabaseService.ts (Prisma client wrapper)
    │   │   └── RedisSubscriber.ts (listen for booking events)
    │   ├── middleware/
    │   │   ├── auth.ts (verify device JWT)
    │   │   └── logger.ts
    │   ├── jobs/
    │   │   ├── DeviceHealthCheck.ts (every 30s)
    │   │   └── ContentRotationUpdater.ts (sync content)
    │   └── utils/
    │       ├── jwt.ts
    │       └── metrics.ts
    ├── tests/
    │   ├── device-auth.test.ts
    │   ├── content-push.test.ts
    │   └── connection-pool.test.ts
    ├── docs/
    │   ├── API.md (tRPC handlers)
    │   ├── WEBSOCKET-PROTOCOL.md
    │   └── DEPLOYMENT.md
    └── .dockerignore
```

**6. `services/signaling/package.json`**
```json
{
  "name": "@elaview/signaling-service",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "tsup watch",
    "start": "node dist/index.js",
    "build": "tsup",
    "test": "vitest",
    "test:coverage": "vitest --coverage"
  },
  "dependencies": {
    "@trpc/server": "^11.0.0",
    "ws": "^8.18.0",
    "@prisma/client": "^5.20.0",
    "redis": "^4.6.0",
    "jsonwebtoken": "^9.1.0",
    "dotenv": "^16.4.0",
    "loglevel": "^1.9.0",
    "node-cron": "^3.0.0"
  },
  "devDependencies": {
    "typescript": "^5.7.0",
    "tsup": "^8.2.0",
    "@types/node": "^22.0.0",
    "@types/jsonwebtoken": "^9.0.0",
    "@types/ws": "^8.5.12",
    "vitest": "^2.0.0"
  }
}
```

**7. `services/signaling/src/index.ts`**
```typescript
// - Setup Express/TRPC server
// - Init WebSocket server on :8001
// - Connect Prisma client
// - Start Redis subscriber
// - Start health check job
// - Graceful shutdown
```

**8. `services/signaling/src/trpc/router.ts`** - Core tRPC handlers
```typescript
export const signalingRouter = router({
  // Device authentication
  auth: publicProcedure
    .input(z.object({ deviceToken: z.string() }))
    .query(async ({ input, ctx }) => {
      // Validate JWT, return device info & active schedule
    }),
  
  // Heartbeat (every 30s from device)
  heartbeat: protectedDeviceProcedure
    .input(z.object({
      status: z.enum(["ONLINE", "PLAYING", "ERROR"]),
      batteryLevel: z.number().optional(),
      ipAddress: z.string().optional()
    }))
    .mutation(async ({ input, ctx }) => {
      // Update LastHeartbeat & health metrics
      // Return current schedule if changed
    }),
  
  // Acknowledge content received
  ackContent: protectedDeviceProcedure
    .input(z.object({ contentId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      // Mark content as viewed
      // Create CONTENT_DISPLAYED event
    }),
  
  // Report playback error
  reportError: protectedDeviceProcedure
    .input(z.object({
      errorType: z.string(),
      message: z.string()
    }))
    .mutation(async ({ input, ctx }) => {
      // Log error event
      // Notify space owner via notification
    })
});
```

**9. `services/signaling/src/websocket/pool.ts`** - Device connection pool
```typescript
export class DeviceConnectionPool {
  private devices = new Map<string, IDeviceConnection>(); // spaceId -> connection
  
  addConnection(spaceId: string, socket: WebSocket, auth: DeviceAuth)
  removeConnection(spaceId: string)
  pushContent(spaceId: string, contentIds: string[])
  broadcastStatus(spaceId: string, status: string)
  getConnectedDevices(): string[]
  isConnected(spaceId: string): boolean
}
```

---

### Phase 2: Player App (React Vite SPA) (2 weeks)

**10. Create `apps/player/` (new Vite app)**
```
apps/
└── player/
    ├── package.json
    ├── vite.config.ts
    ├── tsconfig.json
    ├── index.html
    ├── .env.example
    ├── Dockerfile
    ├── src/
    │   ├── main.tsx
    │   ├── App.tsx (routing, full-screen mode)
    │   ├── pages/
    │   │   ├── PairingPage.tsx (QR code, pairing code entry)
    │   │   ├── PlaybackPage.tsx (fullscreen content display)
    │   │   └── StatusPage.tsx (device health, offline fallback)
    │   ├── components/
    │   │   ├── ContentRotator.tsx (image/video rotation)
    │   │   ├── DeviceStatus.tsx (battery, online/offline)
    │   │   └── ErrorBoundary.tsx
    │   ├── services/
    │   │   ├── deviceService.ts (JWT storage, device ID)
    │   │   ├── websocketClient.ts (connect to signaling)
    │   │   ├── contentFetcher.ts (load images/videos)
    │   │   └── kioskMode.ts (fullscreen APIs)
    │   ├── hooks/
    │   │   ├── useDevicePairing.ts
    │   │   ├── useWebSocket.ts
    │   │   ├── useContentRotation.ts
    │   │   └── useDeviceHealth.ts
    │   ├── types/
    │   │   └── device.ts (interfaces)
    │   ├── utils/
    │   │   ├── qrcode.ts (generate pairing QR)
    │   │   └── localStorage.ts (secure token storage)
    │   └── styles/
    │       └── globals.css (fullscreen, dark theme)
    ├── public/
    │   └── no-signal.png (fallback image)
    └── tests/
        ├── device-pairing.test.tsx
        └── content-rotation.test.tsx
```

**11. `apps/player/package.json`**
```json
{
  "name": "@elaview/player",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "ws": "^8.18.0",
    "qrcode": "^1.5.0",
    "tailwindcss": "^4.0.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.0",
    "vite": "^6.0.0",
    "typescript": "^5.7.0",
    "vitest": "^2.0.0"
  }
}
```

**12. `apps/player/src/App.tsx`** - Main routing & kiosk setup
```typescript
// - Request fullscreen on startup
// - Implement routing: Pairing → Playback → Status
// - Handle WebSocket connection/disconnection
// - Keep screen awake (prevent sleep)
// - Handle Ctrl+Alt+Q to exit (dev mode)
```

**13. `apps/player/src/pages/PairingPage.tsx`**
```typescript
// - Display generated QR code with space ID
// - Text input for 6-digit pairing code (fallback)
// - Call /api/pair endpoint on backend
// - Receive device JWT, store securely
// - Transition to Playback once paired
```

**14. `apps/player/src/pages/PlaybackPage.tsx`**
```typescript
// - Full-screen content loop
// - Image: display 5-10s per creative
// - Video: play to completion
// - Error handling: show fallback image
// - Heartbeat every 30s to signaling service
```

---

### Phase 3: Dashboard Integration (1.5 weeks)

**15. Backend GraphQL Extensions**
```
Modify: `backend/Features/DigitalSignage/DigitalSignageQueries.cs`

Add Query:
- GetSpaceOwnerSignageDevices(profileId)
  ├─ List all digital signage spaces
  ├─ Include connection status
  ├─ Include active schedule + content
  └─ Include recent events

- GetBookingProofOfDisplay(bookingId)
  ├─ All content display events
  ├─ Screenshots if available
  ├─ Advertiser can check proof
```

**16. Frontend Space Owner Dashboard**
```
Create: `clients/web/src/app/(protected)/@spaceOwner/digital-signage/`
├── page.tsx (list of digital spaces)
├── [id]/
│   ├── page.tsx (space detail with live status)
│   ├── settings.tsx (resolution, rotation interval)
│   ├── content.tsx (current schedule preview)
│   └── events.tsx (proof-of-display log)
└── setup/ (onboarding for new digital space)
```

**17. Frontend Advertiser Proof-of-Display**
```
Create: `clients/web/src/app/(protected)/@advertiser/campaigns/[id]/proof-of-display.tsx`
├─ View all spaces where creative ran
├─ Display event timeline (when shown, duration)
├─ Download proof certificate
└─ Optional: screenshot gallery
```

**18. Space Owner Device Management UI**
```
Create: `clients/web/src/components/digital-signage/`
├── DeviceCard.tsx (status, battery, IP)
├── PairingQRModal.tsx (display pairing QR)
├── ContentPreview.tsx (show current rotation)
├── HealthMonitor.tsx (real-time heartbeat)
└── EventLog.tsx (scrollable time-series)
```

---

### Phase 4: Hardware Onboarding (1 week)

**19. Raspberry Pi Setup Guide**
```
Create: `docs/HARDWARE_SETUP.md`

Sections:
├─ Ingredients: Pi 4, PSU, SD card, HDMI display
├─ OS Installation (Raspberry Pi OS Lite)
├─ Setup Script: `setup-elaview-player.sh`
│  ├─ Install Chromium
│  ├─ Run player app from kiosk launcher
│  ├─ Auto-start WebSocket reconnect
│  └─ System logs → tail command
├─ QR Code Sticker: print pairing QR for admin
├─ Network Config: WiFi or Ethernet
└─ Troubleshooting: common startup issues
```

**20. `scripts/setup-elaview-player.sh`** (Raspberry Pi provisioning)
```bash
#!/bin/bash
# 1. Update system
# 2. Install Chromium + unclutter (hide cursor)
# 3. Clone player app repo
# 4. Build Vite production bundle
# 5. Create systemd service to auto-start
# 6. Setup cron for crash recovery
```

**21. `docker/Dockerfile.player`** (for x86 testing)
```dockerfile
FROM node:22-alpine AS build
WORKDIR /app
COPY apps/player .
RUN npm install && npm run build

FROM node:22-alpine
RUN apk add --no-cache chromium
COPY --from=build /app/dist /app
EXPOSE 5173
CMD ["npx", "vite", "preview", "--host"]
```

**22. Fire TV Stick Setup** (alternative)
```
Create: `docs/FIRETV_SETUP.md`

Sections:
├─ Sideload APK (custom React Native Expo wrapper)
├─ Configure WiFi
├─ Launch pairing on first boot
└─ Auto-update mechanism
```

---

## 5. RISK FLAGS & MITIGATION

### ⚠️ **Critical Concerns**

| Risk | Severity | Mitigation |
|------|----------|-----------|
| **WebSocket scaling** | HIGH | Use Redis adapter for horizontal scaling; load test with 1000+ concurrent |
| **Content distribution** | HIGH | Pre-generate adaptive bitrates via Cloudinary; test CDN delivery to Pi |
| **Device auth token leak** | HIGH | Rotate tokens monthly; only send over HTTPS/WSS; use short expiry (24h) |
| **Network reliability** | HIGH | Offline mode: cache last 10 creatives; heartbeat detects dropouts; retry queue |
| **Stripe webhook race conditions** | MEDIUM | Idempotent keys; check schedule exists before creating; add status column to track |
| **Database migration for existing spaces** | MEDIUM | Non-blocking migration; `IsDigitalSignage` defaults to `false`; no data loss |
| **Timezone handling for schedules** | MEDIUM | Store all in UTC; player converts to local time |

### 🔒 **Security Concerns**

1. **Device Authentication**
   - ✅ Use JWT with scope: `{spaceId, deviceId, exp}`
   - ✅ Pairing code valid for 15 minutes only
   - ✅ One device per space (enforce in repo)

2. **Content Access**
   - ✅ Sign Cloudinary URLs with time-limited tokens
   - ✅ Only show content for active booking period
   - ✅ Validate advertiser can modify content

3. **Device Impersonation**
   - ✅ Rate limit pairing attempts (5 per minute per space)
   - ✅ Log all pairing attempts
   - ✅ Alert space owner on failed pairing

### 📊 **Performance Concerns**

| Metric | Target | Approach |
|--------|--------|----------|
| Content push latency | < 1s | WebSocket + Redis; no polling |
| Device reconnection | < 5s | Exponential backoff; max 30s wait |
| Heartbeat overhead | < 1KB/msg | Binary format or compress JSON |
| DB queries/device | < 10/min | Cache schedule in memory; 5m TTL |
| Concurrent devices | 10,000+ | Redis pub/sub sharding; separate signaling instance per 2000 devices |

### 🔍 **Existing Architectural Impact**

✅ **No breaking changes to:**
- Existing Space/Booking entities
- Payment flow
- GraphQL API versioning
- Frontend auth

⚠️ **Database migration required:**
- Add 5 new tables
- Add 2 columns to `spaces`
- One backward-compatible migration (no downtime)

---

## 6. PHASED IMPLEMENTATION TIMELINE

```
Phase 1: Database Schema + Backend Signaling (Weeks 1-2)
├─ Day 1-2: Entity definitions + EF configs
├─ Day 3: Stripe webhook listener setup
├─ Day 4-5: tRPC Node.js service scaffold
├─ Day 6-7: WebSocket connection pool + tests
├─ Day 8-10: Integration test (booking → device push)
└─ Day 11-14: Deploy signaling service to staging

Phase 2: Player App (Weeks 3-4)
├─ Day 1-2: Vite app scaffold + Pairing UI
├─ Day 3-4: Playback logic + content rotation
├─ Day 5-6: Device health monitoring + error handling
├─ Day 7-10: Kiosk mode + fullscreen APIs
└─ Day 11-14: Kiosk mode + fullscreen APIs

Phase 3: Dashboard Integration (Weeks 5-6)
├─ Day 1-3: Space owner device management UI
├─ Day 4-5: Advertiser proof-of-display views
├─ Day 6-7: GraphQL extensions for queries
└─ Day 8-10: End-to-end testing

Phase 4: Hardware Onboarding (Week 7)
├─ Day 1-2: Raspberry Pi setup scripts
├─ Day 3-4: Fire TV Stick APK wrapper
├─ Day 5: Documentation + troubleshooting guide
└─ Day 6-7: Hardware stress testing (100+ devices simulator)
```

---

## 7. TESTING STRATEGY

### Unit Tests
- Device pairing code generation (uniqueness, format)
- JWT token validation (expiry, signature)
- Content rotation logic (ordering, duration)
- Event logging (proper field mapping)

### Integration Tests
- Booking confirmation → Schedule auto-creation
- Stripe webhook → Database update + Redis publish
- Device auth → tRPC handler execution
- Content push → Player app receives updates

### E2E Tests (Playwright)
- Space owner pairing flow: register space → pair device → see online status
- Advertiser booking flow: book digital space → pay → content on screen
- Proof dashboard: verify content was displayed for X hours
- Device failover: disconnect → reconnect → sync content

### Load Tests
- 1000 concurrent WebSocket connections
- 10,000 events/sec through Redis
- 100 heartbeats/sec database writes

---

## 8. DEPLOYMENT CHECKLIST

### Pre-Launch
- [ ] Database migrations tested on staging
- [ ] Signaling service load tested (1000+ devices)
- [ ] Player app tested on actual Raspberry Pi hardware
- [ ] Stripe webhook endpoint registered + secrets rotated
- [ ] Redis persistence enabled (backup strategy)
- [ ] CloudFlare DDoS protection configured for WebSocket endpoint
- [ ] Monitoring/alerting for device offline > 5 min
- [ ] Runbooks for common failure modes

### Day-of Launch
- [ ] Canary: 5% of spaces → digital signage
- [ ] Monitor error rates, device connections, content delivery
- [ ] Space owner support on standby
- [ ] Player app auto-update mechanism (if using managed deployment)

---

## 9. NEXT STEPS

### Immediate: This Week
1. Review this architecture with team
2. Create GitHub issue/epic for Phase 1
3. Set up `services/signaling/` directory structure
4. Order Raspberry Pi hardware for dev/testing

### Short-term: Phase 1 Start
1. Begin backend entity implementation
2. Create EF Core migrations
3. Implement Stripe webhook listener
4. Set up Node.js signaling service skeleton

---

## APPENDIX: Decision Questions

**Q: Should we use REST instead of tRPC for device endpoints?**  
A: No. tRPC provides type-safe client stubs in player app; reduces serialization bugs; better DX.

**Q: Can one signaling service handle 10k+ devices?**  
A: No. Design for 2000 devices/instance; use load balancer + Redis adapter to scale horizontally.

**Q: What if WiFi drops during booking?**  
A: Offline cache. Device stores last 10 creatives locally; continues rotation; syncs when online.

**Q: Should Raspberry Pi auto-update the player app?**  
A: Yes, via systemd timer + GitHub releases; revert if new version can't connect within 5 min.

**Q: Can we use existing Next.js frontend for the player app?**  
A: No. Next.js requires Node server; Raspberry Pi needs single HTML file that can run offline.

---

**Document Version:** 1.0  
**Last Updated:** March 20, 2026  
**Author:** Architecture Review  
**Status:** Ready for Team Review
