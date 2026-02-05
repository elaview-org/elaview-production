using System.Text.RegularExpressions;
using ElaviewBackend.Data;
using ElaviewBackend.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace ElaviewBackend.Features.Analytics;

public interface IAnalyticsRepository {
    Task<List<DailyStats>> GetSpaceOwnerDailyStatsAsync(
        Guid userId, DateTime startDate, DateTime endDate, CancellationToken ct);

    Task<List<DailyStats>> GetAdvertiserDailyStatsAsync(
        Guid userId, DateTime startDate, DateTime endDate, CancellationToken ct);

    Task<List<IActivityEvent>> GetSpaceOwnerActivityFeedAsync(
        Guid userId, int limit, CancellationToken ct);

    Task<List<IActivityEvent>> GetAdvertiserActivityFeedAsync(
        Guid userId, int limit, CancellationToken ct);

    Task<SpaceOwnerSummary> GetSpaceOwnerSummaryAsync(
        Guid userId, DateTime start, DateTime end, CancellationToken ct);

    Task<List<StatusCount>> GetSpaceOwnerStatusDistributionAsync(
        Guid userId, DateTime start, DateTime end, CancellationToken ct);

    Task<List<SpacePerformanceItem>> GetSpaceOwnerSpacePerformanceAsync(
        Guid userId, DateTime start, DateTime end, int limit, CancellationToken ct);

    Task<List<MonthlyStats>> GetSpaceOwnerMonthlyStatsAsync(
        Guid userId, int months, CancellationToken ct);

    Task<List<RatingTrendPoint>> GetSpaceOwnerRatingTrendsAsync(
        Guid userId, int months, CancellationToken ct);

    Task<int[][]> GetSpaceOwnerBookingHeatmapAsync(
        Guid userId, CancellationToken ct);

    Task<SpaceOwnerTopPerformers> GetSpaceOwnerTopPerformersAsync(
        Guid userId, DateTime start, DateTime end, CancellationToken ct);

    Task<AdvertiserSummary> GetAdvertiserSummaryAsync(
        Guid userId, DateTime start, DateTime end, CancellationToken ct);

    Task<List<StatusCount>> GetAdvertiserStatusDistributionAsync(
        Guid userId, DateTime start, DateTime end, CancellationToken ct);

    Task<List<AdvertiserSpacePerformance>> GetAdvertiserSpacePerformanceAsync(
        Guid userId, DateTime start, DateTime end, int limit, CancellationToken ct);

    Task<List<AdvertiserMonthlyStats>> GetAdvertiserMonthlyStatsAsync(
        Guid userId, int months, CancellationToken ct);

    Task<AdvertiserTopPerformers> GetAdvertiserTopPerformersAsync(
        Guid userId, DateTime start, DateTime end, CancellationToken ct);
}

public sealed partial class AnalyticsRepository(AppDbContext context) : IAnalyticsRepository {
    private static readonly BookingStatus[] ExcludedStatuses =
        [BookingStatus.Cancelled, BookingStatus.Rejected];

    private static readonly BookingStatus[] CompletedStatuses =
        [BookingStatus.Completed, BookingStatus.Verified];

    private static readonly BookingStatus[] PendingPayoutStatuses = [
        BookingStatus.Approved, BookingStatus.Paid, BookingStatus.FileDownloaded,
        BookingStatus.Installed, BookingStatus.Verified
    ];

    public async Task<List<DailyStats>> GetSpaceOwnerDailyStatsAsync(
        Guid userId, DateTime startDate, DateTime endDate, CancellationToken ct
    ) {
        var bookingCounts = await context.Bookings
            .Where(b => b.Space.SpaceOwnerProfile.UserId == userId)
            .Where(b => b.CreatedAt >= startDate && b.CreatedAt < endDate)
            .GroupBy(b => b.CreatedAt.Date)
            .Select(g => new { Date = g.Key, Count = g.Count() })
            .ToListAsync(ct);

        var earningsByDay = await context.Payouts
            .Where(p => p.SpaceOwnerProfile.UserId == userId)
            .Where(p => p.Status == PayoutStatus.Completed)
            .Where(p => p.ProcessedAt != null && p.ProcessedAt >= startDate && p.ProcessedAt < endDate)
            .GroupBy(p => p.ProcessedAt!.Value.Date)
            .Select(g => new { Date = g.Key, Amount = g.Sum(p => p.Amount) })
            .ToListAsync(ct);

        var allDates = bookingCounts.Select(b => b.Date)
            .Union(earningsByDay.Select(e => e.Date))
            .Distinct()
            .OrderBy(d => d);

        return allDates.Select(date => new DailyStats(
            date,
            bookingCounts.FirstOrDefault(b => b.Date == date)?.Count ?? 0,
            earningsByDay.FirstOrDefault(e => e.Date == date)?.Amount ?? 0,
            0
        )).ToList();
    }

