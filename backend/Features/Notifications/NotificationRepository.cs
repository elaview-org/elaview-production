using ElaviewBackend.Data;
using ElaviewBackend.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace ElaviewBackend.Features.Notifications;

public interface INotificationRepository {
    IQueryable<Notification> Query();
    Task<Notification?> GetByIdAsync(Guid id, CancellationToken ct);

    Task<Notification> AddAsync(Notification notification,
        CancellationToken ct);

    Task AddRangeAsync(IEnumerable<Notification> notifications,
        CancellationToken ct);

    Task SaveChangesAsync(CancellationToken ct);
}

public sealed class NotificationRepository(
    AppDbContext context,
    INotificationByIdDataLoader notificationById
) : INotificationRepository {
    public IQueryable<Notification> Query() {
        return context.Notifications;
    }

    public async Task<Notification?>
        GetByIdAsync(Guid id, CancellationToken ct) {
        return await notificationById.LoadAsync(id, ct);
    }

    public async Task<Notification> AddAsync(Notification notification,
        CancellationToken ct) {
        context.Notifications.Add(notification);
        await context.SaveChangesAsync(ct);
        return notification;
    }

    public async Task AddRangeAsync(IEnumerable<Notification> notifications,
        CancellationToken ct) {
        context.Notifications.AddRange(notifications);
        await context.SaveChangesAsync(ct);
    }

    public async Task SaveChangesAsync(CancellationToken ct) {
        await context.SaveChangesAsync(ct);
    }
}

public interface INotificationPreferenceRepository {
    IQueryable<NotificationPreference> Query();

    Task<NotificationPreference?> GetByUserIdAndTypeAsync(Guid userId,
        NotificationType type, CancellationToken ct);

    Task<IReadOnlyList<NotificationPreference>> GetByUserIdAsync(Guid userId,
        CancellationToken ct);

    Task<NotificationPreference> AddAsync(NotificationPreference preference,
        CancellationToken ct);

    Task SaveChangesAsync(CancellationToken ct);
}

public sealed class NotificationPreferenceRepository(
    AppDbContext context,
    INotificationPreferencesByUserIdDataLoader preferencesByUserId
) : INotificationPreferenceRepository {
    public IQueryable<NotificationPreference> Query() {
        return context.NotificationPreferences;
    }

    public async Task<NotificationPreference?> GetByUserIdAndTypeAsync(
        Guid userId, NotificationType type, CancellationToken ct) {
        return await context.NotificationPreferences.FirstOrDefaultAsync(
            p => p.UserId == userId && p.NotificationType == type, ct);
    }

    public async Task<IReadOnlyList<NotificationPreference>> GetByUserIdAsync(
        Guid userId, CancellationToken ct) {
        return await preferencesByUserId.LoadAsync(userId, ct) ?? [];
    }

    public async Task<NotificationPreference> AddAsync(
        NotificationPreference preference, CancellationToken ct) {
        context.NotificationPreferences.Add(preference);
        await context.SaveChangesAsync(ct);
        return preference;
    }

    public async Task SaveChangesAsync(CancellationToken ct) {
        await context.SaveChangesAsync(ct);
    }
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