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
    public async Task GetMyPayments_AsAdvertiser_ReturnsPayments() {
        var (_, ownerProfile) = await SeedSpaceOwnerAsync();
        var (advertiser, advertiserProfile) = await SeedAdvertiserAsync();
        await LoginAsync(advertiser.Email, "Test123!");

        var campaign = await SeedCampaignAsync(advertiserProfile.Id);
        var space = await SeedSpaceAsync(ownerProfile.Id);
        var booking = await SeedBookingAsync(campaign.Id, space.Id);
        await SeedPaymentAsync(booking.Id);
        await SeedPaymentAsync(booking.Id);

        var response = await Client.QueryAsync<MyPaymentsResponse>("""
            query {
                myPayments {
                    nodes {
                        id
                        status
                        amount
                    }
                }
            }
            """);

        response.Errors.Should().BeNullOrEmpty();
        response.Data!.MyPayments.Nodes.Should().HaveCount(2);
    }

    [Fact]
    public async Task GetMyPayments_Unauthenticated_ReturnsAuthError() {
        var response = await Client.QueryAsync<MyPaymentsResponse>("""
            query {
                myPayments {
                    nodes {
                        id
                    }
                }
            }
            """);

        response.Errors.Should().NotBeNullOrEmpty();
        response.Errors!.Should().ContainSingle()
            .Which.Extensions.Should().ContainKey("code");
    }

    [Fact]
    public async Task GetAdvertiserSpendingSummary_AsAdvertiser_ReturnsSummary() {
        var (_, ownerProfile) = await SeedSpaceOwnerAsync();
        var (advertiser, advertiserProfile) = await SeedAdvertiserAsync();
        await LoginAsync(advertiser.Email, "Test123!");

        var campaign = await SeedCampaignAsync(advertiserProfile.Id);
        var space = await SeedSpaceAsync(ownerProfile.Id);
        var booking = await SeedBookingAsync(campaign.Id, space.Id);
        await SeedPaymentAsync(booking.Id, p => {
            p.Status = PaymentStatus.Succeeded;
            p.PaidAt = DateTime.UtcNow;
            p.StripeChargeId = "ch_test123";
        });

        var response = await Client.QueryAsync<GetAdvertiserSpendingSummaryResponse>("""
            query {
                advertiserSpendingSummary {
                    totalSpent
                    pendingPayments
                    thisMonthSpending
                    lastMonthSpending
                }
            }
            """);

        response.Errors.Should().BeNullOrEmpty();
        response.Data!.AdvertiserSpendingSummary.Should().NotBeNull();
        response.Data!.AdvertiserSpendingSummary.TotalSpent.Should().BeGreaterThan(0);
        response.Data!.AdvertiserSpendingSummary.ThisMonthSpending.Should().BeGreaterThan(0);
    }

    [Fact]
    public async Task GetAdvertiserSpendingSummary_WithPendingPayments_IncludesPending() {
        var (_, ownerProfile) = await SeedSpaceOwnerAsync();
        var (advertiser, advertiserProfile) = await SeedAdvertiserAsync();
        await LoginAsync(advertiser.Email, "Test123!");

        var campaign = await SeedCampaignAsync(advertiserProfile.Id);
        var space = await SeedSpaceAsync(ownerProfile.Id);
        var booking = await SeedBookingAsync(campaign.Id, space.Id);
        await SeedPaymentDirectAsync(booking.Id, PaymentStatus.Succeeded, 200m);
        await SeedPaymentDirectAsync(booking.Id, PaymentStatus.Pending, 150m);

        var response = await Client.QueryAsync<GetAdvertiserSpendingSummaryResponse>("""
            query {
                advertiserSpendingSummary {
                    totalSpent
                    pendingPayments
                    thisMonthSpending
                    lastMonthSpending
                }
            }
            """);

        response.Errors.Should().BeNullOrEmpty();
        response.Data!.AdvertiserSpendingSummary.TotalSpent.Should().Be(200m);
        response.Data!.AdvertiserSpendingSummary.PendingPayments.Should().Be(150m);
    }

    [Fact]
    public async Task GetAdvertiserSpendingSummary_Unauthenticated_ReturnsAuthError() {
        var response = await Client.QueryAsync<GetAdvertiserSpendingSummaryResponse>("""
            query {
                advertiserSpendingSummary {
                    totalSpent
                    pendingPayments
                    thisMonthSpending
                    lastMonthSpending
                }
            }
            """);

        response.Errors.Should().NotBeNullOrEmpty();
        response.Errors!.Should().ContainSingle()
            .Which.Extensions.Should().ContainKey("code");
    }

    [Fact]
    public async Task GetPaymentById_IncludesReceiptUrl() {
        var (owner, ownerProfile) = await SeedSpaceOwnerAsync();
        var (_, advertiserProfile) = await SeedAdvertiserAsync();
        await LoginAsync(owner.Email, "Test123!");

        var campaign = await SeedCampaignAsync(advertiserProfile.Id);
        var space = await SeedSpaceAsync(ownerProfile.Id);
        var booking = await SeedBookingAsync(campaign.Id, space.Id);
        var payment = await SeedPaymentAsync(booking.Id, p => {
            p.Status = PaymentStatus.Succeeded;
            p.PaidAt = DateTime.UtcNow;
            p.StripeChargeId = "ch_test123";
            p.ReceiptUrl = "https://pay.stripe.com/receipts/test123";
        });

        var response = await Client.QueryAsync<PaymentByIdResponse>("""
            query($id: ID!) {
                paymentById(id: $id) {
                    id
                    status
                    receiptUrl
                }
            }
            """,
            new { id = payment.Id });

        response.Errors.Should().BeNullOrEmpty();
        response.Data!.PaymentById.Should().NotBeNull();
        response.Data!.PaymentById!.ReceiptUrl.Should().Be("https://pay.stripe.com/receipts/test123");
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

    private async Task<Payment> SeedPaymentDirectAsync(
        Guid bookingId, PaymentStatus status, decimal amount) {
        var payment = new Payment {
            Id = Guid.NewGuid(),
            BookingId = bookingId,
            Type = PaymentType.Full,
            Amount = amount,
            StripePaymentIntentId = $"pi_test_{Guid.NewGuid():N}",
            Status = status,
            PaidAt = status == PaymentStatus.Succeeded ? DateTime.UtcNow : null,
            StripeChargeId = status == PaymentStatus.Succeeded ? "ch_test" : null,
            CreatedAt = DateTime.UtcNow
        };
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