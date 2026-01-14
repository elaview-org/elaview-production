using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ElaviewBackend.Data.Entities;

[Table("messages")]
public sealed class Message : EntityBase {
    public Guid ConversationId { get; init; }

    public Conversation Conversation { get; set; } = null!;

    public Guid SenderUserId { get; init; }

    public User SenderUser { get; set; } = null!;

    public MessageType Type { get; init; } = MessageType.Text;

    [MaxLength(5000)]
    public string Content { get; init; } = null!;

    public List<string>? Attachments { get; init; }
}

public sealed class MessageConfig : IEntityTypeConfiguration<Message> {
    public void Configure(EntityTypeBuilder<Message> builder) {
        builder.HasIndex(e => e.ConversationId);
        builder.HasIndex(e => e.SenderUserId);
        builder.HasIndex(e => e.CreatedAt);

        builder.Property(e => e.Id)
            .HasDefaultValueSql("gen_random_uuid()");

        builder.Property(e => e.CreatedAt)
            .IsRequired()
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.HasOne(e => e.Conversation)
            .WithMany(e => e.Messages)
            .HasForeignKey(e => e.ConversationId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(e => e.SenderUser)
            .WithMany()
            .HasForeignKey(e => e.SenderUserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}