using ElaviewBackend.Data.Entities;

namespace ElaviewBackend.Features.Users;

public record UpdateUserInput(
    string? Name,
    string? Phone,
    string? Avatar
);

public record UpdateAdvertiserProfileInput(
    string? CompanyName,
    string? Industry,
    string? Website
);

public record UpdateSpaceOwnerProfileInput(
    string? BusinessName,
    string? BusinessType,
    PayoutSchedule? PayoutSchedule
);