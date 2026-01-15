using System.Security.Claims;
using ElaviewBackend.Data;
using ElaviewBackend.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace ElaviewBackend.Features.Marketplace;

public interface IBookingService {
    Guid? GetCurrentUserIdOrNull();
    IQueryable<Booking> GetBookingByIdQuery(Guid id);
    IQueryable<Booking> GetMyBookingsAsAdvertiserQuery();
    IQueryable<Booking> GetMyBookingsAsOwnerQuery();
    IQueryable<Booking> GetIncomingBookingRequestsQuery();
    IQueryable<Booking> GetBookingsRequiringActionQuery();
    Task<Booking?> GetBookingByIdAsync(Guid id, CancellationToken ct);
    Task<Booking> CreateAsync(Guid campaignId, CreateBookingInput input, CancellationToken ct);
    Task<Booking> ApproveAsync(Guid id, string? ownerNotes, CancellationToken ct);
    Task<Booking> RejectAsync(Guid id, string reason, CancellationToken ct);
    Task<Booking> CancelAsync(Guid id, string reason, CancellationToken ct);
    Task<Booking> MarkFileDownloadedAsync(Guid id, CancellationToken ct);
    Task<Booking> MarkInstalledAsync(Guid id, CancellationToken ct);
    Task<Campaign?> GetCampaignByBookingIdAsync(Guid bookingId, CancellationToken ct);
    Task<Space?> GetSpaceByBookingIdAsync(Guid bookingId, CancellationToken ct);
    IQueryable<Review> GetReviewsByBookingId(Guid bookingId);
    IQueryable<Payment> GetPaymentsByBookingId(Guid bookingId);
    IQueryable<Payout> GetPayoutsByBookingId(Guid bookingId);
}

