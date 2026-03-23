using ElaviewBackend.Features.Shared.Errors;
using HotChocolate.Authorization;

namespace ElaviewBackend.Features.Careers;

[MutationType]
public static partial class CareerMutations {
    [Authorize(Roles = ["Admin"])]
    [Error<ValidationException>]
    public static async Task<CreateCareerPayload> CreateCareer(
        CreateCareerInput input,
        ICareerService careerService,
        CancellationToken ct
    ) => new(await careerService.CreateAsync(input, ct));

    [Authorize(Roles = ["Admin"])]
    [Error<NotFoundException>]
    [Error<ValidationException>]
    public static async Task<UpdateCareerPayload> UpdateCareer(
        [ID] Guid id,
        UpdateCareerInput input,
        ICareerService careerService,
        CancellationToken ct
    ) => new(await careerService.UpdateAsync(id, input, ct));

    [Authorize(Roles = ["Admin"])]
    [Error<NotFoundException>]
    public static async Task<DeleteCareerPayload> DeleteCareer(
        [ID] Guid id,
        ICareerService careerService,
        CancellationToken ct
    ) => new(await careerService.DeleteAsync(id, ct));
}
