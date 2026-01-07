using System.ComponentModel.DataAnnotations;

namespace ElaviewBackend.Shared.Entities;

public sealed class AdvertiserProfile : UserProfileBase {
    [MaxLength(255)]
    public string? CompanyName { get; init; }

    [MaxLength(255)]
    public string? Industry { get; init; }

    [MaxLength(500)]
    public string? Website { get; init; }
}