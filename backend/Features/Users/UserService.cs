using System.Security.Claims;
using ElaviewBackend.Data.Entities;
using ElaviewBackend.Features.Shared.Errors;

namespace ElaviewBackend.Features.Users;

public interface IUserService {
    Guid GetPrincipalId();
    Guid? GetPrincipalIdOrNull();
    IQueryable<User> GetCurrentUser();
    Task<User> UpdateAsync(Guid userId, UpdateUserInput input, CancellationToken ct);
    Task<AdvertiserProfile> UpdateAdvertiserProfileAsync(Guid userId, UpdateAdvertiserProfileInput input, CancellationToken ct);
    Task<SpaceOwnerProfile> UpdateSpaceOwnerProfileAsync(Guid userId, UpdateSpaceOwnerProfileInput input, CancellationToken ct);
    Task<bool> DeleteAsync(Guid userId, CancellationToken ct);
}

public sealed class UserService(
    IHttpContextAccessor httpContextAccessor,
    IUserRepository userRepository
) : IUserService {
    public Guid GetPrincipalId()
        => GetPrincipalIdOrNull()
           ?? throw new ForbiddenException("access this resource");

    public Guid? GetPrincipalIdOrNull()
        => httpContextAccessor.HttpContext?.User.FindFirstValue(
            ClaimTypes.NameIdentifier) is { } id
            ? Guid.Parse(id)
            : null;

    public IQueryable<User> GetCurrentUser()
        => userRepository.GetUserById(GetPrincipalId());

    public async Task<User> UpdateAsync(Guid userId, UpdateUserInput input, CancellationToken ct) {
        var user = await userRepository.GetByIdAsync(userId, ct)
            ?? throw new NotFoundException("User", userId);

        if (input.ActiveProfileType is { } profileType) {
            if (profileType == ProfileType.Advertiser) {
                var profile = await userRepository.GetAdvertiserProfileByUserIdAsync(userId, ct);
                if (profile is null)
                    await userRepository.CreateAdvertiserProfileAsync(userId, ct);
            } else {
                var profile = await userRepository.GetSpaceOwnerProfileByUserIdAsync(userId, ct);
                if (profile is null)
                    await userRepository.CreateSpaceOwnerProfileAsync(userId, ct);
            }
        }

        return await userRepository.UpdateAsync(user, input, ct);
    }

    public async Task<AdvertiserProfile> UpdateAdvertiserProfileAsync(
        Guid userId, UpdateAdvertiserProfileInput input, CancellationToken ct
    ) {
        var profile = await userRepository.GetAdvertiserProfileByUserIdAsync(userId, ct)
            ?? throw new NotFoundException("AdvertiserProfile", userId);
        return await userRepository.UpdateAdvertiserProfileAsync(profile, input, ct);
    }

    public async Task<SpaceOwnerProfile> UpdateSpaceOwnerProfileAsync(
        Guid userId, UpdateSpaceOwnerProfileInput input, CancellationToken ct
    ) {
        var profile = await userRepository.GetSpaceOwnerProfileByUserIdAsync(userId, ct)
            ?? throw new NotFoundException("SpaceOwnerProfile", userId);
        return await userRepository.UpdateSpaceOwnerProfileAsync(profile, input, ct);
    }

    public async Task<bool> DeleteAsync(Guid userId, CancellationToken ct) {
        var user = await userRepository.GetByIdAsync(userId, ct)
            ?? throw new NotFoundException("User", userId);
        return await userRepository.DeleteAsync(user, ct);
    }
}