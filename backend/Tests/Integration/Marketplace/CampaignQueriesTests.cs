using ElaviewBackend.Data;
using ElaviewBackend.Tests.Integration.Fixtures;
using ElaviewBackend.Tests.Shared.Extensions;
using ElaviewBackend.Tests.Shared.Factories;
using ElaviewBackend.Tests.Shared.Models;
using FluentAssertions;
using Xunit;

namespace ElaviewBackend.Tests.Integration.Marketplace;

[Collection("Integration")]
public sealed class CampaignQueriesTests(IntegrationTestFixture fixture)
    : IntegrationTestBase(fixture) {
    [Fact]
    public async Task GetMyCampaigns_AsAdvertiser_ReturnsOwnCampaigns() {
        var (advertiser, advertiserProfile) = await SeedAdvertiserAsync();
        await LoginAsync(advertiser.Email, "Test123!");

        using (var scope = Fixture.Services.CreateScope()) {
            var context =
                scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var campaigns = CampaignFactory.CreateMany(advertiserProfile.Id, 5);
            context.Campaigns.AddRange(campaigns);
            await context.SaveChangesAsync();
        }

        var response = await Client.QueryAsync<MyCampaignsResponse>("""
            query {
                myCampaigns(first: 10) {
                    nodes { id name status }
                }
            }
            """);

        response.Errors.Should().BeNullOrEmpty();
        response.Data!.MyCampaigns.Nodes.Should().HaveCount(5);
    }

    [Fact]
    public async Task GetMyCampaigns_Unauthenticated_ReturnsAuthError() {
        var response = await Client.QueryAsync<MyCampaignsResponse>("""
            query {
                myCampaigns(first: 10) {
                    nodes { id }
                }
            }
            """);

        response.Errors.Should().NotBeNullOrEmpty();
        response.Errors!.Should().ContainSingle()
            .Which.Extensions.Should().ContainKey("code");
    }

    [Fact]
    public async Task GetCampaignById_AsOwner_ReturnsCampaign() {
        var (advertiser, advertiserProfile) = await SeedAdvertiserAsync();
        await LoginAsync(advertiser.Email, "Test123!");
        var campaign = await SeedCampaignAsync(advertiserProfile.Id);

        var response = await Client.QueryAsync<CampaignByIdResponse>("""
                query($id: ID!) {
                    campaignById(id: $id) {
                        id
                        name
                        description
                        imageUrl
                        status
                    }
                }
                """,
            new { id = campaign.Id });

        response.Errors.Should().BeNullOrEmpty();
        response.Data!.CampaignById.Should().NotBeNull();
        response.Data!.CampaignById!.Name.Should().Be(campaign.Name);
    }

    [Fact]
    public async Task GetCampaignById_NonexistentCampaign_ReturnsNull() {
        var (advertiser, _) = await SeedAdvertiserAsync();
        await LoginAsync(advertiser.Email, "Test123!");

        var response = await Client.QueryAsync<CampaignByIdResponse>("""
                query($id: ID!) {
                    campaignById(id: $id) {
                        id
                    }
                }
                """,
            new { id = Guid.NewGuid() });

        response.Errors.Should().BeNullOrEmpty();
        response.Data!.CampaignById.Should().BeNull();
    }
}