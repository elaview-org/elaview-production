using ElaviewBackend.Features.Shared.Errors;
using ElaviewBackend.Features.Users;
using HotChocolate.Authorization;

namespace ElaviewBackend.Features.Marketplace;

[MutationType]
public static partial class BookingMutations {
    [Authorize]
    [Error<NotFoundException>]
    [Error<ValidationException>]
    [Error<ConflictException>]
    public static async Task<CreateBookingPayload> CreateBooking(
        [ID] Guid campaignId,
        CreateBookingInput input,
        IUserService userService,
        IBookingService bookingService,
        CancellationToken ct
    ) {
        var booking = await bookingService.CreateAsync(userService.GetPrincipalId(), campaignId, input, ct);
        return new CreateBookingPayload(booking);
    }

    [Authorize]
    [Error<NotFoundException>]
    [Error<ForbiddenException>]
    [Error<InvalidStatusTransitionException>]
    public static async Task<ApproveBookingPayload> ApproveBooking(
        [ID] Guid id,
        string? ownerNotes,
        IUserService userService,
        IBookingService bookingService,
        CancellationToken ct
    ) {
        var booking = await bookingService.ApproveAsync(userService.GetPrincipalId(), id, ownerNotes, ct);
        return new ApproveBookingPayload(booking);
    }

    [Authorize]
    [Error<NotFoundException>]
    [Error<ForbiddenException>]
    [Error<InvalidStatusTransitionException>]
    public static async Task<RejectBookingPayload> RejectBooking(
        [ID] Guid id,
        string reason,
        IUserService userService,
        IBookingService bookingService,
        CancellationToken ct
    ) {
        var booking = await bookingService.RejectAsync(userService.GetPrincipalId(), id, reason, ct);
        return new RejectBookingPayload(booking);
    }

    [Authorize]
    [Error<NotFoundException>]
    [Error<ForbiddenException>]
    [Error<InvalidStatusTransitionException>]
    public static async Task<CancelBookingPayload> CancelBooking(
        [ID] Guid id,
        string reason,
        IUserService userService,
        IBookingService bookingService,
        CancellationToken ct
    ) {
        var booking = await bookingService.CancelAsync(userService.GetPrincipalId(), id, reason, ct);
        return new CancelBookingPayload(booking);
    }

    [Authorize]
    [Error<NotFoundException>]
    [Error<ForbiddenException>]
    [Error<InvalidStatusTransitionException>]
    public static async Task<MarkFileDownloadedPayload> MarkFileDownloaded(
        [ID] Guid id,
        IUserService userService,
        IBookingService bookingService,
        CancellationToken ct
    ) {
        var booking = await bookingService.MarkFileDownloadedAsync(userService.GetPrincipalId(), id, ct);
        return new MarkFileDownloadedPayload(booking);
    }

    [Authorize]
    [Error<NotFoundException>]
    [Error<ForbiddenException>]
    [Error<InvalidStatusTransitionException>]
    public static async Task<MarkInstalledPayload> MarkInstalled(
        [ID] Guid id,
        IUserService userService,
        IBookingService bookingService,
        CancellationToken ct
    ) {
        var booking = await bookingService.MarkInstalledAsync(userService.GetPrincipalId(), id, ct);
        return new MarkInstalledPayload(booking);
    }

    [Authorize]
    [Error<NotFoundException>]
    [Error<ForbiddenException>]
    [Error<InvalidStatusTransitionException>]
    public static async Task<SubmitProofPayload> SubmitProof(
        SubmitProofInput input,
        IUserService userService,
        IBookingService bookingService,
        CancellationToken ct
    ) {
        var booking = await bookingService.SubmitProofAsync(userService.GetPrincipalId(), input, ct);
        return new SubmitProofPayload(booking);
    }

    [Authorize]
    [Error<NotFoundException>]
    [Error<ForbiddenException>]
    [Error<InvalidStatusTransitionException>]
    public static async Task<ApproveProofPayload> ApproveProof(
        ApproveProofInput input,
        IUserService userService,
        IBookingService bookingService,
        CancellationToken ct
    ) {
        var booking = await bookingService.ApproveProofAsync(userService.GetPrincipalId(), input.BookingId, ct);
        return new ApproveProofPayload(booking);
    }

    [Authorize]
    [Error<NotFoundException>]
    [Error<ForbiddenException>]
    [Error<InvalidStatusTransitionException>]
    public static async Task<DisputeProofPayload> DisputeProof(
        DisputeProofInput input,
        IUserService userService,
        IBookingService bookingService,
        CancellationToken ct
    ) {
        var booking = await bookingService.DisputeProofAsync(userService.GetPrincipalId(), input, ct);
        return new DisputeProofPayload(booking);
    }
}