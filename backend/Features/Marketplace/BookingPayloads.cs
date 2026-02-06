using ElaviewBackend.Data.Entities;

namespace ElaviewBackend.Features.Marketplace;

public record CreateBookingPayload(Booking Booking);

public record ApproveBookingPayload(Booking Booking);

public record RejectBookingPayload(Booking Booking);

public record CancelBookingPayload(Booking Booking);

public record MarkFileDownloadedPayload(Booking Booking);

public record MarkInstalledPayload(Booking Booking);

public record SubmitProofInput(
    [property: ID] Guid BookingId,
    List<string> PhotoUrls
);

public record SubmitProofPayload(Booking Booking);

public record ExportBookingsInput(
    List<BookingStatus>? Statuses,
    DateTime? StartDateFrom,
    DateTime? StartDateTo,
    string? SearchText
);

public record ExportBookingsPayload(
    string FileName,
    string ContentBase64,
    string ContentType
);