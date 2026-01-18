using ElaviewBackend.Features.Shared.Errors;
using ElaviewBackend.Features.Users;
using HotChocolate.Authorization;

namespace ElaviewBackend.Features.Marketplace;

[MutationType]
public static partial class CampaignMutations {
    [Authorize]
    [Error<NotFoundException>]
    public static async Task<CreateCampaignPayload> CreateCampaign(
        CreateCampaignInput input,
        IUserService userService,
        ICampaignService campaignService,
        CancellationToken ct
    ) {
        var campaign = await campaignService.CreateAsync(userService.GetPrincipalId(), input, ct);
        return new CreateCampaignPayload(campaign);
    }

    [Authorize]
    [Error<NotFoundException>]
    [Error<ForbiddenException>]
    [Error<InvalidStatusTransitionException>]
    public static async Task<UpdateCampaignPayload> UpdateCampaign(
        [ID] Guid id,
        UpdateCampaignInput input,
        IUserService userService,
        ICampaignService campaignService,
        CancellationToken ct
    ) {
        var campaign = await campaignService.UpdateAsync(userService.GetPrincipalId(), id, input, ct);
        return new UpdateCampaignPayload(campaign);
    }

    [Authorize]
    [Error<NotFoundException>]
    [Error<ForbiddenException>]
    [Error<ConflictException>]
    public static async Task<DeleteCampaignPayload> DeleteCampaign(
        [ID] Guid id,
        IUserService userService,
        ICampaignService campaignService,
        CancellationToken ct
    ) {
        var success = await campaignService.DeleteAsync(userService.GetPrincipalId(), id, ct);
        return new DeleteCampaignPayload(success);
    }

    [Authorize]
    [Error<NotFoundException>]
    [Error<ForbiddenException>]
    [Error<InvalidStatusTransitionException>]
    public static async Task<SubmitCampaignPayload> SubmitCampaign(
        [ID] Guid id,
        IUserService userService,
        ICampaignService campaignService,
        CancellationToken ct
    ) {
        var campaign = await campaignService.SubmitAsync(userService.GetPrincipalId(), id, ct);
        return new SubmitCampaignPayload(campaign);
    }

    [Authorize]
    [Error<NotFoundException>]
    [Error<ForbiddenException>]
    public static async Task<CancelCampaignPayload> CancelCampaign(
        [ID] Guid id,
        IUserService userService,
        ICampaignService campaignService,
        CancellationToken ct
    ) {
        var campaign = await campaignService.CancelAsync(userService.GetPrincipalId(), id, ct);
        return new CancelCampaignPayload(campaign);
    }
}