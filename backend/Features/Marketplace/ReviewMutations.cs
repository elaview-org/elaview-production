using ElaviewBackend.Features.Shared.Errors;
using ElaviewBackend.Features.Users;
using HotChocolate.Authorization;

namespace ElaviewBackend.Features.Marketplace;

[MutationType]
public static partial class ReviewMutations {
    [Authorize]
    [Error<NotFoundException>]
    [Error<ForbiddenException>]
    [Error<ConflictException>]
    public static async Task<CreateReviewPayload> CreateReview(
        [ID] Guid bookingId,
        CreateReviewInput input,
        IUserService userService,
        IReviewService reviewService,
        CancellationToken ct
    ) {
        var review = await reviewService.CreateAsync(userService.GetPrincipalId(), bookingId, input, ct);
        return new CreateReviewPayload(review);
    }

    [Authorize]
    [Error<NotFoundException>]
    [Error<ForbiddenException>]
    [Error<ValidationException>]
    public static async Task<UpdateReviewPayload> UpdateReview(
        [ID] Guid id,
        UpdateReviewInput input,
        IUserService userService,
        IReviewService reviewService,
        CancellationToken ct
    ) {
        var review = await reviewService.UpdateAsync(userService.GetPrincipalId(), id, input, ct);
        return new UpdateReviewPayload(review);
    }

    [Authorize(Roles = ["Admin"])]
    public static async Task<DeleteReviewPayload> DeleteReview(
        [ID] Guid id,
        IReviewService reviewService,
        CancellationToken ct
    ) {
        var success = await reviewService.DeleteAsync(id, ct);
        return new DeleteReviewPayload(success);
    }
}