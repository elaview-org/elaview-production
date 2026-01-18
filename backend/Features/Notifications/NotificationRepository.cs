using ElaviewBackend.Data;
using ElaviewBackend.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace ElaviewBackend.Features.Notifications;

public interface INotificationRepository {
    IQueryable<Notification> Query();
    Task<Notification?> GetByIdAsync(Guid id, CancellationToken ct);
    IQueryable<Notification> GetByUserId(Guid userId);
    Task<Notification?> GetByIdAndUserIdAsync(Guid id, Guid userId, CancellationToken ct);
    Task<int> GetUnreadCountByUserIdAsync(Guid userId, CancellationToken ct);
    Task<Notification> AddAsync(Notification notification, CancellationToken ct);
    Task AddRangeAsync(IEnumerable<Notification> notifications, CancellationToken ct);
    Task<Notification> MarkAsReadAsync(Notification notification, CancellationToken ct);
    Task<int> MarkAllAsReadByUserIdAsync(Guid userId, CancellationToken ct);
    Task<bool> DeleteAsync(Notification notification, CancellationToken ct);
    Task<BookingNotificationInfo?> GetBookingNotificationInfoAsync(Guid bookingId, CancellationToken ct);
    Task SaveChangesAsync(CancellationToken ct);
}

public record BookingNotificationInfo(
    Guid BookingId,
    Guid AdvertiserUserId,
    Guid OwnerUserId
);

public sealed class NotificationRepository(
    AppDbContext context,
    INotificationByIdDataLoader notificationById
) : INotificationRepository {
    public IQueryable<Notification> Query()
        => context.Notifications;

    public async Task<Notification?> GetByIdAsync(Guid id, CancellationToken ct)
        => await notificationById.LoadAsync(id, ct);

    public IQueryable<Notification> GetByUserId(Guid userId)
        => context.Notifications
            .Where(n => n.UserId == userId)
            .OrderByDescending(n => n.CreatedAt);

    public async Task<Notification?> GetByIdAndUserIdAsync(Guid id, Guid userId, CancellationToken ct)
        => await context.Notifications.FirstOrDefaultAsync(n => n.Id == id && n.UserId == userId, ct);

    public async Task<int> GetUnreadCountByUserIdAsync(Guid userId, CancellationToken ct)
        => await context.Notifications.CountAsync(n => n.UserId == userId && !n.IsRead, ct);

    public async Task<Notification> AddAsync(Notification notification, CancellationToken ct) {
        context.Notifications.Add(notification);
        await context.SaveChangesAsync(ct);
        return notification;
    }

    public async Task AddRangeAsync(IEnumerable<Notification> notifications, CancellationToken ct) {
        context.Notifications.AddRange(notifications);
        await context.SaveChangesAsync(ct);
    }

    public async Task<Notification> MarkAsReadAsync(Notification notification, CancellationToken ct) {
        var entry = context.Entry(notification);
        entry.Property(n => n.IsRead).CurrentValue = true;
        entry.Property(n => n.ReadAt).CurrentValue = DateTime.UtcNow;
        await context.SaveChangesAsync(ct);
        return notification;
    }

    public async Task<int> MarkAllAsReadByUserIdAsync(Guid userId, CancellationToken ct) {
        var now = DateTime.UtcNow;
        return await context.Notifications
            .Where(n => n.UserId == userId && !n.IsRead)
            .ExecuteUpdateAsync(s => s
                .SetProperty(n => n.IsRead, true)
                .SetProperty(n => n.ReadAt, now), ct);
    }

    public async Task<bool> DeleteAsync(Notification notification, CancellationToken ct) {
        context.Notifications.Remove(notification);
        await context.SaveChangesAsync(ct);
        return true;
    }

    public async Task<BookingNotificationInfo?> GetBookingNotificationInfoAsync(Guid bookingId, CancellationToken ct)
        => await context.Bookings
            .Where(b => b.Id == bookingId)
            .Select(b => new BookingNotificationInfo(
                b.Id,
                b.Campaign.AdvertiserProfile.UserId,
                b.Space.SpaceOwnerProfile.UserId))
            .FirstOrDefaultAsync(ct);

    public async Task SaveChangesAsync(CancellationToken ct)
        => await context.SaveChangesAsync(ct);
}

