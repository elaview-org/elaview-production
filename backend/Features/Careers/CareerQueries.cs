using ElaviewBackend.Data.Entities;
using HotChocolate.Authorization;

namespace ElaviewBackend.Features.Careers;

[QueryType]
public static partial class CareerQueries {
    [UsePaging(IncludeTotalCount = true)]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public static IQueryable<Career> GetCareers(
        ICareerService careerService
    ) => careerService.GetAll();

    [UseFirstOrDefault]
    [UseProjection]
    public static IQueryable<Career> GetCareerById(
        [ID] Guid id,
        ICareerService careerService
    ) => careerService.GetById(id);
}
