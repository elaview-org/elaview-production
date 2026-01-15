using Bogus;
using ElaviewBackend.Data.Entities;

namespace ElaviewBackend.Tests.Shared.Factories;

public static class ReviewFactory {
    private static readonly Faker Faker = new();

    public static Review Create(
        Guid bookingId,
        Guid spaceId,
        Guid reviewerProfileId,
        ReviewerType reviewerType = ReviewerType.Advertiser,
        Action<Review>? customize = null
    ) {
        var review = new Review {
            Id = Guid.NewGuid(),
            BookingId = bookingId,
            SpaceId = spaceId,
            ReviewerProfileId = reviewerProfileId,
            ReviewerType = reviewerType,
            Rating = Faker.Random.Int(1, 5),
            Comment = Faker.Lorem.Paragraph(),
            CreatedAt = DateTime.UtcNow
        };
        customize?.Invoke(review);
        return review;
    }

    public static List<Review> CreateMany(
        Guid bookingId,
        Guid spaceId,
        Guid reviewerProfileId,
        int count,
        Action<Review, int>? customize = null
    ) {
        return Enumerable.Range(0, count)
            .Select(i => {
                var review = Create(bookingId, spaceId, reviewerProfileId);
                customize?.Invoke(review, i);
                return review;
            })
            .ToList();
    }
}