using ElaviewBackend.Data.Entities;
using ElaviewBackend.Features.Users;
using HotChocolate.Authorization;

namespace ElaviewBackend.Features.Notifications;

[QueryType]
public static partial class NotificationQueries {
    [Authorize]
    [UsePaging]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public static IQueryable<Notification> GetMyNotifications(
        IUserService userService,
        INotificationService notificationService
    ) => notificationService.GetByUserId(userService.GetPrincipalId());

    [Authorize]
    public static async Task<int> GetUnreadNotificationsCount(
        IUserService userService,
        INotificationService notificationService,
        CancellationToken ct
    ) => await notificationService.GetUnreadCountAsync(userService.GetPrincipalId(), ct);

    [Authorize]
    public static async Task<IReadOnlyList<NotificationPreference>> GetMyNotificationPreferences(
        IUserService userService,
        INotificationService notificationService,
        CancellationToken ct
    ) => await notificationService.GetPreferencesByUserIdAsync(userService.GetPrincipalId(), ct);
}