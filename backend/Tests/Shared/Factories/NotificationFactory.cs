using Bogus;
using ElaviewBackend.Data.Entities;

namespace ElaviewBackend.Tests.Shared.Factories;

public static class NotificationFactory {
    private static readonly Faker Faker = new();

    public static Notification Create(Guid userId,
        Action<Notification>? customize = null) {
        var notification = new Notification {
            Id = Guid.NewGuid(),
            UserId = userId,
            Type = NotificationType.BookingRequested,
            Title = Faker.Lorem.Sentence(3),
            Body = Faker.Lorem.Sentence(),
            IsRead = false,
            CreatedAt = DateTime.UtcNow
        };
        customize?.Invoke(notification);
        return notification;
    }

    public static Notification CreateRead(Guid userId) {
        return Create(userId, n => {
            n.IsRead = true;
            n.ReadAt = DateTime.UtcNow;
        });
    }

    public static Notification CreateWithEntity(Guid userId, string entityType,
        Guid entityId) {
        return new Notification {
            Id = Guid.NewGuid(),
            UserId = userId,
            Type = NotificationType.BookingRequested,
            Title = new Faker().Lorem.Sentence(3),
            Body = new Faker().Lorem.Sentence(),
            EntityType = entityType,
            EntityId = entityId,
            IsRead = false,
            CreatedAt = DateTime.UtcNow
        };
    }

    public static List<Notification> CreateMany(Guid userId, int count) {
        return Enumerable.Range(0, count).Select(_ => Create(userId)).ToList();
    }
}

public static class NotificationPreferenceFactory {
    public static NotificationPreference Create(Guid userId,
        NotificationType type,
        Action<NotificationPreference>? customize = null) {
        var preference = new NotificationPreference {
            Id = Guid.NewGuid(),
            UserId = userId,
            NotificationType = type,
            EmailEnabled = true,
            PushEnabled = true,
            InAppEnabled = true,
            CreatedAt = DateTime.UtcNow
        };
        customize?.Invoke(preference);
        return preference;
    }
}

public static class ConversationFactory {
    public static Conversation Create(Guid? bookingId = null,
        Action<Conversation>? customize = null) {
        var now = DateTime.UtcNow;
        var conversation = new Conversation {
            Id = Guid.NewGuid(),
            BookingId = bookingId,
            UpdatedAt = now,
            CreatedAt = now
        };
        customize?.Invoke(conversation);
        return conversation;
    }
}

public static class MessageFactory {
    private static readonly Faker Faker = new();

    public static Message Create(Guid conversationId, Guid senderUserId,
        Action<Message>? customize = null) {
        var message = new Message {
            Id = Guid.NewGuid(),
            ConversationId = conversationId,
            SenderUserId = senderUserId,
            Type = MessageType.Text,
            Content = Faker.Lorem.Sentence(),
            CreatedAt = DateTime.UtcNow
        };
        customize?.Invoke(message);
        return message;
    }

    public static List<Message> CreateMany(Guid conversationId,
        Guid senderUserId, int count) {
        return Enumerable.Range(0, count)
            .Select(_ => Create(conversationId, senderUserId)).ToList();
    }
}

public static class ConversationParticipantFactory {
    public static ConversationParticipant Create(Guid conversationId,
        Guid userId, Action<ConversationParticipant>? customize = null) {
        var now = DateTime.UtcNow;
        var participant = new ConversationParticipant {
            Id = Guid.NewGuid(),
            ConversationId = conversationId,
            UserId = userId,
            JoinedAt = now,
            CreatedAt = now
        };
        customize?.Invoke(participant);
        return participant;
    }
}