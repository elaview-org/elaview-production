using ElaviewBackend.Data.Entities;
using ElaviewBackend.Features.Shared.Errors;
using Stripe;
using EntityRefund = ElaviewBackend.Data.Entities.Refund;
using StripeRefundService = Stripe.RefundService;

namespace ElaviewBackend.Features.Payments;

public interface IRefundService {
    IQueryable<EntityRefund> GetByPaymentId(Guid paymentId);
    Task<IReadOnlyList<EntityRefund>> GetByPaymentIdAsync(Guid paymentId, CancellationToken ct);
    Task<EntityRefund> RequestRefundAsync(Guid paymentId, decimal amount, string reason, CancellationToken ct);
}

public sealed class RefundService(
    IPaymentRepository paymentRepository,
    IRefundRepository refundRepository,
    ITransactionRepository transactionRepository
) : IRefundService {
    public IQueryable<EntityRefund> GetByPaymentId(Guid paymentId)
        => refundRepository.GetByPaymentId(paymentId);

    public async Task<IReadOnlyList<EntityRefund>> GetByPaymentIdAsync(Guid paymentId, CancellationToken ct)
        => await refundRepository.GetByPaymentIdAsync(paymentId, ct);

    public async Task<EntityRefund> RequestRefundAsync(
        Guid paymentId, decimal amount, string reason, CancellationToken ct
    ) {
        var payment = await paymentRepository.GetByIdAsync(paymentId, ct)
            ?? throw new NotFoundException("Payment", paymentId);

        if (payment.Status != PaymentStatus.Succeeded)
            throw new InvalidStatusTransitionException(payment.Status.ToString(), "Refund");

        var existingRefundsSum = await refundRepository.GetSucceededRefundsSumByPaymentIdAsync(paymentId, ct);

        if (existingRefundsSum + amount > payment.Amount)
            throw new ValidationException("Amount", "Refund amount exceeds available amount");

        var options = new RefundCreateOptions {
            PaymentIntent = payment.StripePaymentIntentId,
            Amount = (long)(amount * 100),
            Reason = RefundReasons.RequestedByCustomer
        };

        StripeRefundService service = new();
        Stripe.Refund stripeRefund;
        try {
            stripeRefund = await service.CreateAsync(options, cancellationToken: ct);
        }
        catch (StripeException ex) {
            throw new PaymentException("refund", ex.Message);
        }

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

            var totalRefunded = existingRefundsSum + amount;
            var newStatus = totalRefunded >= payment.Amount
                ? PaymentStatus.Refunded
                : PaymentStatus.PartiallyRefunded;

            await paymentRepository.UpdateRefundStatusAsync(payment, newStatus, ct);
        }

        return refund;
    }
}