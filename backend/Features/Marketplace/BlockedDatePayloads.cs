using ElaviewBackend.Data.Entities;

namespace ElaviewBackend.Features.Marketplace;

public record BlockDatesPayload(List<BlockedDate> BlockedDates);

public record UnblockDatesPayload(int UnblockedCount);
