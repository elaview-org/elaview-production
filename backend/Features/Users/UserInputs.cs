using ElaviewBackend.Data.Entities;

namespace ElaviewBackend.Features.Users;

public record UpdateUserInput(
    string? Name,
    string? Phone,
    string? Avatar,
    ProfileType? ActiveProfileType
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

public record ChangePasswordInput(string CurrentPassword, string NewPassword);

public record DeleteMyAccountInput(string Password);