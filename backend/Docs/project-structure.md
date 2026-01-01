MyApp/
├── GraphQL/ # All HotChocolate-specific code
│ ├── Types/ # ObjectType<T>, InputType<T>, EnumType, etc.
│ ├── Queries/ # Query class or query extension methods
│ ├── Mutations/ # Mutation class or extension methods
│ ├── Subscriptions/ # Subscription class (if using real-time)
│ └── Resolvers/ # Separate resolver classes (optional, if not co-located)
├── Data/ # DbContext, EF Core migrations, repositories
├── Models/ or Domain/ # Entities, DTOs, value objects
├── Services/ # Business logic, application services
├── Program.cs # Service configuration, middleware, GraphQL setup
├── appsettings.json
└── elaview-backend.csproj