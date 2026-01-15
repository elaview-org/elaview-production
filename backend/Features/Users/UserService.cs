using System.Security.Claims;
using ElaviewBackend.Data.Entities;

namespace ElaviewBackend.Features.Users;

public interface IUserService {
    IQueryable<User> GetCurrentUser();
    IQueryable<User> GetUserById(Guid id);
    IQueryable<User> GetAllUsers();
    Task<User> GetCurrentUserAsync(CancellationToken ct);
    Task<User> UpdateMyInfoAsync(UpdateUserInput input, CancellationToken ct);
    Task<User> SwitchMyProfileTypeAsync(ProfileType type, CancellationToken ct);

    Task<AdvertiserProfile?> GetAdvertiserProfileByUserIdAsync(
        Guid userId, CancellationToken ct);

    Task<AdvertiserProfile> UpdateMyAdvertiserProfileAsync(
        UpdateAdvertiserProfileInput input, CancellationToken ct);

    Task<SpaceOwnerProfile?> GetSpaceOwnerProfileByUserIdAsync(
        Guid userId, CancellationToken ct);

    Task<SpaceOwnerProfile> UpdateMySpaceOwnerProfileAsync(
        UpdateSpaceOwnerProfileInput input, CancellationToken ct);

    Task<User> CompleteOnboardingAsync(ProfileType profileType,
        CancellationToken ct);

    Task<bool> DeleteAsync(Guid id, CancellationToken ct);
}

public sealed class UserService(
    IHttpContextAccessor httpContextAccessor,
    IUserRepository userRepository
) : IUserService {
    public IQueryable<User> GetCurrentUser()
        => GetPrincipalIdOrNull() is { } userId
            ? userRepository.GetUserById(userId)
            : throw new GraphQLException("Not authenticated");

    public IQueryable<User> GetUserById(Guid id)
        => userRepository.GetUserById(id);

    public IQueryable<User> GetAllUsers()
        => userRepository.GetAllUsers();

    public async Task<User> GetCurrentUserAsync(CancellationToken ct)
        => await userRepository.GetUserByIdAsync(GetPrincipalId(), ct)
           ?? throw new GraphQLException("User not found");

    public async Task<User> UpdateMyInfoAsync(UpdateUserInput input,
        CancellationToken ct) {
        var user = await GetCurrentUserAsync(ct);
        if (input.Name is not null) user.Name = input.Name;
        if (input.Phone is not null) user.Phone = input.Phone;
        if (input.Avatar is not null) user.Avatar = input.Avatar;
        return await userRepository.UpdateAsync(user, ct);
    }

    public async Task<User> SwitchMyProfileTypeAsync(ProfileType type,
        CancellationToken ct) {
        var user = await GetCurrentUserAsync(ct);
        user.ActiveProfileType = type;
        return await userRepository.UpdateAsync(user, ct);
    }

    public async Task<AdvertiserProfile?> GetAdvertiserProfileByUserIdAsync(
        Guid userId, CancellationToken ct)
        => await userRepository.GetAdvertiserProfileByUserIdAsync(userId, ct);

    public async Task<AdvertiserProfile> UpdateMyAdvertiserProfileAsync(
        UpdateAdvertiserProfileInput input, CancellationToken ct) {
        var profile = await GetMyAdvertiserProfileAsync(ct);
        if (input.CompanyName is not null) profile.CompanyName = input.CompanyName;
        if (input.Industry is not null) profile.Industry = input.Industry;
        if (input.Website is not null) profile.Website = input.Website;
        return await userRepository.UpdateAsync(profile, ct);
    }

    public async Task<SpaceOwnerProfile?> GetSpaceOwnerProfileByUserIdAsync(
        Guid userId, CancellationToken ct)
        => await userRepository.GetSpaceOwnerProfileByUserIdAsync(userId, ct);

    public async Task<SpaceOwnerProfile> UpdateMySpaceOwnerProfileAsync(
        UpdateSpaceOwnerProfileInput input, CancellationToken ct) {
        var profile = await GetMySpaceOwnerProfileAsync(ct);
        if (input.BusinessName is not null) profile.BusinessName = input.BusinessName;
        if (input.BusinessType is not null) profile.BusinessType = input.BusinessType;
        if (input.PayoutSchedule is not null)
            profile.PayoutSchedule = input.PayoutSchedule.Value;
        return await userRepository.UpdateAsync(profile, ct);
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

        switch (profileType) {
            case ProfileType.Advertiser when advertiserProfile is not null:
                advertiserProfile.OnboardingComplete = true;
                await userRepository.UpdateAsync(advertiserProfile, ct);
                break;
            case ProfileType.SpaceOwner when spaceOwnerProfile is not null:
                spaceOwnerProfile.OnboardingComplete = true;
                await userRepository.UpdateAsync(spaceOwnerProfile, ct);
                break;
            default:
                throw new GraphQLException("Profile not found");
        }

        user.ActiveProfileType = profileType;
        return await userRepository.UpdateAsync(user, ct);
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken ct) {
        var user = await userRepository.GetUserByIdAsync(id, ct);
        if (user is null) return false;
        user.Status = UserStatus.Deleted;
        await userRepository.UpdateAsync(user, ct);
        return true;
    }

    private Guid? GetPrincipalIdOrNull()
        => httpContextAccessor.HttpContext?.User.FindFirstValue(
            ClaimTypes.NameIdentifier) is { } id
            ? Guid.Parse(id)
            : null;

    private Guid GetPrincipalId()
        => GetPrincipalIdOrNull()
           ?? throw new GraphQLException("Not authenticated");

    private async Task<AdvertiserProfile> GetMyAdvertiserProfileAsync(
        CancellationToken ct)
        => await GetAdvertiserProfileByUserIdAsync(GetPrincipalId(), ct)
           ?? throw new GraphQLException("Advertiser profile not found");

    private async Task<SpaceOwnerProfile> GetMySpaceOwnerProfileAsync(
        CancellationToken ct)
        => await GetSpaceOwnerProfileByUserIdAsync(GetPrincipalId(), ct)
           ?? throw new GraphQLException("Space owner profile not found");
}
