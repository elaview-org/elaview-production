using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ElaviewBackend.Data.Entities;

[Table("booking_proofs")]
public sealed class BookingProof : EntityBase {
    public Guid BookingId { get; init; }

    public Booking Booking { get; set; } = null!;

    public List<string> Photos { get; init; } = [];

    public ProofStatus Status { get; set; } = ProofStatus.Pending;

    public DateTime SubmittedAt { get; init; }

    public DateTime AutoApproveAt { get; init; }

    public DateTime? ReviewedAt { get; set; }

    public Guid? ReviewedByUserId { get; set; }

    public User? ReviewedByUser { get; set; }

    [MaxLength(1000)]
    public string? RejectionReason { get; set; }
}

public sealed class
    BookingProofConfig : IEntityTypeConfiguration<BookingProof> {
    public void Configure(EntityTypeBuilder<BookingProof> builder) {
        builder.HasIndex(e => e.BookingId).IsUnique();
        builder.HasIndex(e => e.Status);
        builder.HasIndex(e => e.AutoApproveAt);

        builder.Property(e => e.Id)
            .HasDefaultValueSql("gen_random_uuid()");

        builder.Property(e => e.CreatedAt)
            .IsRequired()
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.HasOne(e => e.Booking)
            .WithOne(e => e.Proof)
            .HasForeignKey<BookingProof>(e => e.BookingId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(e => e.ReviewedByUser)
            .WithMany()
            .HasForeignKey(e => e.ReviewedByUserId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}