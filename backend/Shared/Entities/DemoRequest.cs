using System.ComponentModel.DataAnnotations;

namespace ElaviewBackend.Shared.Entities;

public sealed class DemoRequest
{
    [MaxLength(50)]
    public string Id { get; init; } = null!;
    [MaxLength(255)]
    public string Name { get; init; } = null!;
    [MaxLength(255)]
    public string Email { get; init; } = null!;
    [MaxLength(255)]
    public string Company { get; init; } = null!;
    [MaxLength(50)]
    public string? Phone { get; init; }
    [MaxLength(100)]
    public string? CompanySize { get; init; }
    public string? Message { get; init; }
    [MaxLength(50)]
    public string Status { get; set; } = "NEW";
    [MaxLength(50)]
    public string Priority { get; set; } = "MEDIUM";
    [MaxLength(50)]
    public string Source { get; init; } = "WEBSITE";
    public DateTime CreatedAt { get; init; }
    public DateTime UpdatedAt { get; set; }
    public DateTime? ContactedAt { get; set; }
    public string? Notes { get; init; }
}