    public async Task<List<DailyStats>> GetAdvertiserDailyStatsAsync(
        Guid userId, DateTime startDate, DateTime endDate, CancellationToken ct
    ) {
        var bookingCounts = await context.Bookings
            .Where(b => b.Campaign.AdvertiserProfile.UserId == userId)
            .Where(b => b.CreatedAt >= startDate && b.CreatedAt < endDate)
            .GroupBy(b => b.CreatedAt.Date)
            .Select(g => new { Date = g.Key, Count = g.Count() })
            .ToListAsync(ct);

        var spendingByDay = await context.Payments
            .Where(p => p.Booking.Campaign.AdvertiserProfile.UserId == userId)
            .Where(p => p.Status == PaymentStatus.Succeeded)
            .Where(p => p.PaidAt != null && p.PaidAt >= startDate && p.PaidAt < endDate)
            .GroupBy(p => p.PaidAt!.Value.Date)
            .Select(g => new { Date = g.Key, Amount = g.Sum(p => p.Amount) })
            .ToListAsync(ct);

        var allDates = bookingCounts.Select(b => b.Date)
            .Union(spendingByDay.Select(s => s.Date))
            .Distinct()
            .OrderBy(d => d);

        return allDates.Select(date => new DailyStats(
            date,
            bookingCounts.FirstOrDefault(b => b.Date == date)?.Count ?? 0,
            0,
            spendingByDay.FirstOrDefault(s => s.Date == date)?.Amount ?? 0
        )).ToList();
    }

    public async Task<List<IActivityEvent>> GetSpaceOwnerActivityFeedAsync(
        Guid userId, int limit, CancellationToken ct
    ) {
        var bookings = await context.Bookings
            .Where(b => b.Space.SpaceOwnerProfile.UserId == userId)
            .OrderByDescending(b => b.UpdatedAt)
            .Take(limit)
            .Select(b => new BookingActivity {
                Id = b.Id,
                Type = "booking_" + b.Status.ToString().ToLower(),
                Booking = b,
                Timestamp = b.UpdatedAt
            })
            .ToListAsync(ct);

        var payouts = await context.Payouts
            .Where(p => p.SpaceOwnerProfile.UserId == userId)
            .Where(p => p.Status == PayoutStatus.Completed)
            .OrderByDescending(p => p.ProcessedAt)
            .Take(limit)
            .Include(p => p.Booking)
            .ThenInclude(b => b.Payments)
            .ToListAsync(ct);

        var paymentActivities = payouts
            .SelectMany(p => p.Booking.Payments
                .Where(pay => pay.Status == PaymentStatus.Succeeded)
                .Select(pay => new PaymentActivity {
                    Id = pay.Id,
                    Type = "payment_received",
                    Payment = pay,
                    Timestamp = pay.PaidAt ?? pay.CreatedAt
                }))
            .ToList();

        var proofs = await context.BookingProofs
            .Where(p => p.Booking.Space.SpaceOwnerProfile.UserId == userId)
            .OrderByDescending(p => p.SubmittedAt)
            .Take(limit)
            .Select(p => new ProofActivity {
                Id = p.Id,
                Type = "proof_" + p.Status.ToString().ToLower(),
                Proof = p,
                Timestamp = p.SubmittedAt
            })
            .ToListAsync(ct);

        return bookings.Cast<IActivityEvent>()
            .Concat(paymentActivities)
            .Concat(proofs)
            .OrderByDescending(e => e.Timestamp)
            .Take(limit)
            .ToList();
    }

