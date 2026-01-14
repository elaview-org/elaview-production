using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ElaviewBackend.Data.Entities;

[Table("payments")]
public sealed class Payment : EntityBase {
    public Guid BookingId { get; init; }

    public Booking Booking { get; set; } = null!;

    public PaymentType Type { get; init; }

    [Precision(10, 2)]
    public decimal Amount { get; init; }

    [Precision(10, 2)]
    public decimal? StripeFee { get; set; }

    [MaxLength(255)]
    public string StripePaymentIntentId { get; init; } = null!;

    [MaxLength(255)]
    public string? StripeChargeId { get; set; }

    public PaymentStatus Status { get; set; } = PaymentStatus.Pending;

    public DateTime? PaidAt { get; set; }

    [MaxLength(500)]
    public string? FailureReason { get; set; }

    public ICollection<Refund> Refunds { get; init; } = [];
}

public sealed class PaymentConfig : IEntityTypeConfiguration<Payment> {
    public void Configure(EntityTypeBuilder<Payment> builder) {
        builder.HasIndex(e => e.BookingId);
        builder.HasIndex(e => e.StripePaymentIntentId);
        builder.HasIndex(e => e.Status);

        builder.Property(e => e.Id)
            .HasDefaultValueSql("gen_random_uuid()");

        builder.Property(e => e.CreatedAt)
            .IsRequired()
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.HasOne(e => e.Booking)
            .WithMany(e => e.Payments)
            .HasForeignKey(e => e.BookingId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}