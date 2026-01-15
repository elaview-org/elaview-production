using ElaviewBackend.Data;
using ElaviewBackend.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Stripe;
using EntityRefund = ElaviewBackend.Data.Entities.Refund;
using StripeRefundService = Stripe.RefundService;

namespace ElaviewBackend.Features.Payments;

public interface IRefundService {
    IQueryable<EntityRefund> GetRefundsByPaymentIdQuery(Guid paymentId);
    Task<IReadOnlyList<EntityRefund>> GetRefundsByPaymentIdAsync(Guid paymentId, CancellationToken ct);
    Task<EntityRefund> RequestRefundAsync(Guid paymentId, decimal amount, string reason, CancellationToken ct);
}

public sealed class RefundService(
    AppDbContext context,
    IPaymentRepository paymentRepository,
    IRefundRepository refundRepository,
    ITransactionRepository transactionRepository
) : IRefundService {
    public IQueryable<EntityRefund> GetRefundsByPaymentIdQuery(Guid paymentId) =>
        context.Refunds.Where(r => r.PaymentId == paymentId);

    public async Task<IReadOnlyList<EntityRefund>> GetRefundsByPaymentIdAsync(Guid paymentId, CancellationToken ct) =>
        await refundRepository.GetByPaymentIdAsync(paymentId, ct);

    public async Task<EntityRefund> RequestRefundAsync(Guid paymentId, decimal amount, string reason, CancellationToken ct) {
        var payment = await paymentRepository.GetByIdAsync(paymentId, ct)
            ?? throw new GraphQLException("Payment not found");

        if (payment.Status != PaymentStatus.Succeeded)
            throw new GraphQLException("Can only refund succeeded payments");

        var existingRefunds = await context.Refunds
            .Where(r => r.PaymentId == paymentId && r.Status == RefundStatus.Succeeded)
            .SumAsync(r => r.Amount, ct);

        if (existingRefunds + amount > payment.Amount)
            throw new GraphQLException("Refund amount exceeds available amount");

        var options = new RefundCreateOptions {
            PaymentIntent = payment.StripePaymentIntentId,
            Amount = (long)(amount * 100),
            Reason = RefundReasons.RequestedByCustomer
        };

        var service = new StripeRefundService();
        var stripeRefund = await service.CreateAsync(options, cancellationToken: ct);

        var refund = new EntityRefund {
            PaymentId = paymentId,
            BookingId = payment.BookingId,
            Amount = amount,
            Reason = reason,
            StripeRefundId = stripeRefund.Id,
            Status = stripeRefund.Status == "succeeded" ? RefundStatus.Succeeded : RefundStatus.Pending,
            ProcessedAt = stripeRefund.Status == "succeeded" ? DateTime.UtcNow : null,
            CreatedAt = DateTime.UtcNow
        };

        await refundRepository.AddAsync(refund, ct);

        if (refund.Status == RefundStatus.Succeeded) {
            await transactionRepository.AddAsync(new Transaction {
                BookingId = payment.BookingId,
                Type = TransactionType.Refund,
                Amount = -amount,
                ReferenceType = "Refund",
                ReferenceId = refund.Id,
                Description = $"Refund for payment {paymentId}: {reason}",
                CreatedAt = DateTime.UtcNow
            }, ct);

            var totalRefunded = existingRefunds + amount;
            var paymentEntry = context.Entry(payment);
            paymentEntry.Property(p => p.Status).CurrentValue =
                totalRefunded >= payment.Amount ? PaymentStatus.Refunded : PaymentStatus.PartiallyRefunded;

            await context.SaveChangesAsync(ct);
        }

        return refund;
    }
}
