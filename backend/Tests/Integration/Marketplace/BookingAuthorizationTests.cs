using ElaviewBackend.Data.Entities;
using ElaviewBackend.Tests.Integration.Fixtures;
using ElaviewBackend.Tests.Shared.Extensions;
using ElaviewBackend.Tests.Shared.Models;
using FluentAssertions;
using Xunit;

namespace ElaviewBackend.Tests.Integration.Marketplace;

[Collection("Integration")]
public sealed class BookingAuthorizationTests(IntegrationTestFixture fixture)
    : IntegrationTestBase(fixture) {
    [Fact]
    public async Task ApproveBooking_AsAdvertiser_ReturnsForbidden() {
        var (advertiser, advertiserProfile) = await SeedAdvertiserAsync();
        var (_, ownerProfile) = await SeedSpaceOwnerAsync();
        await LoginAsync(advertiser.Email, "Test123!");

        var campaign = await SeedCampaignAsync(advertiserProfile.Id);
        var space = await SeedSpaceAsync(ownerProfile.Id);
        var booking = await SeedBookingAsync(campaign.Id, space.Id);

        var response = await Client.MutateAsync<ApproveBookingResponse>("""
            mutation($input: ApproveBookingInput!) {
                approveBooking(input: $input) {
                    booking { id status }
                    errors { __typename }
                }
            }
            """, new { input = new { id = booking.Id } });

        response.Data!.ApproveBooking.Errors.Should().NotBeNullOrEmpty();
        response.Data!.ApproveBooking.Errors!.First().TypeName.Should().Be("ForbiddenError");
    }

    [Fact]
    public async Task RejectBooking_AsAdvertiser_ReturnsForbidden() {
        var (advertiser, advertiserProfile) = await SeedAdvertiserAsync();
        var (_, ownerProfile) = await SeedSpaceOwnerAsync();
        await LoginAsync(advertiser.Email, "Test123!");

        var campaign = await SeedCampaignAsync(advertiserProfile.Id);
        var space = await SeedSpaceAsync(ownerProfile.Id);
        var booking = await SeedBookingAsync(campaign.Id, space.Id);

        var response = await Client.MutateAsync<RejectBookingResponse>("""
            mutation($input: RejectBookingInput!) {
                rejectBooking(input: $input) {
                    booking { id status }
                    errors { __typename }
                }
            }
            """, new { input = new { id = booking.Id, reason = "Test rejection" } });

        response.Data!.RejectBooking.Errors.Should().NotBeNullOrEmpty();
        response.Data!.RejectBooking.Errors!.First().TypeName.Should().Be("ForbiddenError");
    }

    [Fact]
    public async Task MarkFileDownloaded_AsAdvertiser_ReturnsForbidden() {
        var (advertiser, advertiserProfile) = await SeedAdvertiserAsync();
        var (_, ownerProfile) = await SeedSpaceOwnerAsync();
        await LoginAsync(advertiser.Email, "Test123!");

        var campaign = await SeedCampaignAsync(advertiserProfile.Id);
        var space = await SeedSpaceAsync(ownerProfile.Id);
        var booking = await SeedBookingWithStatusAsync(campaign.Id, space.Id,
            BookingStatus.Paid);

        var response = await Client.MutateAsync<MarkFileDownloadedResponse>("""
            mutation($input: MarkFileDownloadedInput!) {
                markFileDownloaded(input: $input) {
                    booking { id status }
                    errors { __typename }
                }
            }
            """, new { input = new { id = booking.Id } });

        response.Data!.MarkFileDownloaded.Errors.Should().NotBeNullOrEmpty();
        response.Data!.MarkFileDownloaded.Errors!.First().TypeName.Should().Be("ForbiddenError");
    }

    [Fact]
    public async Task MarkInstalled_AsAdvertiser_ReturnsForbidden() {
        var (advertiser, advertiserProfile) = await SeedAdvertiserAsync();
        var (_, ownerProfile) = await SeedSpaceOwnerAsync();
        await LoginAsync(advertiser.Email, "Test123!");

        var campaign = await SeedCampaignAsync(advertiserProfile.Id);
        var space = await SeedSpaceAsync(ownerProfile.Id);
        var booking = await SeedBookingWithStatusAsync(campaign.Id, space.Id,
            BookingStatus.FileDownloaded);

        var response = await Client.MutateAsync<MarkInstalledResponse>("""
            mutation($input: MarkInstalledInput!) {
                markInstalled(input: $input) {
                    booking { id status }
                    errors { __typename }
                }
            }
            """, new { input = new { id = booking.Id } });

        response.Data!.MarkInstalled.Errors.Should().NotBeNullOrEmpty();
        response.Data!.MarkInstalled.Errors!.First().TypeName.Should().Be("ForbiddenError");
    }

    [Fact]
    public async Task CancelBooking_AsUnrelatedUser_ReturnsForbidden() {
        var (_, advertiserProfile) = await SeedAdvertiserAsync();
        var (_, ownerProfile) = await SeedSpaceOwnerAsync();

        var campaign = await SeedCampaignAsync(advertiserProfile.Id);
        var space = await SeedSpaceAsync(ownerProfile.Id);
        var booking = await SeedBookingAsync(campaign.Id, space.Id);

        var unrelatedUser = await CreateAndLoginUserAsync();

        var response = await Client.MutateAsync<CancelBookingResponse>("""
            mutation($input: CancelBookingInput!) {
                cancelBooking(input: $input) {
                    booking { id status }
                    errors { __typename }
                }
            }
            """, new { input = new { id = booking.Id, reason = "Test" } });

        response.Data!.CancelBooking.Errors.Should().NotBeNullOrEmpty();
        response.Data!.CancelBooking.Errors!.First().TypeName.Should().Be("ForbiddenError");
    }
}
