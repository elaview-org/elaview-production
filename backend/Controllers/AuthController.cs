using System.Security.Claims;
using ElaviewBackend.Data.Entities;
using ElaviewBackend.Models;
using ElaviewBackend.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;

namespace ElaviewBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(AuthService authService) : ControllerBase {
    [HttpPost("signup")]
    public async Task<IActionResult> Signup([FromBody] SignupRequest request) {
        if (!ModelState.IsValid) {
            return BadRequest(ModelState);
        }

        var user = await authService.CreateUserAsync(request.Email,
            request.Password, request.Name);

        if (user == null) {
            return Conflict(new { message = "Email already exists" });
        }

        var claims = new List<Claim> {
            new(ClaimTypes.NameIdentifier, user.Id!),
            new(ClaimTypes.Email, user.Email),
            new(ClaimTypes.Role, user.Role.ToString())
        };

        if (!string.IsNullOrEmpty(user.Name)) {
            claims.Add(new Claim(ClaimTypes.Name, user.Name));
        }

        var claimsIdentity = new ClaimsIdentity(claims,
            CookieAuthenticationDefaults.AuthenticationScheme);
        var claimsPrincipal = new ClaimsPrincipal(claimsIdentity);

        var authProperties = new AuthenticationProperties {
            IsPersistent = true,
            ExpiresUtc = DateTimeOffset.UtcNow.AddDays(7),
            AllowRefresh = true
        };

        await HttpContext.SignInAsync(
            CookieAuthenticationDefaults.AuthenticationScheme,
            claimsPrincipal,
            authProperties
        );

        var response = new LoginResponse {
            Id = user.Id!,
            Email = user.Email,
            Name = user.Name,
            Role = user.Role,
            Message = "Signup successful"
        };

        return Ok(response);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request) {
        if (!ModelState.IsValid) {
            return BadRequest(ModelState);
        }

        var user =
            await authService.ValidateUserAsync(request.Email,
                request.Password);

        if (user == null) {
            return Unauthorized(new { message = "Invalid email or password" });
        }

        if (user.Status != UserStatus.Active) {
            return Unauthorized(new { message = "Account is not active" });
        }

        var claims = new List<Claim> {
            new(ClaimTypes.NameIdentifier, user.Id!),
            new(ClaimTypes.Email, user.Email),
            new(ClaimTypes.Role, user.Role.ToString())
        };

        if (!string.IsNullOrEmpty(user.Name)) {
            claims.Add(new Claim(ClaimTypes.Name, user.Name));
        }

        var claimsIdentity = new ClaimsIdentity(claims,
            CookieAuthenticationDefaults.AuthenticationScheme);
        var claimsPrincipal = new ClaimsPrincipal(claimsIdentity);

        var authProperties = new AuthenticationProperties {
            IsPersistent = true,
            ExpiresUtc = DateTimeOffset.UtcNow.AddDays(7),
            AllowRefresh = true
        };

        await HttpContext.SignInAsync(
            CookieAuthenticationDefaults.AuthenticationScheme,
            claimsPrincipal,
            authProperties
        );

        var response = new LoginResponse {
            Id = user.Id!,
            Email = user.Email,
            Name = user.Name,
            Role = user.Role,
            Message = "Login successful"
        };

        return Ok(response);
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout() {
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults
            .AuthenticationScheme);
        return Ok(new { message = "Logout successful" });
    }

    [HttpGet("me")]
    public IActionResult GetCurrentUser() {
        if (!User.Identity?.IsAuthenticated ?? true) {
            return Unauthorized(new { message = "Not authenticated" });
        }

        var response = new LoginResponse {
            Id = User.FindFirst(ClaimTypes.NameIdentifier)?.Value!,
            Email = User.FindFirst(ClaimTypes.Email)?.Value!,
            Name = User.FindFirst(ClaimTypes.Name)?.Value,
            Role =
                Enum.Parse<UserRole>(User.FindFirst(ClaimTypes.Role)?.Value!),
            Message = "Authenticated"
        };

        return Ok(response);
    }
}