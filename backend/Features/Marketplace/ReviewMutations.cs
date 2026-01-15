using HotChocolate.Authorization;

namespace ElaviewBackend.Features.Marketplace;

[MutationType]
public static partial class ReviewMutations {
    [Authorize]
    public static async Task<CreateReviewPayload> CreateReview(
        [ID] Guid bookingId, CreateReviewInput input,
        IReviewService reviewService, CancellationToken ct
    ) {
        return new CreateReviewPayload(
            await reviewService.CreateAsync(bookingId, input, ct));
    }

    [Authorize]
    public static async Task<UpdateReviewPayload> UpdateReview(
        [ID] Guid id, UpdateReviewInput input, IReviewService reviewService,
        CancellationToken ct
    ) {
        return new UpdateReviewPayload(
            await reviewService.UpdateAsync(id, input, ct));
    }

    [Authorize(Roles = ["Admin"])]
    public static async Task<DeleteReviewPayload> DeleteReview(
        [ID] Guid id, IReviewService reviewService, CancellationToken ct
    ) {
        return new DeleteReviewPayload(await reviewService.DeleteAsync(id, ct));
    }
}