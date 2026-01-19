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
public sealed class PaymentAdminMutationsTests(IntegrationTestFixture fixture)
    : IntegrationTestBase(fixture) {
    [Fact]
    public async Task GetTransactionsByBooking_AsAdmin_ReturnsTransactions() {
        await LoginAsAdminAsync();
        var (_, advertiserProfile) = await SeedAdvertiserAsync();
        var (_, ownerProfile) = await SeedSpaceOwnerAsync();

        var campaign = await SeedCampaignAsync(advertiserProfile.Id);
        var space = await SeedSpaceAsync(ownerProfile.Id);
        var booking = await SeedBookingAsync(campaign.Id, space.Id);
        await SeedTransactionAsync(booking.Id);
        await SeedTransactionAsync(booking.Id);

        var response = await Client.QueryAsync<TransactionsByBookingResponse>(
            """
            query($bookingId: ID!) {
                transactionsByBooking(bookingId: $bookingId) {
                    nodes {
                        id
                        type
                        amount
                        description
                    }
                }
            }
            """,
            new { bookingId = booking.Id });

        response.Errors.Should().BeNullOrEmpty();
        response.Data!.TransactionsByBooking.Nodes.Should().HaveCount(2);
    }

    [Fact]
    public async Task GetTransactionsByBooking_NonAdmin_ReturnsAuthError() {
        var user = await CreateAndLoginUserAsync();
        var (_, advertiserProfile) = await SeedAdvertiserAsync();
        var (_, ownerProfile) = await SeedSpaceOwnerAsync();

        var campaign = await SeedCampaignAsync(advertiserProfile.Id);
        var space = await SeedSpaceAsync(ownerProfile.Id);
        var booking = await SeedBookingAsync(campaign.Id, space.Id);

        var response = await Client.QueryAsync<TransactionsByBookingResponse>(
            """
            query($bookingId: ID!) {
                transactionsByBooking(bookingId: $bookingId) {
                    nodes {
                        id
                    }
                }
            }
            """,
            new { bookingId = booking.Id });

        response.Errors.Should().NotBeNullOrEmpty();
    }

    private async Task<Transaction> SeedTransactionAsync(Guid bookingId) {
        var transaction = TransactionFactory.Create(bookingId);
        using var scope = Fixture.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        context.Transactions.Add(transaction);
        await context.SaveChangesAsync();
        return transaction;
    }
}