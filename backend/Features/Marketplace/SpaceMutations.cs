using HotChocolate.Authorization;

namespace ElaviewBackend.Features.Marketplace;

[MutationType]
public static partial class SpaceMutations {
    [Authorize]
    public static async Task<CreateSpacePayload> CreateSpace(
        CreateSpaceInput input, ISpaceService spaceService, CancellationToken ct
    ) {
        return new CreateSpacePayload(
            await spaceService.CreateAsync(input, ct));
    }

    [Authorize]
    public static async Task<UpdateSpacePayload> UpdateSpace(
        [ID] Guid id, UpdateSpaceInput input, ISpaceService spaceService,
        CancellationToken ct
    ) {
        return new UpdateSpacePayload(
            await spaceService.UpdateAsync(id, input, ct));
    }

    [Authorize]
    public static async Task<DeleteSpacePayload> DeleteSpace(
        [ID] Guid id, ISpaceService spaceService, CancellationToken ct
    ) {
        return new DeleteSpacePayload(await spaceService.DeleteAsync(id, ct));
    }

    [Authorize]
    public static async Task<DeactivateSpacePayload> DeactivateSpace(
        [ID] Guid id, ISpaceService spaceService, CancellationToken ct
    ) {
        return new DeactivateSpacePayload(
            await spaceService.DeactivateAsync(id, ct));
    }

    [Authorize]
    public static async Task<ReactivateSpacePayload> ReactivateSpace(
        [ID] Guid id, ISpaceService spaceService, CancellationToken ct
    ) {
        return new ReactivateSpacePayload(
            await spaceService.ReactivateAsync(id, ct));
    }
}