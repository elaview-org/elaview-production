using ElaviewBackend.Data.Entities;
using ElaviewBackend.Features.Users;
using Microsoft.EntityFrameworkCore;

namespace ElaviewBackend.Features.Analytics;

public interface IAnalyticsService {
    Task<List<DailyStats>> GetSpaceOwnerDailyStatsAsync(
        Guid userId, DateTime startDate, DateTime endDate, CancellationToken ct);

    Task<List<DailyStats>> GetAdvertiserDailyStatsAsync(
        Guid userId, DateTime startDate, DateTime endDate, CancellationToken ct);

    Task<List<IActivityEvent>> GetMyActivityFeedAsync(
        Guid userId, int limit, CancellationToken ct);

    Task<SpaceOwnerAnalytics> GetSpaceOwnerAnalyticsAsync(
        Guid userId, DateTime start, DateTime end, CancellationToken ct);

    Task<List<SpacePerformanceItem>> GetSpaceOwnerSpacePerformanceAsync(
        Guid userId, DateTime start, DateTime end, int limit, CancellationToken ct);

    Task<List<MonthlyStats>> GetSpaceOwnerMonthlyStatsAsync(
        Guid userId, int months, CancellationToken ct);

    Task<List<RatingTrendPoint>> GetSpaceOwnerRatingTrendsAsync(
        Guid userId, int months, CancellationToken ct);

    Task<int[][]> GetSpaceOwnerBookingHeatmapAsync(
        Guid userId, CancellationToken ct);

    Task<AdvertiserAnalytics> GetAdvertiserAnalyticsAsync(
        Guid userId, DateTime start, DateTime end, CancellationToken ct);

    Task<List<AdvertiserSpacePerformance>> GetAdvertiserSpacePerformanceAsync(
        Guid userId, DateTime start, DateTime end, int limit, CancellationToken ct);

    Task<List<AdvertiserMonthlyStats>> GetAdvertiserMonthlyStatsAsync(
        Guid userId, int months, CancellationToken ct);
}

