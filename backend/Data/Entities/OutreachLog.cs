using System.ComponentModel.DataAnnotations;

namespace ElaviewBackend.Data.Entities;

public sealed class OutreachLog
{
    [MaxLength(50)]
    public string Id { get; init; } = null!;
    [MaxLength(50)]
    public string LeadId { get; init; } = null!;
    public OutreachChannel Channel { get; init; }
    public OutreachMessageType MessageType { get; init; } = OutreachMessageType.Initial;
    [MaxLength(255)]
    public string? TemplateUsed { get; init; }
    [MaxLength(500)]
    public string? Subject { get; init; }
    public string? MessageContent { get; init; }
    public bool Responded { get; set; } = false;
    public DateTime? ResponseDate { get; set; }
    public string? ResponseSummary { get; init; }
    public DateTime SentAt { get; init; }
    [MaxLength(50)]
    public string? SentBy { get; init; }
    public DateTime CreatedAt { get; init; }
    public Lead Lead { get; init; } = null!;
}
