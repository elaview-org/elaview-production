using ElaviewBackend.Data.Entities;
using ElaviewBackend.Features.Users;
using HotChocolate.Authorization;

namespace ElaviewBackend.Features.Payments;

[QueryType]
public static partial class SavedPaymentMethodQueries {
    [Authorize]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public static IQueryable<SavedPaymentMethod> GetMySavedPaymentMethods(
        IUserService userService,
        ISavedPaymentMethodService savedPaymentMethodService
    ) => savedPaymentMethodService.GetByUserId(userService.GetPrincipalId());
}