public sealed class AnalyticsService(
    IAnalyticsRepository repository,
    IUserRepository userRepository
) : IAnalyticsService {
    public async Task<List<DailyStats>> GetSpaceOwnerDailyStatsAsync(
        Guid userId, DateTime startDate, DateTime endDate, CancellationToken ct
    ) => await repository.GetSpaceOwnerDailyStatsAsync(userId, startDate, endDate, ct);

    public async Task<List<DailyStats>> GetAdvertiserDailyStatsAsync(
        Guid userId, DateTime startDate, DateTime endDate, CancellationToken ct
    ) => await repository.GetAdvertiserDailyStatsAsync(userId, startDate, endDate, ct);

    public async Task<List<IActivityEvent>> GetMyActivityFeedAsync(
        Guid userId, int limit, CancellationToken ct
    ) {
        var user = await userRepository.GetUserById(userId).FirstOrDefaultAsync(ct);
        if (user is null)
            return [];

        return user.ActiveProfileType == ProfileType.SpaceOwner
            ? await repository.GetSpaceOwnerActivityFeedAsync(userId, limit, ct)
            : await repository.GetAdvertiserActivityFeedAsync(userId, limit, ct);
    }

    public async Task<SpaceOwnerAnalytics> GetSpaceOwnerAnalyticsAsync(
        Guid userId, DateTime start, DateTime end, CancellationToken ct
    ) {
        var summary = await repository.GetSpaceOwnerSummaryAsync(userId, start, end, ct);
        var statusDistribution = await repository.GetSpaceOwnerStatusDistributionAsync(userId, start, end, ct);
        var topPerformers = await repository.GetSpaceOwnerTopPerformersAsync(userId, start, end, ct);

        var periodDays = (end - start).Days;
        var previousStart = start.AddDays(-periodDays);
        var previousEnd = start;

        var periodComparison = new PeriodComparison(
            Current: new PeriodData(
                Period: $"{start:MMM d} - {end:MMM d, yyyy}",
                StartDate: start,
                EndDate: end,
                Bookings: summary.TotalBookings,
                Revenue: summary.TotalRevenue,
                AvgRating: summary.AverageRating,
                CompletionRate: summary.CompletionRate
            ),
            Previous: new PeriodData(
                Period: $"{previousStart:MMM d} - {previousEnd:MMM d, yyyy}",
                StartDate: previousStart,
                EndDate: previousEnd,
                Bookings: summary.PreviousTotalBookings,
                Revenue: summary.PreviousTotalRevenue,
                AvgRating: null,
                CompletionRate: 0
            )
        );

        return new SpaceOwnerAnalytics(
            UserId: userId,
            StartDate: start,
            EndDate: end,
            Summary: summary,
            StatusDistribution: statusDistribution,
            PeriodComparison: periodComparison,
            TopPerformers: topPerformers
        );
    }

    public async Task<List<SpacePerformanceItem>> GetSpaceOwnerSpacePerformanceAsync(
        Guid userId, DateTime start, DateTime end, int limit, CancellationToken ct
    ) => await repository.GetSpaceOwnerSpacePerformanceAsync(userId, start, end, limit, ct);

    public async Task<List<MonthlyStats>> GetSpaceOwnerMonthlyStatsAsync(
        Guid userId, int months, CancellationToken ct
    ) => await repository.GetSpaceOwnerMonthlyStatsAsync(userId, months, ct);

    public async Task<List<RatingTrendPoint>> GetSpaceOwnerRatingTrendsAsync(
        Guid userId, int months, CancellationToken ct
    ) => await repository.GetSpaceOwnerRatingTrendsAsync(userId, months, ct);

    public async Task<int[][]> GetSpaceOwnerBookingHeatmapAsync(
        Guid userId, CancellationToken ct
    ) => await repository.GetSpaceOwnerBookingHeatmapAsync(userId, ct);

    public async Task<AdvertiserAnalytics> GetAdvertiserAnalyticsAsync(
        Guid userId, DateTime start, DateTime end, CancellationToken ct
    ) {
        var summary = await repository.GetAdvertiserSummaryAsync(userId, start, end, ct);
        var statusDistribution = await repository.GetAdvertiserStatusDistributionAsync(userId, start, end, ct);
        var topPerformers = await repository.GetAdvertiserTopPerformersAsync(userId, start, end, ct);

        var periodDays = (end - start).Days;
        var previousStart = start.AddDays(-periodDays);
        var previousEnd = start;

        var periodComparison = new AdvertiserPeriodComparison(
            Current: new AdvertiserPeriodData(
                Period: $"{start:MMM d} - {end:MMM d, yyyy}",
                StartDate: start,
                EndDate: end,
                Bookings: summary.TotalBookings,
                Spending: summary.TotalSpend,
                Impressions: summary.TotalImpressions,
                Roi: summary.Roi
            ),
            Previous: new AdvertiserPeriodData(
                Period: $"{previousStart:MMM d} - {previousEnd:MMM d, yyyy}",
                StartDate: previousStart,
                EndDate: previousEnd,
                Bookings: summary.PreviousTotalBookings,
                Spending: summary.PreviousTotalSpend,
                Impressions: summary.PreviousTotalImpressions,
                Roi: summary.PreviousRoi
            )
        );

        return new AdvertiserAnalytics(
            UserId: userId,
            StartDate: start,
            EndDate: end,
            Summary: summary,
            StatusDistribution: statusDistribution,
            PeriodComparison: periodComparison,
            TopPerformers: topPerformers
        );
    }

    public async Task<List<AdvertiserSpacePerformance>> GetAdvertiserSpacePerformanceAsync(
        Guid userId, DateTime start, DateTime end, int limit, CancellationToken ct
    ) => await repository.GetAdvertiserSpacePerformanceAsync(userId, start, end, limit, ct);

    public async Task<List<AdvertiserMonthlyStats>> GetAdvertiserMonthlyStatsAsync(
        Guid userId, int months, CancellationToken ct
    ) => await repository.GetAdvertiserMonthlyStatsAsync(userId, months, ct);
}
