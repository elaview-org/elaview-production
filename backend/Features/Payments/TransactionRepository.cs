using ElaviewBackend.Data;
using ElaviewBackend.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace ElaviewBackend.Features.Payments;

public interface ITransactionRepository {
    IQueryable<Transaction> GetByBookingId(Guid bookingId);
    Task<Transaction> AddAsync(Transaction transaction, CancellationToken ct);
}

public sealed class TransactionRepository(AppDbContext context) : ITransactionRepository {
    public IQueryable<Transaction> GetByBookingId(Guid bookingId)
        => context.Transactions.Where(t => t.BookingId == bookingId);

    public async Task<Transaction> AddAsync(Transaction transaction, CancellationToken ct) {
        context.Transactions.Add(transaction);
        await context.SaveChangesAsync(ct);
        return transaction;
    }
}

internal static class TransactionDataLoaders {
    [DataLoader]
    public static async Task<ILookup<Guid, Transaction>>
        GetTransactionsByBookingId(
            IReadOnlyList<Guid> bookingIds, AppDbContext context,
            CancellationToken ct
        ) {
        return (await context.Transactions
            .Where(t =>
                t.BookingId != null && bookingIds.Contains(t.BookingId.Value))
            .ToListAsync(ct)).ToLookup(t => t.BookingId!.Value);
    }
}