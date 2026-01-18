using ElaviewBackend.Data.Entities;
using HotChocolate.Authorization;

namespace ElaviewBackend.Features.Payments;

[QueryType]
public static partial class TransactionQueries {
    [Authorize(Roles = ["Admin"])]
    [UsePaging]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public static IQueryable<Transaction> GetTransactionsByBooking(
        [ID] Guid bookingId, ITransactionService transactionService
    ) => transactionService.GetByBookingId(bookingId);
}