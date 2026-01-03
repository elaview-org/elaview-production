using System.Security.Claims;
using ElaviewBackend.Data;

namespace ElaviewBackend.Services;

public class UserService(
    AppDbContext dbContext,
    IHttpContextAccessor httpContextAccessor) {
    public string PrincipalId() =>
        httpContextAccessor.HttpContext?.User.FindFirstValue(
            ClaimTypes.NameIdentifier
        )!;
}