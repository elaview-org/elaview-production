using ElaviewBackend.Data.Entities;
using ElaviewBackend.Features.Shared.Errors;

namespace ElaviewBackend.Features.Marketplace;

public interface IBookingService {
    IQueryable<Booking> GetById(Guid id);
    IQueryable<Booking> GetByAdvertiserUserId(Guid userId);
    IQueryable<Booking> GetByOwnerUserId(Guid userId);
    IQueryable<Booking> GetPendingByOwnerUserId(Guid userId);
    IQueryable<Booking> GetRequiringActionByUserId(Guid userId);
    IQueryable<Review> GetReviewsByBookingId(Guid bookingId);
    IQueryable<Payment> GetPaymentsByBookingId(Guid bookingId);
    IQueryable<Payout> GetPayoutsByBookingId(Guid bookingId);
    Task<Campaign?> GetCampaignByBookingIdAsync(Guid bookingId, CancellationToken ct);
    Task<Space?> GetSpaceByBookingIdAsync(Guid bookingId, CancellationToken ct);
    Task<Booking> CreateAsync(Guid userId, Guid campaignId, CreateBookingInput input, CancellationToken ct);
    Task<Booking> ApproveAsync(Guid userId, Guid id, string? ownerNotes, CancellationToken ct);
    Task<Booking> RejectAsync(Guid userId, Guid id, string reason, CancellationToken ct);
    Task<Booking> CancelAsync(Guid userId, Guid id, string reason, CancellationToken ct);
    Task<Booking> MarkFileDownloadedAsync(Guid userId, Guid id, CancellationToken ct);
    Task<Booking> MarkInstalledAsync(Guid userId, Guid id, CancellationToken ct);
}

public sealed class BookingService(IBookingRepository repository) : IBookingService {
    private const decimal PlatformFeePercent = 0.10m;

    public IQueryable<Booking> GetById(Guid id)
        => repository.Query().Where(b => b.Id == id);

    public IQueryable<Booking> GetByAdvertiserUserId(Guid userId)
        => repository.GetByAdvertiserUserId(userId);

    public IQueryable<Booking> GetByOwnerUserId(Guid userId)
        => repository.GetByOwnerUserId(userId);

    public IQueryable<Booking> GetPendingByOwnerUserId(Guid userId)
        => repository.GetPendingByOwnerUserId(userId);

    public IQueryable<Booking> GetRequiringActionByUserId(Guid userId)
        => repository.GetRequiringActionByUserId(userId);

    public IQueryable<Review> GetReviewsByBookingId(Guid bookingId)
        => repository.GetReviewsByBookingId(bookingId);

    public IQueryable<Payment> GetPaymentsByBookingId(Guid bookingId)
        => repository.GetPaymentsByBookingId(bookingId);

    public IQueryable<Payout> GetPayoutsByBookingId(Guid bookingId)
        => repository.GetPayoutsByBookingId(bookingId);

    public async Task<Campaign?> GetCampaignByBookingIdAsync(Guid bookingId, CancellationToken ct)
        => await repository.GetCampaignByBookingIdAsync(bookingId, ct);

    public async Task<Space?> GetSpaceByBookingIdAsync(Guid bookingId, CancellationToken ct)
        => await repository.GetSpaceByBookingIdAsync(bookingId, ct);

