using System.Security.Claims;
using ElaviewBackend.Data;

namespace ElaviewBackend.Services;

public class UserService(AppDbContext dbContext, ClaimsPrincipal principal) {
    public string PrincipalId() =>
        principal.FindFirstValue(ClaimTypes.NameIdentifier)!;
}