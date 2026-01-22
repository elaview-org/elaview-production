using ElaviewBackend.Data.Entities;
using ElaviewBackend.Tests.Integration.Fixtures;
using ElaviewBackend.Tests.Shared.Extensions;
using ElaviewBackend.Tests.Shared.Models;
using FluentAssertions;
using Xunit;

namespace ElaviewBackend.Tests.Integration.Payments;

[Collection("Integration")]
public sealed class PaymentEdgeCaseTests(IntegrationTestFixture fixture)
    : IntegrationTestBase(fixture) {
    [Fact]
    public async Task CreatePaymentIntent_NotApproved_ReturnsInvalidStatusTransition() {
        var (advertiser, advertiserProfile) = await SeedAdvertiserAsync();
        var (_, ownerProfile) = await SeedSpaceOwnerAsync();
        await LoginAsync(advertiser.Email, "Test123!");

        var campaign = await SeedCampaignAsync(advertiserProfile.Id);
        var space = await SeedSpaceAsync(ownerProfile.Id);
        var booking = await SeedBookingAsync(campaign.Id, space.Id);

        var response = await Client.MutateAsync<CreatePaymentIntentResponse>("""
            mutation($bookingId: ID!) {
                createPaymentIntent(bookingId: $bookingId) {
                    clientSecret
                    paymentIntentId
                    amount
                }
            }
            """, new { bookingId = booking.Id });

        response.Errors.Should().NotBeNullOrEmpty();
        response.Errors!.First().Extensions.Should().ContainKey("code");
        response.Errors!.First().Extensions!["code"].Should()
            .Be("INVALID_STATUS_TRANSITION");
    }

    [Fact]
    public async Task CreatePaymentIntent_AlreadyPaid_ReturnsConflict() {
        var (advertiser, advertiserProfile) = await SeedAdvertiserAsync();
        var (_, ownerProfile) = await SeedSpaceOwnerAsync();
        await LoginAsync(advertiser.Email, "Test123!");

        var campaign = await SeedCampaignAsync(advertiserProfile.Id);
        var space = await SeedSpaceAsync(ownerProfile.Id);
        var booking = await SeedBookingWithStatusAsync(campaign.Id, space.Id,
            BookingStatus.Paid);

        var response = await Client.MutateAsync<CreatePaymentIntentResponse>("""
            mutation($bookingId: ID!) {
                createPaymentIntent(bookingId: $bookingId) {
                    clientSecret
                    paymentIntentId
                    amount
                }
            }
            """, new { bookingId = booking.Id });

        response.Errors.Should().NotBeNullOrEmpty();
        response.Errors!.First().Extensions.Should().ContainKey("code");
        response.Errors!.First().Extensions!["code"].Should().Be("CONFLICT");
    }

    [Fact]
    public async Task CreatePaymentIntent_AsNonAdvertiser_ReturnsForbidden() {
        var (_, advertiserProfile) = await SeedAdvertiserAsync();
        var (_, ownerProfile) = await SeedSpaceOwnerAsync();

        var campaign = await SeedCampaignAsync(advertiserProfile.Id);
        var space = await SeedSpaceAsync(ownerProfile.Id);
        var booking = await SeedBookingWithStatusAsync(campaign.Id, space.Id,
            BookingStatus.Approved);

        var unrelatedUser = await CreateAndLoginUserAsync();

        var response = await Client.MutateAsync<CreatePaymentIntentResponse>("""
            mutation($bookingId: ID!) {
                createPaymentIntent(bookingId: $bookingId) {
                    clientSecret
                    paymentIntentId
                    amount
                }
            }
            """, new { bookingId = booking.Id });

        response.Errors.Should().NotBeNullOrEmpty();
        response.Errors!.First().Extensions.Should().ContainKey("code");
        response.Errors!.First().Extensions!["code"].Should().Be("FORBIDDEN");
    }

    [Fact]
    public async Task CreatePaymentIntent_NonexistentBooking_ReturnsNotFound() {
        var (advertiser, _) = await SeedAdvertiserAsync();
        await LoginAsync(advertiser.Email, "Test123!");

        var response = await Client.MutateAsync<CreatePaymentIntentResponse>("""
            mutation($bookingId: ID!) {
                createPaymentIntent(bookingId: $bookingId) {
                    clientSecret
                    paymentIntentId
                    amount
                }
            }
            """, new { bookingId = Guid.NewGuid() });

        response.Errors.Should().NotBeNullOrEmpty();
        response.Errors!.First().Extensions.Should().ContainKey("code");
        response.Errors!.First().Extensions!["code"].Should().Be("NOT_FOUND");
    }

    [Fact]
    public async Task RequestRefund_NoPayment_ReturnsNotFound() {
        await LoginAsAdminAsync();

        var response = await Client.MutateAsync<RequestRefundResponse>("""
            mutation($input: RequestRefundInput!) {
                requestRefund(input: $input) {
                    refund { id status amount }
                }
            }
            """,
            new {
                input = new {
                    paymentId = Guid.NewGuid(),
                    amount = 100.00m,
                    reason = "Customer requested"
                }
            });

        response.Errors.Should().NotBeNullOrEmpty();
        response.Errors!.First().Extensions.Should().ContainKey("code");
        response.Errors!.First().Extensions!["code"].Should().Be("NOT_FOUND");
    }
}