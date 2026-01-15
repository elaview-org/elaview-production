using ElaviewBackend.Data.Entities;

namespace ElaviewBackend.Features.Notifications;

public record MarkNotificationReadPayload(Notification Notification);

public record MarkAllNotificationsReadPayload(int Count);

public record DeleteNotificationPayload(bool Success);

public record UpdateNotificationPreferencePayload(NotificationPreference Preference);
