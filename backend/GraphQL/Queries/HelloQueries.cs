namespace ElaviewBackend.GraphQL.Queries;

[QueryType]
public static class HelloQueries
{
    public static string SayHello(string name) => $"Hello {name}!";
}