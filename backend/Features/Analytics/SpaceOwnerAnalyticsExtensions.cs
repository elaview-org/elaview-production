using HotChocolate.Types;

namespace ElaviewBackend.Features.Analytics;

[ExtendObjectType<SpaceOwnerAnalytics>]
public static class SpaceOwnerAnalyticsExtensions {
    public static async Task<List<SpacePerformanceItem>> SpacePerformance(
        [Parent] SpaceOwnerAnalytics analytics,
        int first,
        IAnalyticsService analyticsService,
        CancellationToken ct
    ) => await analyticsService.GetSpaceOwnerSpacePerformanceAsync(
        analytics.UserId, analytics.StartDate, analytics.EndDate, first, ct);

    public static async Task<List<MonthlyStats>> MonthlyStats(
        [Parent] SpaceOwnerAnalytics analytics,
        int months,
        IAnalyticsService analyticsService,
        CancellationToken ct
    ) => await analyticsService.GetSpaceOwnerMonthlyStatsAsync(
        analytics.UserId, months, ct);

    public static async Task<List<RatingTrendPoint>> RatingTrends(
        [Parent] SpaceOwnerAnalytics analytics,
        int months,
        IAnalyticsService analyticsService,
        CancellationToken ct
    ) => await analyticsService.GetSpaceOwnerRatingTrendsAsync(
        analytics.UserId, months, ct);

    public static async Task<int[][]> BookingHeatmap(
        [Parent] SpaceOwnerAnalytics analytics,
        IAnalyticsService analyticsService,
        CancellationToken ct
    ) => await analyticsService.GetSpaceOwnerBookingHeatmapAsync(
        analytics.UserId, ct);
}

[ExtendObjectType<SpaceOwnerSummary>]
public static class SpaceOwnerSummaryExtensions {
    [GraphQLType(typeof(DecimalType))]
    public static decimal TotalRevenue([Parent] SpaceOwnerSummary summary)
        => summary.TotalRevenue;

    [GraphQLType(typeof(DecimalType))]
    public static decimal CompletionRate([Parent] SpaceOwnerSummary summary)
        => summary.CompletionRate;

    [GraphQLType(typeof(DecimalType))]
    public static decimal AvgBookingDuration([Parent] SpaceOwnerSummary summary)
        => summary.AvgBookingDuration;

    [GraphQLType(typeof(DecimalType))]
    public static decimal OccupancyRate([Parent] SpaceOwnerSummary summary)
        => summary.OccupancyRate;

    [GraphQLType(typeof(DecimalType))]
    public static decimal RepeatAdvertiserRate([Parent] SpaceOwnerSummary summary)
        => summary.RepeatAdvertiserRate;

    [GraphQLType(typeof(DecimalType))]
    public static decimal ForecastedRevenue([Parent] SpaceOwnerSummary summary)
        => summary.ForecastedRevenue;

    [GraphQLType(typeof(DecimalType))]
    public static decimal PreviousTotalRevenue([Parent] SpaceOwnerSummary summary)
        => summary.PreviousTotalRevenue;

    [GraphQLType(typeof(DecimalType))]
    public static decimal PreviousAvgBookingDuration([Parent] SpaceOwnerSummary summary)
        => summary.PreviousAvgBookingDuration;

    [GraphQLType(typeof(DecimalType))]
    public static decimal PreviousOccupancyRate([Parent] SpaceOwnerSummary summary)
        => summary.PreviousOccupancyRate;

    [GraphQLType(typeof(DecimalType))]
    public static decimal PreviousRepeatAdvertiserRate([Parent] SpaceOwnerSummary summary)
        => summary.PreviousRepeatAdvertiserRate;
}

[ExtendObjectType<SpacePerformanceItem>]
public static class SpacePerformanceItemExtensions {
    [GraphQLType(typeof(DecimalType))]
    public static decimal TotalRevenue([Parent] SpacePerformanceItem item)
        => item.TotalRevenue;

    [GraphQLType(typeof(DecimalType))]
    public static decimal OccupancyRate([Parent] SpacePerformanceItem item)
        => item.OccupancyRate;
}

[ExtendObjectType<MonthlyStats>]
public static class MonthlyStatsExtensions {
    [GraphQLType(typeof(DecimalType))]
    public static decimal Revenue([Parent] MonthlyStats stats)
        => stats.Revenue;
}

[ExtendObjectType<PeriodData>]
public static class PeriodDataExtensions {
    [GraphQLType(typeof(DecimalType))]
    public static decimal Revenue([Parent] PeriodData data)
        => data.Revenue;

    [GraphQLType(typeof(DecimalType))]
    public static decimal CompletionRate([Parent] PeriodData data)
        => data.CompletionRate;
}

[ExtendObjectType<PerformerItem>]
public static class PerformerItemExtensions {
    [GraphQLType(typeof(DecimalType))]
    public static decimal Value([Parent] PerformerItem item)
        => item.Value;

    [GraphQLType(typeof(DecimalType))]
    public static decimal Change([Parent] PerformerItem item)
        => item.Change;
}

[ExtendObjectType<AttentionItem>]
public static class AttentionItemExtensions {
    [GraphQLType(typeof(DecimalType))]
    public static decimal Occupancy([Parent] AttentionItem item)
        => item.Occupancy;
}
