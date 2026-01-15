using System.Security.Claims;
using ElaviewBackend.Data;
using ElaviewBackend.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Stripe;

namespace ElaviewBackend.Features.Payments;

public interface IPaymentService {
    Guid? GetCurrentUserIdOrNull();
    IQueryable<Payment> GetPaymentByIdQuery(Guid id);
    IQueryable<Payment> GetPaymentsByBookingIdQuery(Guid bookingId);
    Task<Payment?> GetPaymentByIdAsync(Guid id, CancellationToken ct);
    Task<PaymentIntentResult> CreatePaymentIntentAsync(Guid bookingId, CancellationToken ct);
    Task<Payment> ConfirmPaymentAsync(string paymentIntentId, CancellationToken ct);
}

public sealed class PaymentService(
    IHttpContextAccessor httpContextAccessor,
    AppDbContext context,
    IPaymentRepository paymentRepository,
    ITransactionRepository transactionRepository
) : IPaymentService {
    public Guid? GetCurrentUserIdOrNull() {
        var principalId = httpContextAccessor.HttpContext?.User.FindFirstValue(
            ClaimTypes.NameIdentifier
        );
        return principalId is null ? null : Guid.Parse(principalId);
    }

    private Guid GetCurrentUserId() =>
        GetCurrentUserIdOrNull() ?? throw new GraphQLException("Not authenticated");

    public IQueryable<Payment> GetPaymentByIdQuery(Guid id) =>
        context.Payments.Where(p => p.Id == id);

    public IQueryable<Payment> GetPaymentsByBookingIdQuery(Guid bookingId) =>
        context.Payments.Where(p => p.BookingId == bookingId);

    public async Task<Payment?> GetPaymentByIdAsync(Guid id, CancellationToken ct) =>
        await paymentRepository.GetByIdAsync(id, ct);

    public async Task<PaymentIntentResult> CreatePaymentIntentAsync(Guid bookingId, CancellationToken ct) {
        var userId = GetCurrentUserId();

        var booking = await context.Bookings
            .Include(b => b.Campaign)
            .ThenInclude(c => c.AdvertiserProfile)
            .FirstOrDefaultAsync(b => b.Id == bookingId && b.Campaign.AdvertiserProfile.UserId == userId, ct)
            ?? throw new GraphQLException("Booking not found");

        if (booking.Status != BookingStatus.Approved)
            throw new GraphQLException("Booking must be approved before payment");

        var existingPayment = await context.Payments
            .FirstOrDefaultAsync(p => p.BookingId == bookingId && p.Status == PaymentStatus.Pending, ct);

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

        await paymentRepository.AddAsync(payment, ct);

        return new PaymentIntentResult(
            paymentIntent.ClientSecret,
            paymentIntent.Id,
            booking.TotalAmount
        );
    }

    public async Task<Payment> ConfirmPaymentAsync(string paymentIntentId, CancellationToken ct) {
        var payment = await paymentRepository.GetByStripePaymentIntentIdAsync(paymentIntentId, ct)
            ?? throw new GraphQLException("Payment not found");

        if (payment.Status == PaymentStatus.Succeeded)
            return payment;

        var service = new PaymentIntentService();
        var paymentIntent = await service.GetAsync(paymentIntentId, cancellationToken: ct);

        if (paymentIntent.Status != "succeeded")
            throw new GraphQLException("Payment has not succeeded");

        var entry = context.Entry(payment);
        entry.Property(p => p.Status).CurrentValue = PaymentStatus.Succeeded;
        entry.Property(p => p.StripeChargeId).CurrentValue = paymentIntent.LatestChargeId;
        entry.Property(p => p.PaidAt).CurrentValue = DateTime.UtcNow;

        var booking = await context.Bookings.FindAsync([payment.BookingId], ct);
        if (booking is not null) {
            var bookingEntry = context.Entry(booking);
            bookingEntry.Property(b => b.Status).CurrentValue = BookingStatus.Paid;
            bookingEntry.Property(b => b.UpdatedAt).CurrentValue = DateTime.UtcNow;
        }

        await transactionRepository.AddAsync(new Transaction {
            BookingId = payment.BookingId,
            Type = TransactionType.Payment,
            Amount = payment.Amount,
            ReferenceType = "Payment",
            ReferenceId = payment.Id,
            Description = $"Payment for booking {payment.BookingId}",
            CreatedAt = DateTime.UtcNow
        }, ct);

        await context.SaveChangesAsync(ct);
        return payment;
    }
}

public record PaymentIntentResult(
    string ClientSecret,
    string PaymentIntentId,
    decimal Amount
);
