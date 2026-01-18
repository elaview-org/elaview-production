using ElaviewBackend.Data.Entities;
using ElaviewBackend.Features.Shared.Errors;
using HotChocolate.Subscriptions;

namespace ElaviewBackend.Features.Notifications;

public interface INotificationService {
    IQueryable<Notification> GetByUserId(Guid userId);
    Task<Notification?> GetByIdAsync(Guid id, CancellationToken ct);
    Task<int> GetUnreadCountAsync(Guid userId, CancellationToken ct);
    Task<Notification> MarkAsReadAsync(Guid userId, Guid id, CancellationToken ct);
    Task<int> MarkAllAsReadAsync(Guid userId, CancellationToken ct);
    Task<bool> DeleteAsync(Guid userId, Guid id, CancellationToken ct);
    Task<IReadOnlyList<NotificationPreference>> GetPreferencesByUserIdAsync(Guid userId, CancellationToken ct);
    Task<NotificationPreference> UpdatePreferenceAsync(Guid userId, UpdateNotificationPreferenceInput input, CancellationToken ct);
    Task SendNotificationAsync(Guid userId, NotificationType type, string title, string body, string? entityType, Guid? entityId, CancellationToken ct);
    Task SendBookingNotificationAsync(Guid bookingId, NotificationType type, string title, string body, CancellationToken ct);
}

public sealed class NotificationService(
    INotificationRepository repository,
    INotificationPreferenceRepository preferenceRepository,
    ITopicEventSender eventSender
) : INotificationService {
    public IQueryable<Notification> GetByUserId(Guid userId)
        => repository.GetByUserId(userId);

    public async Task<Notification?> GetByIdAsync(Guid id, CancellationToken ct)
        => await repository.GetByIdAsync(id, ct);

    public async Task<int> GetUnreadCountAsync(Guid userId, CancellationToken ct)
        => await repository.GetUnreadCountByUserIdAsync(userId, ct);

    public async Task<Notification> MarkAsReadAsync(Guid userId, Guid id, CancellationToken ct) {
        var notification = await repository.GetByIdAndUserIdAsync(id, userId, ct)
            ?? throw new NotFoundException("Notification", id);

        if (notification.IsRead)
            return notification;

        return await repository.MarkAsReadAsync(notification, ct);
    }

    public async Task<int> MarkAllAsReadAsync(Guid userId, CancellationToken ct)
        => await repository.MarkAllAsReadByUserIdAsync(userId, ct);

    public async Task<bool> DeleteAsync(Guid userId, Guid id, CancellationToken ct) {
        var notification = await repository.GetByIdAndUserIdAsync(id, userId, ct);
        if (notification is null) return false;

        return await repository.DeleteAsync(notification, ct);
    }

    public async Task<IReadOnlyList<NotificationPreference>> GetPreferencesByUserIdAsync(Guid userId, CancellationToken ct)
        => await preferenceRepository.GetByUserIdAsync(userId, ct);

    public async Task<NotificationPreference> UpdatePreferenceAsync(Guid userId, UpdateNotificationPreferenceInput input, CancellationToken ct) {
        var preference = await preferenceRepository.GetByUserIdAndTypeAsync(userId, input.NotificationType, ct);

        if (preference is null) {
            preference = new NotificationPreference {
                UserId = userId,
                NotificationType = input.NotificationType,
                EmailEnabled = input.EmailEnabled ?? true,
                PushEnabled = input.PushEnabled ?? true,
                InAppEnabled = input.InAppEnabled ?? true,
                CreatedAt = DateTime.UtcNow
            };
            return await preferenceRepository.AddAsync(preference, ct);
        }

        return await preferenceRepository.UpdateAsync(preference, input, ct);
    }

    public async Task SendNotificationAsync(Guid userId, NotificationType type, string title, string body, string? entityType, Guid? entityId, CancellationToken ct) {
        var preference = await preferenceRepository.GetByUserIdAndTypeAsync(userId, type, ct);

        if (preference is not null && !preference.InAppEnabled)
            return;

        var notification = new Notification {
            UserId = userId,
            Type = type,
            Title = title,
            Body = body,
            EntityType = entityType,
            EntityId = entityId,
            IsRead = false,
            CreatedAt = DateTime.UtcNow
        };

        await repository.AddAsync(notification, ct);
        await eventSender.SendAsync($"notifications:{userId}", notification, ct);
    }

    public async Task SendBookingNotificationAsync(Guid bookingId, NotificationType type, string title, string body, CancellationToken ct) {
        var booking = await repository.GetBookingNotificationInfoAsync(bookingId, ct);
        if (booking is null) return;

        var recipientIds = type switch {
            NotificationType.BookingRequested => new[] { booking.OwnerUserId },
            NotificationType.BookingApproved or NotificationType.BookingRejected => new[] { booking.AdvertiserUserId },
            NotificationType.BookingCancelled => new[] { booking.AdvertiserUserId, booking.OwnerUserId },
            NotificationType.PaymentReceived or NotificationType.PayoutProcessed => new[] { booking.OwnerUserId },
            NotificationType.ProofUploaded => new[] { booking.AdvertiserUserId },
            NotificationType.ProofApproved or NotificationType.ProofRejected or NotificationType.ProofDisputed => new[] { booking.OwnerUserId },
            NotificationType.DisputeFiled => new[] { booking.OwnerUserId },
            NotificationType.DisputeResolved => new[] { booking.AdvertiserUserId, booking.OwnerUserId },
            _ => Array.Empty<Guid>()
        };

        foreach (var userId in recipientIds.Distinct())
            await SendNotificationAsync(userId, type, title, body, "Booking", bookingId, ct);
    }
}