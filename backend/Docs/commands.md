# Handy Commands

### Login

```bash
curl -i -k -X POST http://localhost:7106/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@email.com","password":"admin123"}'
```

### EF Core Migrations

```bash
dotnet ef migrations add MigrationName --output-dir Shared/Migrations
dotnet ef database update
```

### Start with a fresh development database

```bash
dotnet ef migrations add MyMigrationName --project ElaviewBackend.csproj --output-dir Shared/Migrations
docker compose up -d database
dotnet ef database drop -f
docker compose up -d database
dotnet ef database update --project ElaviewBackend.csproj
docker compose up -d server
```

### GraphQL Setup for client repos

Assuming your API directory is "/shared/api" (relative to the repo root directory) and
you already have apollo client set up, run the following command to obtain the graphql
schema:

```bash
curl http://localhost:7106/api/graphql/schema.graphql > "/shared/api"
```

Or, if you opt into HTTP/3:

```bash
curl https://<your-public-domain>:7106/api/graphql/schema.graphql > "/shared/api"
```