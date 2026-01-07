using System.Security.Claims;

namespace ElaviewBackend.Features.Users;

public class UserService(
    IHttpContextAccessor httpContextAccessor) {
    public string? PrincipalId() {
        return httpContextAccessor.HttpContext?.User.FindFirstValue(
            ClaimTypes.NameIdentifier
        );
    }
}