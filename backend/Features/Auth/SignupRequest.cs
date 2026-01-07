using System.ComponentModel.DataAnnotations;

namespace ElaviewBackend.Features.Auth;

public sealed class SignupRequest {
    [Required] [EmailAddress] public string Email { get; init; } = null!;

    [Required] [MinLength(6)] public string Password { get; init; } = null!;

    [MaxLength(255)] public string? Name { get; init; }
}