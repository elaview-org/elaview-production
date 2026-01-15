using System.Net.Http.Json;
using ElaviewBackend.Tests.Shared.Models;

namespace ElaviewBackend.Tests.Shared.Extensions;

public static class HttpClientGraphQLExtensions {
    public static async Task<GraphQLResponse<T>> QueryAsync<T>(
        this HttpClient client,
        string query,
        object? variables = null,
        CancellationToken ct = default
    ) {
        var request = new { query, variables };
        var response = await client.PostAsJsonAsync("/api/graphql", request, ct);
        var content = await response.Content.ReadFromJsonAsync<GraphQLResponse<T>>(ct);
        return content!;
    }

    public static async Task<GraphQLResponse<T>> MutateAsync<T>(
        this HttpClient client,
        string mutation,
        object? variables = null,
        CancellationToken ct = default
    ) => await client.QueryAsync<T>(mutation, variables, ct);
}