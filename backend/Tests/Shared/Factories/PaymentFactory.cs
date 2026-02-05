using Bogus;
using ElaviewBackend.Data.Entities;

namespace ElaviewBackend.Tests.Shared.Factories;

public static class PaymentFactory {
    private static readonly Faker Faker = new();

    public static Payment Create(Guid bookingId,
        Action<Payment>? customize = null) {
        var payment = new Payment {
            Id = Guid.NewGuid(),
            BookingId = bookingId,
            Type = PaymentType.Full,
            Amount = Faker.Finance.Amount(100),
            StripePaymentIntentId = $"pi_{Faker.Random.AlphaNumeric(24)}",
            Status = PaymentStatus.Pending,
            CreatedAt = DateTime.UtcNow
        };
        customize?.Invoke(payment);
        return payment;
    }

    public static Payment CreateSucceeded(Guid bookingId) {
        return Create(bookingId, p => {
            p.Status = PaymentStatus.Succeeded;
            p.PaidAt = DateTime.UtcNow;
            p.StripeChargeId = $"ch_{Faker.Random.AlphaNumeric(24)}";
        });
    }

    public static List<Payment> CreateMany(Guid bookingId, int count) {
        return Enumerable.Range(0, count).Select(_ => Create(bookingId))
            .ToList();
    }
}

public static class PayoutFactory {
    private static readonly Faker Faker = new();

    public static Payout Create(Guid bookingId, Guid spaceOwnerProfileId,
        Action<Payout>? customize = null) {
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

    public static Payout CreateCompleted(Guid bookingId,
        Guid spaceOwnerProfileId, PayoutStage stage) {
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

    public static Refund Create(Guid paymentId, Guid bookingId,
        Action<Refund>? customize = null) {
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

    public static Refund CreateSucceeded(Guid paymentId, Guid bookingId,
        decimal amount) {
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

    public static Transaction Create(Guid? bookingId = null,
        Action<Transaction>? customize = null) {
        var transaction = new Transaction {
            Id = Guid.NewGuid(),
            BookingId = bookingId,
            Type = TransactionType.Payment,
            Amount = Faker.Finance.Amount(100),
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

public static class SavedPaymentMethodFactory {
    private static readonly Faker Faker = new();
    private static readonly string[] CardBrands = ["visa", "mastercard", "amex", "discover"];

    public static SavedPaymentMethod Create(Guid advertiserProfileId,
        Action<SavedPaymentMethod>? customize = null) {
        var paymentMethod = new SavedPaymentMethod {
            Id = Guid.NewGuid(),
            AdvertiserProfileId = advertiserProfileId,
            StripePaymentMethodId = $"pm_{Faker.Random.AlphaNumeric(24)}",
            Brand = Faker.PickRandom(CardBrands),
            Last4 = Faker.Random.Number(1000, 9999).ToString(),
            ExpMonth = Faker.Random.Number(1, 12),
            ExpYear = DateTime.UtcNow.Year + Faker.Random.Number(1, 5),
            IsDefault = false,
            CreatedAt = DateTime.UtcNow
        };
        customize?.Invoke(paymentMethod);
        return paymentMethod;
    }

    public static SavedPaymentMethod CreateDefault(Guid advertiserProfileId) {
        return Create(advertiserProfileId, pm => pm.IsDefault = true);
    }

    public static List<SavedPaymentMethod> CreateMany(Guid advertiserProfileId, int count) {
        return Enumerable.Range(0, count).Select(i => Create(advertiserProfileId, pm => {
            if (i == 0) pm.IsDefault = true;
        })).ToList();
    }
}