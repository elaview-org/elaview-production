using System.Security.Claims;
using ElaviewBackend.Data;
using ElaviewBackend.Data.Entities;
using HotChocolate.Subscriptions;
using Microsoft.EntityFrameworkCore;

namespace ElaviewBackend.Features.Notifications;

public interface INotificationService {
    Guid? GetCurrentUserIdOrNull();
    IQueryable<Notification> GetMyNotificationsQuery();
    IQueryable<Notification> GetNotificationByIdQuery(Guid id);
    Task<Notification?> GetNotificationByIdAsync(Guid id, CancellationToken ct);
    Task<int> GetUnreadCountAsync(CancellationToken ct);
    Task<Notification> MarkAsReadAsync(Guid id, CancellationToken ct);
    Task<int> MarkAllAsReadAsync(CancellationToken ct);
    Task<bool> DeleteNotificationAsync(Guid id, CancellationToken ct);
    Task<IReadOnlyList<NotificationPreference>> GetMyPreferencesAsync(CancellationToken ct);
    Task<NotificationPreference> UpdatePreferenceAsync(UpdateNotificationPreferenceInput input, CancellationToken ct);
    Task SendNotificationAsync(Guid userId, NotificationType type, string title, string body, string? entityType, Guid? entityId, CancellationToken ct);
    Task SendBookingNotificationAsync(Guid bookingId, NotificationType type, string title, string body, CancellationToken ct);
}

public sealed class NotificationService(
    IHttpContextAccessor httpContextAccessor,
    AppDbContext context,
    INotificationRepository notificationRepository,
    INotificationPreferenceRepository preferenceRepository,
    ITopicEventSender eventSender
) : INotificationService {
    public Guid? GetCurrentUserIdOrNull() {
        var principalId = httpContextAccessor.HttpContext?.User.FindFirstValue(
            ClaimTypes.NameIdentifier
        );
        return principalId is null ? null : Guid.Parse(principalId);
    }

    private Guid GetCurrentUserId() =>
        GetCurrentUserIdOrNull() ?? throw new GraphQLException("Not authenticated");

    public IQueryable<Notification> GetMyNotificationsQuery() {
        var userId = GetCurrentUserId();
        return context.Notifications
            .Where(n => n.UserId == userId)
            .OrderByDescending(n => n.CreatedAt);
    }

    public IQueryable<Notification> GetNotificationByIdQuery(Guid id) {
        var userId = GetCurrentUserId();
        return context.Notifications.Where(n => n.Id == id && n.UserId == userId);
    }

    public async Task<Notification?> GetNotificationByIdAsync(Guid id, CancellationToken ct) =>
        await notificationRepository.GetByIdAsync(id, ct);

    public async Task<int> GetUnreadCountAsync(CancellationToken ct) {
        var userId = GetCurrentUserId();
        return await context.Notifications.CountAsync(n => n.UserId == userId && !n.IsRead, ct);
    }

    public async Task<Notification> MarkAsReadAsync(Guid id, CancellationToken ct) {
        var userId = GetCurrentUserId();
        var notification = await context.Notifications
            .FirstOrDefaultAsync(n => n.Id == id && n.UserId == userId, ct)
            ?? throw new GraphQLException("Notification not found");

        if (!notification.IsRead) {
            var entry = context.Entry(notification);
            entry.Property(n => n.IsRead).CurrentValue = true;
            entry.Property(n => n.ReadAt).CurrentValue = DateTime.UtcNow;
            await context.SaveChangesAsync(ct);
        }

        return notification;
    }

    public async Task<int> MarkAllAsReadAsync(CancellationToken ct) {
        var userId = GetCurrentUserId();
        var now = DateTime.UtcNow;

        return await context.Notifications
            .Where(n => n.UserId == userId && !n.IsRead)
            .ExecuteUpdateAsync(s => s
                .SetProperty(n => n.IsRead, true)
                .SetProperty(n => n.ReadAt, now), ct);
    }

    public async Task<bool> DeleteNotificationAsync(Guid id, CancellationToken ct) {
        var userId = GetCurrentUserId();
        var notification = await context.Notifications
            .FirstOrDefaultAsync(n => n.Id == id && n.UserId == userId, ct);

        if (notification is null) return false;

        context.Notifications.Remove(notification);
        await context.SaveChangesAsync(ct);
        return true;
    }

    public async Task<IReadOnlyList<NotificationPreference>> GetMyPreferencesAsync(CancellationToken ct) {
        var userId = GetCurrentUserId();
        return await preferenceRepository.GetByUserIdAsync(userId, ct);
    }

    public async Task<NotificationPreference> UpdatePreferenceAsync(UpdateNotificationPreferenceInput input, CancellationToken ct) {
        var userId = GetCurrentUserId();

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
            await preferenceRepository.AddAsync(preference, ct);
        }
        else {
            var entry = context.Entry(preference);
            if (input.EmailEnabled.HasValue)
                entry.Property(p => p.EmailEnabled).CurrentValue = input.EmailEnabled.Value;
            if (input.PushEnabled.HasValue)
                entry.Property(p => p.PushEnabled).CurrentValue = input.PushEnabled.Value;
            if (input.InAppEnabled.HasValue)
                entry.Property(p => p.InAppEnabled).CurrentValue = input.InAppEnabled.Value;
            await context.SaveChangesAsync(ct);
        }

        return preference;
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

        await notificationRepository.AddAsync(notification, ct);
        await eventSender.SendAsync($"notifications:{userId}", notification, ct);
    }

    public async Task SendBookingNotificationAsync(Guid bookingId, NotificationType type, string title, string body, CancellationToken ct) {
        var booking = await context.Bookings
            .Include(b => b.Campaign)
            .ThenInclude(c => c.AdvertiserProfile)
            .Include(b => b.Space)
            .ThenInclude(s => s.SpaceOwnerProfile)
            .FirstOrDefaultAsync(b => b.Id == bookingId, ct);

        if (booking is null) return;

        var recipientIds = type switch {
            NotificationType.BookingRequested => new[] { booking.Space.SpaceOwnerProfile.UserId },
            NotificationType.BookingApproved or NotificationType.BookingRejected =>
                new[] { booking.Campaign.AdvertiserProfile.UserId },
            NotificationType.BookingCancelled =>
                new[] { booking.Campaign.AdvertiserProfile.UserId, booking.Space.SpaceOwnerProfile.UserId },
            NotificationType.PaymentReceived or NotificationType.PayoutProcessed =>
                new[] { booking.Space.SpaceOwnerProfile.UserId },
            NotificationType.ProofUploaded =>
                new[] { booking.Campaign.AdvertiserProfile.UserId },
            NotificationType.ProofApproved or NotificationType.ProofRejected or NotificationType.ProofDisputed =>
                new[] { booking.Space.SpaceOwnerProfile.UserId },
            NotificationType.DisputeFiled =>
                new[] { booking.Space.SpaceOwnerProfile.UserId },
            NotificationType.DisputeResolved =>
                new[] { booking.Campaign.AdvertiserProfile.UserId, booking.Space.SpaceOwnerProfile.UserId },
            _ => Array.Empty<Guid>()
        };

        foreach (var userId in recipientIds.Distinct()) {
            await SendNotificationAsync(userId, type, title, body, "Booking", bookingId, ct);
        }
    }
}
