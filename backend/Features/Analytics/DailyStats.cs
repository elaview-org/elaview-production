namespace ElaviewBackend.Features.Analytics;

public record DailyStats(
    DateTime Date,
    int Bookings,
    decimal Earnings,
    decimal Spending
);
