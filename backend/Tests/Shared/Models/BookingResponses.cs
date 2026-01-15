namespace ElaviewBackend.Tests.Shared.Models;

public record BookingsResponse(BookingsConnection Bookings);

public record BookingsConnection(
    List<BookingNode> Nodes,
    PageInfo PageInfo,
    int? TotalCount = null);

public record BookingNode(
    Guid Id,
    string Status,
    DateTime StartDate,
    DateTime EndDate,
    int TotalDays,
    decimal PricePerDay,
    decimal SubtotalAmount,
    decimal TotalAmount
);

public record BookingByIdResponse(BookingNode? BookingById);

public record MyBookingsAsAdvertiserResponse(
    BookingsConnection MyBookingsAsAdvertiser);

public record MyBookingsAsOwnerResponse(BookingsConnection MyBookingsAsOwner);

public record CreateBookingResponse(CreateBookingPayload CreateBooking);

public record CreateBookingPayload(BookingNode Booking);

public record ApproveBookingResponse(ApproveBookingPayload ApproveBooking);

public record ApproveBookingPayload(BookingNode Booking);

public record CancelBookingResponse(CancelBookingPayload CancelBooking);

public record CancelBookingPayload(BookingNode Booking);