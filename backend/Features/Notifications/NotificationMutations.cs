using ElaviewBackend.Features.Shared.Errors;
using ElaviewBackend.Features.Users;
using HotChocolate.Authorization;

namespace ElaviewBackend.Features.Notifications;

[MutationType]
public static partial class NotificationMutations {
    [Authorize]
    [Error<NotFoundException>]
    public static async Task<MarkNotificationReadPayload> MarkNotificationRead(
        [ID] Guid id,
        IUserService userService,
        INotificationService notificationService,
        CancellationToken ct
    ) {
        var notification = await notificationService.MarkAsReadAsync(userService.GetPrincipalId(), id, ct);
        return new MarkNotificationReadPayload(notification);
    }

    [Authorize]
    public static async Task<MarkAllNotificationsReadPayload> MarkAllNotificationsRead(
        IUserService userService,
        INotificationService notificationService,
        CancellationToken ct
    ) {
        var count = await notificationService.MarkAllAsReadAsync(userService.GetPrincipalId(), ct);
        return new MarkAllNotificationsReadPayload(count);
    }

    [Authorize]
    public static async Task<DeleteNotificationPayload> DeleteNotification(
        [ID] Guid id,
        IUserService userService,
        INotificationService notificationService,
        CancellationToken ct
    ) {
        var success = await notificationService.DeleteAsync(userService.GetPrincipalId(), id, ct);
        return new DeleteNotificationPayload(success);
    }

    [Authorize]
    public static async Task<UpdateNotificationPreferencePayload> UpdateNotificationPreference(
        UpdateNotificationPreferenceInput input,
        IUserService userService,
        INotificationService notificationService,
        CancellationToken ct
    ) {
        var preference = await notificationService.UpdatePreferenceAsync(userService.GetPrincipalId(), input, ct);
        return new UpdateNotificationPreferencePayload(preference);
    }
}