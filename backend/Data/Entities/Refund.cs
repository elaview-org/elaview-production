using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ElaviewBackend.Data.Entities;

[Table("refunds")]
public sealed class Refund : EntityBase {
    public Guid PaymentId { get; init; }

    public Payment Payment { get; set; } = null!;

    public Guid BookingId { get; init; }

    public Booking Booking { get; set; } = null!;

    [Precision(10, 2)]
    public decimal Amount { get; init; }

    [MaxLength(1000)]
    public string Reason { get; init; } = null!;

    [MaxLength(255)]
    public string? StripeRefundId { get; set; }

    public RefundStatus Status { get; set; } = RefundStatus.Pending;

    public DateTime? ProcessedAt { get; set; }
}

public sealed class RefundConfig : IEntityTypeConfiguration<Refund> {
    public void Configure(EntityTypeBuilder<Refund> builder) {
        builder.HasIndex(e => e.PaymentId);
        builder.HasIndex(e => e.BookingId);
        builder.HasIndex(e => e.Status);

        builder.Property(e => e.Id)
            .HasDefaultValueSql("gen_random_uuid()");

        builder.Property(e => e.CreatedAt)
            .IsRequired()
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.HasOne(e => e.Payment)
            .WithMany(e => e.Refunds)
            .HasForeignKey(e => e.PaymentId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(e => e.Booking)
            .WithMany()
            .HasForeignKey(e => e.BookingId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}