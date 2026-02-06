using ElaviewBackend.Features.Shared.Errors;
using ElaviewBackend.Features.Users;
using HotChocolate.Authorization;

namespace ElaviewBackend.Features.Marketplace;

[MutationType]
public static partial class BlockedDateMutations {
    [Authorize]
    [Error<NotFoundException>]
    [Error<ForbiddenException>]
    [Error<ValidationException>]
    [Error<ConflictException>]
    public static async Task<BlockDatesPayload> BlockDates(
        BlockDatesInput input,
        IUserService userService,
        IBlockedDateService blockedDateService,
        CancellationToken ct
    ) {
        var blockedDates = await blockedDateService.BlockDatesAsync(userService.GetPrincipalId(), input, ct);
        return new BlockDatesPayload(blockedDates);
    }

    [Authorize]
    [Error<NotFoundException>]
    [Error<ForbiddenException>]
    [Error<ValidationException>]
    public static async Task<UnblockDatesPayload> UnblockDates(
        UnblockDatesInput input,
        IUserService userService,
        IBlockedDateService blockedDateService,
        CancellationToken ct
    ) {
        var unblockedCount = await blockedDateService.UnblockDatesAsync(userService.GetPrincipalId(), input, ct);
        return new UnblockDatesPayload(unblockedCount);
    }
}
