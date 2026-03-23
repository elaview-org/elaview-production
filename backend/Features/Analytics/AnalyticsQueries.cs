using ElaviewBackend.Features.Users;
using HotChocolate.Authorization;

namespace ElaviewBackend.Features.Analytics;

[QueryType]
public static class AnalyticsQueries {
    [Authorize]
    public static async Task<List<DailyStats>> SpaceOwnerDailyStats(
        DateTime startDate,
        DateTime endDate,
        IUserService userService,
        IAnalyticsService analyticsService,
        CancellationToken ct
    ) => await analyticsService.GetSpaceOwnerDailyStatsAsync(
        userService.GetPrincipalId(), startDate, endDate, ct);

    [Authorize]
    public static async Task<List<DailyStats>> AdvertiserDailyStats(
        DateTime startDate,
        DateTime endDate,
        IUserService userService,
        IAnalyticsService analyticsService,
        CancellationToken ct
    ) => await analyticsService.GetAdvertiserDailyStatsAsync(
        userService.GetPrincipalId(), startDate, endDate, ct);

    [Authorize]
    public static async Task<List<IActivityEvent>> MyActivityFeed(
        int first,
        IUserService userService,
        IAnalyticsService analyticsService,
        CancellationToken ct
    ) => await analyticsService.GetMyActivityFeedAsync(
        userService.GetPrincipalId(), first, ct);

    [Authorize]
    public static async Task<SpaceOwnerAnalytics> SpaceOwnerAnalytics(
        DateTime startDate,
        DateTime endDate,
        IUserService userService,
        IAnalyticsService analyticsService,
        CancellationToken ct
    ) => await analyticsService.GetSpaceOwnerAnalyticsAsync(
        userService.GetPrincipalId(), startDate, endDate, ct);

    [Authorize]
    public static async Task<AdvertiserAnalytics> AdvertiserAnalytics(
        DateTime startDate,
        DateTime endDate,
        IUserService userService,
        IAnalyticsService analyticsService,
        CancellationToken ct
    ) => await analyticsService.GetAdvertiserAnalyticsAsync(
        userService.GetPrincipalId(), startDate, endDate, ct);

    [Authorize(Roles = ["Admin"])]
    public static async Task<PlatformStats> PlatformStats(
        IAnalyticsService analyticsService,
        CancellationToken ct
    ) => await analyticsService.GetPlatformStatsAsync(ct);

    [Authorize(Roles = ["Admin", "Marketing"])]
    public static async Task<MarketingStats> MarketingStats(
        IAnalyticsService analyticsService,
        CancellationToken ct
    ) => await analyticsService.GetMarketingStatsAsync(ct);

    [Authorize]
    public static async Task<List<ReachTrendPoint>> AdvertiserReachTrend(
        DateTime startDate,
        DateTime endDate,
        IUserService userService,
        IAnalyticsService analyticsService,
        CancellationToken ct
    ) => await analyticsService.GetAdvertiserReachTrendAsync(
        userService.GetPrincipalId(), startDate, endDate, ct);
}
