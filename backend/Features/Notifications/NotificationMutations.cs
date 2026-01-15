using System.Diagnostics.CodeAnalysis;
using HotChocolate.Authorization;

namespace ElaviewBackend.Features.Notifications;

[MutationType]
[SuppressMessage("ReSharper", "MemberCanBePrivate.Global")]
public static partial class NotificationMutations {
    [Authorize]
    public static async Task<MarkNotificationReadPayload> MarkNotificationRead(
        [ID] Guid id, INotificationService notificationService,
        CancellationToken ct
    ) {
        return new MarkNotificationReadPayload(
            await notificationService.MarkAsReadAsync(id, ct));
    }

    [Authorize]
    public static async Task<MarkAllNotificationsReadPayload>
        MarkAllNotificationsRead(
            INotificationService notificationService, CancellationToken ct
        ) {
        return new MarkAllNotificationsReadPayload(
            await notificationService.MarkAllAsReadAsync(ct));
    }

    [Authorize]
    public static async Task<DeleteNotificationPayload> DeleteNotification(
        [ID] Guid id, INotificationService notificationService,
        CancellationToken ct
    ) {
        return new DeleteNotificationPayload(
            await notificationService.DeleteNotificationAsync(id, ct));
    }

    [Authorize]
    public static async Task<UpdateNotificationPreferencePayload>
        UpdateNotificationPreference(
            UpdateNotificationPreferenceInput input,
            INotificationService notificationService, CancellationToken ct
        ) {
        return new UpdateNotificationPreferencePayload(
            await notificationService.UpdatePreferenceAsync(input, ct));
    }
}