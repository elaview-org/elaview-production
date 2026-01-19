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
    public async Task ProcessPayout_AsAdmin_WithInvalidBooking_ReturnsError() {
        await LoginAsAdminAsync();

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
        response.Errors!.First().Message.Should().Contain("not found");
    }

    [Fact]
    public async Task ProcessPayout_AsAdmin_WithPendingBooking_ReturnsError() {
        await LoginAsAdminAsync();
        var (_, advertiserProfile) = await SeedAdvertiserAsync();
        var (_, ownerProfile) = await SeedSpaceOwnerAsync();

        var campaign = await SeedCampaignAsync(advertiserProfile.Id);
        var space = await SeedSpaceAsync(ownerProfile.Id);
        var booking = await SeedBookingAsync(campaign.Id, space.Id);

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
            new { input = new { bookingId = booking.Id, stage = "STAGE1" } });

        response.Errors.Should().NotBeNullOrEmpty();
    }

    [Fact]
    public async Task
        ProcessPayout_AsAdmin_Stage1AlreadyProcessed_ReturnsError() {
        await LoginAsAdminAsync();
        var (_, advertiserProfile) = await SeedAdvertiserAsync();
        var (_, ownerProfile) = await SeedSpaceOwnerAsync();

        var campaign = await SeedCampaignAsync(advertiserProfile.Id);
        var space = await SeedSpaceAsync(ownerProfile.Id);
        var booking = await SeedBookingWithStatusAsync(campaign.Id, space.Id,
            BookingStatus.Paid);
        await SeedPayoutAsync(booking.Id, ownerProfile.Id, PayoutStage.Stage1,
            PayoutStatus.Completed);

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
            new { input = new { bookingId = booking.Id, stage = "STAGE1" } });

        response.Errors.Should().NotBeNullOrEmpty();
    }

    [Fact]
    public async Task RetryPayout_AsAdmin_WithInvalidPayout_ReturnsError() {
        await LoginAsAdminAsync();

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
        response.Errors!.First().Message.Should().Contain("not found");
    }

    [Fact]
    public async Task RetryPayout_AsAdmin_WithNonFailedPayout_ReturnsError() {
        await LoginAsAdminAsync();
        var (_, advertiserProfile) = await SeedAdvertiserAsync();
        var (_, ownerProfile) = await SeedSpaceOwnerAsync();

        var campaign = await SeedCampaignAsync(advertiserProfile.Id);
        var space = await SeedSpaceAsync(ownerProfile.Id);
        var booking = await SeedBookingWithStatusAsync(campaign.Id, space.Id,
            BookingStatus.Paid);
        var payout = await SeedPayoutAsync(booking.Id, ownerProfile.Id,
            PayoutStage.Stage1, PayoutStatus.Pending);

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
            new { input = new { payoutId = payout.Id } });

        response.Errors.Should().NotBeNullOrEmpty();
        response.Errors!.First().Message.Should().Contain("failed");
    }

    [Fact]
    public async Task RequestRefund_AsAdmin_WithInvalidPayment_ReturnsError() {
        await LoginAsAdminAsync();

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
        response.Errors!.First().Message.Should().Contain("not found");
    }

    [Fact]
    public async Task RequestRefund_AsAdmin_WithPendingPayment_ReturnsError() {
        await LoginAsAdminAsync();
        var (_, advertiserProfile) = await SeedAdvertiserAsync();
        var (_, ownerProfile) = await SeedSpaceOwnerAsync();

        var campaign = await SeedCampaignAsync(advertiserProfile.Id);
        var space = await SeedSpaceAsync(ownerProfile.Id);
        var booking = await SeedBookingAsync(campaign.Id, space.Id);
        var payment = await SeedPaymentAsync(booking.Id, PaymentStatus.Pending);

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
                    paymentId = payment.Id,
                    amount = 50.00m,
                    reason = "Test refund"
                }
            });

        response.Errors.Should().NotBeNullOrEmpty();
        response.Errors!.First().Message.Should().Contain("succeeded");
    }

    [Fact]
    public async Task
        RequestRefund_AsAdmin_ExceedsPaymentAmount_ReturnsError() {
        await LoginAsAdminAsync();
        var (_, advertiserProfile) = await SeedAdvertiserAsync();
        var (_, ownerProfile) = await SeedSpaceOwnerAsync();

        var campaign = await SeedCampaignAsync(advertiserProfile.Id);
        var space = await SeedSpaceAsync(ownerProfile.Id);
        var booking = await SeedBookingAsync(campaign.Id, space.Id);
        var payment =
            await SeedPaymentAsync(booking.Id, PaymentStatus.Succeeded, 100m);

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
                    paymentId = payment.Id,
                    amount = 150.00m,
                    reason = "Test refund"
                }
            });

        response.Errors.Should().NotBeNullOrEmpty();
        response.Errors!.First().Message.Should().Contain("exceeds");
    }

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

    private async Task<Payment> SeedPaymentAsync(Guid bookingId,
        PaymentStatus status, decimal? amount = null) {
        var payment = new Payment {
            Id = Guid.NewGuid(),
            BookingId = bookingId,
            Type = PaymentType.Full,
            Amount = amount ?? 100m,
            StripePaymentIntentId = $"pi_test_{Guid.NewGuid():N}",
            Status = status,
            PaidAt = status == PaymentStatus.Succeeded ? DateTime.UtcNow : null,
            StripeChargeId = status == PaymentStatus.Succeeded
                ? $"ch_test_{Guid.NewGuid():N}"
                : null,
            CreatedAt = DateTime.UtcNow
        };
        using var scope = Fixture.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        context.Payments.Add(payment);
        await context.SaveChangesAsync();
        return payment;
    }

    private async Task<Payout> SeedPayoutAsync(Guid bookingId,
        Guid spaceOwnerProfileId, PayoutStage stage, PayoutStatus status) {
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
            StripeTransferId = status == PayoutStatus.Completed
                ? $"tr_test_{Guid.NewGuid():N}"
                : null,
            CreatedAt = DateTime.UtcNow
        };
        using var scope = Fixture.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        context.Payouts.Add(payout);
        await context.SaveChangesAsync();
        return payout;
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