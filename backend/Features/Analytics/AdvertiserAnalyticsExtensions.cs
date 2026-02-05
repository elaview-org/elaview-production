using HotChocolate.Types;

namespace ElaviewBackend.Features.Analytics;

[ExtendObjectType<AdvertiserAnalytics>]
public static class AdvertiserAnalyticsExtensions {
    public static async Task<List<AdvertiserSpacePerformance>> SpacePerformance(
        [Parent] AdvertiserAnalytics analytics,
        int first,
        IAnalyticsService analyticsService,
        CancellationToken ct
    ) => await analyticsService.GetAdvertiserSpacePerformanceAsync(
        analytics.UserId, analytics.StartDate, analytics.EndDate, first, ct);

    public static async Task<List<AdvertiserMonthlyStats>> MonthlyStats(
        [Parent] AdvertiserAnalytics analytics,
        int months,
        IAnalyticsService analyticsService,
        CancellationToken ct
    ) => await analyticsService.GetAdvertiserMonthlyStatsAsync(
        analytics.UserId, months, ct);
}

[ExtendObjectType<AdvertiserSummary>]
public static class AdvertiserSummaryExtensions {
    [GraphQLType(typeof(DecimalType))]
    public static decimal TotalSpend([Parent] AdvertiserSummary summary)
        => summary.TotalSpend;

    [GraphQLType(typeof(DecimalType))]
    public static decimal AvgCostPerImpression([Parent] AdvertiserSummary summary)
        => summary.AvgCostPerImpression;

    [GraphQLType(typeof(DecimalType))]
    public static decimal Roi([Parent] AdvertiserSummary summary)
        => summary.Roi;

    [GraphQLType(typeof(DecimalType))]
    public static decimal CompletionRate([Parent] AdvertiserSummary summary)
        => summary.CompletionRate;

    [GraphQLType(typeof(DecimalType))]
    public static decimal PreviousTotalSpend([Parent] AdvertiserSummary summary)
        => summary.PreviousTotalSpend;

    [GraphQLType(typeof(DecimalType))]
    public static decimal PreviousAvgCostPerImpression([Parent] AdvertiserSummary summary)
        => summary.PreviousAvgCostPerImpression;

    [GraphQLType(typeof(DecimalType))]
    public static decimal PreviousRoi([Parent] AdvertiserSummary summary)
        => summary.PreviousRoi;

    [GraphQLType(typeof(DecimalType))]
    public static decimal PreviousCompletionRate([Parent] AdvertiserSummary summary)
        => summary.PreviousCompletionRate;
}

[ExtendObjectType<AdvertiserSpacePerformance>]
public static class AdvertiserSpacePerformanceExtensions {
    [GraphQLType(typeof(DecimalType))]
    public static decimal TotalSpend([Parent] AdvertiserSpacePerformance item)
        => item.TotalSpend;

    [GraphQLType(typeof(DecimalType))]
    public static decimal Roi([Parent] AdvertiserSpacePerformance item)
        => item.Roi;
}

[ExtendObjectType<AdvertiserMonthlyStats>]
public static class AdvertiserMonthlyStatsExtensions {
    [GraphQLType(typeof(DecimalType))]
    public static decimal Spending([Parent] AdvertiserMonthlyStats stats)
        => stats.Spending;
}

[ExtendObjectType<AdvertiserPeriodData>]
public static class AdvertiserPeriodDataExtensions {
    [GraphQLType(typeof(DecimalType))]
    public static decimal Spending([Parent] AdvertiserPeriodData data)
        => data.Spending;

    [GraphQLType(typeof(DecimalType))]
    public static decimal Roi([Parent] AdvertiserPeriodData data)
        => data.Roi;
}

[ExtendObjectType<AdvertiserAttentionItem>]
public static class AdvertiserAttentionItemExtensions {
    [GraphQLType(typeof(DecimalType))]
    public static decimal Roi([Parent] AdvertiserAttentionItem item)
        => item.Roi;
}
