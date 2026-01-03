using System.Security.Claims;
using ElaviewBackend.Data;
using ElaviewBackend.Services;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace ElaviewBackend.GraphQL.Queries;

public class UserTestFixture {
    public IServiceProvider ServiceProvider { get; }

    public UserTestFixture() {
        var services = new ServiceCollection();
        services.AddScoped<ClaimsPrincipal>();
        services.AddDbContext<AppDbContext>(options =>
            options.UseInMemoryDatabase("TestDatabase"));
        services.AddScoped<UserService>();
        ServiceProvider = services.BuildServiceProvider();
    }
}

public class UserQueriesTests(UserTestFixture fixture)
    : IClassFixture<UserTestFixture> {
    private readonly UserService _userService =
        fixture.ServiceProvider.GetRequiredService<UserService>();

    [Fact]
    public void GetNotificationSettings_ReturnsNonNullObject() {
        var result = UserQueries.GetNotificationSettings(_userService);
        Assert.NotNull(result);
    }

    [Fact]
    public void GetNotificationSettings_BookingRequests_DefaultsToTrue() {
        var result = UserQueries.GetNotificationSettings(_userService);
        Assert.True(result.BookingRequests);
    }

    [Fact]
    public void GetNotificationSettings_BookingApprovals_DefaultsToTrue() {
        var result = UserQueries.GetNotificationSettings(_userService);
        Assert.True(result.BookingApprovals);
    }

    [Fact]
    public void GetNotificationSettings_PaymentReceipts_DefaultsToTrue() {
        var result = UserQueries.GetNotificationSettings(_userService);
        Assert.True(result.PaymentReceipts);
    }

    [Fact]
    public void GetNotificationSettings_CampaignUpdates_DefaultsToTrue() {
        var result = UserQueries.GetNotificationSettings(_userService);
        Assert.True(result.CampaignUpdates);
    }

    [Fact]
    public void GetNotificationSettings_MarketingEmails_DefaultsToTrue() {
        var result = UserQueries.GetNotificationSettings(_userService);
        Assert.True(result.MarketingEmails);
    }

    [Fact]
    public void GetNotificationSettings_SystemNotifications_DefaultsToTrue() {
        var result = UserQueries.GetNotificationSettings(_userService);
        Assert.True(result.SystemNotifications);
    }

    [Fact]
    public void GetNotificationSettings_EmailDigest_DefaultsToWeekly() {
        var result = UserQueries.GetNotificationSettings(_userService);
        Assert.Equal("weekly", result.EmailDigest);
    }

    [Fact]
    public void GetNotificationSettings_EmailDigest_IsNotNull() {
        var result = UserQueries.GetNotificationSettings(_userService);
        Assert.NotNull(result.EmailDigest);
    }

    [Fact]
    public void GetNotificationSettings_EmailDigest_IsNotEmpty() {
        var result = UserQueries.GetNotificationSettings(_userService);
        Assert.NotEmpty(result.EmailDigest);
    }

    [Fact]
    public void GetSecuritySettings_ReturnsNonNullObject() {
        var result = UserQueries.GetSecuritySettings(_userService);
        Assert.NotNull(result);
    }

    [Fact]
    public void GetSecuritySettings_TwoFactorEnabled_DefaultsToFalse() {
        var result = UserQueries.GetSecuritySettings(_userService);
        Assert.False(result.TwoFactorEnabled);
    }

    [Fact]
    public void GetSecuritySettings_LoginNotifications_DefaultsToTrue() {
        var result = UserQueries.GetSecuritySettings(_userService);
        Assert.True(result.LoginNotifications);
    }

    [Fact]
    public void GetSecuritySettings_DeviceSessions_IsNotNull() {
        var result = UserQueries.GetSecuritySettings(_userService);
        Assert.NotNull(result.DeviceSessions);
    }

    [Fact]
    public void GetSecuritySettings_DeviceSessions_ContainsOneItem() {
        var result = UserQueries.GetSecuritySettings(_userService);
        Assert.Single(result.DeviceSessions);
    }

    [Fact]
    public void GetSecuritySettings_DeviceSessions_IsNotEmpty() {
        var result = UserQueries.GetSecuritySettings(_userService);
        Assert.NotEmpty(result.DeviceSessions);
    }

    [Fact]
    public void GetSecuritySettings_FirstDeviceSession_IsNotNull() {
        var result = UserQueries.GetSecuritySettings(_userService);
        var firstSession = result.DeviceSessions.First();
        Assert.NotNull(firstSession);
    }

    [Fact]
    public void
        GetSecuritySettings_FirstDeviceSession_Id_DefaultsToSessionCurrent() {
        var result = UserQueries.GetSecuritySettings(_userService);
        var firstSession = result.DeviceSessions.First();
        Assert.Equal("session_current", firstSession.Id);
    }

    [Fact]
    public void GetSecuritySettings_FirstDeviceSession_Id_IsNotNull() {
        var result = UserQueries.GetSecuritySettings(_userService);
        var firstSession = result.DeviceSessions.First();
        Assert.NotNull(firstSession.Id);
    }

    [Fact]
    public void
        GetSecuritySettings_FirstDeviceSession_Device_DefaultsToCurrentBrowser() {
        var result = UserQueries.GetSecuritySettings(_userService);
        var firstSession = result.DeviceSessions.First();
        Assert.Equal("Current Browser", firstSession.Device);
    }

    [Fact]
    public void GetSecuritySettings_FirstDeviceSession_Device_IsNotNull() {
        var result = UserQueries.GetSecuritySettings(_userService);
        var firstSession = result.DeviceSessions.First();
        Assert.NotNull(firstSession.Device);
    }

    [Fact]
    public void
        GetSecuritySettings_FirstDeviceSession_Location_DefaultsToOrangeCA() {
        var result = UserQueries.GetSecuritySettings(_userService);
        var firstSession = result.DeviceSessions.First();
        Assert.Equal("Orange, CA, US", firstSession.Location);
    }

    [Fact]
    public void GetSecuritySettings_FirstDeviceSession_Location_IsNotNull() {
        var result = UserQueries.GetSecuritySettings(_userService);
        var firstSession = result.DeviceSessions.First();
        Assert.NotNull(firstSession.Location);
    }

    [Fact]
    public void GetSecuritySettings_FirstDeviceSession_LastActive_IsMinValue() {
        var result = UserQueries.GetSecuritySettings(_userService);
        var firstSession = result.DeviceSessions.First();
        Assert.Equal(DateTime.MinValue, firstSession.LastActive);
    }

    [Fact]
    public void
        GetSecuritySettings_FirstDeviceSession_Current_DefaultsToTrue() {
        var result = UserQueries.GetSecuritySettings(_userService);
        var firstSession = result.DeviceSessions.First();
        Assert.True(firstSession.Current);
    }
}