using ElaviewBackend.Data.Entities;

namespace ElaviewBackend.Features.Marketplace;

[ExtendObjectType<Review>]
public static class ReviewExtensions {
    public static async Task<ReviewerInfo?> GetReviewer(
        [Parent] Review review,
        IAdvertiserReviewerInfoByProfileIdDataLoader advertiserLoader,
        ISpaceOwnerReviewerInfoByProfileIdDataLoader ownerLoader,
        CancellationToken ct
    ) => review.ReviewerType switch {
        ReviewerType.Advertiser => await advertiserLoader.LoadAsync(review.ReviewerProfileId, ct),
        ReviewerType.SpaceOwner => await ownerLoader.LoadAsync(review.ReviewerProfileId, ct),
        _ => null
    };
}
