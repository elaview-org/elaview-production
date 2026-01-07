using ElaviewBackend.Shared.Entities;

namespace ElaviewBackend.Features.Auth;

public sealed class LoginResponse {
    public string Id { get; init; } = null!;
    public string Email { get; init; } = null!;
    public string? Name { get; init; }
    public UserRole Role { get; init; }
    public string Message { get; init; } = null!;
}