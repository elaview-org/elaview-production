using ElaviewBackend.Data;
using ElaviewBackend.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace ElaviewBackend.Features.Payments;

public interface IRefundRepository {
    IQueryable<Refund> GetByPaymentId(Guid paymentId);
    Task<Refund?> GetByIdAsync(Guid id, CancellationToken ct);
    Task<IReadOnlyList<Refund>> GetByPaymentIdAsync(Guid paymentId, CancellationToken ct);
    Task<decimal> GetSucceededRefundsSumByPaymentIdAsync(Guid paymentId, CancellationToken ct);
    Task<Refund> AddAsync(Refund refund, CancellationToken ct);
    Task SaveChangesAsync(CancellationToken ct);
}

public sealed class RefundRepository(
    AppDbContext context,
    IRefundByIdDataLoader refundById,
    IRefundsByPaymentIdDataLoader refundsByPaymentId
) : IRefundRepository {
    public IQueryable<Refund> GetByPaymentId(Guid paymentId)
        => context.Refunds.Where(r => r.PaymentId == paymentId);

    public async Task<Refund?> GetByIdAsync(Guid id, CancellationToken ct)
        => await refundById.LoadAsync(id, ct);

    public async Task<IReadOnlyList<Refund>> GetByPaymentIdAsync(Guid paymentId, CancellationToken ct)
        => await refundsByPaymentId.LoadAsync(paymentId, ct) ?? [];

    public async Task<decimal> GetSucceededRefundsSumByPaymentIdAsync(Guid paymentId, CancellationToken ct)
        => await context.Refunds
            .Where(r => r.PaymentId == paymentId && r.Status == RefundStatus.Succeeded)
            .SumAsync(r => r.Amount, ct);

    public async Task<Refund> AddAsync(Refund refund, CancellationToken ct) {
        context.Refunds.Add(refund);
        await context.SaveChangesAsync(ct);
        return refund;
    }

    public async Task SaveChangesAsync(CancellationToken ct)
        => await context.SaveChangesAsync(ct);
}

internal static class RefundDataLoaders {
    [DataLoader]
    public static async Task<IReadOnlyDictionary<Guid, Refund>> GetRefundById(
        IReadOnlyList<Guid> ids, AppDbContext context, CancellationToken ct
    ) {
        return await context.Refunds
            .Where(r => ids.Contains(r.Id))
            .ToDictionaryAsync(r => r.Id, ct);
    }

    [DataLoader]
    public static async Task<ILookup<Guid, Refund>> GetRefundsByPaymentId(
        IReadOnlyList<Guid> paymentIds, AppDbContext context,
        CancellationToken ct
    ) {
        return (await context.Refunds
            .Where(r => paymentIds.Contains(r.PaymentId))
            .ToListAsync(ct)).ToLookup(r => r.PaymentId);
    }

    [DataLoader]
    public static async Task<ILookup<Guid, Refund>> GetRefundsByBookingId(
        IReadOnlyList<Guid> bookingIds, AppDbContext context,
        CancellationToken ct
    ) {
        return (await context.Refunds
            .Where(r => bookingIds.Contains(r.BookingId))
            .ToListAsync(ct)).ToLookup(r => r.BookingId);
    }
}