using HotChocolate.Authorization;

namespace ElaviewBackend.Features.Marketplace;

[MutationType]
public static partial class CampaignMutations {
    [Authorize]
    public static async Task<CreateCampaignPayload> CreateCampaign(
        CreateCampaignInput input, ICampaignService campaignService, CancellationToken ct
    ) => new(await campaignService.CreateAsync(input, ct));

    [Authorize]
    public static async Task<UpdateCampaignPayload> UpdateCampaign(
        [ID] Guid id, UpdateCampaignInput input, ICampaignService campaignService, CancellationToken ct
    ) => new(await campaignService.UpdateAsync(id, input, ct));

    [Authorize]
    public static async Task<DeleteCampaignPayload> DeleteCampaign(
        [ID] Guid id, ICampaignService campaignService, CancellationToken ct
    ) => new(await campaignService.DeleteAsync(id, ct));

    [Authorize]
    public static async Task<SubmitCampaignPayload> SubmitCampaign(
        [ID] Guid id, ICampaignService campaignService, CancellationToken ct
    ) => new(await campaignService.SubmitAsync(id, ct));

    [Authorize]
    public static async Task<CancelCampaignPayload> CancelCampaign(
        [ID] Guid id, ICampaignService campaignService, CancellationToken ct
    ) => new(await campaignService.CancelAsync(id, ct));
}