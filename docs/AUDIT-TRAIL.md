# Elaview Audit Trail

> Audit logging and compliance documentation for the Elaview platform.

## Table of Contents

- [Purpose](#purpose)
- [What Gets Logged](#what-gets-logged)
- [Audit Log Schema](#audit-log-schema)
- [Retention Policies](#retention-policies)
- [Access Control](#access-control)
- [Implementation](#implementation)
- [Querying Audit Logs](#querying-audit-logs)
- [Compliance Reports](#compliance-reports)
- [Monitoring & Alerts](#monitoring--alerts)
- [Data Privacy](#data-privacy)

---

## Purpose

Audit logging provides:

| Purpose | Description |
|---------|-------------|
| **Compliance** | Financial transaction records for Stripe/legal/tax requirements |
| **Debugging** | Trace issues across the system with full context |
| **Security** | Detect unauthorized access or suspicious activity |
| **Support** | Resolve user disputes with timestamped evidence |
| **Analytics** | Understand system usage patterns |

### Key Principles

```
✓ Append-only — logs cannot be modified or deleted
✓ Immutable — once written, data is permanent
✓ Complete — capture all relevant context
✓ Timestamped — UTC timestamps for all events
✓ Indexed — efficient querying by common dimensions
```

---

## What Gets Logged

### Financial Events (REQUIRED — 7 year retention)

Critical for legal compliance and dispute resolution.

| Event | Trigger | Data Captured |
|-------|---------|---------------|
| `PAYMENT_INITIATED` | `createPaymentIntent` mutation | bookingId, amount, currency, userId |
| `PAYMENT_SUCCEEDED` | Stripe `payment_intent.succeeded` webhook | paymentIntentId, amount, fees, netAmount |
| `PAYMENT_FAILED` | Stripe `payment_intent.payment_failed` webhook | paymentIntentId, error, failureCode, failureMessage |
| `PAYOUT_INITIATED` | Stage 1 or Stage 2 trigger | bookingId, amount, stage, recipientId, stripeAccountId |
| `PAYOUT_COMPLETED` | Stripe `transfer.paid` webhook | transferId, amount, arrivalDate |
| `PAYOUT_FAILED` | Stripe `transfer.failed` webhook | transferId, error, failureCode |
| `REFUND_INITIATED` | Cancellation or dispute resolution | bookingId, amount, reason, initiatedBy |
| `REFUND_COMPLETED` | Stripe `refund.created` webhook | refundId, amount, paymentIntentId |
| `REFUND_FAILED` | Stripe `refund.failed` webhook | refundId, error, failureReason |
| `DISPUTE_OPENED` | User or admin action | bookingId, reason, openedBy, disputeType |
| `DISPUTE_RESOLVED` | Admin resolution | bookingId, resolution, resolvedBy, payoutDecision |

### Booking Events (2 year retention)

Track the complete booking lifecycle.

| Event | Trigger | Data Captured |
|-------|---------|---------------|
| `BOOKING_CREATED` | New booking request | bookingId, advertiserId, spaceId, spaceOwnerId, dates, price |
| `BOOKING_STATUS_CHANGED` | Status transition | bookingId, fromStatus, toStatus, triggeredBy, reason |
| `BOOKING_ACCEPTED` | Owner accepts | bookingId, ownerId, expiresAt |
| `BOOKING_DECLINED` | Owner declines | bookingId, ownerId, reason |
| `BOOKING_CANCELLED` | Either party cancels | bookingId, cancelledBy, reason, refundAmount |
| `BOOKING_EXPIRED` | Request timeout | bookingId, expiredAt |
| `FILE_DOWNLOADED` | Owner downloads creative | bookingId, ownerId, fileKey |
| `VERIFICATION_SUBMITTED` | Photos uploaded | bookingId, photoCount, gpsValid, gpsCoordinates |
| `VERIFICATION_APPROVED` | Advertiser approves | bookingId, approvedBy, autoApproved |
| `VERIFICATION_REJECTED` | Advertiser rejects | bookingId, rejectedBy, reason |
| `AUTO_APPROVAL_TRIGGERED` | 48hr timeout | bookingId, verificationId, payoutAmount |

### User Events (2 year retention)

User account and profile changes.

| Event | Trigger | Data Captured |
|-------|---------|---------------|
| `USER_CREATED` | Registration | userId, email, role, authProvider |
| `USER_UPDATED` | Profile update | userId, changedFields (names only, not values) |
| `USER_ROLE_CHANGED` | Role addition/change | userId, fromRoles, toRoles, changedBy |
| `USER_VERIFIED` | Identity verification | userId, verificationType, status |
| `USER_DELETED` | Account deletion | userId, email (hashed), deletedBy, reason |
| `USER_SUSPENDED` | Admin suspension | userId, suspendedBy, reason, duration |
| `PASSWORD_CHANGED` | Password update | userId, method (reset/change) |
| `PASSWORD_RESET_REQUESTED` | Forgot password | email (hashed), ipAddress |

### Space Events (2 year retention)

Space listing lifecycle.

| Event | Trigger | Data Captured |
|-------|---------|---------------|
| `SPACE_CREATED` | New listing | spaceId, ownerId, categoryId, typeId |
| `SPACE_UPDATED` | Listing edit | spaceId, changedFields (names only) |
| `SPACE_PUBLISHED` | Listing goes live | spaceId, ownerId |
| `SPACE_UNPUBLISHED` | Listing hidden | spaceId, reason |
| `SPACE_DELETED` | Listing removed | spaceId, ownerId, reason |
| `SPACE_PHOTO_ADDED` | Photo upload | spaceId, photoId, position |
| `SPACE_PHOTO_REMOVED` | Photo deleted | spaceId, photoId |

### System Events (90 day retention)

Background jobs and integrations.

| Event | Trigger | Data Captured |
|-------|---------|---------------|
| `SCHEDULED_JOB_STARTED` | Cron job begins | jobName, scheduledAt |
| `SCHEDULED_JOB_COMPLETED` | Cron job finishes | jobName, duration, itemsProcessed, errors |
| `SCHEDULED_JOB_FAILED` | Cron job error | jobName, error, stack |
| `EXTERNAL_API_CALL` | Outbound API request | service, endpoint, duration, statusCode |
| `EXTERNAL_API_FAILURE` | API error | service, endpoint, error, retryCount |
| `WEBHOOK_RECEIVED` | Inbound webhook | source, eventType, payloadId |
| `WEBHOOK_PROCESSED` | Webhook handled | source, eventType, result |
| `RATE_LIMIT_EXCEEDED` | Too many requests | userId, endpoint, count, windowMinutes |
| `CACHE_INVALIDATED` | Cache clear | cacheKey, reason |

### Security Events (1 year retention)

Authentication and access control.

| Event | Trigger | Data Captured |
|-------|---------|---------------|
| `AUTH_LOGIN_SUCCESS` | Successful login | userId, method, ipAddress, userAgent |
| `AUTH_LOGIN_FAILURE` | Failed login | email (hashed), reason, ipAddress, attemptCount |
| `AUTH_LOGOUT` | User logout | userId, sessionDuration |
| `AUTH_TOKEN_REFRESHED` | Token refresh | userId, tokenId |
| `AUTH_MFA_ENABLED` | MFA setup | userId, method |
| `AUTH_MFA_DISABLED` | MFA removed | userId, disabledBy |
| `PERMISSION_DENIED` | Unauthorized access | userId, resource, action, reason |
| `SUSPICIOUS_ACTIVITY` | Anomaly detected | userId, activityType, details |

### Error Events (30 day retention)

Application errors for debugging.

| Event | Trigger | Data Captured |
|-------|---------|---------------|
| `UNHANDLED_ERROR` | Uncaught exception | error, stack, context, requestId |
| `VALIDATION_ERROR` | Invalid input | endpoint, input (sanitized), validationErrors |
| `GRAPHQL_ERROR` | Query/mutation error | operationName, variables (sanitized), error |
| `DATABASE_ERROR` | DB operation failure | operation, table, error |

### Admin Events (7 year retention)

Administrative actions require long retention.

| Event | Trigger | Data Captured |
|-------|---------|---------------|
| `ADMIN_LOGIN` | Admin authentication | adminId, ipAddress |
| `ADMIN_ACTION` | Any admin operation | adminId, action, targetType, targetId, details |
| `CATEGORY_CREATED` | New space category | categoryId, adminId, config |
| `CATEGORY_UPDATED` | Category config change | categoryId, adminId, changes |
| `TYPE_CREATED` | New space type | typeId, categoryId, adminId |
| `TYPE_UPDATED` | Space type change | typeId, adminId, changes |
| `AUDIT_LOG_ACCESSED` | Audit log query | adminId, query, resultCount |
| `REPORT_GENERATED` | Compliance report | adminId, reportType, parameters |

---

## Audit Log Schema

### Database Schema

```sql
-- PostgreSQL schema
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    event_type VARCHAR(100) NOT NULL,
    
    -- Actor (who performed the action)
    actor_id UUID,
    actor_type VARCHAR(20) NOT NULL, -- 'USER', 'SYSTEM', 'ADMIN', 'WEBHOOK'
    
    -- Resource (what was affected)
    resource_type VARCHAR(50) NOT NULL,
    resource_id VARCHAR(100) NOT NULL,
    action VARCHAR(20) NOT NULL, -- 'CREATE', 'UPDATE', 'DELETE', 'READ'
    
    -- Change details (JSONB for flexibility)
    changes JSONB,
    
    -- Context
    metadata JSONB NOT NULL DEFAULT '{}',
    
    -- Indexing
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Retention category (for cleanup jobs)
    retention_category VARCHAR(20) NOT NULL
);

-- Indexes for common queries
CREATE INDEX idx_audit_logs_timestamp ON audit_logs (timestamp DESC);
CREATE INDEX idx_audit_logs_event_type ON audit_logs (event_type);
CREATE INDEX idx_audit_logs_actor_id ON audit_logs (actor_id);
CREATE INDEX idx_audit_logs_resource ON audit_logs (resource_type, resource_id);
CREATE INDEX idx_audit_logs_retention ON audit_logs (retention_category, created_at);

-- Composite index for user transaction queries
CREATE INDEX idx_audit_logs_user_financial ON audit_logs (actor_id, event_type)
    WHERE event_type LIKE 'PAYMENT_%' OR event_type LIKE 'PAYOUT_%';
```

### TypeScript Interface

```typescript
interface AuditLog {
  id: string;                    // UUID
  timestamp: Date;               // When event occurred (UTC)
  eventType: AuditEventType;     // e.g., 'PAYMENT_INITIATED'
  
  // Who performed the action
  actorId: string | null;        // User ID (null for system events)
  actorType: 'USER' | 'SYSTEM' | 'ADMIN' | 'WEBHOOK';
  
  // What was affected
  resourceType: string;          // e.g., 'Booking', 'Payment', 'User'
  resourceId: string;            // ID of affected resource
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'READ';
  
  // Change details (for UPDATE actions)
  changes: {
    [field: string]: {
      before: unknown;
      after: unknown;
    };
  } | null;
  
  // Additional context
  metadata: {
    ipAddress?: string;
    userAgent?: string;
    requestId?: string;
    correlationId?: string;
    bookingId?: string;
    paymentIntentId?: string;
    [key: string]: unknown;
  };
  
  // Classification
  retentionCategory: 'FINANCIAL' | 'USER' | 'SYSTEM' | 'ERROR' | 'ADMIN';
  createdAt: Date;
}

type AuditEventType =
  // Financial
  | 'PAYMENT_INITIATED'
  | 'PAYMENT_SUCCEEDED'
  | 'PAYMENT_FAILED'
  | 'PAYOUT_INITIATED'
  | 'PAYOUT_COMPLETED'
  | 'PAYOUT_FAILED'
  | 'REFUND_INITIATED'
  | 'REFUND_COMPLETED'
  | 'REFUND_FAILED'
  | 'DISPUTE_OPENED'
  | 'DISPUTE_RESOLVED'
  // Booking
  | 'BOOKING_CREATED'
  | 'BOOKING_STATUS_CHANGED'
  | 'BOOKING_ACCEPTED'
  | 'BOOKING_DECLINED'
  | 'BOOKING_CANCELLED'
  | 'BOOKING_EXPIRED'
  | 'FILE_DOWNLOADED'
  | 'VERIFICATION_SUBMITTED'
  | 'VERIFICATION_APPROVED'
  | 'VERIFICATION_REJECTED'
  | 'AUTO_APPROVAL_TRIGGERED'
  // User
  | 'USER_CREATED'
  | 'USER_UPDATED'
  | 'USER_ROLE_CHANGED'
  | 'USER_DELETED'
  | 'USER_SUSPENDED'
  // Space
  | 'SPACE_CREATED'
  | 'SPACE_UPDATED'
  | 'SPACE_PUBLISHED'
  | 'SPACE_DELETED'
  // System
  | 'SCHEDULED_JOB_COMPLETED'
  | 'EXTERNAL_API_FAILURE'
  | 'RATE_LIMIT_EXCEEDED'
  // Security
  | 'AUTH_LOGIN_SUCCESS'
  | 'AUTH_LOGIN_FAILURE'
  | 'PERMISSION_DENIED'
  // Error
  | 'UNHANDLED_ERROR'
  | 'VALIDATION_ERROR'
  // Admin
  | 'ADMIN_ACTION'
  | 'AUDIT_LOG_ACCESSED';
```

---

## Retention Policies

### Retention by Category

| Category | Retention | Auto-Delete | Reason |
|----------|-----------|-------------|--------|
| `FINANCIAL` | 7 years | After 7 years | Legal/tax requirements (IRS, SOX) |
| `ADMIN` | 7 years | After 7 years | Administrative accountability |
| `USER` | 2 years | After 2 years | Dispute resolution window |
| `SYSTEM` | 90 days | After 90 days | Operational debugging |
| `ERROR` | 30 days | After 30 days | Issue triage |

### Cleanup Job

```csharp
// backend/Jobs/AuditLogCleanupJob.cs

public class AuditLogCleanupJob : BackgroundService
{
    private readonly ILogger<AuditLogCleanupJob> _logger;
    private readonly AppDbContext _db;

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await CleanupExpiredLogs();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Audit log cleanup failed");
            }

            // Run daily at 2 AM UTC
            await Task.Delay(TimeSpan.FromHours(24), stoppingToken);
        }
    }

    private async Task CleanupExpiredLogs()
    {
        var now = DateTime.UtcNow;

        var retentionRules = new Dictionary<string, TimeSpan>
        {
            ["FINANCIAL"] = TimeSpan.FromDays(365 * 7), // 7 years
            ["ADMIN"] = TimeSpan.FromDays(365 * 7),     // 7 years
            ["USER"] = TimeSpan.FromDays(365 * 2),      // 2 years
            ["SYSTEM"] = TimeSpan.FromDays(90),         // 90 days
            ["ERROR"] = TimeSpan.FromDays(30),          // 30 days
        };

        foreach (var (category, retention) in retentionRules)
        {
            var cutoff = now - retention;
            
            var deleted = await _db.AuditLogs
                .Where(l => l.RetentionCategory == category)
                .Where(l => l.CreatedAt < cutoff)
                .ExecuteDeleteAsync();

            if (deleted > 0)
            {
                _logger.LogInformation(
                    "Deleted {Count} expired {Category} audit logs (older than {Cutoff})",
                    deleted, category, cutoff);
            }
        }
    }
}
```

### Archival (Optional)

For compliance, archive financial logs to cold storage before deletion:

```csharp
private async Task ArchiveBeforeDelete(string category, DateTime cutoff)
{
    var logsToArchive = await _db.AuditLogs
        .Where(l => l.RetentionCategory == category)
        .Where(l => l.CreatedAt < cutoff)
        .Where(l => l.CreatedAt >= cutoff.AddDays(-30)) // Last 30 days of expiring
        .ToListAsync();

    if (logsToArchive.Any())
    {
        // Export to R2 cold storage
        var archive = new AuditArchive
        {
            Category = category,
            StartDate = logsToArchive.Min(l => l.CreatedAt),
            EndDate = logsToArchive.Max(l => l.CreatedAt),
            Logs = logsToArchive,
        };

        var json = JsonSerializer.Serialize(archive);
        var key = $"audit-archives/{category}/{cutoff:yyyy-MM}/{Guid.NewGuid()}.json.gz";
        
        await _r2Service.PutAsync(key, Compress(json), "application/gzip");
        
        _logger.LogInformation("Archived {Count} logs to {Key}", logsToArchive.Count, key);
    }
}
```

---

## Access Control

### Permission Matrix

| Role | Read | Write | Delete | Export |
|------|------|-------|--------|--------|
| User | ❌ | ❌ | ❌ | ❌ |
| Space Owner | ❌ | ❌ | ❌ | ❌ |
| Advertiser | ❌ | ❌ | ❌ | ❌ |
| Support | Own user's logs | ❌ | ❌ | ❌ |
| Admin | ✅ | ❌ | ❌ | ✅ |
| System | ❌ | ✅ | ❌ | ❌ |

### Key Principles

- **Write:** System only (no manual entries allowed)
- **Delete:** Not allowed (append-only, immutable)
- **Modify:** Not allowed (immutable)
- **Read:** Admin role with query limitations

### Access Logging

**All audit log access is itself logged:**

```csharp
// backend/Services/AuditService.cs

public async Task<List<AuditLog>> QueryLogs(
    AuditLogQuery query,
    string adminUserId)
{
    // Execute query
    var logs = await ExecuteQuery(query);
    
    // Log the access
    await CreateAuditLog(new AuditLogEntry
    {
        EventType = "AUDIT_LOG_ACCESSED",
        ActorId = adminUserId,
        ActorType = ActorType.ADMIN,
        ResourceType = "AuditLog",
        ResourceId = "query",
        Action = "READ",
        Metadata = new Dictionary<string, object>
        {
            ["query"] = SanitizeQuery(query),
            ["resultCount"] = logs.Count,
            ["dateRange"] = new { query.StartDate, query.EndDate },
        },
        RetentionCategory = "ADMIN",
    });
    
    return logs;
}
```

---

## Implementation

### Audit Service

```csharp
// backend/Services/AuditService.cs

public interface IAuditService
{
    Task LogAsync(AuditLogEntry entry);
    Task<List<AuditLog>> QueryAsync(AuditLogQuery query);
}

public class AuditService : IAuditService
{
    private readonly AppDbContext _db;
    private readonly IHttpContextAccessor _httpContext;
    private readonly ILogger<AuditService> _logger;

    public async Task LogAsync(AuditLogEntry entry)
    {
        var log = new AuditLog
        {
            Id = Guid.NewGuid().ToString(),
            Timestamp = DateTime.UtcNow,
            EventType = entry.EventType,
            ActorId = entry.ActorId,
            ActorType = entry.ActorType.ToString(),
            ResourceType = entry.ResourceType,
            ResourceId = entry.ResourceId,
            Action = entry.Action.ToString(),
            Changes = entry.Changes != null 
                ? JsonSerializer.Serialize(entry.Changes) 
                : null,
            Metadata = JsonSerializer.Serialize(EnrichMetadata(entry.Metadata)),
            RetentionCategory = entry.RetentionCategory,
            CreatedAt = DateTime.UtcNow,
        };

        _db.AuditLogs.Add(log);
        await _db.SaveChangesAsync();
    }

    private Dictionary<string, object> EnrichMetadata(Dictionary<string, object>? metadata)
    {
        var enriched = metadata ?? new Dictionary<string, object>();
        
        if (_httpContext.HttpContext != null)
        {
            var context = _httpContext.HttpContext;
            enriched["ipAddress"] = context.Connection.RemoteIpAddress?.ToString();
            enriched["userAgent"] = context.Request.Headers["User-Agent"].ToString();
            enriched["requestId"] = context.TraceIdentifier;
        }

        return enriched;
    }
}
```

### Audit Middleware

```csharp
// backend/Middleware/AuditMiddleware.cs

public class AuditMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IAuditService _auditService;

    public async Task InvokeAsync(HttpContext context)
    {
        // Generate correlation ID for request tracing
        var correlationId = Guid.NewGuid().ToString();
        context.Items["CorrelationId"] = correlationId;
        context.Response.Headers["X-Correlation-Id"] = correlationId;

        // Execute request
        await _next(context);

        // Mutation-level logging is handled by resolvers
        // This middleware handles request-level logging
    }
}
```

### Resolver-Level Logging

```csharp
// backend/GraphQL/Mutations/BookingMutations.cs

[Authorize]
public async Task<Booking> AcceptBooking(
    string bookingId,
    [Service] IBookingService bookingService,
    [Service] IAuditService auditService)
{
    var booking = await _db.Bookings.FindAsync(bookingId);
    var previousStatus = booking.Status;
    
    // Perform action
    booking.Status = BookingStatus.ACCEPTED;
    booking.AcceptedAt = DateTime.UtcNow;
    await _db.SaveChangesAsync();
    
    // Log the action
    await auditService.LogAsync(new AuditLogEntry
    {
        EventType = "BOOKING_ACCEPTED",
        ActorId = currentUserId,
        ActorType = ActorType.USER,
        ResourceType = "Booking",
        ResourceId = bookingId,
        Action = ActionType.UPDATE,
        Changes = new Dictionary<string, FieldChange>
        {
            ["status"] = new FieldChange 
            { 
                Before = previousStatus.ToString(), 
                After = BookingStatus.ACCEPTED.ToString() 
            },
        },
        Metadata = new Dictionary<string, object>
        {
            ["advertiserId"] = booking.AdvertiserId,
            ["spaceId"] = booking.SpaceId,
        },
        RetentionCategory = "USER",
    });
    
    return booking;
}
```

### Webhook Logging

```csharp
// backend/Controllers/WebhookController.cs

[HttpPost("stripe")]
public async Task<IActionResult> HandleStripeWebhook()
{
    var json = await new StreamReader(Request.Body).ReadToEndAsync();
    var stripeEvent = EventUtility.ConstructEvent(json, 
        Request.Headers["Stripe-Signature"], 
        _stripeWebhookSecret);
    
    // Log webhook receipt
    await _auditService.LogAsync(new AuditLogEntry
    {
        EventType = "WEBHOOK_RECEIVED",
        ActorType = ActorType.WEBHOOK,
        ResourceType = "StripeEvent",
        ResourceId = stripeEvent.Id,
        Action = ActionType.CREATE,
        Metadata = new Dictionary<string, object>
        {
            ["source"] = "stripe",
            ["eventType"] = stripeEvent.Type,
            ["livemode"] = stripeEvent.Livemode,
        },
        RetentionCategory = "SYSTEM",
    });
    
    // Process webhook
    var result = await ProcessStripeEvent(stripeEvent);
    
    // Log processing result
    await _auditService.LogAsync(new AuditLogEntry
    {
        EventType = "WEBHOOK_PROCESSED",
        ActorType = ActorType.WEBHOOK,
        ResourceType = "StripeEvent",
        ResourceId = stripeEvent.Id,
        Action = ActionType.UPDATE,
        Metadata = new Dictionary<string, object>
        {
            ["result"] = result.Success ? "success" : "failure",
            ["error"] = result.Error,
        },
        RetentionCategory = "SYSTEM",
    });
    
    return Ok();
}
```

---

## Querying Audit Logs

### GraphQL Queries (Admin Only)

```graphql
# Query audit logs with filters
query GetAuditLogs($input: AuditLogQueryInput!) {
  auditLogs(input: $input) {
    edges {
      node {
        id
        timestamp
        eventType
        actorId
        actorType
        resourceType
        resourceId
        action
        changes
        metadata
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
    totalCount
  }
}

# Get audit trail for specific resource
query GetResourceAuditTrail($resourceType: String!, $resourceId: String!) {
  auditTrail(resourceType: $resourceType, resourceId: $resourceId) {
    id
    timestamp
    eventType
    actorId
    action
    changes
  }
}

# Get user's financial history
query GetUserFinancialHistory($userId: String!) {
  userFinancialAuditTrail(userId: $userId) {
    id
    timestamp
    eventType
    metadata
  }
}
```

### Query Input Types

```graphql
input AuditLogQueryInput {
  # Time range (required)
  startDate: DateTime!
  endDate: DateTime!
  
  # Filters (optional)
  eventTypes: [String!]
  actorId: String
  actorType: ActorType
  resourceType: String
  resourceId: String
  action: Action
  
  # Pagination
  first: Int
  after: String
}
```

### Common Queries

```typescript
// Get all events for a booking
const bookingAudit = await client.query({
  query: GET_RESOURCE_AUDIT_TRAIL,
  variables: {
    resourceType: 'Booking',
    resourceId: 'booking-123',
  },
});

// Get payment failures in last 24 hours
const paymentFailures = await client.query({
  query: GET_AUDIT_LOGS,
  variables: {
    input: {
      startDate: new Date(Date.now() - 86400000),
      endDate: new Date(),
      eventTypes: ['PAYMENT_FAILED'],
    },
  },
});

// Get all admin actions
const adminActions = await client.query({
  query: GET_AUDIT_LOGS,
  variables: {
    input: {
      startDate: startOfMonth,
      endDate: endOfMonth,
      actorType: 'ADMIN',
    },
  },
});
```

---

## Compliance Reports

### Available Reports

| Report | Purpose | Generated |
|--------|---------|-----------|
| User Transaction History | All financial events for a user | On-demand |
| Date Range Report | All events between dates | On-demand |
| Failed Payments Report | Payment failures with details | Weekly |
| Dispute Report | All disputes with resolutions | Monthly |
| Access Report | Who accessed what data | Monthly |
| Admin Activity Report | All admin actions | Monthly |

### Report Generation

```csharp
// backend/Services/ComplianceReportService.cs

public class ComplianceReportService
{
    public async Task<Report> GenerateUserTransactionHistory(
        string userId,
        DateTime startDate,
        DateTime endDate)
    {
        var logs = await _db.AuditLogs
            .Where(l => l.ActorId == userId || l.Metadata.Contains(userId))
            .Where(l => l.RetentionCategory == "FINANCIAL")
            .Where(l => l.Timestamp >= startDate && l.Timestamp <= endDate)
            .OrderByDescending(l => l.Timestamp)
            .ToListAsync();

        // Log report generation
        await _auditService.LogAsync(new AuditLogEntry
        {
            EventType = "REPORT_GENERATED",
            ActorId = currentAdminId,
            ActorType = ActorType.ADMIN,
            ResourceType = "ComplianceReport",
            ResourceId = "user-transaction-history",
            Action = ActionType.READ,
            Metadata = new Dictionary<string, object>
            {
                ["targetUserId"] = userId,
                ["startDate"] = startDate,
                ["endDate"] = endDate,
                ["recordCount"] = logs.Count,
            },
            RetentionCategory = "ADMIN",
        });

        return FormatReport(logs);
    }

    public async Task<Report> GenerateFailedPaymentsReport(
        DateTime startDate,
        DateTime endDate)
    {
        var logs = await _db.AuditLogs
            .Where(l => l.EventType == "PAYMENT_FAILED")
            .Where(l => l.Timestamp >= startDate && l.Timestamp <= endDate)
            .Include(l => l.Metadata)
            .OrderByDescending(l => l.Timestamp)
            .ToListAsync();

        return new Report
        {
            Title = "Failed Payments Report",
            DateRange = $"{startDate:yyyy-MM-dd} to {endDate:yyyy-MM-dd}",
            TotalRecords = logs.Count,
            Summary = new
            {
                TotalAttempts = logs.Count,
                UniqueUsers = logs.Select(l => l.ActorId).Distinct().Count(),
                CommonErrors = logs
                    .GroupBy(l => GetErrorCode(l))
                    .OrderByDescending(g => g.Count())
                    .Take(5)
                    .ToDictionary(g => g.Key, g => g.Count()),
            },
            Records = logs,
        };
    }
}
```

### Export Format

```typescript
interface ComplianceReport {
  reportId: string;
  reportType: string;
  generatedAt: Date;
  generatedBy: string;
  dateRange: {
    start: Date;
    end: Date;
  };
  totalRecords: number;
  summary: Record<string, unknown>;
  records: AuditLog[];
  
  // For verification
  checksum: string;
  signature: string;
}
```

---

## Monitoring & Alerts

### Alert Triggers

| Condition | Alert Level | Action |
|-----------|-------------|--------|
| 5+ payment failures in 1 hour | Warning | Notify support |
| 10+ login failures for same IP | Critical | Block IP, notify security |
| Admin accessing user data | Info | Log for review |
| Unusual payout patterns | Warning | Flag for manual review |
| Rate limit exceeded 10+ times | Warning | Review user |

### Monitoring Dashboard

```typescript
// Admin dashboard metrics from audit logs

interface AuditMetrics {
  // Last 24 hours
  eventsToday: number;
  paymentSuccessRate: number;
  loginFailureRate: number;
  disputeCount: number;
  
  // Trends
  eventsByHour: { hour: number; count: number }[];
  topEventTypes: { type: string; count: number }[];
  errorRate: number;
}
```

---

## Data Privacy

### PII Handling

| Data Type | Storage | Logging |
|-----------|---------|---------|
| Email | Plain in User table | Hashed in logs |
| Password | Hashed | Never logged |
| Payment details | Stripe (not stored) | Reference IDs only |
| GPS coordinates | Plain in Verification | Logged for validation |
| IP address | Logged | Logged with retention |
| Phone number | Plain in User table | Last 4 digits only |

### Data Sanitization

```csharp
public class AuditDataSanitizer
{
    private static readonly string[] SensitiveFields = 
    {
        "password", "token", "secret", "key", "authorization",
        "creditCard", "ssn", "socialSecurity"
    };

    public static object Sanitize(object data)
    {
        if (data is Dictionary<string, object> dict)
        {
            return dict.ToDictionary(
                kvp => kvp.Key,
                kvp => SensitiveFields.Contains(kvp.Key.ToLower())
                    ? "[REDACTED]"
                    : Sanitize(kvp.Value)
            );
        }
        
        return data;
    }

    public static string HashEmail(string email)
    {
        using var sha256 = SHA256.Create();
        var hash = sha256.ComputeHash(Encoding.UTF8.GetBytes(email.ToLower()));
        return Convert.ToBase64String(hash)[..16];
    }
}
```

### GDPR Compliance

When user requests data deletion:

```csharp
public async Task HandleGdprDeletionRequest(string userId)
{
    // 1. Log the deletion request
    await _auditService.LogAsync(new AuditLogEntry
    {
        EventType = "USER_DELETION_REQUESTED",
        ActorId = userId,
        ActorType = ActorType.USER,
        ResourceType = "User",
        ResourceId = userId,
        Action = ActionType.DELETE,
        RetentionCategory = "USER",
    });

    // 2. Anonymize audit logs (keep for compliance, remove PII)
    await _db.AuditLogs
        .Where(l => l.ActorId == userId)
        .ExecuteUpdateAsync(s => s
            .SetProperty(l => l.ActorId, (string?)null)
            .SetProperty(l => l.Metadata, AnonymizeMetadata(l.Metadata))
        );

    // 3. Financial logs are retained but anonymized
    // User ID is removed, transaction IDs kept for reconciliation
}
```

---

## Related Documentation

- [Booking Lifecycle](./BOOKING-LIFECYCLE.md) - Events that generate audit logs
- [Architecture](./ARCHITECTURE.md) - System components
- [API Contracts](./API-CONTRACTS.md) - Admin GraphQL operations