    public async Task<List<IActivityEvent>> GetAdvertiserActivityFeedAsync(
        Guid userId, int limit, CancellationToken ct
    ) {
        var bookings = await context.Bookings
            .Where(b => b.Campaign.AdvertiserProfile.UserId == userId)
            .OrderByDescending(b => b.UpdatedAt)
            .Take(limit)
            .Select(b => new BookingActivity {
                Id = b.Id,
                Type = "booking_" + b.Status.ToString().ToLower(),
                Booking = b,
                Timestamp = b.UpdatedAt
            })
            .ToListAsync(ct);

        var payments = await context.Payments
            .Where(p => p.Booking.Campaign.AdvertiserProfile.UserId == userId)
            .Where(p => p.Status == PaymentStatus.Succeeded)
            .OrderByDescending(p => p.PaidAt)
            .Take(limit)
            .Select(p => new PaymentActivity {
                Id = p.Id,
                Type = "payment_completed",
                Payment = p,
                Timestamp = p.PaidAt ?? p.CreatedAt
            })
            .ToListAsync(ct);

        var proofs = await context.BookingProofs
            .Where(p => p.Booking.Campaign.AdvertiserProfile.UserId == userId)
            .OrderByDescending(p => p.SubmittedAt)
            .Take(limit)
            .Select(p => new ProofActivity {
                Id = p.Id,
                Type = "proof_" + p.Status.ToString().ToLower(),
                Proof = p,
                Timestamp = p.SubmittedAt
            })
            .ToListAsync(ct);

        return bookings.Cast<IActivityEvent>()
            .Concat(payments)
            .Concat(proofs)
            .OrderByDescending(e => e.Timestamp)
            .Take(limit)
            .ToList();
    }

    public async Task<SpaceOwnerSummary> GetSpaceOwnerSummaryAsync(
        Guid userId, DateTime start, DateTime end, CancellationToken ct
    ) {
        var periodDays = (end - start).Days;
        var previousStart = start.AddDays(-periodDays);
        var previousEnd = start;

        var bookings = await context.Bookings
            .Where(b => b.Space.SpaceOwnerProfile.UserId == userId)
            .Where(b => b.CreatedAt >= start && b.CreatedAt < end)
            .Include(b => b.Space)
            .ToListAsync(ct);

        var previousBookings = await context.Bookings
            .Where(b => b.Space.SpaceOwnerProfile.UserId == userId)
            .Where(b => b.CreatedAt >= previousStart && b.CreatedAt < previousEnd)
            .Include(b => b.Space)
            .ToListAsync(ct);

        var activeSpacesCount = await context.Spaces
            .Where(s => s.SpaceOwnerProfile.UserId == userId)
            .Where(s => s.Status == SpaceStatus.Active)
            .CountAsync(ct);

        var avgRating = await context.Reviews
            .Where(r => r.Space.SpaceOwnerProfile.UserId == userId)
            .Where(r => r.ReviewerType == ReviewerType.Advertiser)
            .AverageAsync(r => (double?)r.Rating, ct);

        var totalRevenue = bookings
            .Where(b => !ExcludedStatuses.Contains(b.Status))
            .Sum(b => b.OwnerPayoutAmount);

        var previousTotalRevenue = previousBookings
            .Where(b => !ExcludedStatuses.Contains(b.Status))
            .Sum(b => b.OwnerPayoutAmount);

        var validBookings = bookings.Where(b => !ExcludedStatuses.Contains(b.Status)).ToList();
        var previousValidBookings = previousBookings.Where(b => !ExcludedStatuses.Contains(b.Status)).ToList();

        var completedCount = validBookings.Count(b => CompletedStatuses.Contains(b.Status));
        var completionRate = validBookings.Count > 0
            ? (decimal)completedCount / validBookings.Count * 100
            : 0;

        var avgBookingDuration = validBookings.Count > 0
            ? (decimal)validBookings.Average(b => b.TotalDays)
            : 0;

        var previousAvgBookingDuration = previousValidBookings.Count > 0
            ? (decimal)previousValidBookings.Average(b => b.TotalDays)
            : 0;

        var bookedDays = validBookings.Sum(b => b.TotalDays);
        var availableDays = activeSpacesCount * periodDays;
        var occupancyRate = availableDays > 0
            ? (decimal)bookedDays / availableDays * 100
            : 0;

        var previousBookedDays = previousValidBookings.Sum(b => b.TotalDays);
        var previousAvailableDays = activeSpacesCount * periodDays;
        var previousOccupancyRate = previousAvailableDays > 0
            ? (decimal)previousBookedDays / previousAvailableDays * 100
            : 0;

        var advertiserCounts = validBookings
            .GroupBy(b => b.Campaign.AdvertiserProfileId)
            .Select(g => g.Count())
            .ToList();
        var repeatAdvertiserRate = advertiserCounts.Count > 0
            ? (decimal)advertiserCounts.Count(c => c >= 2) / advertiserCounts.Count * 100
            : 0;

        var previousAdvertiserCounts = previousValidBookings
            .GroupBy(b => b.Campaign.AdvertiserProfileId)
            .Select(g => g.Count())
            .ToList();
        var previousRepeatAdvertiserRate = previousAdvertiserCounts.Count > 0
            ? (decimal)previousAdvertiserCounts.Count(c => c >= 2) / previousAdvertiserCounts.Count * 100
            : 0;

        var forecastedRevenue = bookings
            .Where(b => PendingPayoutStatuses.Contains(b.Status))
            .Sum(b => b.OwnerPayoutAmount);

        return new SpaceOwnerSummary(
            TotalBookings: validBookings.Count,
            TotalRevenue: totalRevenue,
            AverageRating: avgRating,
            CompletionRate: Math.Round(completionRate, 1),
            AvgBookingDuration: Math.Round(avgBookingDuration, 1),
            OccupancyRate: Math.Round(occupancyRate, 1),
            RepeatAdvertiserRate: Math.Round(repeatAdvertiserRate, 1),
            ForecastedRevenue: forecastedRevenue,
            PreviousTotalBookings: previousValidBookings.Count,
            PreviousTotalRevenue: previousTotalRevenue,
            PreviousAvgBookingDuration: Math.Round(previousAvgBookingDuration, 1),
            PreviousOccupancyRate: Math.Round(previousOccupancyRate, 1),
            PreviousRepeatAdvertiserRate: Math.Round(previousRepeatAdvertiserRate, 1)
        );
    }

