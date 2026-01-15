using Bogus;
using ElaviewBackend.Data.Entities;

namespace ElaviewBackend.Tests.Shared.Factories;

public static class BookingFactory {
    private static readonly Faker Faker = new();

    public static Booking Create(Guid campaignId, Guid spaceId,
        Action<Booking>? customize = null) {
        var startDate =
            DateTime.SpecifyKind(Faker.Date.Future(), DateTimeKind.Utc);
        var endDate = DateTime.SpecifyKind(
            startDate.AddDays(Faker.Random.Int(7, 30)), DateTimeKind.Utc);
        var totalDays = (endDate - startDate).Days;
        var pricePerDay = Faker.Random.Decimal(10, 100);
        var installationFee = Faker.Random.Decimal(10, 50);
        var subtotal = pricePerDay * totalDays;
        var platformFeePercent = 0.10m;
        var platformFeeAmount = subtotal * platformFeePercent;

        var booking = new Booking {
            Id = Guid.NewGuid(),
            CampaignId = campaignId,
            SpaceId = spaceId,
            Status = BookingStatus.PendingApproval,
            StartDate = startDate,
            EndDate = endDate,
            TotalDays = totalDays,
            PricePerDay = pricePerDay,
            InstallationFee = installationFee,
            SubtotalAmount = subtotal,
            PlatformFeePercent = platformFeePercent,
            PlatformFeeAmount = platformFeeAmount,
            TotalAmount = subtotal + installationFee + platformFeeAmount,
            OwnerPayoutAmount = subtotal + installationFee,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        customize?.Invoke(booking);
        return booking;
    }

    public static Booking CreateWithStatus(Guid campaignId, Guid spaceId,
        BookingStatus status, Action<Booking>? customize = null) {
        return Create(campaignId, spaceId, b => {
            b.Status = status;
            customize?.Invoke(b);
        });
    }

    public static List<Booking> CreateMany(Guid campaignId, Guid spaceId,
        int count, Action<Booking, int>? customize = null) {
        return Enumerable.Range(0, count)
            .Select(i => {
                var booking = Create(campaignId, spaceId);
                customize?.Invoke(booking, i);
                return booking;
            })
            .ToList();
    }
}