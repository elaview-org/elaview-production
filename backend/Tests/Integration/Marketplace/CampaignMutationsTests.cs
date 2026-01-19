using ElaviewBackend.Tests.Integration.Fixtures;
using ElaviewBackend.Tests.Shared.Extensions;
using ElaviewBackend.Tests.Shared.Models;
using FluentAssertions;
using Xunit;

namespace ElaviewBackend.Tests.Integration.Marketplace;

[Collection("Integration")]
public sealed class CampaignMutationsTests(IntegrationTestFixture fixture)
    : IntegrationTestBase(fixture) {
    [Fact]
    public async Task CreateCampaign_AsAdvertiser_CreatesCampaign() {
        var (advertiser, _) = await SeedAdvertiserAsync();
        await LoginAsync(advertiser.Email, "Test123!");

        var response = await Client.MutateAsync<CreateCampaignResponse>("""
                mutation($input: CreateCampaignInput!) {
                    createCampaign(input: $input) {
                        campaign {
                            id
                            name
                            description
                            imageUrl
                            status
                        }
                    }
                }
                """,
            new {
                input = new {
                    name = "Test Campaign",
                    description = "A test campaign",
                    imageUrl = "https://example.com/image.jpg"
                }
            });

        response.Errors.Should().BeNullOrEmpty();
        response.Data!.CreateCampaign.Campaign.Name.Should()
            .Be("Test Campaign");
        response.Data!.CreateCampaign.Campaign.Status.Should().Be("DRAFT");
    }

    [Fact]
    public async Task CreateCampaign_Unauthenticated_ReturnsAuthError() {
        var response = await Client.MutateAsync<CreateCampaignResponse>("""
                mutation($input: CreateCampaignInput!) {
                    createCampaign(input: $input) {
                        campaign { id }
                    }
                }
                """,
            new {
                input = new {
                    name = "Test Campaign",
                    imageUrl = "https://example.com/image.jpg"
                }
            });

        response.Errors.Should().NotBeNullOrEmpty();
        response.Errors!.Should().ContainSingle()
            .Which.Extensions.Should().ContainKey("code");
    }

    [Fact]
    public async Task UpdateCampaign_AsOwner_UpdatesCampaign() {
        var (advertiser, advertiserProfile) = await SeedAdvertiserAsync();
        await LoginAsync(advertiser.Email, "Test123!");
        var campaign = await SeedCampaignAsync(advertiserProfile.Id);

        var response = await Client.MutateAsync<UpdateCampaignResponse>("""
                mutation($id: ID!, $input: UpdateCampaignInput!) {
                    updateCampaign(id: $id, input: $input) {
                        campaign {
                            id
                            name
                            description
                        }
                    }
                }
                """,
            new {
                id = campaign.Id,
                input = new {
                    name = "Updated Campaign",
                    description = "Updated description"
                }
            });

        response.Errors.Should().BeNullOrEmpty();
        response.Data!.UpdateCampaign.Campaign.Name.Should()
            .Be("Updated Campaign");
    }

    [Fact]
    public async Task DeleteCampaign_AsOwner_DeletesCampaign() {
        var (advertiser, advertiserProfile) = await SeedAdvertiserAsync();
        await LoginAsync(advertiser.Email, "Test123!");
        var campaign = await SeedCampaignAsync(advertiserProfile.Id);

        var response = await Client.MutateAsync<DeleteCampaignResponse>("""
                mutation($input: DeleteCampaignInput!) {
                    deleteCampaign(input: $input) {
                        success
                    }
                }
                """,
            new { input = new { id = campaign.Id } });

        response.Errors.Should().BeNullOrEmpty();
        response.Data!.DeleteCampaign.Success.Should().BeTrue();
    }
}