    public async Task<List<StatusCount>> GetSpaceOwnerStatusDistributionAsync(
        Guid userId, DateTime start, DateTime end, CancellationToken ct
    ) {
        var distribution = await context.Bookings
            .Where(b => b.Space.SpaceOwnerProfile.UserId == userId)
            .Where(b => b.CreatedAt >= start && b.CreatedAt < end)
            .GroupBy(b => b.Status)
            .Select(g => new StatusCount(g.Key, g.Count()))
            .ToListAsync(ct);

        return distribution;
    }

    public async Task<List<SpacePerformanceItem>> GetSpaceOwnerSpacePerformanceAsync(
        Guid userId, DateTime start, DateTime end, int limit, CancellationToken ct
    ) {
        var periodDays = (end - start).Days;

        var spaces = await context.Spaces
            .Where(s => s.SpaceOwnerProfile.UserId == userId)
            .Select(s => new {
                s.Id,
                s.Title,
                Image = s.Images.FirstOrDefault(),
                Bookings = s.Bookings
                    .Where(b => b.CreatedAt >= start && b.CreatedAt < end)
                    .Where(b => !ExcludedStatuses.Contains(b.Status))
                    .ToList(),
                s.AverageRating
            })
            .ToListAsync(ct);

        return spaces
            .Select(s => {
                var bookedDays = s.Bookings.Sum(b => b.TotalDays);
                var occupancyRate = periodDays > 0
                    ? (decimal)bookedDays / periodDays * 100
                    : 0;

                return new SpacePerformanceItem(
                    s.Id,
                    s.Title,
                    s.Image,
                    s.Bookings.Count,
                    s.Bookings.Sum(b => b.OwnerPayoutAmount),
                    s.AverageRating,
                    Math.Round(occupancyRate, 1)
                );
            })
            .OrderByDescending(s => s.TotalRevenue)
            .Take(limit)
            .ToList();
    }

    public async Task<List<MonthlyStats>> GetSpaceOwnerMonthlyStatsAsync(
        Guid userId, int months, CancellationToken ct
    ) {
        var endDate = DateTime.UtcNow;
        var startDate = endDate.AddMonths(-months);

        var bookings = await context.Bookings
            .Where(b => b.Space.SpaceOwnerProfile.UserId == userId)
            .Where(b => b.CreatedAt >= startDate && b.CreatedAt < endDate)
            .Where(b => !ExcludedStatuses.Contains(b.Status))
            .ToListAsync(ct);

        return Enumerable.Range(0, months)
            .Select(i => {
                var monthStart = endDate.AddMonths(-months + i);
                var monthEnd = endDate.AddMonths(-months + i + 1);
                var monthBookings = bookings
                    .Where(b => b.CreatedAt >= monthStart && b.CreatedAt < monthEnd)
                    .ToList();

                return new MonthlyStats(
                    monthStart.ToString("MMM yyyy"),
                    monthBookings.Sum(b => b.OwnerPayoutAmount),
                    monthBookings.Count
                );
            })
            .ToList();
    }