public interface INotificationPreferenceRepository {
    IQueryable<NotificationPreference> Query();
    Task<NotificationPreference?> GetByUserIdAndTypeAsync(Guid userId, NotificationType type, CancellationToken ct);
    Task<IReadOnlyList<NotificationPreference>> GetByUserIdAsync(Guid userId, CancellationToken ct);
    Task<NotificationPreference> AddAsync(NotificationPreference preference, CancellationToken ct);
    Task<NotificationPreference> UpdateAsync(NotificationPreference preference, UpdateNotificationPreferenceInput input, CancellationToken ct);
    Task SaveChangesAsync(CancellationToken ct);
}

public sealed class NotificationPreferenceRepository(
    AppDbContext context,
    INotificationPreferencesByUserIdDataLoader preferencesByUserId
) : INotificationPreferenceRepository {
    public IQueryable<NotificationPreference> Query()
        => context.NotificationPreferences;

    public async Task<NotificationPreference?> GetByUserIdAndTypeAsync(Guid userId, NotificationType type, CancellationToken ct)
        => await context.NotificationPreferences.FirstOrDefaultAsync(p => p.UserId == userId && p.NotificationType == type, ct);

    public async Task<IReadOnlyList<NotificationPreference>> GetByUserIdAsync(Guid userId, CancellationToken ct)
        => await preferencesByUserId.LoadAsync(userId, ct) ?? [];

    public async Task<NotificationPreference> AddAsync(NotificationPreference preference, CancellationToken ct) {
        context.NotificationPreferences.Add(preference);
        await context.SaveChangesAsync(ct);
        return preference;
    }

    public async Task<NotificationPreference> UpdateAsync(NotificationPreference preference, UpdateNotificationPreferenceInput input, CancellationToken ct) {
        var entry = context.Entry(preference);
        if (input.EmailEnabled.HasValue)
            entry.Property(p => p.EmailEnabled).CurrentValue = input.EmailEnabled.Value;
        if (input.PushEnabled.HasValue)
            entry.Property(p => p.PushEnabled).CurrentValue = input.PushEnabled.Value;
        if (input.InAppEnabled.HasValue)
            entry.Property(p => p.InAppEnabled).CurrentValue = input.InAppEnabled.Value;
        await context.SaveChangesAsync(ct);
        return preference;
    }

    public async Task SaveChangesAsync(CancellationToken ct)
        => await context.SaveChangesAsync(ct);
}

internal static class NotificationDataLoaders {
    [DataLoader]
    public static async Task<IReadOnlyDictionary<Guid, Notification>>
        GetNotificationById(
            IReadOnlyList<Guid> ids, AppDbContext context, CancellationToken ct
        ) {
        return await context.Notifications
            .Where(n => ids.Contains(n.Id))
            .ToDictionaryAsync(n => n.Id, ct);
    }

    [DataLoader]
    public static async Task<ILookup<Guid, Notification>>
        GetNotificationsByUserId(
            IReadOnlyList<Guid> userIds, AppDbContext context,
            CancellationToken ct
        ) {
        return (await context.Notifications
            .Where(n => userIds.Contains(n.UserId))
            .OrderByDescending(n => n.CreatedAt)
            .ToListAsync(ct)).ToLookup(n => n.UserId);
    }

    [DataLoader]
    public static async Task<ILookup<Guid, NotificationPreference>>
        GetNotificationPreferencesByUserId(
            IReadOnlyList<Guid> userIds, AppDbContext context,
            CancellationToken ct
        ) {
        return (await context.NotificationPreferences
            .Where(p => userIds.Contains(p.UserId))
            .ToListAsync(ct)).ToLookup(p => p.UserId);
    }
}