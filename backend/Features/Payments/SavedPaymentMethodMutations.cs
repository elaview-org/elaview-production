using ElaviewBackend.Features.Shared.Errors;
using ElaviewBackend.Features.Users;
using HotChocolate.Authorization;

namespace ElaviewBackend.Features.Payments;

[MutationType]
public static partial class SavedPaymentMethodMutations {
    [Authorize]
    [Error<NotFoundException>]
    [Error<PaymentException>]
    public static async Task<CreateSetupIntentPayload> CreateSetupIntent(
        IUserService userService,
        ISavedPaymentMethodService savedPaymentMethodService,
        CancellationToken ct
    ) {
        var result = await savedPaymentMethodService.CreateSetupIntentAsync(
            userService.GetPrincipalId(), ct);
        return new CreateSetupIntentPayload(result.ClientSecret, result.SetupIntentId);
    }

    [Authorize]
    [Error<NotFoundException>]
    [Error<PaymentException>]
    public static async Task<ConfirmSetupIntentPayload> ConfirmSetupIntent(
        ConfirmSetupIntentInput input,
        IUserService userService,
        ISavedPaymentMethodService savedPaymentMethodService,
        CancellationToken ct
    ) {
        var paymentMethod = await savedPaymentMethodService.ConfirmSetupIntentAsync(
            userService.GetPrincipalId(), input.SetupIntentId, ct);
        return new ConfirmSetupIntentPayload(paymentMethod);
    }

    [Authorize]
    [Error<NotFoundException>]
    [Error<ForbiddenException>]
    public static async Task<SetDefaultPaymentMethodPayload> SetDefaultPaymentMethod(
        SetDefaultPaymentMethodInput input,
        IUserService userService,
        ISavedPaymentMethodService savedPaymentMethodService,
        CancellationToken ct
    ) {
        var paymentMethod = await savedPaymentMethodService.SetDefaultAsync(
            userService.GetPrincipalId(), input.PaymentMethodId, ct);
        return new SetDefaultPaymentMethodPayload(paymentMethod);
    }

    [Authorize]
    [Error<NotFoundException>]
    [Error<ForbiddenException>]
    public static async Task<DeletePaymentMethodPayload> DeletePaymentMethod(
        DeletePaymentMethodInput input,
        IUserService userService,
        ISavedPaymentMethodService savedPaymentMethodService,
        CancellationToken ct
    ) {
        await savedPaymentMethodService.DeleteAsync(
            userService.GetPrincipalId(), input.PaymentMethodId, ct);
        return new DeletePaymentMethodPayload(true);
    }
}
