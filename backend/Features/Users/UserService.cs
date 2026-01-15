using System.Security.Claims;
using ElaviewBackend.Data;
using ElaviewBackend.Data.Entities;

namespace ElaviewBackend.Features.Users;

public interface IUserService {
    Guid? GetCurrentUserIdOrNull();
    IQueryable<User> GetCurrentUserQuery();
    IQueryable<User> GetUserByIdQuery(Guid id);
    IQueryable<User> GetUsersQuery();
    Task<User> GetCurrentUserAsync(CancellationToken ct);
    Task<User> UpdateAsync(UpdateUserInput input, CancellationToken ct);
    Task<User> SwitchProfileTypeAsync(ProfileType type, CancellationToken ct);

    Task<AdvertiserProfile?> GetAdvertiserProfileByUserIdAsync(
        Guid userId, CancellationToken ct);

    Task<AdvertiserProfile> UpdateAdvertiserProfileAsync(
        UpdateAdvertiserProfileInput input, CancellationToken ct);

    Task<SpaceOwnerProfile?> GetSpaceOwnerProfileByUserIdAsync(
        Guid userId, CancellationToken ct);

    Task<SpaceOwnerProfile> UpdateSpaceOwnerProfileAsync(
        UpdateSpaceOwnerProfileInput input, CancellationToken ct);

    IQueryable<Space> GetSpacesBySpaceOwnerProfileId(Guid profileId);

    IQueryable<Campaign> GetCampaignsByAdvertiserProfileId(Guid profileId);

    Task<User> CompleteOnboardingAsync(ProfileType profileType,
        CancellationToken ct);

    Task<bool> DeleteAsync(Guid id, CancellationToken ct);
}

public sealed class UserService(
    IHttpContextAccessor httpContextAccessor,
    AppDbContext context,
    IUserRepository userRepository
) : IUserService {
    public Guid? GetCurrentUserIdOrNull() {
        var principalId = httpContextAccessor.HttpContext?.User.FindFirstValue(
            ClaimTypes.NameIdentifier
        );
        return principalId is null ? null : Guid.Parse(principalId);
    }

    private Guid GetCurrentUserId() {
        return GetCurrentUserIdOrNull()
               ?? throw new GraphQLException("Not authenticated");
    }

    public IQueryable<User> GetCurrentUserQuery()
        => context.Users.Where(u => u.Id == GetCurrentUserIdOrNull());

    public IQueryable<User> GetUserByIdQuery(Guid id)
        => context.Users.Where(u => u.Id == id);

    public IQueryable<User> GetUsersQuery()
        => context.Users;

    public async Task<User> GetCurrentUserAsync(CancellationToken ct)
        => await userRepository.GetUserByIdAsync(GetCurrentUserId(), ct) ??
           throw new GraphQLException("Current user not found");

    public async Task<User> UpdateAsync(UpdateUserInput input,
        CancellationToken ct) {
        var user = await GetCurrentUserAsync(ct);
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

    public async Task<User> SwitchProfileTypeAsync(ProfileType type,
        CancellationToken ct) {
        var user = await GetCurrentUserAsync(ct);
        user.ActiveProfileType = type;
        await context.SaveChangesAsync(ct);
        return user;
    }

    public async Task<AdvertiserProfile?> GetAdvertiserProfileByUserIdAsync(
        Guid userId, CancellationToken ct)
        => await userRepository.GetAdvertiserProfileByUserIdAsync(userId, ct);

    private async Task<AdvertiserProfile> GetAdvertiserProfileAsync(
        CancellationToken ct) =>
        await GetAdvertiserProfileByUserIdAsync(GetCurrentUserId(), ct)
        ?? throw new GraphQLException("Advertiser profile not found");

    public async Task<AdvertiserProfile> UpdateAdvertiserProfileAsync(
        UpdateAdvertiserProfileInput input, CancellationToken ct
    ) {
        var profile = await GetAdvertiserProfileAsync(ct);

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

    public async Task<SpaceOwnerProfile?> GetSpaceOwnerProfileByUserIdAsync(
        Guid userId, CancellationToken ct)
        => await userRepository.GetSpaceOwnerProfileByUserIdAsync(userId, ct);

    private async Task<SpaceOwnerProfile> GetSpaceOwnerProfileAsync(
        CancellationToken ct) =>
        await GetSpaceOwnerProfileByUserIdAsync(GetCurrentUserId(), ct)
        ?? throw new GraphQLException("Space owner profile not found");

    public async Task<SpaceOwnerProfile> UpdateSpaceOwnerProfileAsync(
        UpdateSpaceOwnerProfileInput input, CancellationToken ct
    ) {
        var profile = await GetSpaceOwnerProfileAsync(ct);

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

    public async Task<User> CompleteOnboardingAsync(ProfileType profileType,
        CancellationToken ct) {
        var user = await GetCurrentUserAsync(ct);
        var advertiserProfileTask =
            userRepository.GetAdvertiserProfileByUserIdAsync(user.Id, ct);
        var spaceOwnerProfileTask =
            userRepository.GetSpaceOwnerProfileByUserIdAsync(user.Id, ct);
        await Task.WhenAll(advertiserProfileTask, spaceOwnerProfileTask);
        var advertiserProfile = await advertiserProfileTask;
        var spaceOwnerProfile = await spaceOwnerProfileTask;

        if (profileType == ProfileType.Advertiser &&
            advertiserProfile is not null) {
            var advEntry = context.Entry(advertiserProfile);
            advEntry.Property(p => p.OnboardingComplete).CurrentValue = true;
        }
        else if (profileType == ProfileType.SpaceOwner &&
                 spaceOwnerProfile is not null) {
            var ownerEntry = context.Entry(spaceOwnerProfile);
            ownerEntry.Property(p => p.OnboardingComplete).CurrentValue = true;
        }

        var userEntry = context.Entry(user);
        userEntry.Property(u => u.ActiveProfileType).CurrentValue = profileType;

        await context.SaveChangesAsync(ct);
        return user;
    }

    public IQueryable<Space> GetSpacesBySpaceOwnerProfileId(Guid profileId)
        => context.Spaces.Where(s => s.SpaceOwnerProfileId == profileId);

    public IQueryable<Campaign> GetCampaignsByAdvertiserProfileId(Guid profileId)
        => context.Campaigns.Where(c => c.AdvertiserProfileId == profileId);

    public async Task<bool> DeleteAsync(Guid id, CancellationToken ct) {
        var user = await userRepository.GetUserByIdAsync(id, ct);
        if (user is null) return false;

        var entry = context.Entry(user);
        entry.Property(u => u.Status).CurrentValue = UserStatus.Deleted;

        await context.SaveChangesAsync(ct);
        return true;
    }
}