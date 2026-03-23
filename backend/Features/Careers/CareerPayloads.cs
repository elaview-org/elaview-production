using ElaviewBackend.Data.Entities;

namespace ElaviewBackend.Features.Careers;

public record CreateCareerPayload(Career Career);
public record UpdateCareerPayload(Career Career);
public record DeleteCareerPayload(bool Success);
