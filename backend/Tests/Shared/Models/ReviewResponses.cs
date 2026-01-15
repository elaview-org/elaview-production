namespace ElaviewBackend.Tests.Shared.Models;

public record ReviewsResponse(ReviewsConnection Reviews);

public record ReviewsConnection(List<ReviewNode> Nodes, PageInfo PageInfo, int TotalCount);

public record ReviewNode(
    Guid Id,
    int Rating,
    string? Comment,
    string ReviewerType
);

public record ReviewByIdResponse(ReviewNode? ReviewById);

public record ReviewsBySpaceResponse(ReviewsConnection ReviewsBySpace);

public record CreateReviewResponse(CreateReviewPayload CreateReview);

public record CreateReviewPayload(ReviewNode Review);

public record UpdateReviewResponse(UpdateReviewPayload UpdateReview);

public record UpdateReviewPayload(ReviewNode Review);

public record DeleteReviewResponse(DeleteReviewPayload DeleteReview);

public record DeleteReviewPayload(bool Success);