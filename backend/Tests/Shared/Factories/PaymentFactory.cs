using Bogus;
using ElaviewBackend.Data.Entities;

namespace ElaviewBackend.Tests.Shared.Factories;

public static class PaymentFactory {
    private static readonly Faker Faker = new();

    public static Payment Create(Guid bookingId, Action<Payment>? customize = null) {
        var payment = new Payment {
            Id = Guid.NewGuid(),
            BookingId = bookingId,
            Type = PaymentType.Full,
            Amount = Faker.Finance.Amount(100, 1000),
            StripePaymentIntentId = $"pi_{Faker.Random.AlphaNumeric(24)}",
            Status = PaymentStatus.Pending,
            CreatedAt = DateTime.UtcNow
        };
        customize?.Invoke(payment);
        return payment;
    }

    public static Payment CreateSucceeded(Guid bookingId) => Create(bookingId, p => {
        p.Status = PaymentStatus.Succeeded;
        p.PaidAt = DateTime.UtcNow;
        p.StripeChargeId = $"ch_{Faker.Random.AlphaNumeric(24)}";
    });

    public static List<Payment> CreateMany(Guid bookingId, int count) =>
        Enumerable.Range(0, count).Select(_ => Create(bookingId)).ToList();
}

public static class PayoutFactory {
    private static readonly Faker Faker = new();

    public static Payout Create(Guid bookingId, Guid spaceOwnerProfileId, Action<Payout>? customize = null) {
        var payout = new Payout {
            Id = Guid.NewGuid(),
            BookingId = bookingId,
            SpaceOwnerProfileId = spaceOwnerProfileId,
            Stage = PayoutStage.Stage1,
            Amount = Faker.Finance.Amount(50, 500),
            Status = PayoutStatus.Pending,
            CreatedAt = DateTime.UtcNow
        };
        customize?.Invoke(payout);
        return payout;
    }

    public static Payout CreateCompleted(Guid bookingId, Guid spaceOwnerProfileId, PayoutStage stage) {
        return new Payout {
            Id = Guid.NewGuid(),
            BookingId = bookingId,
            SpaceOwnerProfileId = spaceOwnerProfileId,
            Stage = stage,
            Amount = Faker.Finance.Amount(50, 500),
            Status = PayoutStatus.Completed,
            ProcessedAt = DateTime.UtcNow,
            StripeTransferId = $"tr_{Faker.Random.AlphaNumeric(24)}",
            CreatedAt = DateTime.UtcNow
        };
    }
}

public static class RefundFactory {
    private static readonly Faker Faker = new();

    public static Refund Create(Guid paymentId, Guid bookingId, Action<Refund>? customize = null) {
        var refund = new Refund {
            Id = Guid.NewGuid(),
            PaymentId = paymentId,
            BookingId = bookingId,
            Amount = Faker.Finance.Amount(10, 100),
            Reason = Faker.Lorem.Sentence(),
            Status = RefundStatus.Pending,
            CreatedAt = DateTime.UtcNow
        };
        customize?.Invoke(refund);
        return refund;
    }

    public static Refund CreateSucceeded(Guid paymentId, Guid bookingId, decimal amount) {
        return new Refund {
            Id = Guid.NewGuid(),
            PaymentId = paymentId,
            BookingId = bookingId,
            Amount = amount,
            Reason = Faker.Lorem.Sentence(),
            Status = RefundStatus.Succeeded,
            ProcessedAt = DateTime.UtcNow,
            StripeRefundId = $"re_{Faker.Random.AlphaNumeric(24)}",
            CreatedAt = DateTime.UtcNow
        };
    }
}

public static class TransactionFactory {
    private static readonly Faker Faker = new();

    public static Transaction Create(Guid? bookingId = null, Action<Transaction>? customize = null) {
        var transaction = new Transaction {
            Id = Guid.NewGuid(),
            BookingId = bookingId,
            Type = TransactionType.Payment,
            Amount = Faker.Finance.Amount(100, 1000),
            Currency = "USD",
            ReferenceType = "Payment",
            ReferenceId = Guid.NewGuid(),
            Description = Faker.Lorem.Sentence(),
            CreatedAt = DateTime.UtcNow
        };
        customize?.Invoke(transaction);
        return transaction;
    }
}
