using ElaviewBackend.Data.Entities;
using HotChocolate.Authorization;

namespace ElaviewBackend.Features.Users;

[ExtendObjectType<User>]
public static class UserExtensions {
    [Authorize]
    public static async Task<AdvertiserProfile?> GetAdvertiserProfile(
        [Parent] User user, IUserService userService, CancellationToken ct
    ) => await userService.GetAdvertiserProfileAsync(ct);

    [Authorize]
    public static async Task<SpaceOwnerProfile?> GetSpaceOwnerProfile(
        [Parent] User user, IUserService userService, CancellationToken ct
    ) => await userService.GetSpaceOwnerProfileAsync(ct);
}