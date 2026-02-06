using ElaviewBackend.Data;
using ElaviewBackend.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace ElaviewBackend.Features.Marketplace;

public interface IBlockedDateRepository {
    IQueryable<BlockedDate> GetBySpaceId(Guid spaceId);
    IQueryable<BlockedDate> GetBySpaceIdInRange(Guid spaceId, DateOnly startDate, DateOnly endDate);
    Task<bool> HasConfirmedBookingsOnDatesAsync(Guid spaceId, List<DateOnly> dates, CancellationToken ct);
    Task<bool> HasBlockedDatesInRangeAsync(Guid spaceId, DateOnly startDate, DateOnly endDate, CancellationToken ct);
    Task<List<BlockedDate>> AddRangeAsync(List<BlockedDate> blockedDates, CancellationToken ct);
    Task<int> DeleteBySpaceIdAndDatesAsync(Guid spaceId, List<DateOnly> dates, CancellationToken ct);
    Task<Space?> GetSpaceWithOwnerAsync(Guid spaceId, CancellationToken ct);
}

public sealed class BlockedDateRepository(AppDbContext context) : IBlockedDateRepository {
    private static readonly BookingStatus[] ConfirmedStatuses = [
        BookingStatus.Paid,
        BookingStatus.FileDownloaded,
        BookingStatus.Installed,
        BookingStatus.Verified
    ];

    public IQueryable<BlockedDate> GetBySpaceId(Guid spaceId)
        => context.BlockedDates
            .Where(bd => bd.SpaceId == spaceId)
            .OrderBy(bd => bd.Date);

    public IQueryable<BlockedDate> GetBySpaceIdInRange(Guid spaceId, DateOnly startDate, DateOnly endDate)
        => context.BlockedDates
            .Where(bd => bd.SpaceId == spaceId && bd.Date >= startDate && bd.Date <= endDate)
            .OrderBy(bd => bd.Date);

    public async Task<bool> HasConfirmedBookingsOnDatesAsync(
        Guid spaceId, List<DateOnly> dates, CancellationToken ct) {
        var minDate = dates.Min();
        var maxDate = dates.Max();

        return await context.Bookings
            .Where(b => b.SpaceId == spaceId && ConfirmedStatuses.Contains(b.Status))
            .AnyAsync(b => dates.Any(d =>
                d >= DateOnly.FromDateTime(b.StartDate) &&
                d <= DateOnly.FromDateTime(b.EndDate)), ct);
    }

    public async Task<bool> HasBlockedDatesInRangeAsync(
        Guid spaceId, DateOnly startDate, DateOnly endDate, CancellationToken ct)
        => await context.BlockedDates.AnyAsync(bd =>
            bd.SpaceId == spaceId &&
            bd.Date >= startDate &&
            bd.Date <= endDate, ct);

    public async Task<List<BlockedDate>> AddRangeAsync(List<BlockedDate> blockedDates, CancellationToken ct) {
        context.BlockedDates.AddRange(blockedDates);
        await context.SaveChangesAsync(ct);
        return blockedDates;
    }

    public async Task<int> DeleteBySpaceIdAndDatesAsync(Guid spaceId, List<DateOnly> dates, CancellationToken ct)
        => await context.BlockedDates
            .Where(bd => bd.SpaceId == spaceId && dates.Contains(bd.Date))
            .ExecuteDeleteAsync(ct);

    public async Task<Space?> GetSpaceWithOwnerAsync(Guid spaceId, CancellationToken ct)
        => await context.Spaces
            .Include(s => s.SpaceOwnerProfile)
            .FirstOrDefaultAsync(s => s.Id == spaceId, ct);
}
