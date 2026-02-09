using ElaviewBackend.Data.Entities;
using ElaviewBackend.Tests.Integration.Fixtures;
using ElaviewBackend.Tests.Shared.Extensions;
using ElaviewBackend.Tests.Shared.Models;
using FluentAssertions;
using Xunit;

namespace ElaviewBackend.Tests.Integration.Marketplace;

[Collection("Integration")]
public sealed class PricingRuleTests(IntegrationTestFixture fixture)
    : IntegrationTestBase(fixture) {
    [Fact]
    public async Task CreatePricingRule_ValidFixedRule_CreatesRule() {
        var (owner, ownerProfile) = await SeedSpaceOwnerAsync();
        await LoginAsync(owner.Email, "Test123!");
        var space = await SeedSpaceAsync(ownerProfile.Id);

        var startDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));
        var endDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(30));

        var response = await Client.MutateAsync<CreatePricingRuleResponse>("""
            mutation($input: CreatePricingRuleInput!) {
                createPricingRule(input: $input) {
                    pricingRule { id spaceId type value startDate endDate label priority }
                    errors { __typename }
                }
            }
            """,
            new {
                input = new {
                    spaceId = space.Id,
                    type = "FIXED",
                    value = 75.00,
                    startDate = startDate.ToString("yyyy-MM-dd"),
                    endDate = endDate.ToString("yyyy-MM-dd"),
                    label = "Holiday Rate",
                    priority = 1
                }
            });

        response.Data!.CreatePricingRule.Errors.Should().BeNullOrEmpty();
        var rule = response.Data!.CreatePricingRule.PricingRule!;
        rule.SpaceId.Should().Be(space.Id);
        rule.Type.Should().Be("FIXED");
        rule.Value.Should().Be(75.00m);
        rule.Label.Should().Be("Holiday Rate");
        rule.Priority.Should().Be(1);
    }

    [Fact]
    public async Task CreatePricingRule_ValidMultiplierRule_CreatesRule() {
        var (owner, ownerProfile) = await SeedSpaceOwnerAsync();
        await LoginAsync(owner.Email, "Test123!");
        var space = await SeedSpaceAsync(ownerProfile.Id);

        var response = await Client.MutateAsync<CreatePricingRuleResponse>("""
            mutation($input: CreatePricingRuleInput!) {
                createPricingRule(input: $input) {
                    pricingRule { id type value }
                    errors { __typename }
                }
            }
            """,
            new {
                input = new {
                    spaceId = space.Id,
                    type = "MULTIPLIER",
                    value = 1.5,
                    label = "Weekend Surge",
                    priority = 0
                }
            });

        response.Data!.CreatePricingRule.Errors.Should().BeNullOrEmpty();
        response.Data!.CreatePricingRule.PricingRule!.Type.Should().Be("MULTIPLIER");
        response.Data!.CreatePricingRule.PricingRule!.Value.Should().Be(1.5m);
    }

    [Fact]
    public async Task CreatePricingRule_NotOwner_ReturnsForbiddenError() {
        var (owner, ownerProfile) = await SeedSpaceOwnerAsync();
        var (otherOwner, _) = await SeedSpaceOwnerAsync();
        await LoginAsync(otherOwner.Email, "Test123!");
        var space = await SeedSpaceAsync(ownerProfile.Id);

        var response = await Client.MutateAsync<CreatePricingRuleResponse>("""
            mutation($input: CreatePricingRuleInput!) {
                createPricingRule(input: $input) {
                    pricingRule { id }
                    errors { __typename }
                }
            }
            """,
            new {
                input = new {
                    spaceId = space.Id,
                    type = "FIXED",
                    value = 50.00,
                    priority = 0
                }
            });

        response.Data!.CreatePricingRule.Errors.Should().NotBeNullOrEmpty();
        response.Data!.CreatePricingRule.Errors!.First().TypeName.Should().Be("ForbiddenError");
    }

    [Fact]
    public async Task CreatePricingRule_ZeroValue_ReturnsValidationError() {
        var (owner, ownerProfile) = await SeedSpaceOwnerAsync();
        await LoginAsync(owner.Email, "Test123!");
        var space = await SeedSpaceAsync(ownerProfile.Id);

        var response = await Client.MutateAsync<CreatePricingRuleResponse>("""
            mutation($input: CreatePricingRuleInput!) {
                createPricingRule(input: $input) {
                    pricingRule { id }
                    errors { __typename }
                }
            }
            """,
            new {
                input = new {
                    spaceId = space.Id,
                    type = "FIXED",
                    value = 0,
                    priority = 0
                }
            });

        response.Data!.CreatePricingRule.Errors.Should().NotBeNullOrEmpty();
        response.Data!.CreatePricingRule.Errors!.First().TypeName.Should().Be("ValidationError");
    }

    [Fact]
    public async Task CreatePricingRule_EndDateBeforeStartDate_ReturnsValidationError() {
        var (owner, ownerProfile) = await SeedSpaceOwnerAsync();
        await LoginAsync(owner.Email, "Test123!");
        var space = await SeedSpaceAsync(ownerProfile.Id);

        var response = await Client.MutateAsync<CreatePricingRuleResponse>("""
            mutation($input: CreatePricingRuleInput!) {
                createPricingRule(input: $input) {
                    pricingRule { id }
                    errors { __typename }
                }
            }
            """,
            new {
                input = new {
                    spaceId = space.Id,
                    type = "FIXED",
                    value = 50.00,
                    startDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(10)).ToString("yyyy-MM-dd"),
                    endDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(5)).ToString("yyyy-MM-dd"),
                    priority = 0
                }
            });

        response.Data!.CreatePricingRule.Errors.Should().NotBeNullOrEmpty();
        response.Data!.CreatePricingRule.Errors!.First().TypeName.Should().Be("ValidationError");
    }

    [Fact]
    public async Task UpdatePricingRule_ValidInput_UpdatesRule() {
        var (owner, ownerProfile) = await SeedSpaceOwnerAsync();
        await LoginAsync(owner.Email, "Test123!");
        var space = await SeedSpaceAsync(ownerProfile.Id);
        var rule = await SeedPricingRuleAsync(space.Id, r => {
            r.Type = PricingRuleType.Fixed;
            r.Value = 50.00m;
            r.Label = "Original";
            r.Priority = 0;
        });

        var response = await Client.MutateAsync<UpdatePricingRuleResponse>("""
            mutation($id: ID!, $input: UpdatePricingRuleInput!) {
                updatePricingRule(id: $id, input: $input) {
                    pricingRule { id value label }
                    errors { __typename }
                }
            }
            """,
            new {
                id = rule.Id,
                input = new {
                    value = 100.00,
                    label = "Updated"
                }
            });

        response.Data!.UpdatePricingRule.Errors.Should().BeNullOrEmpty();
        response.Data!.UpdatePricingRule.PricingRule!.Value.Should().Be(100.00m);
        response.Data!.UpdatePricingRule.PricingRule!.Label.Should().Be("Updated");
    }

    [Fact]
    public async Task UpdatePricingRule_NotOwner_ReturnsForbiddenError() {
        var (owner, ownerProfile) = await SeedSpaceOwnerAsync();
        var (otherOwner, _) = await SeedSpaceOwnerAsync();
        await LoginAsync(otherOwner.Email, "Test123!");
        var space = await SeedSpaceAsync(ownerProfile.Id);
        var rule = await SeedPricingRuleAsync(space.Id);

        var response = await Client.MutateAsync<UpdatePricingRuleResponse>("""
            mutation($id: ID!, $input: UpdatePricingRuleInput!) {
                updatePricingRule(id: $id, input: $input) {
                    pricingRule { id }
                    errors { __typename }
                }
            }
            """,
            new {
                id = rule.Id,
                input = new { value = 999.00 }
            });

        response.Data!.UpdatePricingRule.Errors.Should().NotBeNullOrEmpty();
        response.Data!.UpdatePricingRule.Errors!.First().TypeName.Should().Be("ForbiddenError");
    }

    [Fact]
    public async Task DeletePricingRule_ValidInput_DeletesRule() {
        var (owner, ownerProfile) = await SeedSpaceOwnerAsync();
        await LoginAsync(owner.Email, "Test123!");
        var space = await SeedSpaceAsync(ownerProfile.Id);
        var rule = await SeedPricingRuleAsync(space.Id);

        var response = await Client.MutateAsync<DeletePricingRuleResponse>("""
            mutation($input: DeletePricingRuleInput!) {
                deletePricingRule(input: $input) {
                    deletedRuleId
                    errors { __typename }
                }
            }
            """,
            new { input = new { id = rule.Id } });

        response.Data!.DeletePricingRule.Errors.Should().BeNullOrEmpty();
        response.Data!.DeletePricingRule.DeletedRuleId.Should().Be(rule.Id);
    }

    [Fact]
    public async Task DeletePricingRule_NotOwner_ReturnsForbiddenError() {
        var (owner, ownerProfile) = await SeedSpaceOwnerAsync();
        var (otherOwner, _) = await SeedSpaceOwnerAsync();
        await LoginAsync(otherOwner.Email, "Test123!");
        var space = await SeedSpaceAsync(ownerProfile.Id);
        var rule = await SeedPricingRuleAsync(space.Id);

        var response = await Client.MutateAsync<DeletePricingRuleResponse>("""
            mutation($input: DeletePricingRuleInput!) {
                deletePricingRule(input: $input) {
                    deletedRuleId
                    errors { __typename }
                }
            }
            """,
            new { input = new { id = rule.Id } });

        response.Data!.DeletePricingRule.Errors.Should().NotBeNullOrEmpty();
        response.Data!.DeletePricingRule.Errors!.First().TypeName.Should().Be("ForbiddenError");
    }

    [Fact]
    public async Task GetPricingRulesBySpace_ReturnsRules() {
        var (owner, ownerProfile) = await SeedSpaceOwnerAsync();
        await LoginAsync(owner.Email, "Test123!");
        var space = await SeedSpaceAsync(ownerProfile.Id);

        await SeedPricingRuleAsync(space.Id, r => { r.Label = "Rule 1"; r.Priority = 0; });
        await SeedPricingRuleAsync(space.Id, r => { r.Label = "Rule 2"; r.Priority = 1; });

        var response = await Client.QueryAsync<PricingRulesBySpaceResponse>("""
            query($spaceId: ID!) {
                pricingRulesBySpace(spaceId: $spaceId) {
                    nodes { id label priority }
                    totalCount
                }
            }
            """,
            new { spaceId = space.Id });

        response.Errors.Should().BeNullOrEmpty();
        response.Data!.PricingRulesBySpace.TotalCount.Should().Be(2);
        response.Data!.PricingRulesBySpace.Nodes.Should().HaveCount(2);
    }

    [Fact]
    public async Task GetEffectivePriceByDate_WithFixedRule_ReturnsFixedPrice() {
        var (owner, ownerProfile) = await SeedSpaceOwnerAsync();
        await LoginAsync(owner.Email, "Test123!");
        var space = await SeedSpaceWithPricingAsync(ownerProfile.Id, 50.00m, 25.00m);

        var targetDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(5));
        await SeedPricingRuleAsync(space.Id, r => {
            r.Type = PricingRuleType.Fixed;
            r.Value = 75.00m;
            r.StartDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));
            r.EndDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(10));
            r.Priority = 1;
            r.Label = "Holiday Rate";
        });

        var response = await Client.QueryAsync<EffectivePriceByDateResponse>("""
            query($spaceId: ID!, $date: LocalDate!) {
                effectivePriceByDate(spaceId: $spaceId, date: $date) {
                    effectivePrice
                    appliedRuleId
                    appliedRuleLabel
                }
            }
            """,
            new {
                spaceId = space.Id,
                date = targetDate.ToString("yyyy-MM-dd")
            });

        response.Errors.Should().BeNullOrEmpty();
        response.Data!.EffectivePriceByDate.EffectivePrice.Should().Be(75.00m);
        response.Data!.EffectivePriceByDate.AppliedRuleLabel.Should().Be("Holiday Rate");
    }

    [Fact]
    public async Task GetEffectivePriceByDate_WithMultiplierRule_ReturnsMultipliedPrice() {
        var (owner, ownerProfile) = await SeedSpaceOwnerAsync();
        await LoginAsync(owner.Email, "Test123!");
        var space = await SeedSpaceWithPricingAsync(ownerProfile.Id, 100.00m, 25.00m);

        var targetDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(5));
        await SeedPricingRuleAsync(space.Id, r => {
            r.Type = PricingRuleType.Multiplier;
            r.Value = 1.5m;
            r.StartDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));
            r.EndDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(10));
            r.Priority = 1;
        });

        var response = await Client.QueryAsync<EffectivePriceByDateResponse>("""
            query($spaceId: ID!, $date: LocalDate!) {
                effectivePriceByDate(spaceId: $spaceId, date: $date) {
                    effectivePrice
                    appliedRuleId
                }
            }
            """,
            new {
                spaceId = space.Id,
                date = targetDate.ToString("yyyy-MM-dd")
            });

        response.Errors.Should().BeNullOrEmpty();
        response.Data!.EffectivePriceByDate.EffectivePrice.Should().Be(150.00m);
    }

    [Fact]
    public async Task GetEffectivePriceByDate_NoMatchingRule_ReturnsBasePrice() {
        var (owner, ownerProfile) = await SeedSpaceOwnerAsync();
        await LoginAsync(owner.Email, "Test123!");
        var space = await SeedSpaceWithPricingAsync(ownerProfile.Id, 50.00m, 25.00m);

        var targetDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(5));

        var response = await Client.QueryAsync<EffectivePriceByDateResponse>("""
            query($spaceId: ID!, $date: LocalDate!) {
                effectivePriceByDate(spaceId: $spaceId, date: $date) {
                    effectivePrice
                    appliedRuleId
                }
            }
            """,
            new {
                spaceId = space.Id,
                date = targetDate.ToString("yyyy-MM-dd")
            });

        response.Errors.Should().BeNullOrEmpty();
        response.Data!.EffectivePriceByDate.EffectivePrice.Should().Be(50.00m);
        response.Data!.EffectivePriceByDate.AppliedRuleId.Should().BeNull();
    }

    [Fact]
    public async Task GetEffectivePriceByDate_HigherPriorityWins() {
        var (owner, ownerProfile) = await SeedSpaceOwnerAsync();
        await LoginAsync(owner.Email, "Test123!");
        var space = await SeedSpaceWithPricingAsync(ownerProfile.Id, 50.00m, 25.00m);

        var targetDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(5));
        var startDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));
        var endDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(10));

        await SeedPricingRuleAsync(space.Id, r => {
            r.Type = PricingRuleType.Fixed;
            r.Value = 60.00m;
            r.StartDate = startDate;
            r.EndDate = endDate;
            r.Priority = 1;
            r.Label = "Low Priority";
        });

        await SeedPricingRuleAsync(space.Id, r => {
            r.Type = PricingRuleType.Fixed;
            r.Value = 90.00m;
            r.StartDate = startDate;
            r.EndDate = endDate;
            r.Priority = 10;
            r.Label = "High Priority";
        });

        var response = await Client.QueryAsync<EffectivePriceByDateResponse>("""
            query($spaceId: ID!, $date: LocalDate!) {
                effectivePriceByDate(spaceId: $spaceId, date: $date) {
                    effectivePrice
                    appliedRuleLabel
                }
            }
            """,
            new {
                spaceId = space.Id,
                date = targetDate.ToString("yyyy-MM-dd")
            });

        response.Errors.Should().BeNullOrEmpty();
        response.Data!.EffectivePriceByDate.EffectivePrice.Should().Be(90.00m);
        response.Data!.EffectivePriceByDate.AppliedRuleLabel.Should().Be("High Priority");
    }
}
