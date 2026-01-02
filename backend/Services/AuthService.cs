using ElaviewBackend.Data;
using ElaviewBackend.Data.Entities;

namespace ElaviewBackend.Services;

public class AuthService(AppDbContext dbContext) {
    public async Task<User> CreateUserAsync(string email, string password) {
        var user = new User { Email = email, Password = password };
        dbContext.Users.Add(user);
        await dbContext.SaveChangesAsync();
        return user;
    }
}