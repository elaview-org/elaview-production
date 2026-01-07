using System.ComponentModel.DataAnnotations;
using System.Text.Json;

namespace ElaviewBackend.Shared.Legacy;

public sealed class CronJobLog {
    [MaxLength(50)]
    public string Id { get; init; } = null!;

    [MaxLength(255)]
    public string JobName { get; init; } = null!;

    public DateTime ExecutedAt { get; init; }

    [MaxLength(50)]
    public string Status { get; init; } = null!;

    public int? Duration { get; init; }

    public int? ItemsProcessed { get; init; }

    [MaxLength(1000)]
    public string? ErrorMessage { get; init; }

    public JsonDocument? Metadata { get; init; }
}