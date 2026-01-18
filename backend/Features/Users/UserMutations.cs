using System.Diagnostics.CodeAnalysis;
using ElaviewBackend.Data.Entities;
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
    ) {
        var user = await userService.UpdateAsync(userService.GetPrincipalId(), input, ct);
        return new UpdateCurrentUserPayload(user);
    }

    [Authorize]
    [Error<NotFoundException>]
    public static async Task<UpdateAdvertiserProfilePayload> UpdateAdvertiserProfile(
        UpdateAdvertiserProfileInput input,
        IUserService userService,
        CancellationToken ct
    ) {
        var profile = await userService.UpdateAdvertiserProfileAsync(userService.GetPrincipalId(), input, ct);
        return new UpdateAdvertiserProfilePayload(profile);
    }

    [Authorize]
    [Error<NotFoundException>]
    public static async Task<UpdateSpaceOwnerProfilePayload> UpdateSpaceOwnerProfile(
        UpdateSpaceOwnerProfileInput input,
        IUserService userService,
        CancellationToken ct
    ) {
        var profile = await userService.UpdateSpaceOwnerProfileAsync(userService.GetPrincipalId(), input, ct);
        return new UpdateSpaceOwnerProfilePayload(profile);
    }

    [Authorize(Roles = ["Admin"])]
    [Error<NotFoundException>]
    public static async Task<DeleteUserPayload> DeleteUser(
        [ID] Guid id,
        IUserService userService,
        CancellationToken ct
    ) {
        var success = await userService.DeleteAsync(id, ct);
        return new DeleteUserPayload(success);
    }
}
