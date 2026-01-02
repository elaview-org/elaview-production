using Xunit;

namespace ElaviewBackend.Services;

public class AuthServiceTests {
    [Fact]
    public void HashPassword_ReturnsNonNullValue() {
        var hashedPassword = AuthService.HashPassword("password123");

        Assert.NotNull(hashedPassword);
    }

    [Fact]
    public void HashPassword_ReturnsDifferentValueThanInput() {
        var hashedPassword = AuthService.HashPassword("password123");

        Assert.NotEqual("password123", hashedPassword);
    }

    [Fact]
    public void HashPassword_ReturnsStringStartingWithBCryptPrefix() {
        var hashedPassword = AuthService.HashPassword("password123");

        Assert.StartsWith("$2", hashedPassword);
    }

    [Fact]
    public void HashPassword_ReturnsNonEmptyString() {
        var hashedPassword = AuthService.HashPassword("password123");

        Assert.NotEmpty(hashedPassword);
    }

    [Fact]
    public void HashPassword_WithEmptyString_ReturnsHash() {
        var hashedPassword = AuthService.HashPassword("");

        Assert.NotNull(hashedPassword);
        Assert.NotEmpty(hashedPassword);
        Assert.StartsWith("$2", hashedPassword);
    }

    [Fact]
    public void HashPassword_WithSpecialCharacters_ReturnsHash() {
        var hashedPassword = AuthService.HashPassword("p@ssw0rd!#$%");

        Assert.NotNull(hashedPassword);
        Assert.StartsWith("$2", hashedPassword);
    }

    [Fact]
    public void HashPassword_WithUnicodeCharacters_ReturnsHash() {
        var hashedPassword = AuthService.HashPassword("пароль密码🔐");

        Assert.NotNull(hashedPassword);
        Assert.StartsWith("$2", hashedPassword);
    }

    [Fact]
    public void HashPassword_WithLongPassword_ReturnsHash() {
        var longPassword = new string('a', 1000);
        var hashedPassword = AuthService.HashPassword(longPassword);

        Assert.NotNull(hashedPassword);
        Assert.StartsWith("$2", hashedPassword);
    }

    [Fact]
    public void HashPassword_WithSameInput_ReturnsDifferentHashes() {
        var hash1 = AuthService.HashPassword("password123");
        var hash2 = AuthService.HashPassword("password123");

        Assert.NotEqual(hash1, hash2);
    }

    [Fact]
    public void HashPassword_ProducesHashOfExpectedMinimumLength() {
        var hashedPassword = AuthService.HashPassword("password123");

        Assert.True(hashedPassword.Length >= 59);
    }

    [Fact]
    public void VerifyPassword_WithCorrectPassword_ReturnsTrue() {
        var hashedPassword = AuthService.HashPassword("password123");
        var isValid = AuthService.VerifyPassword("password123", hashedPassword);

        Assert.True(isValid);
    }

    [Fact]
    public void VerifyPassword_WithIncorrectPassword_ReturnsFalse() {
        var hashedPassword = AuthService.HashPassword("password123");
        var isValid = AuthService.VerifyPassword("wrongpassword", hashedPassword);

        Assert.False(isValid);
    }

    [Fact]
    public void VerifyPassword_WithEmptyPassword_ReturnsFalse() {
        var hashedPassword = AuthService.HashPassword("password123");
        var isValid = AuthService.VerifyPassword("", hashedPassword);

        Assert.False(isValid);
    }

    [Fact]
    public void VerifyPassword_WithEmptyPasswordAgainstEmptyHash_ReturnsTrue() {
        var hashedPassword = AuthService.HashPassword("");
        var isValid = AuthService.VerifyPassword("", hashedPassword);

        Assert.True(isValid);
    }

    [Fact]
    public void VerifyPassword_IsCaseSensitive() {
        var hashedPassword = AuthService.HashPassword("Password123");
        var isValid = AuthService.VerifyPassword("password123", hashedPassword);

        Assert.False(isValid);
    }

    [Fact]
    public void VerifyPassword_WithSpecialCharacters_VerifiesCorrectly() {
        var password = "p@ssw0rd!#$%";
        var hashedPassword = AuthService.HashPassword(password);
        var isValid = AuthService.VerifyPassword(password, hashedPassword);

        Assert.True(isValid);
    }

    [Fact]
    public void VerifyPassword_WithUnicodeCharacters_VerifiesCorrectly() {
        var password = "пароль密码🔐";
        var hashedPassword = AuthService.HashPassword(password);
        var isValid = AuthService.VerifyPassword(password, hashedPassword);

        Assert.True(isValid);
    }

    [Fact]
    public void VerifyPassword_WithSlightlyDifferentPassword_ReturnsFalse() {
        var hashedPassword = AuthService.HashPassword("password123");
        var isValid = AuthService.VerifyPassword("password124", hashedPassword);

        Assert.False(isValid);
    }

    [Fact]
    public void VerifyPassword_WithExtraSpaces_ReturnsFalse() {
        var hashedPassword = AuthService.HashPassword("password123");
        var isValid = AuthService.VerifyPassword("password123 ", hashedPassword);

        Assert.False(isValid);
    }

    [Fact]
    public void VerifyPassword_WithLeadingSpaces_ReturnsFalse() {
        var hashedPassword = AuthService.HashPassword("password123");
        var isValid = AuthService.VerifyPassword(" password123", hashedPassword);

        Assert.False(isValid);
    }

    [Fact]
    public void VerifyPassword_WithLongPassword_VerifiesCorrectly() {
        var longPassword = new string('a', 1000);
        var hashedPassword = AuthService.HashPassword(longPassword);
        var isValid = AuthService.VerifyPassword(longPassword, hashedPassword);

        Assert.True(isValid);
    }
}