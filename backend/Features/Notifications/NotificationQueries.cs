using System.Diagnostics.CodeAnalysis;
using ElaviewBackend.Data.Entities;
using HotChocolate.Authorization;

namespace ElaviewBackend.Features.Notifications;

[QueryType]
[SuppressMessage("ReSharper", "MemberCanBePrivate.Global")]
public static partial class NotificationQueries {
    [Authorize]
    [UsePaging]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public static IQueryable<Notification> GetMyNotifications(INotificationService notificationService)
        => notificationService.GetMyNotificationsQuery();

    [Authorize]
    [UseFirstOrDefault]
    [UseProjection]
    public static IQueryable<Notification> GetNotificationById(
        [ID] Guid id, INotificationService notificationService
    ) => notificationService.GetNotificationByIdQuery(id);

    [Authorize]
    public static async Task<int> GetUnreadNotificationsCount(
        INotificationService notificationService, CancellationToken ct
    ) => await notificationService.GetUnreadCountAsync(ct);

    [Authorize]
    public static async Task<IReadOnlyList<NotificationPreference>> GetMyNotificationPreferences(
        INotificationService notificationService, CancellationToken ct
    ) => await notificationService.GetMyPreferencesAsync(ct);
}
