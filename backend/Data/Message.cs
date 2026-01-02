using System.ComponentModel.DataAnnotations;

namespace ElaviewBackend.Data;

public sealed class Message {
    [MaxLength(50)] public string Id { get; init; } = null!;
    [MaxLength(50)] public string CampaignId { get; init; } = null!;
    [MaxLength(50)] public string SenderId { get; init; } = null!;

    [MaxLength(50)] public string Content { get; init; } = null!;

    public bool IsRead { get; set; } = false;

    public List<string> Attachments { get; init; } = new();

    public DateTime CreatedAt { get; init; }

    [MaxLength(50)] public string? BookingId { get; init; }

    [MaxLength(50)] public string? DisputeReason { get; init; }
    public MessageType MessageType { get; init; } = MessageType.TEXT;

    public DateTime? ProofApprovedAt { get; init; }

    public DateTime? AutoApprovedAt { get; init; }

    [MaxLength(50)] public string? ProofApprovedBy { get; init; }

    public DateTime? ProofDisputedAt { get; init; }

    public ProofStatus? ProofStatus { get; init; }

    [MaxLength(50)] public string? AttemptedResolution { get; init; }

    [MaxLength(50)] public string? CorrectionDetails { get; init; }

    public DisputeIssueType? IssueType { get; init; }

    public Booking? Booking { get; init; }

    public Campaign Campaign { get; init; } = null!;

    public User Sender { get; init; } = null!;
}