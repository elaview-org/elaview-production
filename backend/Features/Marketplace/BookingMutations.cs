using HotChocolate.Authorization;

namespace ElaviewBackend.Features.Marketplace;

[MutationType]
public static partial class BookingMutations {
    [Authorize]
    public static async Task<CreateBookingPayload> CreateBooking(
        [ID] Guid campaignId, CreateBookingInput input,
        IBookingService bookingService, CancellationToken ct
    ) {
        return new CreateBookingPayload(
            await bookingService.CreateAsync(campaignId, input, ct));
    }

    [Authorize]
    public static async Task<ApproveBookingPayload> ApproveBooking(
        [ID] Guid id, string? ownerNotes, IBookingService bookingService,
        CancellationToken ct
    ) {
        return new ApproveBookingPayload(
            await bookingService.ApproveAsync(id, ownerNotes, ct));
    }

    [Authorize]
    public static async Task<RejectBookingPayload> RejectBooking(
        [ID] Guid id, string reason, IBookingService bookingService,
        CancellationToken ct
    ) {
        return new RejectBookingPayload(
            await bookingService.RejectAsync(id, reason, ct));
    }

    [Authorize]
    public static async Task<CancelBookingPayload> CancelBooking(
        [ID] Guid id, string reason, IBookingService bookingService,
        CancellationToken ct
    ) {
        return new CancelBookingPayload(
            await bookingService.CancelAsync(id, reason, ct));
    }

    [Authorize]
    public static async Task<MarkFileDownloadedPayload> MarkFileDownloaded(
        [ID] Guid id, IBookingService bookingService, CancellationToken ct
    ) {
        return new MarkFileDownloadedPayload(
            await bookingService.MarkFileDownloadedAsync(id, ct));
    }

    [Authorize]
    public static async Task<MarkInstalledPayload> MarkInstalled(
        [ID] Guid id, IBookingService bookingService, CancellationToken ct
    ) {
        return new MarkInstalledPayload(
            await bookingService.MarkInstalledAsync(id, ct));
    }
}