using ElaviewBackend.Data.Entities;
using ElaviewBackend.Features.Shared.Errors;
using Stripe;

namespace ElaviewBackend.Features.Payments;

public interface IPaymentService {
    IQueryable<Payment> GetById(Guid id);
    IQueryable<Payment> GetByBookingId(Guid bookingId);
    Task<Payment?> GetByIdAsync(Guid id, CancellationToken ct);
    Task<PaymentIntentResult> CreatePaymentIntentAsync(Guid userId, Guid bookingId, CancellationToken ct);
    Task<Payment> ConfirmPaymentAsync(string paymentIntentId, CancellationToken ct);
}

public sealed class PaymentService(
    IPaymentRepository repository,
    ITransactionRepository transactionRepository
) : IPaymentService {
    public IQueryable<Payment> GetById(Guid id)
        => repository.GetById(id);

    public IQueryable<Payment> GetByBookingId(Guid bookingId)
        => repository.GetByBookingId(bookingId);

    public async Task<Payment?> GetByIdAsync(Guid id, CancellationToken ct)
        => await repository.GetByIdAsync(id, ct);

    public async Task<PaymentIntentResult> CreatePaymentIntentAsync(Guid userId, Guid bookingId, CancellationToken ct) {
        var booking = await repository.GetBookingInfoByIdAsync(bookingId, ct)
            ?? throw new NotFoundException("Booking", bookingId);

        if (booking.AdvertiserUserId != userId)
            throw new ForbiddenException("create payment for this booking");

        if (booking.Status != BookingStatus.Approved)
            throw new InvalidStatusTransitionException(booking.Status.ToString(), "Payment");

        var existingPayment = await repository.GetPendingByBookingIdAsync(bookingId, ct);
        if (existingPayment is not null)
            return new PaymentIntentResult(
                existingPayment.StripePaymentIntentId,
                existingPayment.StripePaymentIntentId,
                existingPayment.Amount
            );

        var options = new PaymentIntentCreateOptions {
            Amount = (long)(booking.TotalAmount * 100),
            Currency = "usd",
            Metadata = new Dictionary<string, string> {
                ["booking_id"] = bookingId.ToString(),
                ["user_id"] = userId.ToString()
            }
        };

        var service = new PaymentIntentService();
        var paymentIntent = await service.CreateAsync(options, cancellationToken: ct);

        var payment = new Payment {
            BookingId = bookingId,
            Type = PaymentType.Full,
            Amount = booking.TotalAmount,
            StripePaymentIntentId = paymentIntent.Id,
            Status = PaymentStatus.Pending,
            CreatedAt = DateTime.UtcNow
        };

        await repository.AddAsync(payment, ct);

        return new PaymentIntentResult(
            paymentIntent.ClientSecret,
            paymentIntent.Id,
            booking.TotalAmount
        );
    }

    public async Task<Payment> ConfirmPaymentAsync(string paymentIntentId, CancellationToken ct) {
        var payment = await repository.GetByStripePaymentIntentIdAsync(paymentIntentId, ct)
            ?? throw new NotFoundException("Payment", Guid.Empty);

        if (payment.Status == PaymentStatus.Succeeded)
            return payment;

        var service = new PaymentIntentService();
        var paymentIntent = await service.GetAsync(paymentIntentId, cancellationToken: ct);

        if (paymentIntent.Status != "succeeded")
            throw new PaymentException("confirmation", "Payment has not succeeded");

        await repository.UpdateStatusAsync(payment, PaymentStatus.Succeeded, paymentIntent.LatestChargeId, ct);
        await repository.UpdateBookingToPaidAsync(payment.BookingId, ct);

        await transactionRepository.AddAsync(new Transaction {
            BookingId = payment.BookingId,
            Type = TransactionType.Payment,
            Amount = payment.Amount,
            ReferenceType = "Payment",
            ReferenceId = payment.Id,
            Description = $"Payment for booking {payment.BookingId}",
            CreatedAt = DateTime.UtcNow
        }, ct);

        return payment;
    }
}

public record PaymentIntentResult(
    string ClientSecret,
    string PaymentIntentId,
    decimal Amount
);