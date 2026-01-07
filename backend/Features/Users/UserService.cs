using System.Security.Claims;
using ElaviewBackend.Shared;

namespace ElaviewBackend.Features.Users;

public class UserService(
    AppDbContext dbContext,
    IHttpContextAccessor httpContextAccessor) {
    public string PrincipalId() =>
        httpContextAccessor.HttpContext?.User.FindFirstValue(
            ClaimTypes.NameIdentifier
        )!;
}