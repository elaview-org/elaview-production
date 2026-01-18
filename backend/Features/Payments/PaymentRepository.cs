using ElaviewBackend.Data;
using ElaviewBackend.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace ElaviewBackend.Features.Payments;

public interface IPaymentRepository {
    IQueryable<Payment> GetById(Guid id);
    IQueryable<Payment> GetByBookingId(Guid bookingId);
    Task<Payment?> GetByIdAsync(Guid id, CancellationToken ct);
    Task<Payment?> GetByStripePaymentIntentIdAsync(string paymentIntentId, CancellationToken ct);
    Task<Payment?> GetPendingByBookingIdAsync(Guid bookingId, CancellationToken ct);
    Task<BookingPaymentInfo?> GetBookingInfoForPaymentAsync(Guid bookingId, Guid userId, CancellationToken ct);
    Task<Payment> AddAsync(Payment payment, CancellationToken ct);
    Task<Payment> UpdateStatusAsync(Payment payment, PaymentStatus status, string? chargeId, CancellationToken ct);
    Task<Payment> UpdateRefundStatusAsync(Payment payment, PaymentStatus status, CancellationToken ct);
    Task UpdateBookingToPaidAsync(Guid bookingId, CancellationToken ct);
    Task SaveChangesAsync(CancellationToken ct);
}

public record BookingPaymentInfo(
    Guid Id,
    BookingStatus Status,
    decimal TotalAmount
);

public sealed class PaymentRepository(
    AppDbContext context,
    IPaymentByIdDataLoader paymentById
) : IPaymentRepository {
    public IQueryable<Payment> GetById(Guid id)
        => context.Payments.Where(p => p.Id == id);

    public IQueryable<Payment> GetByBookingId(Guid bookingId)
        => context.Payments.Where(p => p.BookingId == bookingId);

    public async Task<Payment?> GetByIdAsync(Guid id, CancellationToken ct)
        => await paymentById.LoadAsync(id, ct);

    public async Task<Payment?> GetByStripePaymentIntentIdAsync(string paymentIntentId, CancellationToken ct)
        => await context.Payments.FirstOrDefaultAsync(p => p.StripePaymentIntentId == paymentIntentId, ct);

    public async Task<Payment?> GetPendingByBookingIdAsync(Guid bookingId, CancellationToken ct)
        => await context.Payments.FirstOrDefaultAsync(p => p.BookingId == bookingId && p.Status == PaymentStatus.Pending, ct);

    public async Task<BookingPaymentInfo?> GetBookingInfoForPaymentAsync(Guid bookingId, Guid userId, CancellationToken ct)
        => await context.Bookings
            .Where(b => b.Id == bookingId && b.Campaign.AdvertiserProfile.UserId == userId)
            .Select(b => new BookingPaymentInfo(b.Id, b.Status, b.TotalAmount))
            .FirstOrDefaultAsync(ct);

    public async Task<Payment> AddAsync(Payment payment, CancellationToken ct) {
        context.Payments.Add(payment);
        await context.SaveChangesAsync(ct);
        return payment;
    }

    public async Task<Payment> UpdateStatusAsync(Payment payment, PaymentStatus status, string? chargeId, CancellationToken ct) {
        var entry = context.Entry(payment);
        entry.Property(p => p.Status).CurrentValue = status;
        if (chargeId is not null)
            entry.Property(p => p.StripeChargeId).CurrentValue = chargeId;
        entry.Property(p => p.PaidAt).CurrentValue = DateTime.UtcNow;
        await context.SaveChangesAsync(ct);
        return payment;
    }

    public async Task<Payment> UpdateRefundStatusAsync(Payment payment, PaymentStatus status, CancellationToken ct) {
        var entry = context.Entry(payment);
        entry.Property(p => p.Status).CurrentValue = status;
        await context.SaveChangesAsync(ct);
        return payment;
    }

    public async Task UpdateBookingToPaidAsync(Guid bookingId, CancellationToken ct) {
        var booking = await context.Bookings.FindAsync([bookingId], ct);
        if (booking is not null) {
            var entry = context.Entry(booking);
            entry.Property(b => b.Status).CurrentValue = BookingStatus.Paid;
            entry.Property(b => b.UpdatedAt).CurrentValue = DateTime.UtcNow;
            await context.SaveChangesAsync(ct);
        }
    }

    public async Task SaveChangesAsync(CancellationToken ct)
        => await context.SaveChangesAsync(ct);
}

internal static class PaymentDataLoaders {
    [DataLoader]
    public static async Task<IReadOnlyDictionary<Guid, Payment>> GetPaymentById(
        IReadOnlyList<Guid> ids, AppDbContext context, CancellationToken ct
    ) {
        return await context.Payments
            .Where(p => ids.Contains(p.Id))
            .ToDictionaryAsync(p => p.Id, ct);
    }

    [DataLoader]
    public static async Task<ILookup<Guid, Payment>> GetPaymentsByBookingId(
        IReadOnlyList<Guid> bookingIds, AppDbContext context,
        CancellationToken ct
    ) {
        return (await context.Payments
            .Where(p => bookingIds.Contains(p.BookingId))
            .ToListAsync(ct)).ToLookup(p => p.BookingId);
    }
}