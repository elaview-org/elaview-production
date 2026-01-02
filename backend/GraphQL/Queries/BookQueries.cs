using ElaviewBackend.GraphQL.Types;

namespace ElaviewBackend.GraphQL.Queries;

[QueryType]
public static class BookQueries {
    public static Book GetBook()
        => new Book("C# in depth.", new Author("Jon Skeet"));
}