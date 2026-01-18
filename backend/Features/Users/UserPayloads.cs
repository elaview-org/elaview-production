using ElaviewBackend.Data.Entities;

namespace ElaviewBackend.Features.Users;

public record UpdateCurrentUserPayload(User User);

public record UpdateAdvertiserProfilePayload(AdvertiserProfile AdvertiserProfile);

public record UpdateSpaceOwnerProfilePayload(SpaceOwnerProfile SpaceOwnerProfile);

public record DeleteUserPayload(bool Success);