    public async Task<List<RatingTrendPoint>> GetSpaceOwnerRatingTrendsAsync(
        Guid userId, int months, CancellationToken ct
    ) {
        var endDate = DateTime.UtcNow;
        var startDate = endDate.AddMonths(-months);

        var reviews = await context.Reviews
            .Where(r => r.Space.SpaceOwnerProfile.UserId == userId)
            .Where(r => r.ReviewerType == ReviewerType.Advertiser)
            .Where(r => r.CreatedAt >= startDate && r.CreatedAt < endDate)
            .ToListAsync(ct);

        return Enumerable.Range(0, months)
            .Select(i => {
                var monthStart = endDate.AddMonths(-months + i);
                var monthEnd = endDate.AddMonths(-months + i + 1);
                var monthReviews = reviews
                    .Where(r => r.CreatedAt >= monthStart && r.CreatedAt < monthEnd)
                    .ToList();

                return new RatingTrendPoint(
                    monthStart.ToString("MMM yyyy"),
                    monthReviews.Count > 0 ? monthReviews.Average(r => r.Rating) : 0,
                    monthReviews.Count
                );
            })
            .ToList();
    }

    public async Task<int[][]> GetSpaceOwnerBookingHeatmapAsync(
        Guid userId, CancellationToken ct
    ) {
        var bookings = await context.Bookings
            .Where(b => b.Space.SpaceOwnerProfile.UserId == userId)
            .Select(b => b.CreatedAt)
            .ToListAsync(ct);

        var heatmap = new int[7][];
        for (var i = 0; i < 7; i++)
            heatmap[i] = new int[9];

        foreach (var createdAt in bookings) {
            var day = (int)createdAt.DayOfWeek;
            var hour = createdAt.Hour;
            if (hour >= 9 && hour <= 17)
                heatmap[day][hour - 9]++;
        }

        return heatmap;
    }

    public async Task<SpaceOwnerTopPerformers> GetSpaceOwnerTopPerformersAsync(
        Guid userId, DateTime start, DateTime end, CancellationToken ct
    ) {
        var periodDays = (end - start).Days;
        var previousStart = start.AddDays(-periodDays);
        var previousEnd = start;

        var spaces = await context.Spaces
            .Where(s => s.SpaceOwnerProfile.UserId == userId)
            .Select(s => new {
                s.Id,
                s.Title,
                s.AverageRating,
                CurrentBookings = s.Bookings
                    .Where(b => b.CreatedAt >= start && b.CreatedAt < end)
                    .Where(b => !ExcludedStatuses.Contains(b.Status))
                    .ToList(),
                PreviousBookings = s.Bookings
                    .Where(b => b.CreatedAt >= previousStart && b.CreatedAt < previousEnd)
                    .Where(b => !ExcludedStatuses.Contains(b.Status))
                    .ToList(),
                ReviewCount = s.Reviews.Count(r => r.ReviewerType == ReviewerType.Advertiser)
            })
            .ToListAsync(ct);

        var spaceMetrics = spaces.Select(s => {
            var currentRevenue = s.CurrentBookings.Sum(b => b.OwnerPayoutAmount);
            var previousRevenue = s.PreviousBookings.Sum(b => b.OwnerPayoutAmount);
            var revenueChange = previousRevenue > 0
                ? (currentRevenue - previousRevenue) / previousRevenue * 100
                : currentRevenue > 0 ? 100 : 0;

            var currentBookedDays = s.CurrentBookings.Sum(b => b.TotalDays);
            var occupancyRate = periodDays > 0
                ? (decimal)currentBookedDays / periodDays * 100
                : 0;

            var previousBookedDays = s.PreviousBookings.Sum(b => b.TotalDays);
            var previousOccupancyRate = periodDays > 0
                ? (decimal)previousBookedDays / periodDays * 100
                : 0;
            var occupancyChange = previousOccupancyRate > 0
                ? (occupancyRate - previousOccupancyRate) / previousOccupancyRate * 100
                : occupancyRate > 0 ? 100 : 0;

            var currentBookingCount = s.CurrentBookings.Count;
            var previousBookingCount = s.PreviousBookings.Count;
            var bookingChange = previousBookingCount > 0
                ? (decimal)(currentBookingCount - previousBookingCount) / previousBookingCount * 100
                : currentBookingCount > 0 ? 100 : 0;

            return new {
                s.Id,
                s.Title,
                Revenue = currentRevenue,
                RevenueChange = Math.Round(revenueChange, 1),
                Rating = s.AverageRating ?? 0,
                s.ReviewCount,
                OccupancyRate = Math.Round(occupancyRate, 1),
                OccupancyChange = Math.Round(occupancyChange, 1),
                BookingCount = currentBookingCount,
                BookingChange = Math.Round(bookingChange, 1)
            };
        }).ToList();

        var bestRevenue = spaceMetrics
            .Where(s => s.Revenue > 0)
            .OrderByDescending(s => s.Revenue)
            .Select(s => new PerformerItem(s.Id, s.Title, s.Revenue, s.RevenueChange))
            .FirstOrDefault();

        var bestRating = spaceMetrics
            .Where(s => s.Rating > 0 && s.ReviewCount >= 3)
            .OrderByDescending(s => s.Rating)
            .Select(s => new RatingPerformerItem(s.Id, s.Title, s.Rating, s.ReviewCount))
            .FirstOrDefault();

        var bestOccupancy = spaceMetrics
            .Where(s => s.OccupancyRate > 0)
            .OrderByDescending(s => s.OccupancyRate)
            .Select(s => new PerformerItem(s.Id, s.Title, s.OccupancyRate, s.OccupancyChange))
            .FirstOrDefault();

        var mostBookings = spaceMetrics
            .Where(s => s.BookingCount > 0)
            .OrderByDescending(s => s.BookingCount)
            .Select(s => new PerformerItem(s.Id, s.Title, s.BookingCount, s.BookingChange))
            .FirstOrDefault();

        var needsAttention = spaceMetrics
            .Where(s => s.OccupancyRate < 20 || s.BookingCount == 0)
            .OrderBy(s => s.OccupancyRate)
            .Select(s => new AttentionItem(s.Id, s.Title, s.OccupancyRate, s.BookingCount))
            .FirstOrDefault();

        return new SpaceOwnerTopPerformers(
            bestRevenue, bestRating, bestOccupancy, mostBookings, needsAttention
        );
    }

