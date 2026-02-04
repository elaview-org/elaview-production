using System.Diagnostics.CodeAnalysis;
using ElaviewBackend.Features.Auth;
using ElaviewBackend.Features.Shared.Errors;
using HotChocolate.Authorization;
using ValidationException = ElaviewBackend.Features.Shared.Errors.ValidationException;

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

    [Authorize]
    [Error<NotFoundException>]
    [Error<ValidationException>]
    public static async Task<ChangePasswordPayload> ChangePassword(
        ChangePasswordInput input,
        IUserService userService,
        AuthService authService,
        CancellationToken ct
    ) {
        await authService.ChangePasswordAsync(
            userService.GetPrincipalId(), input.CurrentPassword,
            input.NewPassword, ct);
        return new(true);
    }

    [Authorize]
    [Error<NotFoundException>]
    [Error<ValidationException>]
    public static async Task<DeleteMyAccountPayload> DeleteMyAccount(
        DeleteMyAccountInput input,
        IUserService userService,
        AuthService authService,
        CancellationToken ct
    ) {
        var userId = userService.GetPrincipalId();
        await authService.VerifyPasswordAsync(userId, input.Password, ct);
        await userService.DeleteAsync(userId, ct);
        return new(true);
    }
}