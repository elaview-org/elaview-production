using System.Security.Claims;
using ElaviewBackend.Data;
using ElaviewBackend.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace ElaviewBackend.Features.Marketplace;

public interface ISpaceService {
    Guid? GetCurrentUserIdOrNull();
    IQueryable<Space> GetSpacesQuery();
    IQueryable<Space> GetSpacesExcludingCurrentUserQuery();
    IQueryable<Space> GetSpaceByIdQuery(Guid id);
    IQueryable<Space> GetMySpacesQuery();
    IQueryable<Space> GetByOwnerId(Guid ownerProfileId);
    Task<Space?> GetSpaceByIdAsync(Guid id, CancellationToken ct);
    Task<Space> CreateAsync(CreateSpaceInput input, CancellationToken ct);

    Task<Space> UpdateAsync(Guid id, UpdateSpaceInput input,
        CancellationToken ct);

    Task<bool> DeleteAsync(Guid id, CancellationToken ct);
    Task<Space> DeactivateAsync(Guid id, CancellationToken ct);
    Task<Space> ReactivateAsync(Guid id, CancellationToken ct);
    IQueryable<Booking> GetBookingsBySpaceId(Guid spaceId);
    IQueryable<Review> GetReviewsBySpaceId(Guid spaceId);

    Task<SpaceOwnerProfile?> GetSpaceOwnerBySpaceIdAsync(Guid spaceId,
        CancellationToken ct);
}