    public async Task<AdvertiserSummary> GetAdvertiserSummaryAsync(
        Guid userId, DateTime start, DateTime end, CancellationToken ct
    ) {
        var periodDays = (end - start).Days;
        var previousStart = start.AddDays(-periodDays);
        var previousEnd = start;

        var bookings = await context.Bookings
            .Where(b => b.Campaign.AdvertiserProfile.UserId == userId)
            .Where(b => b.CreatedAt >= start && b.CreatedAt < end)
            .Include(b => b.Space)
            .ToListAsync(ct);

        var previousBookings = await context.Bookings
            .Where(b => b.Campaign.AdvertiserProfile.UserId == userId)
            .Where(b => b.CreatedAt >= previousStart && b.CreatedAt < previousEnd)
            .Include(b => b.Space)
            .ToListAsync(ct);

        var validBookings = bookings.Where(b => !ExcludedStatuses.Contains(b.Status)).ToList();
        var previousValidBookings = previousBookings.Where(b => !ExcludedStatuses.Contains(b.Status)).ToList();

        var totalSpend = validBookings.Sum(b => b.TotalAmount);
        var previousTotalSpend = previousValidBookings.Sum(b => b.TotalAmount);

        var totalImpressions = validBookings.Sum(b =>
            ParseTrafficToDaily(b.Space.Traffic) * b.TotalDays);
        var previousTotalImpressions = previousValidBookings.Sum(b =>
            ParseTrafficToDaily(b.Space.Traffic) * b.TotalDays);

        var reach = validBookings.Select(b => b.SpaceId).Distinct().Count();
        var previousReach = previousValidBookings.Select(b => b.SpaceId).Distinct().Count();

        var avgCostPerImpression = totalImpressions > 0
            ? totalSpend / totalImpressions * 1000
            : 0;
        var previousAvgCostPerImpression = previousTotalImpressions > 0
            ? previousTotalSpend / previousTotalImpressions * 1000
            : 0;

        var roi = totalSpend > 0
            ? (decimal)totalImpressions / totalSpend * 1000
            : 0;
        var previousRoi = previousTotalSpend > 0
            ? (decimal)previousTotalImpressions / previousTotalSpend * 1000
            : 0;

        var completedCount = validBookings.Count(b => CompletedStatuses.Contains(b.Status));
        var completionRate = validBookings.Count > 0
            ? (decimal)completedCount / validBookings.Count * 100
            : 0;

        var previousCompletedCount = previousValidBookings.Count(b => CompletedStatuses.Contains(b.Status));
        var previousCompletionRate = previousValidBookings.Count > 0
            ? (decimal)previousCompletedCount / previousValidBookings.Count * 100
            : 0;

        return new AdvertiserSummary(
            TotalSpend: totalSpend,
            TotalBookings: validBookings.Count,
            TotalImpressions: totalImpressions,
            Reach: reach,
            AvgCostPerImpression: Math.Round(avgCostPerImpression, 2),
            Roi: Math.Round(roi, 2),
            CompletionRate: Math.Round(completionRate, 1),
            PreviousTotalSpend: previousTotalSpend,
            PreviousTotalBookings: previousValidBookings.Count,
            PreviousTotalImpressions: previousTotalImpressions,
            PreviousReach: previousReach,
            PreviousAvgCostPerImpression: Math.Round(previousAvgCostPerImpression, 2),
            PreviousRoi: Math.Round(previousRoi, 2),
            PreviousCompletionRate: Math.Round(previousCompletionRate, 1)
        );
    }

