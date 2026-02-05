using ElaviewBackend.Data.Entities;
using ElaviewBackend.Features.Shared.Errors;
using Stripe;

namespace ElaviewBackend.Features.Payments;

public interface ISavedPaymentMethodService {
    IQueryable<SavedPaymentMethod> GetByUserId(Guid userId);
    Task<SetupIntentResult> CreateSetupIntentAsync(Guid userId, CancellationToken ct);
    Task<SavedPaymentMethod> ConfirmSetupIntentAsync(Guid userId, string setupIntentId, CancellationToken ct);
    Task<SavedPaymentMethod> SetDefaultAsync(Guid userId, Guid paymentMethodId, CancellationToken ct);
    Task DeleteAsync(Guid userId, Guid paymentMethodId, CancellationToken ct);
}

public sealed class SavedPaymentMethodService(
    ISavedPaymentMethodRepository repository
) : ISavedPaymentMethodService {
    public IQueryable<SavedPaymentMethod> GetByUserId(Guid userId)
        => repository.GetByUserId(userId);

    public async Task<SetupIntentResult> CreateSetupIntentAsync(Guid userId, CancellationToken ct) {
        var profile = await repository.GetAdvertiserProfileByUserIdAsync(userId, ct)
            ?? throw new NotFoundException("AdvertiserProfile", userId);

        var customerId = profile.StripeCustomerId;

        if (string.IsNullOrEmpty(customerId)) {
            var customerService = new CustomerService();
            Customer customer;
            try {
                customer = await customerService.CreateAsync(new CustomerCreateOptions {
                    Email = profile.User?.Email,
                    Metadata = new Dictionary<string, string> {
                        ["user_id"] = userId.ToString(),
                        ["advertiser_profile_id"] = profile.Id.ToString()
                    }
                }, cancellationToken: ct);
            }
            catch (StripeException ex) {
                throw new PaymentException("customer creation", ex.Message);
            }

            customerId = customer.Id;
            await repository.UpdateStripeCustomerIdAsync(profile, customerId, ct);
        }

        var setupIntentService = new SetupIntentService();
        SetupIntent setupIntent;
        try {
            setupIntent = await setupIntentService.CreateAsync(new SetupIntentCreateOptions {
                Customer = customerId,
                PaymentMethodTypes = ["card"],
                Usage = "off_session",
                Metadata = new Dictionary<string, string> {
                    ["user_id"] = userId.ToString(),
                    ["advertiser_profile_id"] = profile.Id.ToString()
                }
            }, cancellationToken: ct);
        }
        catch (StripeException ex) {
            throw new PaymentException("setup intent creation", ex.Message);
        }

        return new SetupIntentResult(setupIntent.ClientSecret, setupIntent.Id);
    }

    public async Task<SavedPaymentMethod> ConfirmSetupIntentAsync(Guid userId, string setupIntentId, CancellationToken ct) {
        var profile = await repository.GetAdvertiserProfileByUserIdAsync(userId, ct)
            ?? throw new NotFoundException("AdvertiserProfile", userId);

        var setupIntentService = new SetupIntentService();
        SetupIntent setupIntent;
        try {
            setupIntent = await setupIntentService.GetAsync(setupIntentId, new SetupIntentGetOptions {
                Expand = ["payment_method"]
            }, cancellationToken: ct);
        }
        catch (StripeException ex) {
            throw new PaymentException("setup intent retrieval", ex.Message);
        }

        if (setupIntent.Status != "succeeded")
            throw new PaymentException("setup intent confirmation", $"Setup intent has not succeeded. Status: {setupIntent.Status}");

        if (setupIntent.PaymentMethod is null)
            throw new PaymentException("setup intent confirmation", "No payment method attached to setup intent");

        var card = setupIntent.PaymentMethod.Card;
        if (card is null)
            throw new PaymentException("setup intent confirmation", "Payment method is not a card");

        var existingMethods = repository.GetByAdvertiserProfileId(profile.Id);
        var isFirstMethod = !existingMethods.Any();

        var savedPaymentMethod = new SavedPaymentMethod {
            Id = Guid.NewGuid(),
            AdvertiserProfileId = profile.Id,
            StripePaymentMethodId = setupIntent.PaymentMethod.Id,
            Brand = card.Brand ?? "unknown",
            Last4 = card.Last4 ?? "0000",
            ExpMonth = (int)card.ExpMonth,
            ExpYear = (int)card.ExpYear,
            IsDefault = isFirstMethod,
            CreatedAt = DateTime.UtcNow
        };

        await repository.AddAsync(savedPaymentMethod, ct);

        if (isFirstMethod) {
            try {
                var customerService = new CustomerService();
                await customerService.UpdateAsync(profile.StripeCustomerId!, new CustomerUpdateOptions {
                    InvoiceSettings = new CustomerInvoiceSettingsOptions {
                        DefaultPaymentMethod = setupIntent.PaymentMethod.Id
                    }
                }, cancellationToken: ct);
            }
            catch (StripeException) {
            }
        }

        return savedPaymentMethod;
    }

    public async Task<SavedPaymentMethod> SetDefaultAsync(Guid userId, Guid paymentMethodId, CancellationToken ct) {
        var profile = await repository.GetAdvertiserProfileByUserIdAsync(userId, ct)
            ?? throw new NotFoundException("AdvertiserProfile", userId);

        var paymentMethod = await repository.GetByIdAsync(paymentMethodId, ct)
            ?? throw new NotFoundException("SavedPaymentMethod", paymentMethodId);

        if (paymentMethod.AdvertiserProfileId != profile.Id)
            throw new ForbiddenException("modify this payment method");

        await repository.ClearDefaultAsync(profile.Id, ct);

        paymentMethod.IsDefault = true;
        await repository.UpdateAsync(paymentMethod, ct);

        if (!string.IsNullOrEmpty(profile.StripeCustomerId)) {
            try {
                var customerService = new CustomerService();
                await customerService.UpdateAsync(profile.StripeCustomerId, new CustomerUpdateOptions {
                    InvoiceSettings = new CustomerInvoiceSettingsOptions {
                        DefaultPaymentMethod = paymentMethod.StripePaymentMethodId
                    }
                }, cancellationToken: ct);
            }
            catch (StripeException) {
            }
        }

        return paymentMethod;
    }

    public async Task DeleteAsync(Guid userId, Guid paymentMethodId, CancellationToken ct) {
        var profile = await repository.GetAdvertiserProfileByUserIdAsync(userId, ct)
            ?? throw new NotFoundException("AdvertiserProfile", userId);

        var paymentMethod = await repository.GetByIdAsync(paymentMethodId, ct)
            ?? throw new NotFoundException("SavedPaymentMethod", paymentMethodId);

        if (paymentMethod.AdvertiserProfileId != profile.Id)
            throw new ForbiddenException("delete this payment method");

        try {
            var stripeService = new PaymentMethodService();
            await stripeService.DetachAsync(paymentMethod.StripePaymentMethodId, cancellationToken: ct);
        }
        catch (StripeException) {
        }

        await repository.DeleteAsync(paymentMethod, ct);
    }
}

public record SetupIntentResult(string ClientSecret, string SetupIntentId);
