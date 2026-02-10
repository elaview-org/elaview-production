using ElaviewBackend.Data;
using ElaviewBackend.Data.Entities;
using ElaviewBackend.Tests.Integration.Fixtures;
using ElaviewBackend.Tests.Shared.Extensions;
using ElaviewBackend.Tests.Shared.Models;
using FluentAssertions;
using Xunit;

namespace ElaviewBackend.Tests.Integration.Marketplace;

[Collection("Integration")]
public sealed class BookingStatusTransitionTests(IntegrationTestFixture fixture)
    : IntegrationTestBase(fixture) {
    [Theory]
    [InlineData(BookingStatus.Approved)]
    [InlineData(BookingStatus.Paid)]
    [InlineData(BookingStatus.FileDownloaded)]
    [InlineData(BookingStatus.Installed)]
    [InlineData(BookingStatus.Completed)]
    [InlineData(BookingStatus.Cancelled)]
    [InlineData(BookingStatus.Rejected)]
    public async Task ApproveBooking_NotPendingApproval_ReturnsInvalidStatusTransition(
        BookingStatus initialStatus) {
        var (owner, ownerProfile) = await SeedSpaceOwnerAsync();
        var (_, advertiserProfile) = await SeedAdvertiserAsync();
        await LoginAsync(owner.Email, "Test123!");

        var campaign = await SeedCampaignAsync(advertiserProfile.Id);
        var space = await SeedSpaceAsync(ownerProfile.Id);
        var booking = await SeedBookingWithStatusAsync(campaign.Id, space.Id,
            initialStatus);

        var response = await Client.MutateAsync<ApproveBookingResponse>("""
            mutation($input: ApproveBookingInput!) {
                approveBooking(input: $input) {
                    booking { id status }
                    errors { __typename }
                }
            }
            """, new { input = new { id = booking.Id } });

        response.Data!.ApproveBooking.Errors.Should().NotBeNullOrEmpty();
        response.Data!.ApproveBooking.Errors!.First().TypeName.Should()
            .Be("InvalidStatusTransitionError");
    }

    [Theory]
    [InlineData(BookingStatus.Approved)]
    [InlineData(BookingStatus.Paid)]
    [InlineData(BookingStatus.FileDownloaded)]
    [InlineData(BookingStatus.Installed)]
    [InlineData(BookingStatus.Completed)]
    [InlineData(BookingStatus.Cancelled)]
    [InlineData(BookingStatus.Rejected)]
    public async Task RejectBooking_NotPendingApproval_ReturnsInvalidStatusTransition(
        BookingStatus initialStatus) {
        var (owner, ownerProfile) = await SeedSpaceOwnerAsync();
        var (_, advertiserProfile) = await SeedAdvertiserAsync();
        await LoginAsync(owner.Email, "Test123!");

        var campaign = await SeedCampaignAsync(advertiserProfile.Id);
        var space = await SeedSpaceAsync(ownerProfile.Id);
        var booking = await SeedBookingWithStatusAsync(campaign.Id, space.Id,
            initialStatus);

        var response = await Client.MutateAsync<RejectBookingResponse>("""
            mutation($input: RejectBookingInput!) {
                rejectBooking(input: $input) {
                    booking { id status }
                    errors { __typename }
                }
            }
            """, new { input = new { id = booking.Id, reason = "Not suitable" } });

        response.Data!.RejectBooking.Errors.Should().NotBeNullOrEmpty();
        response.Data!.RejectBooking.Errors!.First().TypeName.Should()
            .Be("InvalidStatusTransitionError");
    }

    [Theory]
    [InlineData(BookingStatus.PendingApproval)]
    [InlineData(BookingStatus.Approved)]
    [InlineData(BookingStatus.FileDownloaded)]
    [InlineData(BookingStatus.Installed)]
    [InlineData(BookingStatus.Completed)]
    [InlineData(BookingStatus.Cancelled)]
    public async Task MarkFileDownloaded_NotPaid_ReturnsInvalidStatusTransition(
        BookingStatus initialStatus) {
        var (owner, ownerProfile) = await SeedSpaceOwnerAsync();
        var (_, advertiserProfile) = await SeedAdvertiserAsync();
        await LoginAsync(owner.Email, "Test123!");

        var campaign = await SeedCampaignAsync(advertiserProfile.Id);
        var space = await SeedSpaceAsync(ownerProfile.Id);
        var booking = await SeedBookingWithStatusAsync(campaign.Id, space.Id,
            initialStatus);

        var response = await Client.MutateAsync<MarkFileDownloadedResponse>("""
            mutation($input: MarkFileDownloadedInput!) {
                markFileDownloaded(input: $input) {
                    booking { id status }
                    errors { __typename }
                }
            }
            """, new { input = new { id = booking.Id } });

        response.Data!.MarkFileDownloaded.Errors.Should().NotBeNullOrEmpty();
        response.Data!.MarkFileDownloaded.Errors!.First().TypeName.Should()
            .Be("InvalidStatusTransitionError");
    }

    [Theory]
    [InlineData(BookingStatus.PendingApproval)]
    [InlineData(BookingStatus.Approved)]
    [InlineData(BookingStatus.Paid)]
    [InlineData(BookingStatus.Installed)]
    [InlineData(BookingStatus.Completed)]
    [InlineData(BookingStatus.Cancelled)]
    public async Task MarkInstalled_NotFileDownloaded_ReturnsInvalidStatusTransition(
        BookingStatus initialStatus) {
        var (owner, ownerProfile) = await SeedSpaceOwnerAsync();
        var (_, advertiserProfile) = await SeedAdvertiserAsync();
        await LoginAsync(owner.Email, "Test123!");

        var campaign = await SeedCampaignAsync(advertiserProfile.Id);
        var space = await SeedSpaceAsync(ownerProfile.Id);
        var booking = await SeedBookingWithStatusAsync(campaign.Id, space.Id,
            initialStatus);

        var response = await Client.MutateAsync<MarkInstalledResponse>("""
            mutation($input: MarkInstalledInput!) {
                markInstalled(input: $input) {
                    booking { id status }
                    errors { __typename }
                }
            }
            """, new { input = new { id = booking.Id } });

        response.Data!.MarkInstalled.Errors.Should().NotBeNullOrEmpty();
        response.Data!.MarkInstalled.Errors!.First().TypeName.Should()
            .Be("InvalidStatusTransitionError");
    }

    [Theory]
    [InlineData(BookingStatus.PendingApproval)]
    [InlineData(BookingStatus.Approved)]
    [InlineData(BookingStatus.Paid)]
    [InlineData(BookingStatus.FileDownloaded)]
    [InlineData(BookingStatus.Installed)]
    [InlineData(BookingStatus.Completed)]
    [InlineData(BookingStatus.Cancelled)]
    [InlineData(BookingStatus.Disputed)]
    public async Task ApproveProof_NotVerified_ReturnsInvalidStatusTransition(
        BookingStatus initialStatus) {
        var (advertiser, advertiserProfile) = await SeedAdvertiserAsync();
        var (_, ownerProfile) = await SeedSpaceOwnerAsync();
        await LoginAsync(advertiser.Email, "Test123!");

        var campaign = await SeedCampaignAsync(advertiserProfile.Id);
        var space = await SeedSpaceAsync(ownerProfile.Id);
        var booking = await SeedBookingWithStatusAsync(campaign.Id, space.Id, initialStatus);

        using (var scope = Fixture.Services.CreateScope()) {
            var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            context.BookingProofs.Add(new BookingProof {
                Id = Guid.NewGuid(),
                BookingId = booking.Id,
                Photos = ["https://example.com/photo.jpg"],
                Status = ProofStatus.Pending,
                SubmittedAt = DateTime.UtcNow,
                AutoApproveAt = DateTime.UtcNow.AddHours(48),
                CreatedAt = DateTime.UtcNow
            });
            await context.SaveChangesAsync();
        }

        var response = await Client.MutateAsync<ApproveProofResponse>("""
            mutation($input: ApproveProofInput!) {
                approveProof(input: $input) {
                    booking { id status }
                    errors { __typename }
                }
            }
            """, new { input = new { bookingId = booking.Id } });

        response.Data!.ApproveProof.Errors.Should().NotBeNullOrEmpty();
        response.Data!.ApproveProof.Errors!.First().TypeName.Should()
            .Be("InvalidStatusTransitionError");
    }

    [Theory]
    [InlineData(BookingStatus.PendingApproval)]
    [InlineData(BookingStatus.Approved)]
    [InlineData(BookingStatus.Paid)]
    [InlineData(BookingStatus.FileDownloaded)]
    [InlineData(BookingStatus.Installed)]
    [InlineData(BookingStatus.Completed)]
    [InlineData(BookingStatus.Cancelled)]
    [InlineData(BookingStatus.Disputed)]
    public async Task DisputeProof_NotVerified_ReturnsInvalidStatusTransition(
        BookingStatus initialStatus) {
        var (advertiser, advertiserProfile) = await SeedAdvertiserAsync();
        var (_, ownerProfile) = await SeedSpaceOwnerAsync();
        await LoginAsync(advertiser.Email, "Test123!");

        var campaign = await SeedCampaignAsync(advertiserProfile.Id);
        var space = await SeedSpaceAsync(ownerProfile.Id);
        var booking = await SeedBookingWithStatusAsync(campaign.Id, space.Id, initialStatus);

        using (var scope = Fixture.Services.CreateScope()) {
            var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            context.BookingProofs.Add(new BookingProof {
                Id = Guid.NewGuid(),
                BookingId = booking.Id,
                Photos = ["https://example.com/photo.jpg"],
                Status = ProofStatus.Pending,
                SubmittedAt = DateTime.UtcNow,
                AutoApproveAt = DateTime.UtcNow.AddHours(48),
                CreatedAt = DateTime.UtcNow
            });
            await context.SaveChangesAsync();
        }

        var response = await Client.MutateAsync<DisputeProofResponse>("""
            mutation($input: DisputeProofInput!) {
                disputeProof(input: $input) {
                    booking { id status }
                    errors { __typename }
                }
            }
            """, new {
            input = new {
                bookingId = booking.Id,
                issueType = "POOR_QUALITY",
                reason = "Not acceptable"
            }
        });

        response.Data!.DisputeProof.Errors.Should().NotBeNullOrEmpty();
        response.Data!.DisputeProof.Errors!.First().TypeName.Should()
            .Be("InvalidStatusTransitionError");
    }

    [Theory]
    [InlineData(BookingStatus.FileDownloaded)]
    [InlineData(BookingStatus.Installed)]
    [InlineData(BookingStatus.Completed)]
    [InlineData(BookingStatus.Cancelled)]
    [InlineData(BookingStatus.Rejected)]
    public async Task CancelBooking_NotCancellable_ReturnsInvalidStatusTransition(
        BookingStatus initialStatus) {
        var (advertiser, advertiserProfile) = await SeedAdvertiserAsync();
        var (_, ownerProfile) = await SeedSpaceOwnerAsync();
        await LoginAsync(advertiser.Email, "Test123!");

        var campaign = await SeedCampaignAsync(advertiserProfile.Id);
        var space = await SeedSpaceAsync(ownerProfile.Id);
        var booking = await SeedBookingWithStatusAsync(campaign.Id, space.Id,
            initialStatus);

        var response = await Client.MutateAsync<CancelBookingResponse>("""
            mutation($input: CancelBookingInput!) {
                cancelBooking(input: $input) {
                    booking { id status }
                    errors { __typename }
                }
            }
            """, new { input = new { id = booking.Id, reason = "Changed plans" } });

        response.Data!.CancelBooking.Errors.Should().NotBeNullOrEmpty();
        response.Data!.CancelBooking.Errors!.First().TypeName.Should()
            .Be("InvalidStatusTransitionError");
    }
}
