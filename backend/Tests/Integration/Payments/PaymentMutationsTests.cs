using ElaviewBackend.Data.Entities;
using ElaviewBackend.Tests.Integration.Fixtures;
using ElaviewBackend.Tests.Shared.Extensions;
using ElaviewBackend.Tests.Shared.Models;
using FluentAssertions;
using Xunit;

namespace ElaviewBackend.Tests.Integration.Payments;

[Collection("Integration")]
public sealed class PaymentMutationsTests(IntegrationTestFixture fixture)
    : IntegrationTestBase(fixture) {
    [Fact]
    public async Task CreatePaymentIntent_Unauthenticated_ReturnsAuthError() {
        var response = await Client.MutateAsync<CreatePaymentIntentResponse>("""
                mutation($input: CreatePaymentIntentInput!) {
                    createPaymentIntent(input: $input) {
                        clientSecret
                        paymentIntentId
                        amount
                    }
                }
                """,
            new { input = new { bookingId = Guid.NewGuid() } });

        response.Errors.Should().NotBeNullOrEmpty();
        response.Errors!.Should().ContainSingle()
            .Which.Extensions.Should().ContainKey("code")
            .WhoseValue?.ToString().Should().Be("AUTH_NOT_AUTHENTICATED");
    }

    [Fact]
    public async Task CreatePaymentIntent_BookingNotApproved_ReturnsError() {
        var (advertiser, advertiserProfile) = await SeedAdvertiserAsync();
        var (_, ownerProfile) = await SeedSpaceOwnerAsync();
        await LoginAsync(advertiser.Email, "Test123!");

        var campaign = await SeedCampaignAsync(advertiserProfile.Id);
        var space = await SeedSpaceAsync(ownerProfile.Id);
        var booking = await SeedBookingAsync(campaign.Id, space.Id);

        var response = await Client.MutateAsync<CreatePaymentIntentResponse>("""
                mutation($input: CreatePaymentIntentInput!) {
                    createPaymentIntent(input: $input) {
                        clientSecret
                        paymentIntentId
                        amount
                    }
                }
                """,
            new { input = new { bookingId = booking.Id } });

        response.Errors.Should().NotBeNullOrEmpty();
        response.Errors!.First().Message.Should().Contain("approved");
    }

    [Fact]
    public async Task CreatePaymentIntent_OtherUserBooking_ReturnsError() {
        var user = await CreateAndLoginUserAsync();
        var (_, advertiserProfile) = await SeedAdvertiserAsync();
        var (_, ownerProfile) = await SeedSpaceOwnerAsync();

        var campaign = await SeedCampaignAsync(advertiserProfile.Id);
        var space = await SeedSpaceAsync(ownerProfile.Id);
        var booking = await SeedBookingWithStatusAsync(campaign.Id, space.Id,
            BookingStatus.Approved);

        var response = await Client.MutateAsync<CreatePaymentIntentResponse>("""
                mutation($input: CreatePaymentIntentInput!) {
                    createPaymentIntent(input: $input) {
                        clientSecret
                        paymentIntentId
                        amount
                    }
                }
                """,
            new { input = new { bookingId = booking.Id } });

        response.Errors.Should().NotBeNullOrEmpty();
    }

    [Fact]
    public async Task ConfirmPayment_Unauthenticated_ReturnsAuthError() {
        var response = await Client.MutateAsync<ConfirmPaymentResponse>("""
                mutation($input: ConfirmPaymentInput!) {
                    confirmPayment(input: $input) {
                        payment {
                            id
                            status
                        }
                    }
                }
                """,
            new { input = new { paymentIntentId = "pi_test_12345" } });

        response.Errors.Should().NotBeNullOrEmpty();
        response.Errors!.Should().ContainSingle()
            .Which.Extensions.Should().ContainKey("code")
            .WhoseValue?.ToString().Should().Be("AUTH_NOT_AUTHENTICATED");
    }

    [Fact]
    public async Task ConfirmPayment_InvalidPaymentIntent_ReturnsError() {
        var user = await CreateAndLoginUserAsync();

        var response = await Client.MutateAsync<ConfirmPaymentResponse>("""
                mutation($input: ConfirmPaymentInput!) {
                    confirmPayment(input: $input) {
                        payment {
                            id
                            status
                        }
                    }
                }
                """,
            new { input = new { paymentIntentId = "pi_nonexistent" } });

        response.Errors.Should().NotBeNullOrEmpty();
        response.Errors!.First().Message.Should().Contain("not found");
    }

    [Fact]
    public async Task ConnectStripeAccount_Unauthenticated_ReturnsAuthError() {
        var response = await Client.MutateAsync<ConnectStripeAccountResponse>(
            """
            mutation {
                connectStripeAccount {
                    accountId
                    onboardingUrl
                }
            }
            """);

        response.Errors.Should().NotBeNullOrEmpty();
        response.Errors!.Should().ContainSingle()
            .Which.Extensions.Should().ContainKey("code")
            .WhoseValue?.ToString().Should().Be("AUTH_NOT_AUTHENTICATED");
    }

    [Fact]
    public async Task ConnectStripeAccount_NotSpaceOwner_ReturnsError() {
        var user = await CreateAndLoginUserAsync();

        var response = await Client.MutateAsync<ConnectStripeAccountResponse>(
            """
            mutation {
                connectStripeAccount {
                    accountId
                    onboardingUrl
                }
            }
            """);

        response.Errors.Should().NotBeNullOrEmpty();
        response.Errors!.First().Message.Should()
            .Contain("Space owner profile not found");
    }

    [Fact]
    public async Task RefreshStripeAccountStatus_NotSpaceOwner_ReturnsError() {
        var user = await CreateAndLoginUserAsync();

        var response =
            await Client.MutateAsync<RefreshStripeAccountStatusResponse>("""
                mutation {
                    refreshStripeAccountStatus {
                        profile {
                            id
                        }
                    }
                }
                """);

        response.Errors.Should().NotBeNullOrEmpty();
        response.Errors!.First().Message.Should()
            .Contain("Space owner profile not found");
    }

    [Fact]
    public async Task
        RefreshStripeAccountStatus_NoStripeAccount_ReturnsError() {
        var (owner, _) = await SeedSpaceOwnerAsync();
        await LoginAsync(owner.Email, "Test123!");

        var response =
            await Client.MutateAsync<RefreshStripeAccountStatusResponse>("""
                mutation {
                    refreshStripeAccountStatus {
                        profile {
                            id
                        }
                    }
                }
                """);

        response.Errors.Should().NotBeNullOrEmpty();
        response.Errors!.First().Message.Should()
            .Contain("No Stripe account connected");
    }

    [Fact]
    public async Task ProcessPayout_NonAdmin_ReturnsAuthError() {
        var (owner, _) = await SeedSpaceOwnerAsync();
        await LoginAsync(owner.Email, "Test123!");

        var response = await Client.MutateAsync<ProcessPayoutResponse>("""
                mutation($input: ProcessPayoutInput!) {
                    processPayout(input: $input) {
                        payout {
                            id
                            status
                        }
                    }
                }
                """,
            new {
                input = new { bookingId = Guid.NewGuid(), stage = "STAGE1" }
            });

        response.Errors.Should().NotBeNullOrEmpty();
    }

    [Fact]
    public async Task RequestRefund_NonAdmin_ReturnsAuthError() {
        var (advertiser, _) = await SeedAdvertiserAsync();
        await LoginAsync(advertiser.Email, "Test123!");

        var response = await Client.MutateAsync<RequestRefundResponse>("""
                mutation($input: RequestRefundInput!) {
                    requestRefund(input: $input) {
                        refund {
                            id
                            status
                        }
                    }
                }
                """,
            new {
                input = new {
                    paymentId = Guid.NewGuid(),
                    amount = 100.00m,
                    reason = "Test refund"
                }
            });

        response.Errors.Should().NotBeNullOrEmpty();
    }

    [Fact]
    public async Task RetryPayout_NonAdmin_ReturnsAuthError() {
        var (owner, _) = await SeedSpaceOwnerAsync();
        await LoginAsync(owner.Email, "Test123!");

        var response = await Client.MutateAsync<RetryPayoutResponse>("""
                mutation($input: RetryPayoutInput!) {
                    retryPayout(input: $input) {
                        payout {
                            id
                            status
                        }
                    }
                }
                """,
            new { input = new { payoutId = Guid.NewGuid() } });

        response.Errors.Should().NotBeNullOrEmpty();
    }
}