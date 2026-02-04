# Backlog

## Message Analytics

**Date:** 2026-02-04 | **Status:** Deferred

Add computed `responseRate` and `averageResponseTime` fields to `SpaceOwnerProfile` and `AdvertiserProfile`. These require aggregating message timestamps from the conversations system.

**Blocked by:** Conversation/message volume — analytics are only meaningful once there is sufficient messaging activity.

**Approach:**
- Query first reply timestamps per conversation to compute average response time
- Compute response rate as (conversations with at least one reply) / (total conversations received)
- Expose as computed GraphQL fields on both profile types

**Tasks:**

- [ ] Add `responseRate` computed field to `SpaceOwnerProfile`
- [ ] Add `averageResponseTime` computed field to `SpaceOwnerProfile`
- [ ] Add `responseRate` computed field to `AdvertiserProfile`
- [ ] Add `averageResponseTime` computed field to `AdvertiserProfile`
- [ ] Add repository methods to aggregate message timestamps per conversation
- [ ] Add unit tests for edge cases (no messages, single message, etc.)

**Depends on:** `Features/Notifications/` — `IMessageRepository`, `IConversationRepository`

---

## Cloudinary Signed Upload (Web Integration)

**Date:** 2026-02-04 | **Status:** Backend Complete

Backend endpoint ready at `POST /api/storage/upload-signature` (cookie auth required). Web client integration pending.

**Endpoint:**

```
POST /api/storage/upload-signature

Request:  { folder?: string, publicId?: string, tags?: string[] }
Response: { signature, timestamp, apiKey, cloudName, folder?, publicId? }
```

**Client-side upload flow:**
1. `POST /api/storage/upload-signature` with `{ folder: "avatars" }`
2. Build `FormData`: file + all response fields
3. `POST` to `https://api.cloudinary.com/v1_1/{cloudName}/image/upload`
4. Cloudinary returns `{ secure_url, public_id, ... }`
5. Save URL via `updateCurrentUser(input: { avatar: secure_url })`

**Conventions:** folder `"avatars"` for user avatars, `"campaigns"` for campaign images. Signature valid 1 hour.

**Tasks:**

- [x] Backend endpoint (`Features/Storage/StorageController.cs`)
- [ ] Web: create upload helper / hook
- [ ] Web: integrate avatar upload in settings
- [ ] Web: integrate campaign image upload