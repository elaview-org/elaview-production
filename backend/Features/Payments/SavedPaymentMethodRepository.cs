using ElaviewBackend.Data;
using ElaviewBackend.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace ElaviewBackend.Features.Payments;

public interface ISavedPaymentMethodRepository {
    IQueryable<SavedPaymentMethod> GetByAdvertiserProfileId(Guid advertiserProfileId);
    IQueryable<SavedPaymentMethod> GetByUserId(Guid userId);
    Task<SavedPaymentMethod?> GetByIdAsync(Guid id, CancellationToken ct);
    Task<AdvertiserProfile?> GetAdvertiserProfileByUserIdAsync(Guid userId, CancellationToken ct);
    Task<SavedPaymentMethod> AddAsync(SavedPaymentMethod paymentMethod, CancellationToken ct);
    Task<SavedPaymentMethod> UpdateAsync(SavedPaymentMethod paymentMethod, CancellationToken ct);
    Task DeleteAsync(SavedPaymentMethod paymentMethod, CancellationToken ct);
    Task ClearDefaultAsync(Guid advertiserProfileId, CancellationToken ct);
    Task UpdateStripeCustomerIdAsync(AdvertiserProfile profile, string customerId, CancellationToken ct);
}

public sealed class SavedPaymentMethodRepository(
    AppDbContext context,
    ISavedPaymentMethodByIdDataLoader savedPaymentMethodById
) : ISavedPaymentMethodRepository {
    public IQueryable<SavedPaymentMethod> GetByAdvertiserProfileId(Guid advertiserProfileId)
        => context.SavedPaymentMethods
            .Where(pm => pm.AdvertiserProfileId == advertiserProfileId)
            .OrderByDescending(pm => pm.IsDefault)
            .ThenByDescending(pm => pm.CreatedAt);

    public IQueryable<SavedPaymentMethod> GetByUserId(Guid userId)
        => context.SavedPaymentMethods
            .Where(pm => pm.AdvertiserProfile.UserId == userId)
            .OrderByDescending(pm => pm.IsDefault)
            .ThenByDescending(pm => pm.CreatedAt);

    public async Task<SavedPaymentMethod?> GetByIdAsync(Guid id, CancellationToken ct)
        => await savedPaymentMethodById.LoadAsync(id, ct);

    public async Task<AdvertiserProfile?> GetAdvertiserProfileByUserIdAsync(Guid userId, CancellationToken ct)
        => await context.AdvertiserProfiles.FirstOrDefaultAsync(p => p.UserId == userId, ct);

    public async Task<SavedPaymentMethod> AddAsync(SavedPaymentMethod paymentMethod, CancellationToken ct) {
        context.SavedPaymentMethods.Add(paymentMethod);
        await context.SaveChangesAsync(ct);
        return paymentMethod;
    }

    public async Task<SavedPaymentMethod> UpdateAsync(SavedPaymentMethod paymentMethod, CancellationToken ct) {
        await context.SaveChangesAsync(ct);
        return paymentMethod;
    }

    public async Task DeleteAsync(SavedPaymentMethod paymentMethod, CancellationToken ct) {
        context.SavedPaymentMethods.Remove(paymentMethod);
        await context.SaveChangesAsync(ct);
    }

    public async Task ClearDefaultAsync(Guid advertiserProfileId, CancellationToken ct) {
        await context.SavedPaymentMethods
            .Where(pm => pm.AdvertiserProfileId == advertiserProfileId && pm.IsDefault)
            .ExecuteUpdateAsync(s => s.SetProperty(pm => pm.IsDefault, false), ct);
    }

    public async Task UpdateStripeCustomerIdAsync(AdvertiserProfile profile, string customerId, CancellationToken ct) {
        context.Entry(profile).Property(p => p.StripeCustomerId).CurrentValue = customerId;
        await context.SaveChangesAsync(ct);
    }
}

internal static class SavedPaymentMethodDataLoaders {
    [DataLoader]
    public static async Task<IReadOnlyDictionary<Guid, SavedPaymentMethod>> GetSavedPaymentMethodById(
        IReadOnlyList<Guid> ids, AppDbContext context, CancellationToken ct
    ) => await context.SavedPaymentMethods
        .Where(pm => ids.Contains(pm.Id))
        .ToDictionaryAsync(pm => pm.Id, ct);

    [DataLoader]
    public static async Task<ILookup<Guid, SavedPaymentMethod>> GetSavedPaymentMethodsByAdvertiserProfileId(
        IReadOnlyList<Guid> advertiserProfileIds, AppDbContext context, CancellationToken ct
    ) => (await context.SavedPaymentMethods
        .Where(pm => advertiserProfileIds.Contains(pm.AdvertiserProfileId))
        .OrderByDescending(pm => pm.IsDefault)
        .ThenByDescending(pm => pm.CreatedAt)
        .ToListAsync(ct)).ToLookup(pm => pm.AdvertiserProfileId);
}
