using ElaviewBackend.Data.Entities;
using ElaviewBackend.Features.Shared.Errors;

namespace ElaviewBackend.Features.Marketplace;

public interface IBlockedDateService {
    IQueryable<BlockedDate> GetBySpaceId(Guid spaceId);
    IQueryable<BlockedDate> GetBySpaceIdInRange(Guid spaceId, DateOnly? startDate, DateOnly? endDate);
    Task<List<BlockedDate>> BlockDatesAsync(Guid userId, BlockDatesInput input, CancellationToken ct);
    Task<int> UnblockDatesAsync(Guid userId, UnblockDatesInput input, CancellationToken ct);
}

public sealed class BlockedDateService(IBlockedDateRepository repository) : IBlockedDateService {
    public IQueryable<BlockedDate> GetBySpaceId(Guid spaceId)
        => repository.GetBySpaceId(spaceId);

    public IQueryable<BlockedDate> GetBySpaceIdInRange(Guid spaceId, DateOnly? startDate, DateOnly? endDate) {
        if (startDate.HasValue && endDate.HasValue)
            return repository.GetBySpaceIdInRange(spaceId, startDate.Value, endDate.Value);
        return repository.GetBySpaceId(spaceId);
    }

    public async Task<List<BlockedDate>> BlockDatesAsync(Guid userId, BlockDatesInput input, CancellationToken ct) {
        if (input.Dates.Count == 0)
            throw new ValidationException("Dates", "At least one date is required");

        var space = await repository.GetSpaceWithOwnerAsync(input.SpaceId, ct)
            ?? throw new NotFoundException("Space", input.SpaceId);

        if (space.SpaceOwnerProfile.UserId != userId)
            throw new ForbiddenException("block dates on this space");

        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        var pastDates = input.Dates.Where(d => d < today).ToList();
        if (pastDates.Count > 0)
            throw new ValidationException("Dates", "Cannot block dates in the past");

        if (await repository.HasConfirmedBookingsOnDatesAsync(input.SpaceId, input.Dates, ct))
            throw new ConflictException("BlockedDate", "Cannot block dates with confirmed bookings");

        var blockedDates = input.Dates
            .Distinct()
            .Select(date => new BlockedDate {
                SpaceId = input.SpaceId,
                Date = date,
                Reason = input.Reason,
                CreatedAt = DateTime.UtcNow
            })
            .ToList();

        return await repository.AddRangeAsync(blockedDates, ct);
    }

    public async Task<int> UnblockDatesAsync(Guid userId, UnblockDatesInput input, CancellationToken ct) {
        if (input.Dates.Count == 0)
            throw new ValidationException("Dates", "At least one date is required");

        var space = await repository.GetSpaceWithOwnerAsync(input.SpaceId, ct)
            ?? throw new NotFoundException("Space", input.SpaceId);

        if (space.SpaceOwnerProfile.UserId != userId)
            throw new ForbiddenException("unblock dates on this space");

        return await repository.DeleteBySpaceIdAndDatesAsync(input.SpaceId, input.Dates, ct);
    }
}
