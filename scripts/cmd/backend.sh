#!/bin/sh

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SCRIPTS_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

. "$SCRIPTS_DIR/core/dir.sh"
. "$SCRIPTS_DIR/core/auth.sh"

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

ev_backend_audit() {
    ev_core_require_cmd "dotnet" || return 1
    ev_core_log_info "Auditing backend dependencies..."
    ev_core_in_backend dotnet list ElaviewBackend.csproj package --vulnerable --include-transitive
    ev_backend_exit=$?
    [ $ev_backend_exit -eq 0 ] && ev_core_log_success "Dependency audit passed."
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

ev_backend_deploy() {
    ev_core_prompt_token "ELAVIEW_RAILWAY_API_TOKEN" || return 1

    if [ "$ELAVIEW_ENVIRONMENT" != "staging" ] && [ "$ELAVIEW_ENVIRONMENT" != "production" ]; then
        ev_core_log_error "Deploy is only allowed in staging or production (current: $ELAVIEW_ENVIRONMENT)"
        return 1
    fi

    . "$SCRIPTS_DIR/core/railway.sh"

    _ev_railway_resolve_project || _ev_railway_provision || return 1

    if [ -z "$(_ev_railway_environment_id)" ]; then
        _ev_railway_provision || return 1
    fi

    _ev_railway_sync_database_vars "$(_ev_railway_environment_id)" || return 1
    _ev_railway_sync_server_vars || return 1
    _ev_railway_deploy_server || return 1

    ev_core_log_info "Updating WEB_API_URL in Doppler..."
    doppler secrets set "WEB_API_URL=https://${RAILWAY_SERVER_DOMAIN}/api" \
        --config "$ELAVIEW_ENVIRONMENT" || return 1

    ev_core_log_success "WEB_API_URL set to https://${RAILWAY_SERVER_DOMAIN}/api"
}

ev_backend_destroy() {
    ev_core_prompt_token "ELAVIEW_RAILWAY_API_TOKEN" || return 1

    if [ "$ELAVIEW_ENVIRONMENT" != "staging" ] && [ "$ELAVIEW_ENVIRONMENT" != "production" ]; then
        ev_core_log_error "Destroy is only allowed in staging or production (current: $ELAVIEW_ENVIRONMENT)"
        return 1
    fi

    . "$SCRIPTS_DIR/core/railway.sh"

    _ev_rw_eid="$(_ev_railway_environment_id)"
    if [ -z "$_ev_rw_eid" ]; then
        ev_core_log_warn "No Railway environment ID for '$ELAVIEW_ENVIRONMENT' — skipping."
        return 0
    fi

    _ev_railway_destroy_environment "$_ev_rw_eid" || return 1
    ev_core_log_success "Railway '$ELAVIEW_ENVIRONMENT' environment destroyed."
    unset _ev_rw_eid
}

ev_backend_destroy_all() {
    ev_core_prompt_token "ELAVIEW_RAILWAY_API_TOKEN" || return 1

    if [ "$ELAVIEW_ENVIRONMENT" != "staging" ] && [ "$ELAVIEW_ENVIRONMENT" != "production" ]; then
        ev_core_log_error "Destroy is only allowed in staging or production (current: $ELAVIEW_ENVIRONMENT)"
        return 1
    fi

    . "$SCRIPTS_DIR/core/railway.sh"

    ev_core_require_cmd "jq" || return 1

    _ev_railway_resolve_project

    if [ -n "$RAILWAY_PROJECT_ID" ]; then
        ev_core_log_info "Deleting Railway project: $RAILWAY_PROJECT_ID"
        _ev_rw_payload=$(jq -nc --arg id "$RAILWAY_PROJECT_ID" '{
            query: "mutation($id: String!) { projectDelete(id: $id) }",
            variables: { id: $id }
        }')
        _ev_railway_api "$_ev_rw_payload" > /dev/null || { ev_core_log_error "Failed to delete Railway project"; return 1; }
        ev_core_log_success "Railway project deleted."
        unset _ev_rw_payload
    else
        ev_core_log_warn "No Railway project found — skipping."
    fi
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
        audit)            ev_backend_audit ;;
        reset)            ev_backend_reset ;;
        deploy)           ev_backend_deploy ;;
        destroy)          ev_backend_destroy ;;
        destroy:all)      ev_backend_destroy_all ;;
        *)
            ev_core_log_error "Unknown backend command: $cmd"
            echo "Available: start, stop, restart, logs, status, exec, install, build, format, format:check, test, test:unit, test:integration, publish, audit, reset, deploy, destroy, destroy:all"
            return 1
            ;;
    esac
}

ev_backend_dispatch "$@"