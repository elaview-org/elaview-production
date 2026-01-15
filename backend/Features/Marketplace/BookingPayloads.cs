using ElaviewBackend.Data.Entities;

namespace ElaviewBackend.Features.Marketplace;

public record CreateBookingPayload(Booking Booking);
public record ApproveBookingPayload(Booking Booking);
public record RejectBookingPayload(Booking Booking);
public record CancelBookingPayload(Booking Booking);
public record MarkFileDownloadedPayload(Booking Booking);
public record MarkInstalledPayload(Booking Booking);