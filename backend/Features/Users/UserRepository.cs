using ElaviewBackend.Data;
using ElaviewBackend.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace ElaviewBackend.Features.Users;

public interface IUserRepository {
    IQueryable<User> GetUserById(Guid id);
    IQueryable<User> GetAllUsers();
    Task<User?> GetUserByIdAsync(Guid id, CancellationToken ct);

    Task<User> UpdateAsync(User user, UpdateUserInput input,
        CancellationToken ct);

    Task<User> UpdateProfileTypeAsync(User user, ProfileType type,
        CancellationToken ct);

    Task<User> UpdateStatusAsync(User user, UserStatus status,
        CancellationToken ct);

    Task<AdvertiserProfile?> GetAdvertiserProfileByUserIdAsync(Guid userId,
        CancellationToken ct);

    Task<AdvertiserProfile> UpdateAsync(AdvertiserProfile profile,
        UpdateAdvertiserProfileInput input, CancellationToken ct);

    Task<AdvertiserProfile> UpdateOnboardingAsync(AdvertiserProfile profile,
        bool complete, CancellationToken ct);

    Task<SpaceOwnerProfile?> GetSpaceOwnerProfileByUserIdAsync(Guid userId,
        CancellationToken ct);

    Task<SpaceOwnerProfile> UpdateAsync(SpaceOwnerProfile profile,
        UpdateSpaceOwnerProfileInput input, CancellationToken ct);

    Task<SpaceOwnerProfile> UpdateOnboardingAsync(SpaceOwnerProfile profile,
        bool complete, CancellationToken ct);
}

public class UserRepository(
    AppDbContext context,
    IUserByIdDataLoader userById,
    IAdvertiserProfileByUserIdDataLoader advertiserProfileByUserId,
    ISpaceOwnerProfileByUserIdDataLoader spaceOwnerProfileByUserId
) : IUserRepository {
    public IQueryable<User> GetUserById(Guid id)
        => context.Users.Where(u => u.Id == id);

    public IQueryable<User> GetAllUsers() => context.Users;

    public async Task<User?> GetUserByIdAsync(Guid id, CancellationToken ct)
        => await userById.LoadAsync(id, ct);

    public async Task<User> UpdateAsync(User user, UpdateUserInput input,
        CancellationToken ct) {
        var entry = context.Entry(user);
        if (input.Name is not null)
            entry.Property(u => u.Name).CurrentValue = input.Name;
        if (input.Phone is not null)
            entry.Property(u => u.Phone).CurrentValue = input.Phone;
        if (input.Avatar is not null)
            entry.Property(u => u.Avatar).CurrentValue = input.Avatar;
        await context.SaveChangesAsync(ct);
        return user;
    }

    public async Task<User> UpdateProfileTypeAsync(User user, ProfileType type,
        CancellationToken ct) {
        context.Entry(user).Property(u => u.ActiveProfileType).CurrentValue =
            type;
        await context.SaveChangesAsync(ct);
        return user;
    }

    public async Task<User> UpdateStatusAsync(User user, UserStatus status,
        CancellationToken ct) {
        context.Entry(user).Property(u => u.Status).CurrentValue = status;
        await context.SaveChangesAsync(ct);
        return user;
    }

    public async Task<AdvertiserProfile?> GetAdvertiserProfileByUserIdAsync(
        Guid userId, CancellationToken ct)
        => await advertiserProfileByUserId.LoadAsync(userId, ct);

    public async Task<AdvertiserProfile> UpdateAsync(AdvertiserProfile profile,
        UpdateAdvertiserProfileInput input, CancellationToken ct) {
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

    public async Task<AdvertiserProfile> UpdateOnboardingAsync(
        AdvertiserProfile profile, bool complete, CancellationToken ct) {
        context.Entry(profile).Property(p => p.OnboardingComplete)
                .CurrentValue =
            complete;
        await context.SaveChangesAsync(ct);
        return profile;
    }

    public async Task<SpaceOwnerProfile?> GetSpaceOwnerProfileByUserIdAsync(
        Guid userId, CancellationToken ct)
        => await spaceOwnerProfileByUserId.LoadAsync(userId, ct);

    public async Task<SpaceOwnerProfile> UpdateAsync(SpaceOwnerProfile profile,
        UpdateSpaceOwnerProfileInput input, CancellationToken ct) {
        var entry = context.Entry(profile);
        if (input.BusinessName is not null)
            entry.Property(p => p.BusinessName).CurrentValue =
                input.BusinessName;
        if (input.BusinessType is not null)
            entry.Property(p => p.BusinessType).CurrentValue =
                input.BusinessType;
        if (input.PayoutSchedule is not null)
            entry.Property(p => p.PayoutSchedule).CurrentValue =
                input.PayoutSchedule.Value;
        await context.SaveChangesAsync(ct);
        return profile;
    }

    public async Task<SpaceOwnerProfile> UpdateOnboardingAsync(
        SpaceOwnerProfile profile, bool complete, CancellationToken ct) {
        context.Entry(profile).Property(p => p.OnboardingComplete)
                .CurrentValue =
            complete;
        await context.SaveChangesAsync(ct);
        return profile;
    }
}

internal static class UserDataLoader {
    [DataLoader]
    public static async Task<IReadOnlyDictionary<Guid, User>> GetUserById(
        IReadOnlyList<Guid> ids, AppDbContext context, CancellationToken ct
    ) => await context.Users
        .Where(u => ids.Contains(u.Id))
        .ToDictionaryAsync(u => u.Id, ct);

    [DataLoader]
    public static async Task<IReadOnlyDictionary<Guid, AdvertiserProfile>>
        GetAdvertiserProfileByUserId(
            IReadOnlyList<Guid> userIds, AppDbContext context,
            CancellationToken ct
        ) => await context.AdvertiserProfiles
        .Where(p => userIds.Contains(p.UserId))
        .ToDictionaryAsync(p => p.UserId, ct);

    [DataLoader]
    public static async Task<IReadOnlyDictionary<Guid, SpaceOwnerProfile>>
        GetSpaceOwnerProfileByUserId(
            IReadOnlyList<Guid> userIds, AppDbContext context,
            CancellationToken ct
        ) => await context.SpaceOwnerProfiles
        .Where(p => userIds.Contains(p.UserId))
        .ToDictionaryAsync(p => p.UserId, ct);
}