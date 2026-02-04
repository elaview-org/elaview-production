using System.Text.Json.Serialization;

namespace ElaviewBackend.Tests.Shared.Models;

public record GraphQLResponse<T>(T? Data, List<GraphQLError>? Errors);

public record GraphQLError(
    string Message,
    Dictionary<string, object?>? Extensions);

public record MutationError(
    [property: JsonPropertyName("__typename")] string TypeName);