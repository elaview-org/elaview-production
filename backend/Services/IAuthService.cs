using ElaviewBackend.Data.Entities;

namespace ElaviewBackend.Services;

public interface IAuthService {
    Task<User?> CreateUserAsync(string email, string password, string? name = null);
    Task<User?> ValidateUserAsync(string email, string password);
}