using ElaviewBackend.Features.Shared.Errors;
using ElaviewBackend.Features.Users;
using HotChocolate.Authorization;

namespace ElaviewBackend.Features.Marketplace;

[MutationType]
public static partial class SpaceMutations {
    [Authorize]
    [Error<NotFoundException>]
    [Error<ValidationException>]
    public static async Task<CreateSpacePayload> CreateSpace(
        CreateSpaceInput input,
        IUserService userService,
        ISpaceService spaceService,
        CancellationToken ct
    ) {
        var space = await spaceService.CreateAsync(userService.GetPrincipalId(), input, ct);
        return new CreateSpacePayload(space);
    }

    [Authorize]
    [Error<NotFoundException>]
    [Error<ForbiddenException>]
    [Error<ValidationException>]
    public static async Task<UpdateSpacePayload> UpdateSpace(
        [ID] Guid id,
        UpdateSpaceInput input,
        IUserService userService,
        ISpaceService spaceService,
        CancellationToken ct
    ) {
        var space = await spaceService.UpdateAsync(userService.GetPrincipalId(), id, input, ct);
        return new UpdateSpacePayload(space);
    }

    [Authorize]
    [Error<NotFoundException>]
    [Error<ForbiddenException>]
    [Error<ConflictException>]
    public static async Task<DeleteSpacePayload> DeleteSpace(
        [ID] Guid id,
        IUserService userService,
        ISpaceService spaceService,
        CancellationToken ct
    ) {
        var success = await spaceService.DeleteAsync(userService.GetPrincipalId(), id, ct);
        return new DeleteSpacePayload(success);
    }

    [Authorize]
    [Error<NotFoundException>]
    [Error<ForbiddenException>]
    [Error<ConflictException>]
    public static async Task<DeactivateSpacePayload> DeactivateSpace(
        [ID] Guid id,
        IUserService userService,
        ISpaceService spaceService,
        CancellationToken ct
    ) {
        var space = await spaceService.DeactivateAsync(userService.GetPrincipalId(), id, ct);
        return new DeactivateSpacePayload(space);
    }

    [Authorize]
    [Error<NotFoundException>]
    [Error<ForbiddenException>]
    public static async Task<ReactivateSpacePayload> ReactivateSpace(
        [ID] Guid id,
        IUserService userService,
        ISpaceService spaceService,
        CancellationToken ct
    ) {
        var space = await spaceService.ReactivateAsync(userService.GetPrincipalId(), id, ct);
        return new ReactivateSpacePayload(space);
    }
}