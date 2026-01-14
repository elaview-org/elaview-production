using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ElaviewBackend.Data.Entities;

[Table("transactions")]
public sealed class Transaction : EntityBase {
    public Guid? BookingId { get; init; }

    public Booking? Booking { get; set; }

    public Guid? UserId { get; init; }

    public User? User { get; set; }

    public TransactionType Type { get; init; }

    [Precision(10, 2)]
    public decimal Amount { get; init; }

    [MaxLength(3)]
    public string Currency { get; init; } = "USD";

    [MaxLength(50)]
    public string ReferenceType { get; init; } = null!;

    public Guid ReferenceId { get; init; }

    [MaxLength(500)]
    public string Description { get; init; } = null!;
}

public sealed class TransactionConfig : IEntityTypeConfiguration<Transaction> {
    public void Configure(EntityTypeBuilder<Transaction> builder) {
        builder.HasIndex(e => e.BookingId);
        builder.HasIndex(e => e.UserId);
        builder.HasIndex(e => e.Type);
        builder.HasIndex(e => e.ReferenceId);
        builder.HasIndex(e => e.CreatedAt);

        builder.Property(e => e.Id)
            .HasDefaultValueSql("gen_random_uuid()");

        builder.Property(e => e.CreatedAt)
            .IsRequired()
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.HasOne(e => e.Booking)
            .WithMany()
            .HasForeignKey(e => e.BookingId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasOne(e => e.User)
            .WithMany()
            .HasForeignKey(e => e.UserId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}