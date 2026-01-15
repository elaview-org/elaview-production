using System.Diagnostics.CodeAnalysis;
using ElaviewBackend.Data.Entities;
using HotChocolate.Authorization;

namespace ElaviewBackend.Features.Notifications;

[SubscriptionType]
[SuppressMessage("ReSharper", "MemberCanBePrivate.Global")]
public static partial class NotificationSubscriptions {
    [Authorize]
    [Subscribe]
    [Topic("notifications:{userId}")]
    public static Notification OnNotification(
        [ID] Guid userId,
        [EventMessage] Notification notification
    ) => notification;

    [Authorize]
    [Subscribe]
    [Topic("messages:{conversationId}")]
    public static Message OnMessage(
        [ID] Guid conversationId,
        [EventMessage] Message message
    ) => message;

    [Authorize]
    [Subscribe]
    [Topic("booking:{bookingId}:updates")]
    public static Booking OnBookingUpdate(
        [ID] Guid bookingId,
        [EventMessage] Booking booking
    ) => booking;

    [Authorize]
    [Subscribe]
    [Topic("booking:{bookingId}:proof")]
    public static BookingProof OnProofUpdate(
        [ID] Guid bookingId,
        [EventMessage] BookingProof proof
    ) => proof;
}
