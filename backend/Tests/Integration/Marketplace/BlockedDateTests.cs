using ElaviewBackend.Data.Entities;
using ElaviewBackend.Tests.Integration.Fixtures;
using ElaviewBackend.Tests.Shared.Extensions;
using ElaviewBackend.Tests.Shared.Models;
using FluentAssertions;
using Xunit;

namespace ElaviewBackend.Tests.Integration.Marketplace;

[Collection("Integration")]
public sealed class BlockedDateTests(IntegrationTestFixture fixture)
    : IntegrationTestBase(fixture) {
    [Fact]
    public async Task BlockDates_ValidInput_CreatesBlockedDates() {
        var (owner, ownerProfile) = await SeedSpaceOwnerAsync();
        await LoginAsync(owner.Email, "Test123!");

        var space = await SeedSpaceAsync(ownerProfile.Id);
        var futureDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(14));

        var response = await Client.MutateAsync<BlockDatesResponse>("""
            mutation($input: BlockDatesInput!) {
                blockDates(input: $input) {
                    blockedDates { id spaceId date reason }
                    errors { __typename }
                }
            }
            """,
            new {
                input = new {
                    spaceId = space.Id,
                    dates = new[] { futureDate.ToString("yyyy-MM-dd") },
                    reason = "Maintenance"
                }
            });

        response.Data!.BlockDates.Errors.Should().BeNullOrEmpty();
        response.Data!.BlockDates.BlockedDates.Should().HaveCount(1);
        response.Data!.BlockDates.BlockedDates![0].SpaceId.Should().Be(space.Id);
        response.Data!.BlockDates.BlockedDates![0].Reason.Should().Be("Maintenance");
    }

    [Fact]
    public async Task BlockDates_MultipleDates_CreatesAllBlockedDates() {
        var (owner, ownerProfile) = await SeedSpaceOwnerAsync();
        await LoginAsync(owner.Email, "Test123!");

        var space = await SeedSpaceAsync(ownerProfile.Id);
        var startDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(14));
        var dates = Enumerable.Range(0, 5).Select(i => startDate.AddDays(i).ToString("yyyy-MM-dd")).ToArray();

        var response = await Client.MutateAsync<BlockDatesResponse>("""
            mutation($input: BlockDatesInput!) {
                blockDates(input: $input) {
                    blockedDates { id date }
                    errors { __typename }
                }
            }
            """,
            new {
                input = new {
                    spaceId = space.Id,
                    dates
                }
            });

        response.Data!.BlockDates.Errors.Should().BeNullOrEmpty();
        response.Data!.BlockDates.BlockedDates.Should().HaveCount(5);
    }

    [Fact]
    public async Task BlockDates_PastDate_ReturnsValidationError() {
        var (owner, ownerProfile) = await SeedSpaceOwnerAsync();
        await LoginAsync(owner.Email, "Test123!");

        var space = await SeedSpaceAsync(ownerProfile.Id);
        var pastDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-1));

        var response = await Client.MutateAsync<BlockDatesResponse>("""
            mutation($input: BlockDatesInput!) {
                blockDates(input: $input) {
                    blockedDates { id }
                    errors { __typename }
                }
            }
            """,
            new {
                input = new {
                    spaceId = space.Id,
                    dates = new[] { pastDate.ToString("yyyy-MM-dd") }
                }
            });

        response.Data!.BlockDates.Errors.Should().NotBeNullOrEmpty();
        response.Data!.BlockDates.Errors!.First().TypeName.Should().Be("ValidationError");
    }

    [Fact]
    public async Task BlockDates_NotOwner_ReturnsForbiddenError() {
        var (owner, ownerProfile) = await SeedSpaceOwnerAsync();
        var (otherOwner, _) = await SeedSpaceOwnerAsync();
        await LoginAsync(otherOwner.Email, "Test123!");

        var space = await SeedSpaceAsync(ownerProfile.Id);
        var futureDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(14));

        var response = await Client.MutateAsync<BlockDatesResponse>("""
            mutation($input: BlockDatesInput!) {
                blockDates(input: $input) {
                    blockedDates { id }
                    errors { __typename }
                }
            }
            """,
            new {
                input = new {
                    spaceId = space.Id,
                    dates = new[] { futureDate.ToString("yyyy-MM-dd") }
                }
            });

        response.Data!.BlockDates.Errors.Should().NotBeNullOrEmpty();
        response.Data!.BlockDates.Errors!.First().TypeName.Should().Be("ForbiddenError");
    }

    [Fact]
    public async Task BlockDates_WithConfirmedBooking_ReturnsConflictError() {
        var (owner, ownerProfile) = await SeedSpaceOwnerAsync();
        var (advertiser, advertiserProfile) = await SeedAdvertiserAsync();
        await LoginAsync(owner.Email, "Test123!");

        var space = await SeedSpaceAsync(ownerProfile.Id);
        var campaign = await SeedCampaignAsync(advertiserProfile.Id);

        var startDate = DateTime.UtcNow.AddDays(14);
        var endDate = DateTime.UtcNow.AddDays(21);
        await SeedBookingWithDatesAsync(campaign.Id, space.Id, startDate, endDate, BookingStatus.Paid);

        var blockedDate = DateOnly.FromDateTime(startDate.AddDays(2));

        var response = await Client.MutateAsync<BlockDatesResponse>("""
            mutation($input: BlockDatesInput!) {
                blockDates(input: $input) {
                    blockedDates { id }
                    errors { __typename }
                }
            }
            """,
            new {
                input = new {
                    spaceId = space.Id,
                    dates = new[] { blockedDate.ToString("yyyy-MM-dd") }
                }
            });

        response.Data!.BlockDates.Errors.Should().NotBeNullOrEmpty();
        response.Data!.BlockDates.Errors!.First().TypeName.Should().Be("ConflictError");
    }

    [Fact]
    public async Task UnblockDates_ValidInput_RemovesBlockedDates() {
        var (owner, ownerProfile) = await SeedSpaceOwnerAsync();
        await LoginAsync(owner.Email, "Test123!");

        var space = await SeedSpaceAsync(ownerProfile.Id);
        var futureDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(14));
        await SeedBlockedDateAsync(space.Id, futureDate);

        var response = await Client.MutateAsync<UnblockDatesResponse>("""
            mutation($input: UnblockDatesInput!) {
                unblockDates(input: $input) {
                    unblockedCount
                    errors { __typename }
                }
            }
            """,
            new {
                input = new {
                    spaceId = space.Id,
                    dates = new[] { futureDate.ToString("yyyy-MM-dd") }
                }
            });

        response.Data!.UnblockDates.Errors.Should().BeNullOrEmpty();
        response.Data!.UnblockDates.UnblockedCount.Should().Be(1);
    }

    [Fact]
    public async Task UnblockDates_NotOwner_ReturnsForbiddenError() {
        var (owner, ownerProfile) = await SeedSpaceOwnerAsync();
        var (otherOwner, _) = await SeedSpaceOwnerAsync();
        await LoginAsync(otherOwner.Email, "Test123!");

        var space = await SeedSpaceAsync(ownerProfile.Id);
        var futureDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(14));
        await SeedBlockedDateAsync(space.Id, futureDate);

        var response = await Client.MutateAsync<UnblockDatesResponse>("""
            mutation($input: UnblockDatesInput!) {
                unblockDates(input: $input) {
                    unblockedCount
                    errors { __typename }
                }
            }
            """,
            new {
                input = new {
                    spaceId = space.Id,
                    dates = new[] { futureDate.ToString("yyyy-MM-dd") }
                }
            });

        response.Data!.UnblockDates.Errors.Should().NotBeNullOrEmpty();
        response.Data!.UnblockDates.Errors!.First().TypeName.Should().Be("ForbiddenError");
    }

    [Fact]
    public async Task GetBlockedDatesBySpace_ReturnsBlockedDates() {
        var (owner, ownerProfile) = await SeedSpaceOwnerAsync();
        await LoginAsync(owner.Email, "Test123!");

        var space = await SeedSpaceAsync(ownerProfile.Id);
        var startDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(14));
        await SeedBlockedDatesAsync(space.Id, startDate, 5);

        var response = await Client.QueryAsync<BlockedDatesBySpaceResponse>("""
            query($spaceId: ID!) {
                blockedDatesBySpace(spaceId: $spaceId) {
                    nodes { id date reason }
                    totalCount
                }
            }
            """,
            new { spaceId = space.Id });

        response.Data!.BlockedDatesBySpace.TotalCount.Should().Be(5);
        response.Data!.BlockedDatesBySpace.Nodes.Should().HaveCount(5);
    }

    [Fact]
    public async Task GetBlockedDatesBySpace_WithDateRange_ReturnsFilteredDates() {
        var (owner, ownerProfile) = await SeedSpaceOwnerAsync();
        await LoginAsync(owner.Email, "Test123!");

        var space = await SeedSpaceAsync(ownerProfile.Id);
        var startDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(14));
        await SeedBlockedDatesAsync(space.Id, startDate, 10);

        var response = await Client.QueryAsync<BlockedDatesBySpaceResponse>("""
            query($spaceId: ID!) {
                blockedDatesBySpace(spaceId: $spaceId) {
                    nodes { id date }
                    totalCount
                }
            }
            """,
            new { spaceId = space.Id });

        response.Errors.Should().BeNullOrEmpty();
        response.Data!.BlockedDatesBySpace.TotalCount.Should().Be(10);
        response.Data!.BlockedDatesBySpace.Nodes.Should().HaveCount(10);
    }
}
