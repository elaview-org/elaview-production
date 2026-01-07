using System.ComponentModel.DataAnnotations;

namespace ElaviewBackend.Shared.Entities;

public sealed class User {
    [MaxLength(50)]
    [IsProjected(true)]
    public string? Id { get; init; }

    [MaxLength(255)]
    public string Email { get; init; } = null!;

    [MaxLength(500)]
    public string Password { get; init; } = null!;

    [MaxLength(255)]
    public string? Name { get; init; }

    [MaxLength(50)]
    public string? Phone { get; init; }

    [MaxLength(500)]
    public string? Avatar { get; init; }

    public UserRole Role { get; init; } = UserRole.User;

    public UserStatus Status { get; init; } = UserStatus.Active;

    public Profile? ActiveProfile { get; set; }

    public DateTime CreatedAt { get; init; }

    public DateTime UpdatedAt { get; set; }

    public DateTime? LastLoginAt { get; set; }
}