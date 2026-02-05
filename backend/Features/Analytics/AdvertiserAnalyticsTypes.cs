namespace ElaviewBackend.Features.Analytics;

public record AdvertiserAnalytics(
    Guid UserId,
    DateTime StartDate,
    DateTime EndDate,
    AdvertiserSummary Summary,
    List<StatusCount> StatusDistribution,
    AdvertiserPeriodComparison PeriodComparison,
    AdvertiserTopPerformers TopPerformers
);

public record AdvertiserSummary(
    decimal TotalSpend,
    int TotalBookings,
    long TotalImpressions,
    int Reach,
    decimal AvgCostPerImpression,
    decimal Roi,
    decimal CompletionRate,
    decimal PreviousTotalSpend,
    int PreviousTotalBookings,
    long PreviousTotalImpressions,
    int PreviousReach,
    decimal PreviousAvgCostPerImpression,
    decimal PreviousRoi,
    decimal PreviousCompletionRate
);

public record AdvertiserSpacePerformance(
    Guid Id,
    string Title,
    string? Image,
    int TotalBookings,
    decimal TotalSpend,
    long Impressions,
    decimal Roi
);

public record AdvertiserMonthlyStats(string Month, decimal Spending, long Impressions);

public record AdvertiserPeriodData(
    string Period,
    DateTime StartDate,
    DateTime EndDate,
    int Bookings,
    decimal Spending,
    long Impressions,
    decimal Roi
);

public record AdvertiserPeriodComparison(
    AdvertiserPeriodData Current,
    AdvertiserPeriodData Previous
);

public record AdvertiserAttentionItem(Guid Id, string Title, decimal Roi, long Impressions);

public record AdvertiserTopPerformers(
    PerformerItem? BestRoi,
    PerformerItem? MostImpressions,
    PerformerItem? BestValue,
    PerformerItem? MostBookings,
    AdvertiserAttentionItem? NeedsReview
);
