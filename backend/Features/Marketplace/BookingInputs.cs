using ElaviewBackend.Data.Entities;

namespace ElaviewBackend.Features.Marketplace;

public record CreateBookingInput(
    Guid SpaceId,
    DateTime StartDate,
    DateTime EndDate,
    string? AdvertiserNotes
);

public record DisputeProofInput(
    [property: ID] Guid BookingId,
    DisputeIssueType IssueType,
    string Reason,
    List<string>? PhotoUrls = null
);