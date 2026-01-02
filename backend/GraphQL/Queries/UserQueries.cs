namespace ElaviewBackend.GraphQL.Queries;

[QueryType]
public static partial class UserQueries {
    public static string SayHello(string name) {
        return $"Hello {name}!";
    }
}