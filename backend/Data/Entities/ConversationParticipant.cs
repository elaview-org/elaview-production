using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ElaviewBackend.Data.Entities;

[Table("conversation_participants")]
public sealed class ConversationParticipant : EntityBase {
    public Guid ConversationId { get; init; }

    public Conversation Conversation { get; set; } = null!;

    public Guid UserId { get; init; }

    public User User { get; set; } = null!;

    public DateTime JoinedAt { get; init; }

    public DateTime? LastReadAt { get; set; }
}

public sealed class ConversationParticipantConfig : IEntityTypeConfiguration<ConversationParticipant> {
    public void Configure(EntityTypeBuilder<ConversationParticipant> builder) {
        builder.HasIndex(e => new { e.ConversationId, e.UserId }).IsUnique();
        builder.HasIndex(e => e.UserId);

        builder.Property(e => e.Id)
            .HasDefaultValueSql("gen_random_uuid()");

        builder.Property(e => e.CreatedAt)
            .IsRequired()
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(e => e.JoinedAt)
            .IsRequired()
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.HasOne(e => e.Conversation)
            .WithMany(e => e.Participants)
            .HasForeignKey(e => e.ConversationId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(e => e.User)
            .WithMany()
            .HasForeignKey(e => e.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}