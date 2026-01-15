using ElaviewBackend.Data;
using ElaviewBackend.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace ElaviewBackend.Features.Marketplace;

public interface ISpaceRepository {
    Task<Space?> GetByIdAsync(Guid id, CancellationToken ct);
    Task<SpaceOwnerProfile?> GetSpaceOwnerBySpaceIdAsync(Guid spaceId, CancellationToken ct);
    Task<IReadOnlyList<Booking>> GetBookingsBySpaceIdAsync(Guid spaceId, CancellationToken ct);
    Task<IReadOnlyList<Review>> GetReviewsBySpaceIdAsync(Guid spaceId, CancellationToken ct);
}

public sealed class SpaceRepository(
    ISpaceByIdDataLoader spaceById,
    ISpaceOwnerBySpaceIdDataLoader spaceOwnerBySpaceId,
    IBookingsBySpaceIdDataLoader bookingsBySpaceId,
    IReviewsBySpaceIdDataLoader reviewsBySpaceId
) : ISpaceRepository {
    public async Task<Space?> GetByIdAsync(Guid id, CancellationToken ct) =>
        await spaceById.LoadAsync(id, ct);

    public async Task<SpaceOwnerProfile?> GetSpaceOwnerBySpaceIdAsync(Guid spaceId, CancellationToken ct) =>
        await spaceOwnerBySpaceId.LoadAsync(spaceId, ct);

    public async Task<IReadOnlyList<Booking>> GetBookingsBySpaceIdAsync(Guid spaceId, CancellationToken ct) =>
        await bookingsBySpaceId.LoadAsync(spaceId, ct) ?? [];

    public async Task<IReadOnlyList<Review>> GetReviewsBySpaceIdAsync(Guid spaceId, CancellationToken ct) =>
        await reviewsBySpaceId.LoadAsync(spaceId, ct) ?? [];
}

internal static class SpaceDataLoaders {
    [DataLoader]
    public static async Task<IReadOnlyDictionary<Guid, Space>> GetSpaceById(
        IReadOnlyList<Guid> ids, AppDbContext context, CancellationToken ct
    ) => await context.Spaces
        .Where(s => ids.Contains(s.Id))
        .ToDictionaryAsync(s => s.Id, ct);

    [DataLoader]
    public static async Task<IReadOnlyDictionary<Guid, SpaceOwnerProfile>> GetSpaceOwnerBySpaceId(
        IReadOnlyList<Guid> spaceIds, AppDbContext context, CancellationToken ct
    ) => await context.Spaces
        .Where(s => spaceIds.Contains(s.Id))
        .Include(s => s.SpaceOwnerProfile)
        .ToDictionaryAsync(s => s.Id, s => s.SpaceOwnerProfile, ct);

    [DataLoader]
    public static async Task<ILookup<Guid, Booking>> GetBookingsBySpaceId(
        IReadOnlyList<Guid> spaceIds, AppDbContext context, CancellationToken ct
    ) => (await context.Bookings
        .Where(b => spaceIds.Contains(b.SpaceId))
        .ToListAsync(ct)).ToLookup(b => b.SpaceId);

    [DataLoader]
    public static async Task<ILookup<Guid, Review>> GetReviewsBySpaceId(
        IReadOnlyList<Guid> spaceIds, AppDbContext context, CancellationToken ct
    ) => (await context.Reviews
        .Where(r => spaceIds.Contains(r.SpaceId))
        .ToListAsync(ct)).ToLookup(r => r.SpaceId);
}