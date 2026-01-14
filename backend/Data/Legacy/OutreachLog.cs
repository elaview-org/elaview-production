using System.ComponentModel.DataAnnotations;

namespace ElaviewBackend.Data.Legacy;

public sealed class OutreachLog {
    [MaxLength(50)]
    public string Id { get; init; } = null!;

    public OutreachChannel Channel { get; init; }

    public OutreachMessageType MessageType { get; init; } =
        OutreachMessageType.Initial;

    [MaxLength(255)]
    public string? TemplateUsed { get; init; }

    [MaxLength(500)]
    public string? Subject { get; init; }

    [MaxLength(5000)]
    public string? MessageContent { get; init; }

    public bool Responded { get; set; } = false;

    public DateTime? ResponseDate { get; set; }

    [MaxLength(2000)]
    public string? ResponseSummary { get; init; }

    public DateTime SentAt { get; init; }

    [MaxLength(50)]
    public string? SentBy { get; init; }

    public DateTime CreatedAt { get; init; }

    public Lead Lead { get; init; } = null!;
}