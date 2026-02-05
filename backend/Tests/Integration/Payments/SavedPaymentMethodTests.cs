using ElaviewBackend.Data;
using ElaviewBackend.Data.Entities;
using ElaviewBackend.Tests.Integration.Fixtures;
using ElaviewBackend.Tests.Shared.Extensions;
using ElaviewBackend.Tests.Shared.Factories;
using ElaviewBackend.Tests.Shared.Models;
using FluentAssertions;
using Xunit;

namespace ElaviewBackend.Tests.Integration.Payments;

[Collection("Integration")]
public sealed class SavedPaymentMethodTests(IntegrationTestFixture fixture)
    : IntegrationTestBase(fixture) {
    [Fact]
    public async Task GetMySavedPaymentMethods_NoPaymentMethods_ReturnsEmptyList() {
        var (advertiser, _) = await SeedAdvertiserAsync();
        await LoginAsync(advertiser.Email, "Test123!");

        var response = await Client.QueryAsync<MySavedPaymentMethodsResponse>("""
            query {
                mySavedPaymentMethods {
                    id
                    brand
                    last4
                    expMonth
                    expYear
                    isDefault
                }
            }
            """);

        response.Errors.Should().BeNullOrEmpty();
        response.Data!.MySavedPaymentMethods.Should().BeEmpty();
    }

    [Fact]
    public async Task GetMySavedPaymentMethods_HasPaymentMethods_ReturnsAll() {
        var (advertiser, advertiserProfile) = await SeedAdvertiserAsync();
        await SeedSavedPaymentMethodsAsync(advertiserProfile.Id, 3);
        await LoginAsync(advertiser.Email, "Test123!");

        var response = await Client.QueryAsync<MySavedPaymentMethodsResponse>("""
            query {
                mySavedPaymentMethods {
                    id
                    brand
                    last4
                    expMonth
                    expYear
                    isDefault
                }
            }
            """);

        response.Errors.Should().BeNullOrEmpty();
        response.Data!.MySavedPaymentMethods.Should().HaveCount(3);
        response.Data!.MySavedPaymentMethods.Should().ContainSingle(pm => pm.IsDefault);
    }

    [Fact]
    public async Task GetMySavedPaymentMethods_OtherUsersPaymentMethods_NotReturned() {
        var (advertiser1, advertiserProfile1) = await SeedAdvertiserAsync();
        var (advertiser2, advertiserProfile2) = await SeedAdvertiserAsync();

        await SeedSavedPaymentMethodsAsync(advertiserProfile1.Id, 2);
        await SeedSavedPaymentMethodsAsync(advertiserProfile2.Id, 3);

        await LoginAsync(advertiser1.Email, "Test123!");

        var response = await Client.QueryAsync<MySavedPaymentMethodsResponse>("""
            query {
                mySavedPaymentMethods {
                    id
                    brand
                    last4
                }
            }
            """);

        response.Errors.Should().BeNullOrEmpty();
        response.Data!.MySavedPaymentMethods.Should().HaveCount(2);
    }

    [Fact]
    public async Task GetMySavedPaymentMethods_Unauthenticated_ReturnsAuthError() {
        var response = await Client.QueryAsync<MySavedPaymentMethodsResponse>("""
            query {
                mySavedPaymentMethods {
                    id
                }
            }
            """);

        response.Errors.Should().NotBeNullOrEmpty();
        response.Errors!.Should().ContainSingle()
            .Which.Extensions.Should().ContainKey("code");
    }

    [Fact]
    public async Task GetMySavedPaymentMethods_AsSpaceOwner_ReturnsEmptyList() {
        var (owner, _) = await SeedSpaceOwnerAsync();
        await LoginAsync(owner.Email, "Test123!");

        var response = await Client.QueryAsync<MySavedPaymentMethodsResponse>("""
            query {
                mySavedPaymentMethods {
                    id
                }
            }
            """);

        response.Errors.Should().BeNullOrEmpty();
        response.Data!.MySavedPaymentMethods.Should().BeEmpty();
    }

    [Fact]
    public async Task GetMySavedPaymentMethods_ReturnsDefaultFirst() {
        var (advertiser, advertiserProfile) = await SeedAdvertiserAsync();
        await LoginAsync(advertiser.Email, "Test123!");

        var nonDefaultPm = SavedPaymentMethodFactory.Create(advertiserProfile.Id, pm => pm.IsDefault = false);
        var defaultPm = SavedPaymentMethodFactory.Create(advertiserProfile.Id, pm => pm.IsDefault = true);

        using var scope = Fixture.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        context.SavedPaymentMethods.AddRange([nonDefaultPm, defaultPm]);
        await context.SaveChangesAsync();

        var response = await Client.QueryAsync<MySavedPaymentMethodsResponse>("""
            query {
                mySavedPaymentMethods {
                    id
                    isDefault
                }
            }
            """);

        response.Errors.Should().BeNullOrEmpty();
        response.Data!.MySavedPaymentMethods.Should().HaveCount(2);
        response.Data!.MySavedPaymentMethods.First().IsDefault.Should().BeTrue();
    }

    private async Task<List<SavedPaymentMethod>> SeedSavedPaymentMethodsAsync(
        Guid advertiserProfileId, int count) {
        var paymentMethods = SavedPaymentMethodFactory.CreateMany(advertiserProfileId, count);
        using var scope = Fixture.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        context.SavedPaymentMethods.AddRange(paymentMethods);
        await context.SaveChangesAsync();
        return paymentMethods;
    }
}
