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
public sealed class PaymentQueriesTests(IntegrationTestFixture fixture)
    : IntegrationTestBase(fixture) {
    [Fact]
    public async Task GetPaymentById_AsOwner_ReturnsPayment() {
        var (owner, ownerProfile) = await SeedSpaceOwnerAsync();
        var (_, advertiserProfile) = await SeedAdvertiserAsync();
        await LoginAsync(owner.Email, "Test123!");

        var campaign = await SeedCampaignAsync(advertiserProfile.Id);
        var space = await SeedSpaceAsync(ownerProfile.Id);
        var booking = await SeedBookingAsync(campaign.Id, space.Id);
        var payment = await SeedPaymentAsync(booking.Id);

        var response = await Client.QueryAsync<PaymentByIdResponse>("""
                query($id: ID!) {
                    paymentById(id: $id) {
                        id
                        status
                        amount
                        stripePaymentIntentId
                    }
                }
                """,
            new { id = payment.Id });

        response.Errors.Should().BeNullOrEmpty();
        response.Data!.PaymentById.Should().NotBeNull();
        response.Data!.PaymentById!.Id.Should().Be(payment.Id);
        response.Data!.PaymentById!.Status.Should().Be("PENDING");
    }

    [Fact]
    public async Task GetPaymentById_Unauthenticated_ReturnsAuthError() {
        var response = await Client.QueryAsync<PaymentByIdResponse>("""
                query($id: ID!) {
                    paymentById(id: $id) {
                        id
                    }
                }
                """,
            new { id = Guid.NewGuid() });

        response.Errors.Should().NotBeNullOrEmpty();
        response.Errors!.Should().ContainSingle()
            .Which.Extensions.Should().ContainKey("code");
    }

    [Fact]
    public async Task GetPaymentsByBooking_ReturnsPayments() {
        var (owner, ownerProfile) = await SeedSpaceOwnerAsync();
        var (_, advertiserProfile) = await SeedAdvertiserAsync();
        await LoginAsync(owner.Email, "Test123!");

        var campaign = await SeedCampaignAsync(advertiserProfile.Id);
        var space = await SeedSpaceAsync(ownerProfile.Id);
        var booking = await SeedBookingAsync(campaign.Id, space.Id);
        await SeedPaymentAsync(booking.Id);
        await SeedPaymentAsync(booking.Id);

        var response = await Client.QueryAsync<PaymentsByBookingResponse>("""
                query($bookingId: ID!) {
                    paymentsByBooking(bookingId: $bookingId) {
                        nodes {
                            id
                            status
                            amount
                        }
                    }
                }
                """,
            new { bookingId = booking.Id });

        response.Errors.Should().BeNullOrEmpty();
        response.Data!.PaymentsByBooking.Nodes.Should().HaveCount(2);
    }

    [Fact]
    public async Task GetMyPayouts_AsSpaceOwner_ReturnsPayouts() {
        var (owner, ownerProfile) = await SeedSpaceOwnerAsync();
        var (_, advertiserProfile) = await SeedAdvertiserAsync();
        await LoginAsync(owner.Email, "Test123!");

        var campaign = await SeedCampaignAsync(advertiserProfile.Id);
        var space = await SeedSpaceAsync(ownerProfile.Id);
        var booking = await SeedBookingAsync(campaign.Id, space.Id);
        await SeedPayoutAsync(booking.Id, ownerProfile.Id, PayoutStage.Stage1);

        var response = await Client.QueryAsync<MyPayoutsResponse>("""
            query {
                myPayouts {
                    nodes {
                        id
                        status
                        stage
                        amount
                    }
                }
            }
            """);

        response.Errors.Should().BeNullOrEmpty();
        response.Data!.MyPayouts.Nodes.Should().HaveCount(1);
        response.Data!.MyPayouts.Nodes.First().Stage.Should().Be("STAGE1");
    }

    [Fact]
    public async Task GetEarningsSummary_AsSpaceOwner_ReturnsSummary() {
        var (owner, ownerProfile) = await SeedSpaceOwnerAsync();
        var (_, advertiserProfile) = await SeedAdvertiserAsync();
        await LoginAsync(owner.Email, "Test123!");

        var campaign = await SeedCampaignAsync(advertiserProfile.Id);
        var space = await SeedSpaceAsync(ownerProfile.Id);
        var booking = await SeedBookingAsync(campaign.Id, space.Id);
        await SeedPayoutAsync(booking.Id, ownerProfile.Id, PayoutStage.Stage1,
            PayoutStatus.Completed);

        var response = await Client.QueryAsync<GetEarningsSummaryResponse>("""
            query {
                earningsSummary {
                    totalEarnings
                    pendingPayouts
                    availableBalance
                    thisMonthEarnings
                    lastMonthEarnings
                }
            }
            """);

        response.Errors.Should().BeNullOrEmpty();
        response.Data!.EarningsSummary.Should().NotBeNull();
        response.Data!.EarningsSummary.TotalEarnings.Should().BeGreaterThan(0);
    }

    private async Task<Payment> SeedPaymentAsync(Guid bookingId,
        Action<Payment>? customize = null) {
        var payment = PaymentFactory.Create(bookingId, customize);
        using var scope = Fixture.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        context.Payments.Add(payment);
        await context.SaveChangesAsync();
        return payment;
    }

    private async Task<Payout> SeedPayoutAsync(Guid bookingId,
        Guid spaceOwnerProfileId, PayoutStage stage,
        PayoutStatus status = PayoutStatus.Pending) {
        var payout = new Payout {
            Id = Guid.NewGuid(),
            BookingId = bookingId,
            SpaceOwnerProfileId = spaceOwnerProfileId,
            Stage = stage,
            Amount = 100m,
            Status = status,
            ProcessedAt = status == PayoutStatus.Completed
                ? DateTime.UtcNow
                : null,
            CreatedAt = DateTime.UtcNow
        };
        using var scope = Fixture.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        context.Payouts.Add(payout);
        await context.SaveChangesAsync();
        return payout;
    }
}