using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ElaviewBackend.Data.Entities;

[Table("conversations")]
public sealed class Conversation : EntityBase {
    public Guid? BookingId { get; init; }

    public Booking? Booking { get; set; }

    public DateTime UpdatedAt { get; set; }

    public ICollection<ConversationParticipant> Participants { get; init; } = [];

    public ICollection<Message> Messages { get; init; } = [];
}

public sealed class ConversationConfig : IEntityTypeConfiguration<Conversation> {
    public void Configure(EntityTypeBuilder<Conversation> builder) {
        builder.HasIndex(e => e.BookingId);
        builder.HasIndex(e => e.UpdatedAt);

        builder.Property(e => e.Id)
            .HasDefaultValueSql("gen_random_uuid()");

        builder.Property(e => e.CreatedAt)
            .IsRequired()
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(e => e.UpdatedAt)
            .IsRequired()
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.HasOne(e => e.Booking)
            .WithMany()
            .HasForeignKey(e => e.BookingId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}