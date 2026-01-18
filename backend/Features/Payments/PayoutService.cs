using ElaviewBackend.Data.Entities;
using ElaviewBackend.Features.Shared.Errors;
using Stripe;
using EntityPayout = ElaviewBackend.Data.Entities.Payout;

namespace ElaviewBackend.Features.Payments;

public interface IPayoutService {
    IQueryable<EntityPayout> GetByUserId(Guid userId);
    IQueryable<EntityPayout> GetById(Guid id);
    Task<EntityPayout?> GetByIdAsync(Guid id, CancellationToken ct);
    Task<EarningsSummary> GetEarningsSummaryAsync(Guid userId, CancellationToken ct);
    Task<EntityPayout> ProcessPayoutAsync(Guid bookingId, PayoutStage stage, CancellationToken ct);
    Task<EntityPayout> RetryPayoutAsync(Guid payoutId, CancellationToken ct);
}

public sealed class PayoutService(
    IPayoutRepository repository,
    ITransactionRepository transactionRepository
) : IPayoutService {
    private const decimal Stage1PayoutPercent = 0.30m;

    public IQueryable<EntityPayout> GetByUserId(Guid userId)
        => repository.GetByUserId(userId);

    public IQueryable<EntityPayout> GetById(Guid id)
        => repository.GetById(id);

    public async Task<EntityPayout?> GetByIdAsync(Guid id, CancellationToken ct)
        => await repository.GetByIdAsync(id, ct);

    public async Task<EarningsSummary> GetEarningsSummaryAsync(Guid userId, CancellationToken ct) {
        var now = DateTime.UtcNow;
        var startOfMonth = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);
        var startOfLastMonth = startOfMonth.AddMonths(-1);

        var payouts = await repository.GetByUserIdAsync(userId, ct);

        var totalEarnings = payouts
            .Where(p => p.Status == PayoutStatus.Completed)
            .Sum(p => p.Amount);

        var pendingPayouts = payouts
            .Where(p => p.Status is PayoutStatus.Pending or PayoutStatus.Processing)
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
            totalEarnings,
            pendingPayouts,
            totalEarnings,
            thisMonthEarnings,
            lastMonthEarnings
        );
    }

    public async Task<EntityPayout> ProcessPayoutAsync(
        Guid bookingId, PayoutStage stage, CancellationToken ct
    ) {
        var booking = await repository.GetBookingInfoForPayoutAsync(bookingId, ct)
            ?? throw new NotFoundException("Booking", bookingId);

        var existingPayout = await repository.GetByBookingIdAndStageAsync(bookingId, stage, ct);
        if (existingPayout is not null)
            throw new ConflictException("Payout", $"Payout for {stage} already exists");

        if (string.IsNullOrEmpty(booking.StripeAccountId))
            throw new PaymentException("payout", "Space owner has not connected Stripe account");

        var amount = stage == PayoutStage.Stage1
            ? booking.InstallationFee + booking.SubtotalAmount * Stage1PayoutPercent
            : booking.SubtotalAmount * (1 - Stage1PayoutPercent);

        var payout = new EntityPayout {
            BookingId = bookingId,
            SpaceOwnerProfileId = booking.SpaceOwnerProfileId,
            Stage = stage,
            Amount = amount,
            Status = PayoutStatus.Pending,
            CreatedAt = DateTime.UtcNow
        };

        await repository.AddAsync(payout, ct);

        try {
            var options = new TransferCreateOptions {
                Amount = (long)(amount * 100),
                Currency = "usd",
                Destination = booking.StripeAccountId,
                Metadata = new Dictionary<string, string> {
                    ["booking_id"] = bookingId.ToString(),
                    ["payout_id"] = payout.Id.ToString(),
                    ["stage"] = stage.ToString()
                }
            };

            var service = new TransferService();
            var transfer = await service.CreateAsync(options, cancellationToken: ct);

            await repository.UpdateStatusCompletedAsync(payout, transfer.Id, ct);

            await transactionRepository.AddAsync(new Transaction {
                BookingId = bookingId,
                Type = TransactionType.Payout,
                Amount = -amount,
                ReferenceType = "Payout",
                ReferenceId = payout.Id,
                Description = $"{stage} payout for booking {bookingId}",
                CreatedAt = DateTime.UtcNow
            }, ct);
        }
        catch (StripeException ex) {
            await repository.UpdateStatusFailedAsync(payout, ex.Message, ct);
            throw new PaymentException("payout", ex.Message);
        }

        return payout;
    }

    public async Task<EntityPayout> RetryPayoutAsync(Guid payoutId, CancellationToken ct) {
        var payout = await repository.GetByIdAsync(payoutId, ct)
            ?? throw new NotFoundException("Payout", payoutId);

        if (payout.Status != PayoutStatus.Failed)
            throw new InvalidStatusTransitionException(payout.Status.ToString(), "retry");

        var booking = await repository.GetBookingInfoForPayoutAsync(payout.BookingId, ct)
            ?? throw new NotFoundException("Booking", payout.BookingId);

        if (string.IsNullOrEmpty(booking.StripeAccountId))
            throw new PaymentException("payout retry", "Space owner has not connected Stripe account");

        try {
            var options = new TransferCreateOptions {
                Amount = (long)(payout.Amount * 100),
                Currency = "usd",
                Destination = booking.StripeAccountId,
                Metadata = new Dictionary<string, string> {
                    ["booking_id"] = payout.BookingId.ToString(),
                    ["payout_id"] = payout.Id.ToString(),
                    ["stage"] = payout.Stage.ToString(),
                    ["retry"] = "true"
                }
            };

            var service = new TransferService();
            var transfer = await service.CreateAsync(options, cancellationToken: ct);

            await repository.UpdateStatusCompletedAsync(payout, transfer.Id, ct);

            await transactionRepository.AddAsync(new Transaction {
                BookingId = payout.BookingId,
                Type = TransactionType.Payout,
                Amount = -payout.Amount,
                ReferenceType = "Payout",
                ReferenceId = payout.Id,
                Description = $"{payout.Stage} payout retry for booking {payout.BookingId}",
                CreatedAt = DateTime.UtcNow
            }, ct);
        }
        catch (StripeException ex) {
            await repository.UpdateStatusFailedAsync(payout, ex.Message, ct);
            throw new PaymentException("payout retry", ex.Message);
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