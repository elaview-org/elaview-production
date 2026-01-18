using ElaviewBackend.Data.Entities;

namespace ElaviewBackend.Features.Payments;

public interface ITransactionService {
    IQueryable<Transaction> GetByBookingId(Guid bookingId);
}

public sealed class TransactionService(ITransactionRepository repository) : ITransactionService {
    public IQueryable<Transaction> GetByBookingId(Guid bookingId)
        => repository.GetByBookingId(bookingId);
}