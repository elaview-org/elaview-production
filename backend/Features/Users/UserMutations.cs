using System.Diagnostics.CodeAnalysis;
using ElaviewBackend.Features.Shared.Errors;
using HotChocolate.Authorization;

namespace ElaviewBackend.Features.Users;

[MutationType]
[SuppressMessage("ReSharper", "MemberCanBePrivate.Global")]
public static partial class UserMutations {
    [Authorize]
    [Error<NotFoundException>]
    public static async Task<UpdateCurrentUserPayload> UpdateCurrentUser(
        UpdateUserInput input,
        IUserService userService,
        CancellationToken ct
    ) => new(await userService.UpdateAsync(userService.GetPrincipalId(), input,
        ct));

    [Authorize]
    [Error<NotFoundException>]
    public static async Task<UpdateAdvertiserProfilePayload>
        UpdateAdvertiserProfile(
            UpdateAdvertiserProfileInput input,
            IUserService userService,
            CancellationToken ct
        ) => new(await userService.UpdateAdvertiserProfileAsync(
        userService.GetPrincipalId(), input, ct));

    [Authorize]
    [Error<NotFoundException>]
    public static async Task<UpdateSpaceOwnerProfilePayload>
        UpdateSpaceOwnerProfile(
            UpdateSpaceOwnerProfileInput input,
            IUserService userService,
            CancellationToken ct
        ) => new(await userService.UpdateSpaceOwnerProfileAsync(
        userService.GetPrincipalId(), input, ct));

    [Authorize(Roles = ["Admin"])]
    [Error<NotFoundException>]
    public static async Task<DeleteUserPayload> DeleteUser(
        [ID] Guid id,
        IUserService userService,
        CancellationToken ct
    ) => new(await userService.DeleteAsync(id, ct));
}