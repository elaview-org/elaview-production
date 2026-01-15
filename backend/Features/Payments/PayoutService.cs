using System.Security.Claims;
using ElaviewBackend.Data;
using ElaviewBackend.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Stripe;
using EntityPayout = ElaviewBackend.Data.Entities.Payout;

namespace ElaviewBackend.Features.Payments;

public interface IPayoutService {
    Guid? GetCurrentUserIdOrNull();
    IQueryable<EntityPayout> GetMyPayoutsQuery();
    IQueryable<EntityPayout> GetPayoutByIdQuery(Guid id);
    Task<EntityPayout?> GetPayoutByIdAsync(Guid id, CancellationToken ct);
    Task<EarningsSummary> GetEarningsSummaryAsync(CancellationToken ct);
    Task<EntityPayout> ProcessPayoutAsync(Guid bookingId, PayoutStage stage, CancellationToken ct);
    Task<EntityPayout> RetryPayoutAsync(Guid payoutId, CancellationToken ct);
}

public sealed class PayoutService(
    IHttpContextAccessor httpContextAccessor,
    AppDbContext context,
    IPayoutRepository payoutRepository,
    ITransactionRepository transactionRepository
) : IPayoutService {
    private const decimal Stage1PayoutPercent = 0.30m;

    public Guid? GetCurrentUserIdOrNull() {
        var principalId = httpContextAccessor.HttpContext?.User.FindFirstValue(
            ClaimTypes.NameIdentifier
        );
        return principalId is null ? null : Guid.Parse(principalId);
    }

    private Guid GetCurrentUserId() =>
        GetCurrentUserIdOrNull() ?? throw new GraphQLException("Not authenticated");

    public IQueryable<EntityPayout> GetMyPayoutsQuery() {
        var userId = GetCurrentUserId();
        return context.Payouts.Where(p => p.SpaceOwnerProfile.UserId == userId);
    }

    public IQueryable<EntityPayout> GetPayoutByIdQuery(Guid id) =>
        context.Payouts.Where(p => p.Id == id);

    public async Task<EntityPayout?> GetPayoutByIdAsync(Guid id, CancellationToken ct) =>
        await payoutRepository.GetByIdAsync(id, ct);

    public async Task<EarningsSummary> GetEarningsSummaryAsync(CancellationToken ct) {
        var userId = GetCurrentUserId();
        var now = DateTime.UtcNow;
        var startOfMonth = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);
        var startOfLastMonth = startOfMonth.AddMonths(-1);

        var payouts = await context.Payouts
            .Where(p => p.SpaceOwnerProfile.UserId == userId)
            .ToListAsync(ct);

        var totalEarnings = payouts
            .Where(p => p.Status == PayoutStatus.Completed)
            .Sum(p => p.Amount);

        var pendingPayouts = payouts
            .Where(p => p.Status == PayoutStatus.Pending || p.Status == PayoutStatus.Processing)
            .Sum(p => p.Amount);

        var thisMonthEarnings = payouts
            .Where(p => p.Status == PayoutStatus.Completed && p.ProcessedAt >= startOfMonth)
            .Sum(p => p.Amount);

        var lastMonthEarnings = payouts
            .Where(p => p.Status == PayoutStatus.Completed &&
                        p.ProcessedAt >= startOfLastMonth &&
                        p.ProcessedAt < startOfMonth)
            .Sum(p => p.Amount);

        return new EarningsSummary(
            TotalEarnings: totalEarnings,
            PendingPayouts: pendingPayouts,
            AvailableBalance: totalEarnings,
            ThisMonthEarnings: thisMonthEarnings,
            LastMonthEarnings: lastMonthEarnings
        );
    }

    public async Task<EntityPayout> ProcessPayoutAsync(Guid bookingId, PayoutStage stage, CancellationToken ct) {
        var booking = await context.Bookings
            .Include(b => b.Space)
            .ThenInclude(s => s.SpaceOwnerProfile)
            .FirstOrDefaultAsync(b => b.Id == bookingId, ct)
            ?? throw new GraphQLException("Booking not found");

        var existingPayout = await context.Payouts
            .FirstOrDefaultAsync(p => p.BookingId == bookingId && p.Stage == stage, ct);

        if (existingPayout is not null)
            throw new GraphQLException($"Payout for {stage} already exists");

        var amount = stage == PayoutStage.Stage1
            ? booking.InstallationFee + (booking.SubtotalAmount * Stage1PayoutPercent)
            : booking.SubtotalAmount * (1 - Stage1PayoutPercent);

        var payout = new EntityPayout {
            BookingId = bookingId,
            SpaceOwnerProfileId = booking.Space.SpaceOwnerProfileId,
            Stage = stage,
            Amount = amount,
            Status = PayoutStatus.Pending,
            CreatedAt = DateTime.UtcNow
        };

        await payoutRepository.AddAsync(payout, ct);

        try {
            var ownerProfile = booking.Space.SpaceOwnerProfile;
            if (string.IsNullOrEmpty(ownerProfile.StripeAccountId))
                throw new GraphQLException("Space owner has not connected Stripe account");

            var options = new TransferCreateOptions {
                Amount = (long)(amount * 100),
                Currency = "usd",
                Destination = ownerProfile.StripeAccountId,
                Metadata = new Dictionary<string, string> {
                    ["booking_id"] = bookingId.ToString(),
                    ["payout_id"] = payout.Id.ToString(),
                    ["stage"] = stage.ToString()
                }
            };

            var service = new TransferService();
            var transfer = await service.CreateAsync(options, cancellationToken: ct);

            var entry = context.Entry(payout);
            entry.Property(p => p.StripeTransferId).CurrentValue = transfer.Id;
            entry.Property(p => p.Status).CurrentValue = PayoutStatus.Completed;
            entry.Property(p => p.ProcessedAt).CurrentValue = DateTime.UtcNow;
            entry.Property(p => p.AttemptCount).CurrentValue = 1;
            entry.Property(p => p.LastAttemptAt).CurrentValue = DateTime.UtcNow;

            await transactionRepository.AddAsync(new Transaction {
                BookingId = bookingId,
                Type = TransactionType.Payout,
                Amount = -amount,
                ReferenceType = "Payout",
                ReferenceId = payout.Id,
                Description = $"{stage} payout for booking {bookingId}",
                CreatedAt = DateTime.UtcNow
            }, ct);

            await context.SaveChangesAsync(ct);
        }
        catch (StripeException ex) {
            var entry = context.Entry(payout);
            entry.Property(p => p.Status).CurrentValue = PayoutStatus.Failed;
            entry.Property(p => p.FailureReason).CurrentValue = ex.Message;
            entry.Property(p => p.AttemptCount).CurrentValue = 1;
            entry.Property(p => p.LastAttemptAt).CurrentValue = DateTime.UtcNow;
            await context.SaveChangesAsync(ct);
            throw new GraphQLException($"Payout failed: {ex.Message}");
        }

        return payout;
    }

    public async Task<EntityPayout> RetryPayoutAsync(Guid payoutId, CancellationToken ct) {
        var payout = await payoutRepository.GetByIdAsync(payoutId, ct)
            ?? throw new GraphQLException("Payout not found");

        if (payout.Status != PayoutStatus.Failed)
            throw new GraphQLException("Only failed payouts can be retried");

        var booking = await context.Bookings
            .Include(b => b.Space)
            .ThenInclude(s => s.SpaceOwnerProfile)
            .FirstOrDefaultAsync(b => b.Id == payout.BookingId, ct)
            ?? throw new GraphQLException("Booking not found");

        try {
            var ownerProfile = booking.Space.SpaceOwnerProfile;
            if (string.IsNullOrEmpty(ownerProfile.StripeAccountId))
                throw new GraphQLException("Space owner has not connected Stripe account");

            var options = new TransferCreateOptions {
                Amount = (long)(payout.Amount * 100),
                Currency = "usd",
                Destination = ownerProfile.StripeAccountId,
                Metadata = new Dictionary<string, string> {
                    ["booking_id"] = payout.BookingId.ToString(),
                    ["payout_id"] = payout.Id.ToString(),
                    ["stage"] = payout.Stage.ToString(),
                    ["retry"] = "true"
                }
            };

            var service = new TransferService();
            var transfer = await service.CreateAsync(options, cancellationToken: ct);

            var entry = context.Entry(payout);
            entry.Property(p => p.StripeTransferId).CurrentValue = transfer.Id;
            entry.Property(p => p.Status).CurrentValue = PayoutStatus.Completed;
            entry.Property(p => p.ProcessedAt).CurrentValue = DateTime.UtcNow;
            entry.Property(p => p.FailureReason).CurrentValue = null;
            entry.Property(p => p.AttemptCount).CurrentValue = payout.AttemptCount + 1;
            entry.Property(p => p.LastAttemptAt).CurrentValue = DateTime.UtcNow;

            await transactionRepository.AddAsync(new Transaction {
                BookingId = payout.BookingId,
                Type = TransactionType.Payout,
                Amount = -payout.Amount,
                ReferenceType = "Payout",
                ReferenceId = payout.Id,
                Description = $"{payout.Stage} payout retry for booking {payout.BookingId}",
                CreatedAt = DateTime.UtcNow
            }, ct);

            await context.SaveChangesAsync(ct);
        }
        catch (StripeException ex) {
            var entry = context.Entry(payout);
            entry.Property(p => p.FailureReason).CurrentValue = ex.Message;
            entry.Property(p => p.AttemptCount).CurrentValue = payout.AttemptCount + 1;
            entry.Property(p => p.LastAttemptAt).CurrentValue = DateTime.UtcNow;
            await context.SaveChangesAsync(ct);
            throw new GraphQLException($"Payout retry failed: {ex.Message}");
        }

        return payout;
    }
}

public record EarningsSummary(
    decimal TotalEarnings,
    decimal PendingPayouts,
    decimal AvailableBalance,
    decimal ThisMonthEarnings,
    decimal LastMonthEarnings
);
