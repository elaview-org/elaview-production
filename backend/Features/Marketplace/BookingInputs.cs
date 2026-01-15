namespace ElaviewBackend.Features.Marketplace;

public record CreateBookingInput(
    Guid SpaceId,
    DateTime StartDate,
    DateTime EndDate,
    string? AdvertiserNotes
);