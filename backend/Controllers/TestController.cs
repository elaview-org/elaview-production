using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ElaviewBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TestController : ControllerBase {
    [HttpGet("public")]
    public IActionResult PublicEndpoint() => Ok(new {
        message = "This endpoint is accessible to everyone"
    });

    [HttpGet("authenticated")]
    [Authorize]
    public IActionResult AuthenticatedEndpoint() => Ok(new {
        message = "This endpoint requires authentication",
        userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value,
        email = User.FindFirst(ClaimTypes.Email)?.Value,
        role = User.FindFirst(ClaimTypes.Role)?.Value
    });

    [HttpGet("admin-only")]
    [Authorize(Roles = "Admin")]
    public IActionResult AdminOnlyEndpoint() => Ok(new {
        message = "This endpoint is only accessible to Admin users",
        userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value,
        email = User.FindFirst(ClaimTypes.Email)?.Value
    });

    [HttpGet("space-owner-or-admin")]
    [Authorize(Roles = "SpaceOwner,Admin")]
    public IActionResult SpaceOwnerOrAdminEndpoint() {
        return Ok(new {
            message =
                "This endpoint is accessible to SpaceOwner and Admin users",
            role = User.FindFirst(ClaimTypes.Role)?.Value
        });
    }

    [HttpGet("advertiser-only")]
    [Authorize(Roles = "Advertiser")]
    public IActionResult AdvertiserOnlyEndpoint() => Ok(new {
        message = "This endpoint is only accessible to Advertiser users",
        role = User.FindFirst(ClaimTypes.Role)?.Value
    });
}