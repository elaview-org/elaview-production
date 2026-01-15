using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ElaviewBackend.Data.Entities;

[Table("stripe_webhook_events")]
public sealed class StripeWebhookEvent : EntityBase {
    [MaxLength(255)]
    public string StripeEventId { get; init; } = null!;

    [MaxLength(100)]
    public string EventType { get; init; } = null!;

    [Column(TypeName = "text")]
    public string? Payload { get; init; }

    public bool Processed { get; set; }

    public DateTime? ProcessedAt { get; set; }

    [MaxLength(500)]
    public string? ProcessingError { get; set; }
}

public sealed class
    StripeWebhookEventConfig : IEntityTypeConfiguration<StripeWebhookEvent> {
    public void Configure(EntityTypeBuilder<StripeWebhookEvent> builder) {
        builder.HasIndex(e => e.StripeEventId).IsUnique();
        builder.HasIndex(e => e.EventType);
        builder.HasIndex(e => e.Processed);

        builder.Property(e => e.Id)
            .HasDefaultValueSql("gen_random_uuid()");

        builder.Property(e => e.CreatedAt)
            .IsRequired()
            .HasDefaultValueSql("CURRENT_TIMESTAMP");
    }
}