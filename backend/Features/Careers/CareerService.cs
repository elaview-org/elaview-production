using ElaviewBackend.Data.Entities;
using ElaviewBackend.Features.Shared.Errors;

namespace ElaviewBackend.Features.Careers;

public interface ICareerService {
    IQueryable<Career> GetAll();
    IQueryable<Career> GetById(Guid id);
    Task<Career> CreateAsync(CreateCareerInput input, CancellationToken ct);
    Task<Career> UpdateAsync(Guid id, UpdateCareerInput input, CancellationToken ct);
    Task<bool> DeleteAsync(Guid id, CancellationToken ct);
}

public sealed class CareerService(ICareerRepository repository) : ICareerService {
    public IQueryable<Career> GetAll()
        => repository.Query().OrderByDescending(c => c.CreatedAt);

    public IQueryable<Career> GetById(Guid id)
        => repository.Query().Where(c => c.Id == id);

    public async Task<Career> CreateAsync(CreateCareerInput input, CancellationToken ct) {
        ValidateInput(input.Title, input.Description, input.Requirements, input.ExpiresAt);

        var career = new Career {
            Title = input.Title,
            Department = input.Department,
            Type = input.Type,
            Location = input.Location,
            Description = input.Description,
            Requirements = input.Requirements,
            IsActive = input.IsActive,
            ExpiresAt = input.ExpiresAt
        };

        return await repository.AddAsync(career, ct);
    }

    public async Task<Career> UpdateAsync(Guid id, UpdateCareerInput input, CancellationToken ct) {
        var career = await repository.GetByIdAsync(id, ct)
            ?? throw new NotFoundException("Career", id);

        if (input.Title is not null && string.IsNullOrWhiteSpace(input.Title))
            throw new ValidationException("Title", "Title cannot be empty");
        if (input.Description is not null && string.IsNullOrWhiteSpace(input.Description))
            throw new ValidationException("Description", "Description cannot be empty");
        if (input.Requirements is not null && string.IsNullOrWhiteSpace(input.Requirements))
            throw new ValidationException("Requirements", "Requirements cannot be empty");
        if (input.ExpiresAt is not null && input.ExpiresAt <= DateTime.UtcNow)
            throw new ValidationException("ExpiresAt", "Expiration date must be in the future");

        return await repository.UpdateAsync(career, input, ct);
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken ct) {
        var career = await repository.GetByIdAsync(id, ct)
            ?? throw new NotFoundException("Career", id);

        return await repository.DeleteAsync(career, ct);
    }

    private static void ValidateInput(string title, string description, string requirements, DateTime? expiresAt) {
        if (string.IsNullOrWhiteSpace(title))
            throw new ValidationException("Title", "Title is required");
        if (string.IsNullOrWhiteSpace(description))
            throw new ValidationException("Description", "Description is required");
        if (string.IsNullOrWhiteSpace(requirements))
            throw new ValidationException("Requirements", "Requirements is required");
        if (expiresAt is not null && expiresAt <= DateTime.UtcNow)
            throw new ValidationException("ExpiresAt", "Expiration date must be in the future");
    }
}
