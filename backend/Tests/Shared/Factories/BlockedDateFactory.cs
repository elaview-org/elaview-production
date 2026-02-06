using Bogus;
using ElaviewBackend.Data.Entities;

namespace ElaviewBackend.Tests.Shared.Factories;

public static class BlockedDateFactory {
    private static readonly Faker Faker = new();

    public static BlockedDate Create(Guid spaceId, Action<BlockedDate>? customize = null) {
        var blockedDate = new BlockedDate {
            Id = Guid.NewGuid(),
            SpaceId = spaceId,
            Date = DateOnly.FromDateTime(Faker.Date.Future()),
            Reason = Faker.Lorem.Sentence(),
            CreatedAt = DateTime.UtcNow
        };
        customize?.Invoke(blockedDate);
        return blockedDate;
    }

    public static BlockedDate CreateForDate(Guid spaceId, DateOnly date, string? reason = null) {
        return new BlockedDate {
            Id = Guid.NewGuid(),
            SpaceId = spaceId,
            Date = date,
            Reason = reason,
            CreatedAt = DateTime.UtcNow
        };
    }

    public static List<BlockedDate> CreateMany(Guid spaceId, int count, Action<BlockedDate, int>? customize = null) {
        return Enumerable.Range(0, count)
            .Select(i => {
                var blockedDate = Create(spaceId);
                customize?.Invoke(blockedDate, i);
                return blockedDate;
            })
            .ToList();
    }

    public static List<BlockedDate> CreateRange(Guid spaceId, DateOnly startDate, int days, string? reason = null) {
        return Enumerable.Range(0, days)
            .Select(i => new BlockedDate {
                Id = Guid.NewGuid(),
                SpaceId = spaceId,
                Date = startDate.AddDays(i),
                Reason = reason,
                CreatedAt = DateTime.UtcNow
            })
            .ToList();
    }
}
