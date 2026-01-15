using System.Diagnostics.CodeAnalysis;
using ElaviewBackend.Data.Entities;
using HotChocolate.Authorization;

namespace ElaviewBackend.Features.Users;

[MutationType]
[SuppressMessage("ReSharper", "MemberCanBePrivate.Global")]
public static partial class UserMutations {
    [Authorize]
    public static async Task<User> UpdateCurrentUser(
        UpdateUserInput input, IUserService userService, CancellationToken ct
    ) {
        return await userService.UpdateMyInfoAsync(input, ct);
    }

    [Authorize]
    public static async Task<User> SwitchProfileType(
        ProfileType type, IUserService userService, CancellationToken ct
    ) {
        return await userService.SwitchMyProfileTypeAsync(type, ct);
    }

    [Authorize]
    public static async Task<AdvertiserProfile> UpdateAdvertiserProfile(
        UpdateAdvertiserProfileInput input, IUserService userService,
        CancellationToken ct
    ) {
        return await userService.UpdateAdvertiserProfileAsync(input, ct);
    }

    [Authorize]
    public static async Task<SpaceOwnerProfile> UpdateSpaceOwnerProfile(
        UpdateSpaceOwnerProfileInput input, IUserService userService,
        CancellationToken ct
    ) {
        return await userService.UpdateSpaceOwnerProfileAsync(input, ct);
    }

    [Authorize]
    public static async Task<User> CompleteOnboarding(
        ProfileType profileType, IUserService userService, CancellationToken ct
    ) {
        return await userService.CompleteOnboardingAsync(profileType, ct);
    }

    [Authorize(Roles = ["Admin"])]
    public static async Task<bool> DeleteUser(
        [ID] Guid id, IUserService userService, CancellationToken ct
    ) {
        return await userService.DeleteAsync(id, ct);
    }
}