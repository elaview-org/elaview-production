using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ElaviewBackend.Data.Entities;

[Table("bookings")]
public sealed class Booking : EntityBase {
    public Guid CampaignId { get; init; }

    public Campaign Campaign { get; set; } = null!;

    public Guid SpaceId { get; init; }

    public Space Space { get; set; } = null!;

    public DateTime StartDate { get; init; }

    public DateTime EndDate { get; init; }

    public int TotalDays { get; init; }

    [Precision(10, 2)]
    public decimal PricePerDay { get; init; }

    [Precision(10, 2)]
    public decimal InstallationFee { get; init; }

    [Precision(10, 2)]
    public decimal SubtotalAmount { get; init; }

    [Precision(5, 2)]
    public decimal PlatformFeePercent { get; init; }

    [Precision(10, 2)]
    public decimal PlatformFeeAmount { get; init; }

    [Precision(10, 2)]
    public decimal TotalAmount { get; init; }

    [Precision(10, 2)]
    public decimal OwnerPayoutAmount { get; init; }

    public BookingStatus Status { get; set; } = BookingStatus.PendingApproval;

    [MaxLength(2000)]
    public string? AdvertiserNotes { get; init; }

    [MaxLength(2000)]
    public string? OwnerNotes { get; set; }

    public DateTime? FileDownloadedAt { get; set; }

    [MaxLength(1000)]
    public string? CancellationReason { get; set; }

    public DateTime? CancelledAt { get; set; }

    public Guid? CancelledByUserId { get; set; }

    public User? CancelledByUser { get; set; }

    [MaxLength(1000)]
    public string? RejectionReason { get; set; }

    public DateTime? RejectedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public BookingProof? Proof { get; set; }

    public BookingDispute? Dispute { get; set; }

    public ICollection<Review> Reviews { get; init; } = [];

    public ICollection<Payment> Payments { get; init; } = [];

    public ICollection<Payout> Payouts { get; init; } = [];
}

public sealed class BookingConfig : IEntityTypeConfiguration<Booking> {
    public void Configure(EntityTypeBuilder<Booking> builder) {
        builder.HasIndex(e => e.CampaignId);
        builder.HasIndex(e => e.SpaceId);
        builder.HasIndex(e => e.Status);
        builder.HasIndex(e => e.StartDate);
        builder.HasIndex(e => e.EndDate);

        builder.Property(e => e.Id)
            .HasDefaultValueSql("gen_random_uuid()");

        builder.Property(e => e.CreatedAt)
            .IsRequired()
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(e => e.UpdatedAt)
            .IsRequired()
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.HasOne(e => e.Campaign)
            .WithMany(e => e.Bookings)
            .HasForeignKey(e => e.CampaignId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(e => e.Space)
            .WithMany(e => e.Bookings)
            .HasForeignKey(e => e.SpaceId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(e => e.CancelledByUser)
            .WithMany()
            .HasForeignKey(e => e.CancelledByUserId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}