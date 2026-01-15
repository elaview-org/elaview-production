using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ElaviewBackend.Data.Entities;

[Table("payouts")]
public sealed class Payout : EntityBase {
    public Guid BookingId { get; init; }

    public Booking Booking { get; set; } = null!;

    public Guid SpaceOwnerProfileId { get; init; }

    public SpaceOwnerProfile SpaceOwnerProfile { get; set; } = null!;

    public PayoutStage Stage { get; init; }

    [Precision(10, 2)]
    public decimal Amount { get; init; }

    [MaxLength(255)]
    public string? StripeTransferId { get; set; }

    public PayoutStatus Status { get; set; } = PayoutStatus.Pending;

    public DateTime? ProcessedAt { get; set; }

    [MaxLength(500)]
    public string? FailureReason { get; set; }

    public int AttemptCount { get; set; }

    public DateTime? LastAttemptAt { get; set; }
}

public sealed class PayoutConfig : IEntityTypeConfiguration<Payout> {
    public void Configure(EntityTypeBuilder<Payout> builder) {
        builder.HasIndex(e => e.BookingId);
        builder.HasIndex(e => e.SpaceOwnerProfileId);
        builder.HasIndex(e => e.Status);
        builder.HasIndex(e => e.Stage);

        builder.Property(e => e.Id)
            .HasDefaultValueSql("gen_random_uuid()");

        builder.Property(e => e.CreatedAt)
            .IsRequired()
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.HasOne(e => e.Booking)
            .WithMany(e => e.Payouts)
            .HasForeignKey(e => e.BookingId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(e => e.SpaceOwnerProfile)
            .WithMany(e => e.Payouts)
            .HasForeignKey(e => e.SpaceOwnerProfileId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}