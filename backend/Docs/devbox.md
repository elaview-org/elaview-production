# Devbox Setup Guide

This project includes a devbox configuration to ensure consistent development environments across different machines
with only devbox and nix installed.

## Prerequisites

Install devbox and nix:

```bash
curl -fsSL https://get.jetify.com/devbox | bash
```

## Quick Start

### Option 1: Docker-based Development (Recommended)

1. Enter the devbox shell:

```bash
devbox shell
```

2. Start PostgreSQL with Docker Compose:

```bash
devbox run docker-up
```

3. Apply database migrations:

```bash
dotnet ef database update
```

4. Run the application:

```bash
dotnet run
```

### Option 2: Local PostgreSQL Development

1. Enter the devbox shell:

```bash
devbox shell
```

2. Initialize local PostgreSQL (first time only):

```bash
devbox run setup
```

3. Apply database migrations:

```bash
dotnet ef database update
```

4. Start the application:

```bash
devbox run start
```

## Available Scripts

### Development Scripts

- `devbox run setup` - Initialize local PostgreSQL and restore dependencies
- `devbox run start` - Start with local PostgreSQL and run the application
- `devbox run test` - Run all unit tests

### Docker Scripts

- `devbox run docker-up` - Start PostgreSQL using Docker Compose
- `devbox run docker-down` - Stop Docker Compose services
- `devbox run docker-clean` - Stop services and remove volumes (deletes data)

### Cleanup Scripts

- `devbox run clean` - Stop local PostgreSQL and clean build artifacts

## Manual Commands

Inside the devbox shell, you can run any of these commands:

### .NET Commands

```bash
dotnet restore                      # Restore dependencies
dotnet build                        # Build the project
dotnet run                          # Run the application
dotnet test ElaviewBackend.csproj   # Run tests
dotnet ef migrations add <name>     # Create migration
dotnet ef database update           # Apply migrations
```

### Local PostgreSQL Commands

```bash
pg_ctl -D .devbox/postgres -l .devbox/postgres/logfile start  # Start PostgreSQL
pg_ctl -D .devbox/postgres stop                               # Stop PostgreSQL
createdb <dbname>                                             # Create database
psql <dbname>                                                 # Connect to database
```

### Docker Commands

```bash
docker-compose -f compose.yaml up -d     # Start services
docker-compose -f compose.yaml down      # Stop services
docker-compose -f compose.yaml logs -f   # View logs
docker ps                                # List running containers
```

## Installed Packages

The devbox environment includes:

- .NET SDK (latest available, supports .NET 10)
- PostgreSQL (latest)
- Docker (latest)
- Docker Compose (latest)

## Environment Variables

The following environment variables are automatically set in the devbox shell:

- `PGDATA=.devbox/postgres` - Local PostgreSQL data directory
- `PGHOST=localhost` - PostgreSQL host
- `PGPORT=5432` - PostgreSQL port
- `DOTNET_CLI_TELEMETRY_OPTOUT=1` - Disable .NET telemetry
- `DOTNET_SKIP_FIRST_TIME_EXPERIENCE=1` - Skip .NET first-run experience

## Configuration Files

### secrets.json

Create this file with your configuration:

```json
{
  "Database": {
    "Host": "127.0.0.1",
    "Port": 5432,
    "User": "elaview-backend",
    "Password": "elaview-backend-dev"
  },
  "DevelopmentAccounts": [
    ...
  ]
}
```

### .env (for Docker Compose)

Already exists with default values:

```
Database__Host=127.0.0.1
Database__Port=5432
Database__User=elaview-backend
Database__Password=elaview-backend-dev
```

## Directory Structure

```
backend/
├── .devbox/              # Devbox-managed files (gitignored)
│   └── postgres/         # Local PostgreSQL data
├── devbox.json           # Devbox configuration
├── compose.yaml          # Docker Compose configuration
├── Dockerfile            # Docker build configuration
├── secrets.json          # Local secrets (gitignored)
└── .env                  # Docker Compose environment
```

## Troubleshooting

### Docker Issues

If Docker commands fail, ensure the Docker daemon is running:

```bash
sudo systemctl start docker  # Linux
open -a Docker              # macOS
```

### PostgreSQL Port Conflict

If port 5432 is already in use:

1. Stop the conflicting service
2. Or modify the port in `.env` and `secrets.json`

### .NET SDK Version

If you need a specific .NET SDK version, you can:

1. Use Docker-based development (Dockerfile uses .NET 10)
2. Or manually install .NET 10 SDK alongside devbox

## Notes

- `.devbox/postgres/` is gitignored - local PostgreSQL data only
- Docker Compose uses named volumes for persistence
- Database connection strings must match between `secrets.json` and `.env`
- Use `devbox run docker-clean` carefully - it deletes all database data
- Tests run using an in-memory database (EF Core InMemory provider)