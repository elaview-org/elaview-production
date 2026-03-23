namespace ElaviewBackend.Features.Analytics;

// ── Admin Platform Stats ─────────────────────────────────
public record PlatformStats(
    int TotalUsers,
    int TotalActiveSpaces,
    int TotalBookings,
    decimal TotalRevenue,
    int TotalCampaigns,
    int TotalSpaceOwners,
    int TotalAdvertisers,
    int NewUsersLast30Days
);

// ── Marketing Stats ──────────────────────────────────────
public record MarketingStats(
    int NewSignups30d,
    decimal ConversionRate,
    int ActiveCampaigns,
    decimal TotalAdSpend30d,
    int TotalCompletedBookings30d,
    List<DailySignups> SignupTrend
);

public record DailySignups(DateTime Date, int Count);

// ── Advertiser Reach Trend ───────────────────────────────
public record ReachTrendPoint(
    DateTime Date,
    long Reach,
    long Impressions
);
