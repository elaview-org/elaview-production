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