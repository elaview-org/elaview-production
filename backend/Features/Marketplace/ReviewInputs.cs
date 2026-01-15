namespace ElaviewBackend.Features.Marketplace;

public record CreateReviewInput(
    int Rating,
    string? Comment
);

public record UpdateReviewInput(
    int? Rating,
    string? Comment
);