public sealed class SpaceService(
    IHttpContextAccessor httpContextAccessor,
    AppDbContext context,
    ISpaceRepository spaceRepository
) : ISpaceService {
    public Guid? GetCurrentUserIdOrNull() {
        var principalId = httpContextAccessor.HttpContext?.User.FindFirstValue(
            ClaimTypes.NameIdentifier
        );
        return principalId is null ? null : Guid.Parse(principalId);
    }

    public IQueryable<Space> GetSpacesQuery() {
        return context.Spaces;
    }

    public IQueryable<Space> GetSpacesExcludingCurrentUserQuery() {
        var userId = GetCurrentUserIdOrNull();
        return userId is null
            ? context.Spaces
            : context.Spaces.Where(s => s.SpaceOwnerProfile.UserId != userId);
    }

    public IQueryable<Space> GetSpaceByIdQuery(Guid id) {
        return context.Spaces.Where(s => s.Id == id);
    }

    public IQueryable<Space> GetMySpacesQuery() {
        var userId = GetCurrentUserId();
        return context.Spaces.Where(s => s.SpaceOwnerProfile.UserId == userId);
    }

    public IQueryable<Space> GetByOwnerId(Guid ownerProfileId)
        => context.Spaces.Where(s => s.SpaceOwnerProfileId == ownerProfileId);

    public async Task<Space?> GetSpaceByIdAsync(Guid id, CancellationToken ct) {
        return await spaceRepository.GetByIdAsync(id, ct);
    }

    public async Task<Space> CreateAsync(CreateSpaceInput input,
        CancellationToken ct) {
        var userId = GetCurrentUserId();
        var profile = await context.SpaceOwnerProfiles
                          .Where(p => p.UserId == userId)
                          .Select(p => new { p.Id })
                          .FirstOrDefaultAsync(ct)
                      ?? throw new GraphQLException(
                          "Space owner profile not found");

        var space = new Space {
            SpaceOwnerProfileId = profile.Id,
            Title = input.Title,
            Description = input.Description,
            Type = input.Type,
            Status = SpaceStatus.Active,
            Address = input.Address,
            City = input.City,
            State = input.State,
            ZipCode = input.ZipCode,
            Latitude = input.Latitude,
            Longitude = input.Longitude,
            Width = input.Width,
            Height = input.Height,
            Dimensions = input.Dimensions,
            PricePerDay = input.PricePerDay,
            InstallationFee = input.InstallationFee,
            MinDuration = input.MinDuration,
            MaxDuration = input.MaxDuration,
            Images = input.Images ?? [],
            AvailableFrom = input.AvailableFrom,
            AvailableTo = input.AvailableTo,
            DimensionsText = input.DimensionsText,
            Traffic = input.Traffic,
            CreatedAt = DateTime.UtcNow
        };

        context.Spaces.Add(space);
        await context.SaveChangesAsync(ct);
        return space;
    }

    public async Task<Space> UpdateAsync(Guid id, UpdateSpaceInput input,
        CancellationToken ct) {
        var userId = GetCurrentUserId();
        var space = await context.Spaces
                        .FirstOrDefaultAsync(
                            s => s.Id == id &&
                                 s.SpaceOwnerProfile.UserId == userId, ct)
                    ?? throw new GraphQLException("Space not found");

        var entry = context.Entry(space);
        if (input.Title is not null)
            entry.Property(s => s.Title).CurrentValue = input.Title;
        if (input.Description is not null)
            entry.Property(s => s.Description).CurrentValue = input.Description;
        if (input.PricePerDay is not null)
            entry.Property(s => s.PricePerDay).CurrentValue =
                input.PricePerDay.Value;
        if (input.InstallationFee is not null)
            entry.Property(s => s.InstallationFee).CurrentValue =
                input.InstallationFee;
        if (input.MinDuration is not null)
            entry.Property(s => s.MinDuration).CurrentValue =
                input.MinDuration.Value;
        if (input.MaxDuration is not null)
            entry.Property(s => s.MaxDuration).CurrentValue = input.MaxDuration;
        if (input.Images is not null)
            entry.Property(s => s.Images).CurrentValue = input.Images;
        if (input.AvailableFrom is not null)
            entry.Property(s => s.AvailableFrom).CurrentValue =
                input.AvailableFrom;
        if (input.AvailableTo is not null)
            entry.Property(s => s.AvailableTo).CurrentValue = input.AvailableTo;
        if (input.Traffic is not null)
            entry.Property(s => s.Traffic).CurrentValue = input.Traffic;

        await context.SaveChangesAsync(ct);
        return space;
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken ct) {
        var userId = GetCurrentUserId();
        var space = await context.Spaces
            .FirstOrDefaultAsync(
                s => s.Id == id && s.SpaceOwnerProfile.UserId == userId, ct);

        if (space is null) return false;

        var hasActiveBookings = await context.Bookings
            .AnyAsync(b => b.SpaceId == id &&
                           b.Status != BookingStatus.Completed &&
                           b.Status != BookingStatus.Cancelled &&
                           b.Status != BookingStatus.Rejected, ct);

        if (hasActiveBookings)
            throw new GraphQLException(
                "Cannot delete space with active bookings");

        context.Spaces.Remove(space);
        await context.SaveChangesAsync(ct);
        return true;
    }

    public async Task<Space> DeactivateAsync(Guid id, CancellationToken ct) {
        var userId = GetCurrentUserId();
        var space = await context.Spaces
                        .FirstOrDefaultAsync(
                            s => s.Id == id &&
                                 s.SpaceOwnerProfile.UserId == userId, ct)
                    ?? throw new GraphQLException("Space not found");

        context.Entry(space).Property(s => s.Status).CurrentValue =
            SpaceStatus.Inactive;
        await context.SaveChangesAsync(ct);
        return space;
    }

    public async Task<Space> ReactivateAsync(Guid id, CancellationToken ct) {
        var userId = GetCurrentUserId();
        var space = await context.Spaces
                        .FirstOrDefaultAsync(
                            s => s.Id == id &&
                                 s.SpaceOwnerProfile.UserId == userId, ct)
                    ?? throw new GraphQLException("Space not found");

        context.Entry(space).Property(s => s.Status).CurrentValue =
            SpaceStatus.Active;
        await context.SaveChangesAsync(ct);
        return space;
    }

    public IQueryable<Booking> GetBookingsBySpaceId(Guid spaceId) {
        return context.Bookings.Where(b => b.SpaceId == spaceId);
    }

    public IQueryable<Review> GetReviewsBySpaceId(Guid spaceId) {
        return context.Reviews.Where(r => r.SpaceId == spaceId);
    }

    public async Task<SpaceOwnerProfile?> GetSpaceOwnerBySpaceIdAsync(
        Guid spaceId, CancellationToken ct) {
        return await spaceRepository.GetSpaceOwnerBySpaceIdAsync(spaceId, ct);
    }

    private Guid GetCurrentUserId() {
        return GetCurrentUserIdOrNull() ??
               throw new GraphQLException("Not authenticated");
    }
}