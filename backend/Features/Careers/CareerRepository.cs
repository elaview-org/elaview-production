using ElaviewBackend.Data;
using ElaviewBackend.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace ElaviewBackend.Features.Careers;

public interface ICareerRepository {
    IQueryable<Career> Query();
    Task<Career?> GetByIdAsync(Guid id, CancellationToken ct);
    Task<Career> AddAsync(Career career, CancellationToken ct);
    Task<Career> UpdateAsync(Career career, UpdateCareerInput input, CancellationToken ct);
    Task<bool> DeleteAsync(Career career, CancellationToken ct);
}

public sealed class CareerRepository(AppDbContext context) : ICareerRepository {
    public IQueryable<Career> Query() => context.Careers;

    public async Task<Career?> GetByIdAsync(Guid id, CancellationToken ct)
        => await context.Careers.FirstOrDefaultAsync(c => c.Id == id, ct);

    public async Task<Career> AddAsync(Career career, CancellationToken ct) {
        context.Careers.Add(career);
        await context.SaveChangesAsync(ct);
        return career;
    }

    public async Task<Career> UpdateAsync(Career career, UpdateCareerInput input, CancellationToken ct) {
        var entry = context.Entry(career);

        if (input.Title is not null)
            entry.Property(c => c.Title).CurrentValue = input.Title;
        if (input.Department is not null)
            entry.Property(c => c.Department).CurrentValue = input.Department.Value;
        if (input.Type is not null)
            entry.Property(c => c.Type).CurrentValue = input.Type.Value;
        if (input.Location is not null)
            entry.Property(c => c.Location).CurrentValue = input.Location;
        if (input.Description is not null)
            entry.Property(c => c.Description).CurrentValue = input.Description;
        if (input.Requirements is not null)
            entry.Property(c => c.Requirements).CurrentValue = input.Requirements;
        if (input.IsActive is not null)
            entry.Property(c => c.IsActive).CurrentValue = input.IsActive.Value;
        if (input.ExpiresAt is not null)
            entry.Property(c => c.ExpiresAt).CurrentValue = input.ExpiresAt;

        await context.SaveChangesAsync(ct);
        return career;
    }

    public async Task<bool> DeleteAsync(Career career, CancellationToken ct) {
        context.Careers.Remove(career);
        await context.SaveChangesAsync(ct);
        return true;
    }
}
