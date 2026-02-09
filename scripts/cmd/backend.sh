#!/bin/sh

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SCRIPTS_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

. "$SCRIPTS_DIR/core/dir.sh"

ev_backend_start() {
    ev_core_require_cmd "docker" || return 1
    ev_core_log_info "Applying EF Core database migrations."
    ev_core_in_backend docker compose up -d database && dotnet ef database update
    ev_core_log_info "Starting backend services."
    ev_core_in_backend docker compose up --build -d
    ev_backend_exit=$?
    [ $ev_backend_exit -eq 0 ] && ev_core_log_success "Backend services started."
    return $ev_backend_exit
}

ev_backend_stop() {
    ev_core_require_cmd "docker" || return 1
    ev_core_log_info "Stopping backend services..."
    ev_core_in_backend docker compose down --remove-orphans
    ev_backend_exit=$?
    [ $ev_backend_exit -eq 0 ] && ev_core_log_success "Backend services stopped."
    return $ev_backend_exit
}

ev_backend_restart() {
    ev_backend_stop && ev_backend_start
}

ev_backend_logs() {
    ev_core_require_cmd "docker" || return 1
    ev_core_in_backend docker compose logs -f "$@"
}

ev_backend_status() {
    ev_core_require_cmd "docker" || return 1
    ev_core_in_backend docker compose ps
}

ev_backend_exec() {
    ev_core_require_cmd "docker" || return 1
    ev_core_in_backend docker compose exec "$@"
}

ev_backend_install() {
    ev_core_require_cmd "dotnet" || return 1
    ev_core_log_info "Restoring backend dependencies..."
    ev_core_in_backend dotnet restore ElaviewBackend.csproj
    ev_backend_exit=$?
    [ $ev_backend_exit -eq 0 ] && ev_core_log_success "Backend dependencies restored."
    return $ev_backend_exit
}

ev_backend_build() {
    ev_core_require_cmd "dotnet" || return 1
    ev_core_log_info "Building backend..."
    ev_core_in_backend dotnet build ElaviewBackend.csproj --configuration Release --no-restore
    ev_backend_exit=$?
    [ $ev_backend_exit -eq 0 ] && ev_core_log_success "Backend built successfully."
    return $ev_backend_exit
}

ev_backend_format() {
    ev_core_require_cmd "dotnet" || return 1
    ev_core_log_info "Formatting code..."
    ev_core_in_backend dotnet format ElaviewBackend.csproj
    ev_backend_exit=$?
    [ $ev_backend_exit -eq 0 ] && ev_core_log_success "Code formatted successfully."
    return $ev_backend_exit
}

ev_backend_format_check() {
    ev_core_require_cmd "dotnet" || return 1
    ev_core_log_info "Checking code formatting..."
    ev_core_in_backend dotnet format ElaviewBackend.csproj --verify-no-changes
    ev_backend_exit=$?
    [ $ev_backend_exit -eq 0 ] && ev_core_log_success "Code formatting check passed."
    return $ev_backend_exit
}

ev_backend_test() {
    ev_core_require_cmd "dotnet" || return 1
    ev_core_log_info "Running all tests..."
    ev_core_in_backend dotnet test ElaviewBackend.csproj --configuration Release --no-build
    ev_backend_exit=$?
    [ $ev_backend_exit -eq 0 ] && ev_core_log_success "All tests passed."
    return $ev_backend_exit
}

ev_backend_test_unit() {
    ev_core_require_cmd "dotnet" || return 1
    ev_core_log_info "Running unit tests..."
    ev_core_in_backend dotnet test ElaviewBackend.csproj --configuration Release --no-build --filter "Category=Unit"
    ev_backend_exit=$?
    [ $ev_backend_exit -eq 0 ] && ev_core_log_success "All unit tests passed."
    return $ev_backend_exit
}

ev_backend_test_integration() {
    ev_core_require_cmd "dotnet" || return 1
    ev_core_log_info "Running integration tests..."
    ev_core_in_backend dotnet test ElaviewBackend.csproj --configuration Release --no-build --filter "Category=Integration"
    ev_backend_exit=$?
    [ $ev_backend_exit -eq 0 ] && ev_core_log_success "All integration tests passed."
    return $ev_backend_exit
}

ev_backend_publish() {
    ev_core_require_cmd "dotnet" || return 1
    ev_core_log_info "Publishing backend..."
    ev_core_in_backend dotnet publish ElaviewBackend.csproj --configuration Release --no-build -o ./publish
    ev_backend_exit=$?
    [ $ev_backend_exit -eq 0 ] && ev_core_log_success "Backend published to ./publish"
    return $ev_backend_exit
}

ev_backend_reset() {
    ev_core_require_cmd "dotnet" || return 1
    ev_core_log_info "Cleaning backend artifacts..."
    ev_core_in_backend rm -rf bin obj publish
    ev_core_log_info "Restoring dependencies..."
    ev_core_in_backend dotnet restore ElaviewBackend.csproj
    ev_backend_exit=$?
    [ $ev_backend_exit -eq 0 ] && ev_core_log_success "Backend reset complete."
    return $ev_backend_exit
}

ev_backend_dispatch() {
    cmd="$1"
    shift

    case "$cmd" in
        start)            ev_backend_start ;;
        stop)             ev_backend_stop ;;
        restart)          ev_backend_restart ;;
        logs)             ev_backend_logs "$@" ;;
        status)           ev_backend_status ;;
        exec)             ev_backend_exec "$@" ;;
        install)          ev_backend_install ;;
        build)            ev_backend_build ;;
        format)           ev_backend_format ;;
        format:check)     ev_backend_format_check ;;
        test)             ev_backend_test ;;
        test:unit)        ev_backend_test_unit ;;
        test:integration) ev_backend_test_integration ;;
        publish)          ev_backend_publish ;;
        reset)            ev_backend_reset ;;
        *)
            ev_core_log_error "Unknown backend command: $cmd"
            echo "Available: start, stop, restart, logs, status, exec, install, build, lint, format, format:check, test, test:unit, test:integration, publish, reset"
            return 1
            ;;
    esac
}

ev_backend_dispatch "$@"