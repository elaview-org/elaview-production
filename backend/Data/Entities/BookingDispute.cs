using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ElaviewBackend.Data.Entities;

[Table("booking_disputes")]
public sealed class BookingDispute : EntityBase {
    public Guid BookingId { get; init; }

    public Booking Booking { get; set; } = null!;

    public DisputeIssueType IssueType { get; init; }

    [MaxLength(2000)]
    public string Reason { get; init; } = null!;

    public List<string> Photos { get; init; } = [];

    public Guid DisputedByUserId { get; init; }

    public User DisputedByUser { get; set; } = null!;

    public DateTime DisputedAt { get; init; }

    public Guid? ResolvedByUserId { get; set; }

    public User? ResolvedByUser { get; set; }

    public DateTime? ResolvedAt { get; set; }

    [MaxLength(100)]
    public string? ResolutionAction { get; set; }

    [MaxLength(2000)]
    public string? ResolutionNotes { get; set; }
}

public sealed class BookingDisputeConfig : IEntityTypeConfiguration<BookingDispute> {
    public void Configure(EntityTypeBuilder<BookingDispute> builder) {
        builder.HasIndex(e => e.BookingId).IsUnique();
        builder.HasIndex(e => e.DisputedByUserId);
        builder.HasIndex(e => e.IssueType);

        builder.Property(e => e.Id)
            .HasDefaultValueSql("gen_random_uuid()");

        builder.Property(e => e.CreatedAt)
            .IsRequired()
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.HasOne(e => e.Booking)
            .WithOne(e => e.Dispute)
            .HasForeignKey<BookingDispute>(e => e.BookingId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(e => e.DisputedByUser)
            .WithMany()
            .HasForeignKey(e => e.DisputedByUserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(e => e.ResolvedByUser)
            .WithMany()
            .HasForeignKey(e => e.ResolvedByUserId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}