    public async Task<List<StatusCount>> GetAdvertiserStatusDistributionAsync(
        Guid userId, DateTime start, DateTime end, CancellationToken ct
    ) {
        var distribution = await context.Bookings
            .Where(b => b.Campaign.AdvertiserProfile.UserId == userId)
            .Where(b => b.CreatedAt >= start && b.CreatedAt < end)
            .GroupBy(b => b.Status)
            .Select(g => new StatusCount(g.Key, g.Count()))
            .ToListAsync(ct);

        return distribution;
    }

    public async Task<List<AdvertiserSpacePerformance>> GetAdvertiserSpacePerformanceAsync(
        Guid userId, DateTime start, DateTime end, int limit, CancellationToken ct
    ) {
        var bookings = await context.Bookings
            .Where(b => b.Campaign.AdvertiserProfile.UserId == userId)
            .Where(b => b.CreatedAt >= start && b.CreatedAt < end)
            .Where(b => !ExcludedStatuses.Contains(b.Status))
            .Include(b => b.Space)
            .ToListAsync(ct);

        var spaceGroups = bookings
            .GroupBy(b => b.SpaceId)
            .Select(g => {
                var space = g.First().Space;
                var totalSpend = g.Sum(b => b.TotalAmount);
                var impressions = g.Sum(b => ParseTrafficToDaily(space.Traffic) * b.TotalDays);
                var roi = totalSpend > 0 ? (decimal)impressions / totalSpend * 1000 : 0;

                return new AdvertiserSpacePerformance(
                    space.Id,
                    space.Title,
                    space.Images.FirstOrDefault(),
                    g.Count(),
                    totalSpend,
                    impressions,
                    Math.Round(roi, 2)
                );
            })
            .OrderByDescending(s => s.TotalSpend)
            .Take(limit)
            .ToList();

        return spaceGroups;
    }

    public async Task<List<AdvertiserMonthlyStats>> GetAdvertiserMonthlyStatsAsync(
        Guid userId, int months, CancellationToken ct
    ) {
        var endDate = DateTime.UtcNow;
        var startDate = endDate.AddMonths(-months);

        var bookings = await context.Bookings
            .Where(b => b.Campaign.AdvertiserProfile.UserId == userId)
            .Where(b => b.CreatedAt >= startDate && b.CreatedAt < endDate)
            .Where(b => !ExcludedStatuses.Contains(b.Status))
            .Include(b => b.Space)
            .ToListAsync(ct);

        return Enumerable.Range(0, months)
            .Select(i => {
                var monthStart = endDate.AddMonths(-months + i);
                var monthEnd = endDate.AddMonths(-months + i + 1);
                var monthBookings = bookings
                    .Where(b => b.CreatedAt >= monthStart && b.CreatedAt < monthEnd)
                    .ToList();

                var spending = monthBookings.Sum(b => b.TotalAmount);
                var impressions = monthBookings.Sum(b =>
                    ParseTrafficToDaily(b.Space.Traffic) * b.TotalDays);

                return new AdvertiserMonthlyStats(
                    monthStart.ToString("MMM yyyy"),
                    spending,
                    impressions
                );
            })
            .ToList();
    }

