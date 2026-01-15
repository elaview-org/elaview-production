using ElaviewBackend.Data.Entities;

namespace ElaviewBackend.Features.Payments;

public interface ITransactionService {
    IQueryable<Transaction> GetTransactionsByBookingIdQuery(Guid bookingId);
}

public sealed class TransactionService(
    ITransactionRepository transactionRepository
) : ITransactionService {
    public IQueryable<Transaction> GetTransactionsByBookingIdQuery(
        Guid bookingId) {
        return transactionRepository.Query()
            .Where(t => t.BookingId == bookingId);
    }
}