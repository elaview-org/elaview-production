using System.ComponentModel.DataAnnotations;

namespace ElaviewBackend.Shared.Legacy;

public sealed class BugReport {
    [MaxLength(50)]
    public string Id { get; init; } = null!;

    public DateTime CreatedAt { get; init; }

    public DateTime UpdatedAt { get; set; }

    public User? User { get; init; }

    [MaxLength(200)]
    public string Title { get; init; } = null!;

    [MaxLength(5000)]
    public string Description { get; init; } = null!;

    [MaxLength(500)]
    public string? PageUrl { get; init; }

    [MaxLength(1000)]
    public string? UserAgent { get; init; }

    public List<string> Screenshots { get; init; } = new();

    public BugCategory Category { get; init; } = BugCategory.Other;

    public BugSeverity Severity { get; init; } = BugSeverity.Medium;

    public BugStatus Status { get; set; } = BugStatus.New;

    [MaxLength(2000)]
    public string? AdminNotes { get; init; }

    [MaxLength(50)]
    public string? LinkedBugId { get; init; }

    public DateTime? ProcessedAt { get; set; }

    [MaxLength(50)]
    public string? ProcessedBy { get; init; }
}