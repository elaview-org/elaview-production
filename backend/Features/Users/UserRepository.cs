using ElaviewBackend.Data;
using ElaviewBackend.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace ElaviewBackend.Features.Users;

public interface IUserRepository {
    IQueryable<User> GetUserById(Guid id);
    Task<User?> GetByIdAsync(Guid id, CancellationToken ct);
    Task<AdvertiserProfile?> GetAdvertiserProfileByUserIdAsync(Guid userId, CancellationToken ct);
    Task<SpaceOwnerProfile?> GetSpaceOwnerProfileByUserIdAsync(Guid userId, CancellationToken ct);
    Task<User> UpdateAsync(User user, UpdateUserInput input, CancellationToken ct);
    Task<AdvertiserProfile> CreateAdvertiserProfileAsync(Guid userId, CancellationToken ct);
    Task<SpaceOwnerProfile> CreateSpaceOwnerProfileAsync(Guid userId, CancellationToken ct);
    Task<AdvertiserProfile> UpdateAdvertiserProfileAsync(AdvertiserProfile profile, UpdateAdvertiserProfileInput input, CancellationToken ct);
    Task<SpaceOwnerProfile> UpdateSpaceOwnerProfileAsync(SpaceOwnerProfile profile, UpdateSpaceOwnerProfileInput input, CancellationToken ct);
    Task<bool> DeleteAsync(User user, CancellationToken ct);
}

public sealed class UserRepository(AppDbContext context) : IUserRepository {
    public IQueryable<User> GetUserById(Guid id)
        => context.Users.Where(u => u.Id == id);

    public async Task<User?> GetByIdAsync(Guid id, CancellationToken ct)
        => await context.Users.FirstOrDefaultAsync(u => u.Id == id, ct);

    public async Task<AdvertiserProfile?> GetAdvertiserProfileByUserIdAsync(Guid userId, CancellationToken ct)
        => await context.AdvertiserProfiles.FirstOrDefaultAsync(p => p.UserId == userId, ct);

    public async Task<SpaceOwnerProfile?> GetSpaceOwnerProfileByUserIdAsync(Guid userId, CancellationToken ct)
        => await context.SpaceOwnerProfiles.FirstOrDefaultAsync(p => p.UserId == userId, ct);

    public async Task<User> UpdateAsync(User user, UpdateUserInput input, CancellationToken ct) {
        var entry = context.Entry(user);
        if (input.Name is not null)
            entry.Property(u => u.Name).CurrentValue = input.Name;
        if (input.Phone is not null)
            entry.Property(u => u.Phone).CurrentValue = input.Phone;
        if (input.Avatar is not null)
            entry.Property(u => u.Avatar).CurrentValue = input.Avatar;
        if (input.ActiveProfileType is not null)
            entry.Property(u => u.ActiveProfileType).CurrentValue = input.ActiveProfileType.Value;
        await context.SaveChangesAsync(ct);
        return user;
    }

    public async Task<AdvertiserProfile> CreateAdvertiserProfileAsync(Guid userId, CancellationToken ct) {
        var profile = new AdvertiserProfile { UserId = userId };
        context.AdvertiserProfiles.Add(profile);
        await context.SaveChangesAsync(ct);
        return profile;
    }

    public async Task<SpaceOwnerProfile> CreateSpaceOwnerProfileAsync(Guid userId, CancellationToken ct) {
        var profile = new SpaceOwnerProfile { UserId = userId };
        context.SpaceOwnerProfiles.Add(profile);
        await context.SaveChangesAsync(ct);
        return profile;
    }

    public async Task<AdvertiserProfile> UpdateAdvertiserProfileAsync(
        AdvertiserProfile profile, UpdateAdvertiserProfileInput input, CancellationToken ct
    ) {
        var entry = context.Entry(profile);
        if (input.CompanyName is not null)
            entry.Property(p => p.CompanyName).CurrentValue = input.CompanyName;
        if (input.Industry is not null)
            entry.Property(p => p.Industry).CurrentValue = input.Industry;
        if (input.Website is not null)
            entry.Property(p => p.Website).CurrentValue = input.Website;
        await context.SaveChangesAsync(ct);
        return profile;
    }

    public async Task<SpaceOwnerProfile> UpdateSpaceOwnerProfileAsync(
        SpaceOwnerProfile profile, UpdateSpaceOwnerProfileInput input, CancellationToken ct
    ) {
        var entry = context.Entry(profile);
        if (input.BusinessName is not null)
            entry.Property(p => p.BusinessName).CurrentValue = input.BusinessName;
        if (input.BusinessType is not null)
            entry.Property(p => p.BusinessType).CurrentValue = input.BusinessType;
        if (input.PayoutSchedule is not null)
            entry.Property(p => p.PayoutSchedule).CurrentValue = input.PayoutSchedule.Value;
        await context.SaveChangesAsync(ct);
        return profile;
    }

    public async Task<bool> DeleteAsync(User user, CancellationToken ct) {
        context.Entry(user).Property(u => u.Status).CurrentValue = UserStatus.Deleted;
        await context.SaveChangesAsync(ct);
        return true;
    }
}