using System.Diagnostics.CodeAnalysis;
using HotChocolate.Authorization;

namespace ElaviewBackend.Features.Notifications;

[MutationType]
[SuppressMessage("ReSharper", "MemberCanBePrivate.Global")]
public static partial class NotificationMutations {
    [Authorize]
    public static async Task<MarkNotificationReadPayload> MarkNotificationRead(
        [ID] Guid id, INotificationService notificationService, CancellationToken ct
    ) => new(await notificationService.MarkAsReadAsync(id, ct));

    [Authorize]
    public static async Task<MarkAllNotificationsReadPayload> MarkAllNotificationsRead(
        INotificationService notificationService, CancellationToken ct
    ) => new(await notificationService.MarkAllAsReadAsync(ct));

    [Authorize]
    public static async Task<DeleteNotificationPayload> DeleteNotification(
        [ID] Guid id, INotificationService notificationService, CancellationToken ct
    ) => new(await notificationService.DeleteNotificationAsync(id, ct));

    [Authorize]
    public static async Task<UpdateNotificationPreferencePayload> UpdateNotificationPreference(
        UpdateNotificationPreferenceInput input, INotificationService notificationService, CancellationToken ct
    ) => new(await notificationService.UpdatePreferenceAsync(input, ct));
}
