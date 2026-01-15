namespace ElaviewBackend.Tests.Shared.Models;

public record GraphQLResponse<T>(T? Data, List<GraphQLError>? Errors);

public record GraphQLError(string Message, Dictionary<string, object?>? Extensions);