using ElaviewBackend.Data;
using ElaviewBackend.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace ElaviewBackend.Features.Marketplace;

public interface ISpaceRepository {
    IQueryable<Space> Query();
    Task<Space?> GetByIdAsync(Guid id, CancellationToken ct);
    Task<Space?> GetByIdWithOwnerAsync(Guid id, CancellationToken ct);
    Task<SpaceOwnerProfile?> GetSpaceOwnerProfileByUserIdAsync(Guid userId, CancellationToken ct);
    Task<SpaceOwnerProfile?> GetSpaceOwnerBySpaceIdAsync(Guid spaceId, CancellationToken ct);
    Task<bool> HasActiveBookingsAsync(Guid spaceId, CancellationToken ct);
    IQueryable<Space> GetByOwnerId(Guid ownerProfileId);
    IQueryable<Space> GetByUserId(Guid userId);
    IQueryable<Space> GetExcludingUserId(Guid? userId);
    IQueryable<Booking> GetBookingsBySpaceId(Guid spaceId);
    IQueryable<Review> GetReviewsBySpaceId(Guid spaceId);
    Task<Space> AddAsync(Space space, CancellationToken ct);
    Task<Space> UpdateAsync(Space space, UpdateSpaceInput input, CancellationToken ct);
    Task<Space> UpdateStatusAsync(Space space, SpaceStatus status, CancellationToken ct);
    Task<bool> DeleteAsync(Space space, CancellationToken ct);
}

public sealed class SpaceRepository(
    AppDbContext context,
    ISpaceByIdDataLoader spaceById,
    ISpaceOwnerBySpaceIdDataLoader spaceOwnerBySpaceId
) : ISpaceRepository {
    public IQueryable<Space> Query() => context.Spaces;

    public async Task<Space?> GetByIdAsync(Guid id, CancellationToken ct)
        => await spaceById.LoadAsync(id, ct);

    public async Task<Space?> GetByIdWithOwnerAsync(Guid id, CancellationToken ct)
        => await context.Spaces
            .Include(s => s.SpaceOwnerProfile)
            .FirstOrDefaultAsync(s => s.Id == id, ct);

    public async Task<SpaceOwnerProfile?> GetSpaceOwnerProfileByUserIdAsync(Guid userId, CancellationToken ct)
        => await context.SpaceOwnerProfiles.FirstOrDefaultAsync(p => p.UserId == userId, ct);

    public async Task<SpaceOwnerProfile?> GetSpaceOwnerBySpaceIdAsync(Guid spaceId, CancellationToken ct)
        => await spaceOwnerBySpaceId.LoadAsync(spaceId, ct);

    public async Task<bool> HasActiveBookingsAsync(Guid spaceId, CancellationToken ct)
        => await context.Bookings.AnyAsync(b =>
            b.SpaceId == spaceId &&
            b.Status != BookingStatus.Completed &&
            b.Status != BookingStatus.Cancelled &&
            b.Status != BookingStatus.Rejected, ct);

    public IQueryable<Space> GetByOwnerId(Guid ownerProfileId)
        => context.Spaces
            .Where(s => s.SpaceOwnerProfileId == ownerProfileId)
            .OrderByDescending(s => s.CreatedAt);

    public IQueryable<Space> GetByUserId(Guid userId)
        => context.Spaces
            .Where(s => s.SpaceOwnerProfile.UserId == userId)
            .OrderByDescending(s => s.CreatedAt);

    public IQueryable<Space> GetExcludingUserId(Guid? userId)
        => userId is null
            ? context.Spaces
            : context.Spaces.Where(s => s.SpaceOwnerProfile.UserId != userId);

    public IQueryable<Booking> GetBookingsBySpaceId(Guid spaceId)
        => context.Bookings.Where(b => b.SpaceId == spaceId);

    public IQueryable<Review> GetReviewsBySpaceId(Guid spaceId)
        => context.Reviews.Where(r => r.SpaceId == spaceId);

    public async Task<Space> AddAsync(Space space, CancellationToken ct) {
        context.Spaces.Add(space);
        await context.SaveChangesAsync(ct);
        return space;
    }

    public async Task<Space> UpdateAsync(Space space, UpdateSpaceInput input, CancellationToken ct) {
        var entry = context.Entry(space);
        if (input.Title is not null)
            entry.Property(s => s.Title).CurrentValue = input.Title;
        if (input.Description is not null)
            entry.Property(s => s.Description).CurrentValue = input.Description;
        if (input.PricePerDay is not null)
            entry.Property(s => s.PricePerDay).CurrentValue = input.PricePerDay.Value;
        if (input.InstallationFee is not null)
            entry.Property(s => s.InstallationFee).CurrentValue = input.InstallationFee;
        if (input.MinDuration is not null)
            entry.Property(s => s.MinDuration).CurrentValue = input.MinDuration.Value;
        if (input.MaxDuration is not null)
            entry.Property(s => s.MaxDuration).CurrentValue = input.MaxDuration;
        if (input.Images is not null)
            entry.Property(s => s.Images).CurrentValue = input.Images;
        if (input.AvailableFrom is not null)
            entry.Property(s => s.AvailableFrom).CurrentValue = input.AvailableFrom;
        if (input.AvailableTo is not null)
            entry.Property(s => s.AvailableTo).CurrentValue = input.AvailableTo;
        if (input.Traffic is not null)
            entry.Property(s => s.Traffic).CurrentValue = input.Traffic;
        await context.SaveChangesAsync(ct);
        return space;
    }

    public async Task<Space> UpdateStatusAsync(Space space, SpaceStatus status, CancellationToken ct) {
        context.Entry(space).Property(s => s.Status).CurrentValue = status;
        await context.SaveChangesAsync(ct);
        return space;
    }

    public async Task<bool> DeleteAsync(Space space, CancellationToken ct) {
        context.Spaces.Remove(space);
        await context.SaveChangesAsync(ct);
        return true;
    }
}

internal static class SpaceDataLoaders {
    [DataLoader]
    public static async Task<IReadOnlyDictionary<Guid, Space>> GetSpaceById(
        IReadOnlyList<Guid> ids, AppDbContext context, CancellationToken ct
    ) {
        return await context.Spaces
            .Where(s => ids.Contains(s.Id))
            .ToDictionaryAsync(s => s.Id, ct);
    }

    [DataLoader]
    public static async Task<IReadOnlyDictionary<Guid, SpaceOwnerProfile>>
        GetSpaceOwnerBySpaceId(
            IReadOnlyList<Guid> spaceIds, AppDbContext context,
            CancellationToken ct
        ) {
        return await context.Spaces
            .Where(s => spaceIds.Contains(s.Id))
            .Include(s => s.SpaceOwnerProfile)
            .ToDictionaryAsync(s => s.Id, s => s.SpaceOwnerProfile, ct);
    }

    [DataLoader]
    public static async Task<ILookup<Guid, Booking>> GetBookingsBySpaceId(
        IReadOnlyList<Guid> spaceIds, AppDbContext context, CancellationToken ct
    ) {
        return (await context.Bookings
            .Where(b => spaceIds.Contains(b.SpaceId))
            .ToListAsync(ct)).ToLookup(b => b.SpaceId);
    }

    [DataLoader]
    public static async Task<ILookup<Guid, Review>> GetReviewsBySpaceId(
        IReadOnlyList<Guid> spaceIds, AppDbContext context, CancellationToken ct
    ) {
        return (await context.Reviews
            .Where(r => spaceIds.Contains(r.SpaceId))
            .ToListAsync(ct)).ToLookup(r => r.SpaceId);
    }
}