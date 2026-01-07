using System.ComponentModel.DataAnnotations;

namespace ElaviewBackend.Shared.Entities;

public sealed class Profile {
    [MaxLength(50)]
    [IsProjected(true)]
    public string Id { get; init; } = null!;

    public ProfileType ProfileType { get; init; }

    public DateTime CreatedAt { get; init; }

    public DateTime UpdatedAt { get; set; }

    public User User { get; init; } = null!;
}