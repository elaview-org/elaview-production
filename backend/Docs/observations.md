# Handy Commands

### HotChocolate non-static extension class

The SpaceOwnerExtensions class is missing the keyword "static"

```csharp
[ExtendObjectType<SpaceOwnerProfile>]
public class SpaceOwnerExtensions {
    [Authorize]
    [UsePaging]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public static IQueryable<Space> GetSpaces(
        [Parent] SpaceOwnerProfile spaceOwner, AppDbContext context
    ) {
        return context.Spaces.Where(s =>
            s.SpaceOwnerProfileId == spaceOwner.Id);
    }
}
```

When that happens, the [UsePaging] directive stops working

```graphql
  spaceOwnerProfile {
    spaces {
      # nodes {
        address
        city
        state
        zipCode
      # }
    }
  }
```