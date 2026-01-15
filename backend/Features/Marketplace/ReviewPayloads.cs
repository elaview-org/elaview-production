using ElaviewBackend.Data.Entities;

namespace ElaviewBackend.Features.Marketplace;

public record CreateReviewPayload(Review Review);
public record UpdateReviewPayload(Review Review);
public record DeleteReviewPayload(bool Success);