    public async Task<AdvertiserTopPerformers> GetAdvertiserTopPerformersAsync(
        Guid userId, DateTime start, DateTime end, CancellationToken ct
    ) {
        var periodDays = (end - start).Days;
        var previousStart = start.AddDays(-periodDays);
        var previousEnd = start;

        var currentBookings = await context.Bookings
            .Where(b => b.Campaign.AdvertiserProfile.UserId == userId)
            .Where(b => b.CreatedAt >= start && b.CreatedAt < end)
            .Where(b => !ExcludedStatuses.Contains(b.Status))
            .Include(b => b.Space)
            .ToListAsync(ct);

        var previousBookings = await context.Bookings
            .Where(b => b.Campaign.AdvertiserProfile.UserId == userId)
            .Where(b => b.CreatedAt >= previousStart && b.CreatedAt < previousEnd)
            .Where(b => !ExcludedStatuses.Contains(b.Status))
            .Include(b => b.Space)
            .ToListAsync(ct);

        var currentBySpace = currentBookings.GroupBy(b => b.SpaceId).ToList();
        var previousBySpace = previousBookings.GroupBy(b => b.SpaceId).ToList();

        var spaceMetrics = currentBySpace.Select(g => {
            var space = g.First().Space;
            var currentSpend = g.Sum(b => b.TotalAmount);
            var currentImpressions = g.Sum(b =>
                ParseTrafficToDaily(space.Traffic) * b.TotalDays);
            var currentRoi = currentSpend > 0
                ? (decimal)currentImpressions / currentSpend * 1000
                : 0;

            var prevGroup = previousBySpace.FirstOrDefault(pg => pg.Key == g.Key);
            var previousSpend = prevGroup?.Sum(b => b.TotalAmount) ?? 0;
            var previousImpressions = prevGroup?.Sum(b =>
                ParseTrafficToDaily(space.Traffic) * b.TotalDays) ?? 0;
            var previousRoi = previousSpend > 0
                ? (decimal)previousImpressions / previousSpend * 1000
                : 0;

            var roiChange = previousRoi > 0
                ? (currentRoi - previousRoi) / previousRoi * 100
                : currentRoi > 0 ? 100 : 0;

            var impressionChange = previousImpressions > 0
                ? (decimal)(currentImpressions - previousImpressions) / previousImpressions * 100
                : currentImpressions > 0 ? 100 : 0;

            var bookingCount = g.Count();
            var previousBookingCount = prevGroup?.Count() ?? 0;
            var bookingChange = previousBookingCount > 0
                ? (decimal)(bookingCount - previousBookingCount) / previousBookingCount * 100
                : bookingCount > 0 ? 100 : 0;

            return new {
                space.Id,
                space.Title,
                Roi = Math.Round(currentRoi, 2),
                RoiChange = Math.Round(roiChange, 1),
                Impressions = currentImpressions,
                ImpressionChange = Math.Round(impressionChange, 1),
                Spend = currentSpend,
                SpendChange = previousSpend > 0
                    ? Math.Round((currentSpend - previousSpend) / previousSpend * 100, 1)
                    : currentSpend > 0 ? 100m : 0m,
                BookingCount = bookingCount,
                BookingChange = Math.Round(bookingChange, 1)
            };
        }).ToList();

        var bestRoi = spaceMetrics
            .Where(s => s.Roi > 0)
            .OrderByDescending(s => s.Roi)
            .Select(s => new PerformerItem(s.Id, s.Title, s.Roi, s.RoiChange))
            .FirstOrDefault();

        var mostImpressions = spaceMetrics
            .Where(s => s.Impressions > 0)
            .OrderByDescending(s => s.Impressions)
            .Select(s => new PerformerItem(s.Id, s.Title, s.Impressions, s.ImpressionChange))
            .FirstOrDefault();

        var bestValue = spaceMetrics
            .Where(s => s.Roi > 0 && s.BookingCount >= 2)
            .OrderByDescending(s => s.Roi * s.BookingCount)
            .Select(s => new PerformerItem(s.Id, s.Title, s.Spend, s.SpendChange))
            .FirstOrDefault();

        var mostBookings = spaceMetrics
            .Where(s => s.BookingCount > 0)
            .OrderByDescending(s => s.BookingCount)
            .Select(s => new PerformerItem(s.Id, s.Title, s.BookingCount, s.BookingChange))
            .FirstOrDefault();

        var needsReview = spaceMetrics
            .Where(s => s.Roi < 100 || s.Impressions < 1000)
            .OrderBy(s => s.Roi)
            .Select(s => new AdvertiserAttentionItem(s.Id, s.Title, s.Roi, s.Impressions))
            .FirstOrDefault();

        return new AdvertiserTopPerformers(
            bestRoi, mostImpressions, bestValue, mostBookings, needsReview
        );
    }

    private static long ParseTrafficToDaily(string? traffic) {
        if (string.IsNullOrEmpty(traffic)) return 100;
        var match = TrafficPattern().Match(traffic);
        return match.Success && long.TryParse(match.Value, out var v) ? v : 100;
    }

    [GeneratedRegex(@"(\d+)")]
    private static partial Regex TrafficPattern();
}