public sealed class BookingService(
    IHttpContextAccessor httpContextAccessor,
    AppDbContext context,
    IBookingRepository bookingRepository
) : IBookingService {
    private const decimal PlatformFeePercent = 0.10m;

    public Guid? GetCurrentUserIdOrNull() {
        var principalId = httpContextAccessor.HttpContext?.User.FindFirstValue(
            ClaimTypes.NameIdentifier
        );
        return principalId is null ? null : Guid.Parse(principalId);
    }

    private Guid GetCurrentUserId() =>
        GetCurrentUserIdOrNull() ?? throw new GraphQLException("Not authenticated");

    public IQueryable<Booking> GetBookingByIdQuery(Guid id) =>
        context.Bookings.Where(b => b.Id == id);

    public IQueryable<Booking> GetMyBookingsAsAdvertiserQuery() {
        var userId = GetCurrentUserId();
        return context.Bookings.Where(b => b.Campaign.AdvertiserProfile.UserId == userId);
    }

    public IQueryable<Booking> GetMyBookingsAsOwnerQuery() {
        var userId = GetCurrentUserId();
        return context.Bookings.Where(b => b.Space.SpaceOwnerProfile.UserId == userId);
    }

    public IQueryable<Booking> GetIncomingBookingRequestsQuery() {
        var userId = GetCurrentUserId();
        return context.Bookings.Where(b =>
            b.Space.SpaceOwnerProfile.UserId == userId &&
            b.Status == BookingStatus.PendingApproval);
    }

    public IQueryable<Booking> GetBookingsRequiringActionQuery() {
        var userId = GetCurrentUserId();
        return context.Bookings.Where(b =>
            (b.Campaign.AdvertiserProfile.UserId == userId &&
             b.Status == BookingStatus.Verified) ||
            (b.Space.SpaceOwnerProfile.UserId == userId &&
             (b.Status == BookingStatus.PendingApproval ||
              b.Status == BookingStatus.Paid ||
              b.Status == BookingStatus.FileDownloaded ||
              b.Status == BookingStatus.Installed)));
    }

    public async Task<Booking?> GetBookingByIdAsync(Guid id, CancellationToken ct) =>
        await bookingRepository.GetByIdAsync(id, ct);

    public async Task<Booking> CreateAsync(Guid campaignId, CreateBookingInput input, CancellationToken ct) {
        var userId = GetCurrentUserId();

        var campaign = await context.Campaigns
            .Where(c => c.Id == campaignId && c.AdvertiserProfile.UserId == userId)
            .Select(c => new { c.Id })
            .FirstOrDefaultAsync(ct)
            ?? throw new GraphQLException("Campaign not found");

        var space = await context.Spaces
            .Where(s => s.Id == input.SpaceId && s.Status == SpaceStatus.Active)
            .Select(s => new { s.Id, s.PricePerDay, s.InstallationFee })
            .FirstOrDefaultAsync(ct)
            ?? throw new GraphQLException("Space not found or not available");

        var totalDays = (input.EndDate - input.StartDate).Days;
        if (totalDays <= 0)
            throw new GraphQLException("End date must be after start date");

        var subtotal = space.PricePerDay * totalDays;
        var installationFee = space.InstallationFee ?? 0;
        var platformFee = subtotal * PlatformFeePercent;

        var booking = new Booking {
            CampaignId = campaign.Id,
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

        context.Bookings.Add(booking);
        await context.SaveChangesAsync(ct);
        return booking;
    }

    public async Task<Booking> ApproveAsync(Guid id, string? ownerNotes, CancellationToken ct) {
        var userId = GetCurrentUserId();
        var booking = await context.Bookings
            .FirstOrDefaultAsync(b => b.Id == id && b.Space.SpaceOwnerProfile.UserId == userId, ct)
            ?? throw new GraphQLException("Booking not found");

        if (booking.Status != BookingStatus.PendingApproval)
            throw new GraphQLException("Only pending bookings can be approved");

        var entry = context.Entry(booking);
        entry.Property(b => b.Status).CurrentValue = BookingStatus.Approved;
        entry.Property(b => b.OwnerNotes).CurrentValue = ownerNotes;
        entry.Property(b => b.UpdatedAt).CurrentValue = DateTime.UtcNow;

        await context.SaveChangesAsync(ct);
        return booking;
    }

    public async Task<Booking> RejectAsync(Guid id, string reason, CancellationToken ct) {
        var userId = GetCurrentUserId();
        var booking = await context.Bookings
            .FirstOrDefaultAsync(b => b.Id == id && b.Space.SpaceOwnerProfile.UserId == userId, ct)
            ?? throw new GraphQLException("Booking not found");

        if (booking.Status != BookingStatus.PendingApproval)
            throw new GraphQLException("Only pending bookings can be rejected");

        var entry = context.Entry(booking);
        entry.Property(b => b.Status).CurrentValue = BookingStatus.Rejected;
        entry.Property(b => b.RejectionReason).CurrentValue = reason;
        entry.Property(b => b.RejectedAt).CurrentValue = DateTime.UtcNow;
        entry.Property(b => b.UpdatedAt).CurrentValue = DateTime.UtcNow;

        await context.SaveChangesAsync(ct);
        return booking;
    }

    public async Task<Booking> CancelAsync(Guid id, string reason, CancellationToken ct) {
        var userId = GetCurrentUserId();
        var booking = await context.Bookings
            .FirstOrDefaultAsync(b => b.Id == id &&
                (b.Campaign.AdvertiserProfile.UserId == userId ||
                 b.Space.SpaceOwnerProfile.UserId == userId), ct)
            ?? throw new GraphQLException("Booking not found");

        var cancellableStatuses = new[] {
            BookingStatus.PendingApproval,
            BookingStatus.Approved,
            BookingStatus.Paid
        };

        if (!cancellableStatuses.Contains(booking.Status))
            throw new GraphQLException("Booking cannot be cancelled in current status");

        var entry = context.Entry(booking);
        entry.Property(b => b.Status).CurrentValue = BookingStatus.Cancelled;
        entry.Property(b => b.CancellationReason).CurrentValue = reason;
        entry.Property(b => b.CancelledAt).CurrentValue = DateTime.UtcNow;
        entry.Property(b => b.CancelledByUserId).CurrentValue = userId;
        entry.Property(b => b.UpdatedAt).CurrentValue = DateTime.UtcNow;

        await context.SaveChangesAsync(ct);
        return booking;
    }

    public async Task<Booking> MarkFileDownloadedAsync(Guid id, CancellationToken ct) {
        var userId = GetCurrentUserId();
        var booking = await context.Bookings
            .FirstOrDefaultAsync(b => b.Id == id && b.Space.SpaceOwnerProfile.UserId == userId, ct)
            ?? throw new GraphQLException("Booking not found");

        if (booking.Status != BookingStatus.Paid)
            throw new GraphQLException("Only paid bookings can be marked as file downloaded");

        var entry = context.Entry(booking);
        entry.Property(b => b.Status).CurrentValue = BookingStatus.FileDownloaded;
        entry.Property(b => b.FileDownloadedAt).CurrentValue = DateTime.UtcNow;
        entry.Property(b => b.UpdatedAt).CurrentValue = DateTime.UtcNow;

        await context.SaveChangesAsync(ct);
        return booking;
    }

    public async Task<Booking> MarkInstalledAsync(Guid id, CancellationToken ct) {
        var userId = GetCurrentUserId();
        var booking = await context.Bookings
            .FirstOrDefaultAsync(b => b.Id == id && b.Space.SpaceOwnerProfile.UserId == userId, ct)
            ?? throw new GraphQLException("Booking not found");

        if (booking.Status != BookingStatus.FileDownloaded)
            throw new GraphQLException("Only file downloaded bookings can be marked as installed");

        var entry = context.Entry(booking);
        entry.Property(b => b.Status).CurrentValue = BookingStatus.Installed;
        entry.Property(b => b.UpdatedAt).CurrentValue = DateTime.UtcNow;

        await context.SaveChangesAsync(ct);
        return booking;
    }

    public async Task<Campaign?> GetCampaignByBookingIdAsync(Guid bookingId, CancellationToken ct) =>
        await bookingRepository.GetCampaignByBookingIdAsync(bookingId, ct);

    public async Task<Space?> GetSpaceByBookingIdAsync(Guid bookingId, CancellationToken ct) =>
        await bookingRepository.GetSpaceByBookingIdAsync(bookingId, ct);

    public IQueryable<Review> GetReviewsByBookingId(Guid bookingId) =>
        context.Reviews.Where(r => r.BookingId == bookingId);

    public IQueryable<Payment> GetPaymentsByBookingId(Guid bookingId) =>
        context.Payments.Where(p => p.BookingId == bookingId);

    public IQueryable<Payout> GetPayoutsByBookingId(Guid bookingId) =>
        context.Payouts.Where(p => p.BookingId == bookingId);
}