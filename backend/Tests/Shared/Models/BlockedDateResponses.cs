namespace ElaviewBackend.Tests.Shared.Models;

public record BlockedDatesBySpaceResponse(BlockedDatesConnection BlockedDatesBySpace);

public record BlockedDatesConnection(
    List<BlockedDateNode> Nodes,
    PageInfo PageInfo,
    int? TotalCount = null);

public record BlockedDateNode(
    Guid Id,
    Guid SpaceId,
    DateOnly Date,
    string? Reason,
    DateTime CreatedAt
);

public record BlockDatesResponse(BlockDatesPayload BlockDates);

public record BlockDatesPayload(List<BlockedDateNode>? BlockedDates, List<MutationError>? Errors);

public record UnblockDatesResponse(UnblockDatesPayload UnblockDates);

public record UnblockDatesPayload(int? UnblockedCount, List<MutationError>? Errors);