    public async Task<Booking> CreateAsync(Guid userId, Guid campaignId, CreateBookingInput input, CancellationToken ct) {
        var ownedCampaignId = await repository.GetCampaignIdIfOwnedByUserAsync(campaignId, userId, ct)
            ?? throw new NotFoundException("Campaign", campaignId);

        var space = await repository.GetActiveSpaceInfoAsync(input.SpaceId, ct)
            ?? throw new NotFoundException("Space", input.SpaceId);

        if (input.StartDate.Date < DateTime.UtcNow.Date)
            throw new ValidationException("StartDate", "Start date cannot be in the past");

        var totalDays = (input.EndDate - input.StartDate).Days;
        if (totalDays <= 0)
            throw new ValidationException("EndDate", "End date must be after start date");

        if (totalDays < space.MinDuration)
            throw new ValidationException("Duration", $"Minimum duration is {space.MinDuration} days");

        if (await repository.HasOverlappingBookingsAsync(input.SpaceId, input.StartDate, input.EndDate, ct))
            throw new ConflictException("Booking", "Space already has bookings for the requested dates");

        var startDateOnly = DateOnly.FromDateTime(input.StartDate);
        var endDateOnly = DateOnly.FromDateTime(input.EndDate);

        if (await repository.HasBlockedDatesInRangeAsync(input.SpaceId, startDateOnly, endDateOnly, ct))
            throw new ConflictException("Booking", "Space has blocked dates in the requested range");

        var subtotal = space.PricePerDay * totalDays;
        var installationFee = space.InstallationFee ?? 0;
        var platformFee = subtotal * PlatformFeePercent;

        var booking = new Booking {
            CampaignId = ownedCampaignId,
            SpaceId = space.Id,
            StartDate = input.StartDate,
            EndDate = input.EndDate,
            TotalDays = totalDays,
            PricePerDay = space.PricePerDay,
            SubtotalAmount = subtotal,
            InstallationFee = installationFee,
            PlatformFeePercent = PlatformFeePercent,
            PlatformFeeAmount = platformFee,
            TotalAmount = subtotal + installationFee + platformFee,
            OwnerPayoutAmount = subtotal + installationFee,
            Status = BookingStatus.PendingApproval,
            AdvertiserNotes = input.AdvertiserNotes,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        return await repository.AddAsync(booking, ct);
    }

    public async Task<Booking> ApproveAsync(Guid userId, Guid id, string? ownerNotes, CancellationToken ct) {
        var booking = await repository.GetByIdWithRelationsAsync(id, ct)
            ?? throw new NotFoundException("Booking", id);

        if (booking.Space.SpaceOwnerProfile.UserId != userId)
            throw new ForbiddenException("approve this booking");

        if (booking.Status != BookingStatus.PendingApproval)
            throw new InvalidStatusTransitionException(booking.Status.ToString(), BookingStatus.Approved.ToString());

        booking.OwnerNotes = ownerNotes;
        return await repository.UpdateStatusAsync(booking, BookingStatus.Approved, ct);
    }

    public async Task<Booking> RejectAsync(Guid userId, Guid id, string reason, CancellationToken ct) {
        var booking = await repository.GetByIdWithRelationsAsync(id, ct)
            ?? throw new NotFoundException("Booking", id);

        if (booking.Space.SpaceOwnerProfile.UserId != userId)
            throw new ForbiddenException("reject this booking");

        if (booking.Status != BookingStatus.PendingApproval)
            throw new InvalidStatusTransitionException(booking.Status.ToString(), BookingStatus.Rejected.ToString());

        booking.RejectionReason = reason;
        booking.RejectedAt = DateTime.UtcNow;
        return await repository.UpdateStatusAsync(booking, BookingStatus.Rejected, ct);
    }

    public async Task<Booking> CancelAsync(Guid userId, Guid id, string reason, CancellationToken ct) {
        var booking = await repository.GetByIdWithRelationsAsync(id, ct)
            ?? throw new NotFoundException("Booking", id);

        var isAdvertiser = booking.Campaign.AdvertiserProfile.UserId == userId;
        var isOwner = booking.Space.SpaceOwnerProfile.UserId == userId;

        if (!isAdvertiser && !isOwner)
            throw new ForbiddenException("cancel this booking");

        var cancellableStatuses = new[] {
            BookingStatus.PendingApproval,
            BookingStatus.Approved,
            BookingStatus.Paid
        };

        if (!cancellableStatuses.Contains(booking.Status))
            throw new InvalidStatusTransitionException(booking.Status.ToString(), BookingStatus.Cancelled.ToString());

        booking.CancellationReason = reason;
        booking.CancelledAt = DateTime.UtcNow;
        booking.CancelledByUserId = userId;
        return await repository.UpdateStatusAsync(booking, BookingStatus.Cancelled, ct);
    }

    public async Task<Booking> MarkFileDownloadedAsync(Guid userId, Guid id, CancellationToken ct) {
        var booking = await repository.GetByIdWithRelationsAsync(id, ct)
            ?? throw new NotFoundException("Booking", id);

        if (booking.Space.SpaceOwnerProfile.UserId != userId)
            throw new ForbiddenException("mark this booking as file downloaded");

        if (booking.Status != BookingStatus.Paid)
            throw new InvalidStatusTransitionException(booking.Status.ToString(), BookingStatus.FileDownloaded.ToString());

        booking.FileDownloadedAt = DateTime.UtcNow;
        return await repository.UpdateStatusAsync(booking, BookingStatus.FileDownloaded, ct);
    }

    public async Task<Booking> MarkInstalledAsync(Guid userId, Guid id, CancellationToken ct) {
        var booking = await repository.GetByIdWithRelationsAsync(id, ct)
            ?? throw new NotFoundException("Booking", id);

        if (booking.Space.SpaceOwnerProfile.UserId != userId)
            throw new ForbiddenException("mark this booking as installed");

        if (booking.Status != BookingStatus.FileDownloaded)
            throw new InvalidStatusTransitionException(booking.Status.ToString(), BookingStatus.Installed.ToString());

        return await repository.UpdateStatusAsync(booking, BookingStatus.Installed, ct);
    }
}