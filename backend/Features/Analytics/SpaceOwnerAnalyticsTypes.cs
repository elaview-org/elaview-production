using ElaviewBackend.Data.Entities;

namespace ElaviewBackend.Features.Analytics;

public record SpaceOwnerAnalytics(
    Guid UserId,
    DateTime StartDate,
    DateTime EndDate,
    SpaceOwnerSummary Summary,
    List<StatusCount> StatusDistribution,
    PeriodComparison PeriodComparison,
    SpaceOwnerTopPerformers TopPerformers
);

public record SpaceOwnerSummary(
    int TotalBookings,
    decimal TotalRevenue,
    double? AverageRating,
    decimal CompletionRate,
    decimal AvgBookingDuration,
    decimal OccupancyRate,
    decimal RepeatAdvertiserRate,
    decimal ForecastedRevenue,
    int PreviousTotalBookings,
    decimal PreviousTotalRevenue,
    decimal PreviousAvgBookingDuration,
    decimal PreviousOccupancyRate,
    decimal PreviousRepeatAdvertiserRate
);

public record StatusCount(BookingStatus Status, int Count);

public record SpacePerformanceItem(
    Guid Id,
    string Title,
    string? Image,
    int TotalBookings,
    decimal TotalRevenue,
    double? AverageRating,
    decimal OccupancyRate
);

public record MonthlyStats(string Month, decimal Revenue, int Bookings);

public record RatingTrendPoint(string Month, double Rating, int Reviews);

public record PeriodData(
    string Period,
    DateTime StartDate,
    DateTime EndDate,
    int Bookings,
    decimal Revenue,
    double? AvgRating,
    decimal CompletionRate
);

public record PeriodComparison(PeriodData Current, PeriodData Previous);

public record PerformerItem(Guid Id, string Title, decimal Value, decimal Change);

public record RatingPerformerItem(Guid Id, string Title, double Value, int Reviews);

public record AttentionItem(Guid Id, string Title, decimal Occupancy, int Bookings);

public record SpaceOwnerTopPerformers(
    PerformerItem? BestRevenue,
    RatingPerformerItem? BestRating,
    PerformerItem? BestOccupancy,
    PerformerItem? MostBookings,
    AttentionItem? NeedsAttention
);
