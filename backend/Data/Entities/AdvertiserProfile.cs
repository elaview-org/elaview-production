using System.ComponentModel.DataAnnotations;

namespace ElaviewBackend.Data.Entities;

public sealed class AdvertiserProfile
{
    [MaxLength(50)]
    public string Id { get; init; } = null!;
    [MaxLength(50)]
    public string UserId { get; init; } = null!;
    [MaxLength(255)]
    public string? CompanyName { get; init; }
    [MaxLength(255)]
    public string? Industry { get; init; }
    [MaxLength(500)]
    public string? Website { get; init; }
    [MaxLength(255)]
    public string? StripeCustomerId { get; init; }
    public DateTime CreatedAt { get; init; }
    public DateTime UpdatedAt { get; set; }
    public User User { get; init; } = null!;
}