using Bogus;
using ElaviewBackend.Data.Entities;

namespace ElaviewBackend.Data.Seeding.Generators;

public sealed class BookingGenerator(int? seed = null) {
    private readonly Faker _faker = seed.HasValue
        ? new Faker { Random = new Randomizer(seed.Value) }
        : new Faker();
    private const decimal PlatformFeePercent = 0.10m;

    public Booking Generate(Guid campaignId, Space space, BookingStatus? status = null) {
        var startDate = DateTime.SpecifyKind(_faker.Date.Future(1), DateTimeKind.Utc);
        var totalDays = _faker.Random.Int(7, 30);
        var endDate = DateTime.SpecifyKind(startDate.AddDays(totalDays), DateTimeKind.Utc);
        var subtotal = space.PricePerDay * totalDays;
        var installationFee = space.InstallationFee ?? 0;
        var platformFee = subtotal * PlatformFeePercent;

        return new Booking {
            CampaignId = campaignId,
            SpaceId = space.Id,
            Status = status ?? _faker.PickRandom<BookingStatus>(),
            StartDate = startDate,
            EndDate = endDate,
            TotalDays = totalDays,
            PricePerDay = space.PricePerDay,
            SubtotalAmount = subtotal,
            InstallationFee = installationFee,
            PlatformFeePercent = PlatformFeePercent,
            PlatformFeeAmount = platformFee,
            TotalAmount = subtotal + installationFee + platformFee,
            OwnerPayoutAmount = subtotal + installationFee
        };
    }

    public List<Booking> Generate(int count, List<Campaign> campaigns, List<Space> spaces) {
        return Enumerable.Range(0, count)
            .Select(_ => Generate(
                _faker.PickRandom(campaigns).Id,
                _faker.PickRandom(spaces)))
            .ToList();
    }
}