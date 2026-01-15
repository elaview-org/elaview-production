using ElaviewBackend.Data;
using ElaviewBackend.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace ElaviewBackend.Features.Payments;

public interface IPaymentRepository {
    IQueryable<Payment> Query();
    Task<Payment?> GetByIdAsync(Guid id, CancellationToken ct);

    Task<Payment?> GetByStripePaymentIntentIdAsync(string paymentIntentId,
        CancellationToken ct);

    Task<Payment> AddAsync(Payment payment, CancellationToken ct);
    Task SaveChangesAsync(CancellationToken ct);
}

public sealed class PaymentRepository(
    AppDbContext context,
    IPaymentByIdDataLoader paymentById
) : IPaymentRepository {
    public IQueryable<Payment> Query() {
        return context.Payments;
    }

    public async Task<Payment?> GetByIdAsync(Guid id, CancellationToken ct) {
        return await paymentById.LoadAsync(id, ct);
    }

    public async Task<Payment?> GetByStripePaymentIntentIdAsync(
        string paymentIntentId, CancellationToken ct) {
        return await context.Payments.FirstOrDefaultAsync(
            p => p.StripePaymentIntentId == paymentIntentId, ct);
    }

    public async Task<Payment> AddAsync(Payment payment, CancellationToken ct) {
        context.Payments.Add(payment);
        await context.SaveChangesAsync(ct);
        return payment;
    }

    public async Task SaveChangesAsync(CancellationToken ct) {
        await context.SaveChangesAsync(ct);
    }
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