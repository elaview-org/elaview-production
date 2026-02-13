#!/bin/sh

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SCRIPTS_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

. "$SCRIPTS_DIR/core/dir.sh"

RAILWAY_PROJECT_ID=""
RAILWAY_STAGING_ENVIRONMENT_ID=""
RAILWAY_PRODUCTION_ENVIRONMENT_ID=""
RAILWAY_SERVER_SERVICE_ID=""
RAILWAY_DATABASE_SERVICE_ID=""

_ev_railway_environment_id() {
    case "$ELAVIEW_ENVIRONMENT" in
        staging)    printf '%s' "$RAILWAY_STAGING_ENVIRONMENT_ID" ;;
        production) printf '%s' "$RAILWAY_PRODUCTION_ENVIRONMENT_ID" ;;
    esac
}

_ev_railway_api() {
    curl -sf -X POST "https://backboard.railway.com/graphql/v2" \
        -H "Authorization: Bearer $ELAVIEW_RAILWAY_API_TOKEN" \
        -H "Content-Type: application/json" \
        -d "$1"
}

_ev_railway_provision() {
    ev_core_require_cmd "jq" || return 1
    ev_core_require_var "ELAVIEW_RAILWAY_API_TOKEN" || return 1

    ev_core_log_info "Checking for existing Railway project..."
    _ev_rw_result=$(_ev_railway_api '{"query":"{ projects { edges { node { id name } } } }"}')
    _ev_rw_project_id=$(printf '%s' "$_ev_rw_result" | jq -r '.data.projects.edges[] | select(.node.name == "elaview-backend") | .node.id')

    if [ -z "$_ev_rw_project_id" ]; then
        ev_core_log_info "Creating Railway project 'elaview-backend'..."
        _ev_rw_result=$(_ev_railway_api '{"query":"mutation { projectCreate(input: { name: \"elaview-backend\" }) { id } }"}')
        _ev_rw_project_id=$(printf '%s' "$_ev_rw_result" | jq -r '.data.projectCreate.id')
        [ "$_ev_rw_project_id" = "null" ] || [ -z "$_ev_rw_project_id" ] && { ev_core_log_error "Failed to create project"; return 1; }
        ev_core_log_success "Created project: $_ev_rw_project_id"
    else
        ev_core_log_info "Project exists: $_ev_rw_project_id"
    fi
    RAILWAY_PROJECT_ID="$_ev_rw_project_id"

    _ev_rw_payload=$(jq -nc --arg id "$RAILWAY_PROJECT_ID" '{
        query: "query($id: String!) { project(id: $id) { environments { edges { node { id name } } } } }",
        variables: { id: $id }
    }')
    _ev_rw_result=$(_ev_railway_api "$_ev_rw_payload")
    _ev_rw_env_id=$(printf '%s' "$_ev_rw_result" | jq -r --arg name "$ELAVIEW_ENVIRONMENT" '.data.project.environments.edges[] | select(.node.name == $name) | .node.id')
    if [ -z "$_ev_rw_env_id" ]; then
        ev_core_log_info "Creating '$ELAVIEW_ENVIRONMENT' environment..."
        _ev_rw_payload=$(jq -nc \
            --arg pid "$RAILWAY_PROJECT_ID" \
            --arg name "$ELAVIEW_ENVIRONMENT" '{
            query: "mutation($input: EnvironmentCreateInput!) { environmentCreate(input: $input) { id } }",
            variables: { input: { projectId: $pid, name: $name } }
        }')
        _ev_rw_result=$(_ev_railway_api "$_ev_rw_payload")
        _ev_rw_env_id=$(printf '%s' "$_ev_rw_result" | jq -r '.data.environmentCreate.id')
        [ "$_ev_rw_env_id" = "null" ] || [ -z "$_ev_rw_env_id" ] && { ev_core_log_error "Failed to create environment"; return 1; }
        ev_core_log_success "Created environment: $_ev_rw_env_id"
    fi

    _ev_rw_payload=$(jq -nc --arg id "$RAILWAY_PROJECT_ID" '{
        query: "query($id: String!) { project(id: $id) { services { edges { node { id name } } } } }",
        variables: { id: $id }
    }')
    _ev_rw_result=$(_ev_railway_api "$_ev_rw_payload")
    RAILWAY_DATABASE_SERVICE_ID=$(printf '%s' "$_ev_rw_result" | jq -r '.data.project.services.edges[] | select(.node.name == "database") | .node.id')
    RAILWAY_SERVER_SERVICE_ID=$(printf '%s' "$_ev_rw_result" | jq -r '.data.project.services.edges[] | select(.node.name == "server") | .node.id')
    case "$ELAVIEW_ENVIRONMENT" in
        staging)    RAILWAY_STAGING_ENVIRONMENT_ID="$_ev_rw_env_id" ;;
        production) RAILWAY_PRODUCTION_ENVIRONMENT_ID="$_ev_rw_env_id" ;;
    esac
    ev_core_log_info "Environment ($ELAVIEW_ENVIRONMENT): $_ev_rw_env_id"

    if [ -z "$RAILWAY_DATABASE_SERVICE_ID" ]; then
        ev_core_log_info "Creating database service..."
        _ev_rw_payload=$(jq -nc --arg pid "$RAILWAY_PROJECT_ID" '{
            query: "mutation($input: ServiceCreateInput!) { serviceCreate(input: $input) { id } }",
            variables: { input: { projectId: $pid, name: "database", source: { image: "postgres:17" } } }
        }')
        _ev_rw_result=$(_ev_railway_api "$_ev_rw_payload")
        RAILWAY_DATABASE_SERVICE_ID=$(printf '%s' "$_ev_rw_result" | jq -r '.data.serviceCreate.id')
        [ "$RAILWAY_DATABASE_SERVICE_ID" = "null" ] || [ -z "$RAILWAY_DATABASE_SERVICE_ID" ] && { ev_core_log_error "Failed to create database service"; return 1; }

        ev_core_log_info "Creating database volume..."
        _ev_rw_payload=$(jq -nc \
            --arg pid "$RAILWAY_PROJECT_ID" \
            --arg sid "$RAILWAY_DATABASE_SERVICE_ID" \
            --arg eid "$_ev_rw_env_id" '{
            query: "mutation($input: VolumeCreateInput!) { volumeCreate(input: $input) { id } }",
            variables: { input: { projectId: $pid, serviceId: $sid, environmentId: $eid, mountPath: "/var/lib/postgresql/data" } }
        }')
        _ev_railway_api "$_ev_rw_payload" > /dev/null || { ev_core_log_error "Failed to create volume"; return 1; }

        _ev_railway_sync_database_vars "$_ev_rw_env_id" || return 1
        ev_core_log_success "Database service: $RAILWAY_DATABASE_SERVICE_ID"
    else
        ev_core_log_info "Database service exists: $RAILWAY_DATABASE_SERVICE_ID"
    fi

    if [ -z "$RAILWAY_SERVER_SERVICE_ID" ]; then
        ev_core_log_info "Creating server service..."
        _ev_rw_payload=$(jq -nc --arg pid "$RAILWAY_PROJECT_ID" '{
            query: "mutation($input: ServiceCreateInput!) { serviceCreate(input: $input) { id } }",
            variables: { input: { projectId: $pid, name: "server" } }
        }')
        _ev_rw_result=$(_ev_railway_api "$_ev_rw_payload")
        RAILWAY_SERVER_SERVICE_ID=$(printf '%s' "$_ev_rw_result" | jq -r '.data.serviceCreate.id')
        [ "$RAILWAY_SERVER_SERVICE_ID" = "null" ] || [ -z "$RAILWAY_SERVER_SERVICE_ID" ] && { ev_core_log_error "Failed to create server service"; return 1; }

        ev_core_log_info "Generating server domain..."
        _ev_rw_domain_name=$(printf '%s' "$ELAVIEW_WEB_API_URL" | sed 's|^https\?://||' | sed 's|/.*||' | sed 's|\.up\.railway\.app$||')
        _ev_rw_payload=$(jq -nc \
            --arg sid "$RAILWAY_SERVER_SERVICE_ID" \
            --arg eid "$_ev_rw_env_id" \
            --arg domain "$_ev_rw_domain_name" '{
            query: "mutation($input: ServiceDomainCreateInput!) { serviceDomainCreate(input: $input) { domain } }",
            variables: { input: { serviceId: $sid, environmentId: $eid, domain: $domain } }
        }')
        _ev_rw_result=$(_ev_railway_api "$_ev_rw_payload")
        _ev_rw_domain=$(printf '%s' "$_ev_rw_result" | jq -r '.data.serviceDomainCreate.domain')
        ev_core_log_success "Server service: $RAILWAY_SERVER_SERVICE_ID"
        ev_core_log_success "Domain: $_ev_rw_domain"
    else
        ev_core_log_info "Server service exists: $RAILWAY_SERVER_SERVICE_ID"
    fi

    ev_core_log_warn "Hardcode these IDs in scripts/cmd/infra.sh:"
    printf "  RAILWAY_PROJECT_ID=\"%s\"\n" "$RAILWAY_PROJECT_ID"
    printf "  RAILWAY_%s_ENVIRONMENT_ID=\"%s\"\n" "$(printf '%s' "$ELAVIEW_ENVIRONMENT" | tr '[:lower:]' '[:upper:]')" "$_ev_rw_env_id"
    printf "  RAILWAY_SERVER_SERVICE_ID=\"%s\"\n" "$RAILWAY_SERVER_SERVICE_ID"
    printf "  RAILWAY_DATABASE_SERVICE_ID=\"%s\"\n" "$RAILWAY_DATABASE_SERVICE_ID"

    unset _ev_rw_result _ev_rw_project_id _ev_rw_payload _ev_rw_domain _ev_rw_domain_name _ev_rw_env_id
}

_ev_railway_sync_database_vars() {
    _ev_rw_eid="$1"

    ev_core_log_info "Checking for existing database volume..."
    _ev_rw_payload=$(jq -nc --arg id "$RAILWAY_PROJECT_ID" '{
        query: "query($id: String!) { project(id: $id) { volumes { edges { node { id volumeInstances { edges { node { serviceId environmentId } } } } } } } }",
        variables: { id: $id }
    }')
    _ev_rw_result=$(_ev_railway_api "$_ev_rw_payload")
    _ev_rw_has_volume=$(printf '%s' "$_ev_rw_result" | jq -r \
        --arg sid "$RAILWAY_DATABASE_SERVICE_ID" \
        --arg eid "$_ev_rw_eid" \
        '[.data.project.volumes.edges[].node.volumeInstances.edges[].node | select(.serviceId == $sid and .environmentId == $eid)] | length')

    if [ "$_ev_rw_has_volume" = "0" ] || [ -z "$_ev_rw_has_volume" ]; then
        ev_core_log_info "Creating database volume..."
        _ev_rw_payload=$(jq -nc \
            --arg pid "$RAILWAY_PROJECT_ID" \
            --arg sid "$RAILWAY_DATABASE_SERVICE_ID" \
            --arg eid "$_ev_rw_eid" '{
            query: "mutation($input: VolumeCreateInput!) { volumeCreate(input: $input) { id } }",
            variables: { input: { projectId: $pid, serviceId: $sid, environmentId: $eid, mountPath: "/var/lib/postgresql/data" } }
        }')
        _ev_railway_api "$_ev_rw_payload" > /dev/null || { ev_core_log_error "Failed to create volume"; return 1; }
        ev_core_log_success "Volume created."
    else
        ev_core_log_info "Database volume exists."
    fi

    ev_core_log_info "Syncing database variables..."
    _ev_rw_payload=$(jq -nc \
        --arg pid "$RAILWAY_PROJECT_ID" \
        --arg sid "$RAILWAY_DATABASE_SERVICE_ID" \
        --arg eid "$_ev_rw_eid" \
        --arg user "$ELAVIEW_BACKEND_DATABASE_USER" \
        --arg pass "$ELAVIEW_BACKEND_DATABASE_PASSWORD" '{
        query: "mutation($input: VariableCollectionUpsertInput!) { variableCollectionUpsert(input: $input) }",
        variables: { input: { projectId: $pid, serviceId: $sid, environmentId: $eid, variables: { POSTGRES_USER: $user, POSTGRES_PASSWORD: $pass, POSTGRES_DB: $user, PGDATA: "/var/lib/postgresql/data/pgdata" } } }
    }')
    _ev_railway_api "$_ev_rw_payload" > /dev/null || { ev_core_log_error "Failed to sync database variables"; return 1; }

    ev_core_log_info "Deploying database service..."
    _ev_rw_payload=$(jq -nc \
        --arg sid "$RAILWAY_DATABASE_SERVICE_ID" \
        --arg eid "$_ev_rw_eid" '{
        query: "mutation($sid: String!, $eid: String!, $input: ServiceInstanceUpdateInput!) { serviceInstanceUpdate(serviceId: $sid, environmentId: $eid, input: $input) }",
        variables: { sid: $sid, eid: $eid, input: { source: { image: "postgres:17" } } }
    }')
    _ev_railway_api "$_ev_rw_payload" > /dev/null 2>&1

    _ev_rw_payload=$(jq -nc \
        --arg pid "$RAILWAY_PROJECT_ID" \
        --arg sid "$RAILWAY_DATABASE_SERVICE_ID" \
        --arg eid "$_ev_rw_eid" '{
        query: "mutation($input: EnvironmentTriggersDeployInput!) { environmentTriggersDeploy(input: $input) }",
        variables: { input: { projectId: $pid, serviceId: $sid, environmentId: $eid } }
    }')
    _ev_railway_api "$_ev_rw_payload" > /dev/null 2>&1

    ev_core_log_success "Database synced."
    unset _ev_rw_payload _ev_rw_result _ev_rw_has_volume _ev_rw_eid
}

_ev_railway_sync_server_vars() {
    ev_core_require_cmd "jq" || return 1
    ev_core_require_var "ELAVIEW_RAILWAY_API_TOKEN" || return 1

    ev_core_log_info "Syncing server variables to Railway..."
    _ev_rw_vars=$(env | grep '^ELAVIEW_BACKEND_' | jq -Rn \
        --arg aspnet "$ELAVIEW_BACKEND_ASPNETCORE_ENVIRONMENT" \
        --arg dbhost "database.railway.internal" '
        [inputs | split("=") | {key: .[0], value: (.[1:] | join("="))} | {(.key): .value}] | add // {}
        | .ELAVIEW_BACKEND_SERVER_PORT = ""
        | .ELAVIEW_BACKEND_SERVER_TLS_CERT_PATH = ""
        | .ELAVIEW_BACKEND_SERVER_TLS_CERT_PASSWORD = ""
        | .ELAVIEW_BACKEND_DATABASE_HOST = $dbhost
        | .ELAVIEW_BACKEND_DATABASE_PORT = "5432"
        | . + {"ASPNETCORE_ENVIRONMENT": $aspnet}
    ')

    _ev_rw_payload=$(jq -nc \
        --arg pid "$RAILWAY_PROJECT_ID" \
        --arg sid "$RAILWAY_SERVER_SERVICE_ID" \
        --arg eid "$(_ev_railway_environment_id)" \
        --argjson vars "$_ev_rw_vars" '{
        query: "mutation($input: VariableCollectionUpsertInput!) { variableCollectionUpsert(input: $input) }",
        variables: { input: { projectId: $pid, serviceId: $sid, environmentId: $eid, variables: $vars } }
    }')

    _ev_railway_api "$_ev_rw_payload" > /dev/null || { ev_core_log_error "Failed to sync variables"; return 1; }
    ev_core_log_success "Server variables synced."
    unset _ev_rw_vars _ev_rw_payload
}

_ev_railway_ensure_server_domain() {
    _ev_rw_payload=$(jq -nc \
        --arg pid "$RAILWAY_PROJECT_ID" \
        --arg sid "$RAILWAY_SERVER_SERVICE_ID" \
        --arg eid "$(_ev_railway_environment_id)" '{
        query: "query($pid: String!, $sid: String!, $eid: String!) { domains(projectId: $pid, serviceId: $sid, environmentId: $eid) { serviceDomains { domain } } }",
        variables: { pid: $pid, sid: $sid, eid: $eid }
    }')
    _ev_rw_result=$(_ev_railway_api "$_ev_rw_payload")
    _ev_rw_domain_count=$(printf '%s' "$_ev_rw_result" | jq '.data.domains.serviceDomains | length')

    if [ "$_ev_rw_domain_count" = "0" ] || [ -z "$_ev_rw_domain_count" ]; then
        ev_core_log_info "Creating server domain..."
        _ev_rw_domain_name=$(printf '%s' "$ELAVIEW_WEB_API_URL" | sed 's|^https\?://||' | sed 's|/.*||' | sed 's|\.up\.railway\.app$||')
        _ev_rw_payload=$(jq -nc \
            --arg sid "$RAILWAY_SERVER_SERVICE_ID" \
            --arg eid "$(_ev_railway_environment_id)" \
            --arg domain "$_ev_rw_domain_name" '{
            query: "mutation($input: ServiceDomainCreateInput!) { serviceDomainCreate(input: $input) { domain } }",
            variables: { input: { serviceId: $sid, environmentId: $eid, domain: $domain } }
        }')
        _ev_rw_result=$(_ev_railway_api "$_ev_rw_payload")
        _ev_rw_domain=$(printf '%s' "$_ev_rw_result" | jq -r '.data.serviceDomainCreate.domain')
        ev_core_log_success "Domain: $_ev_rw_domain"
    fi
    unset _ev_rw_payload _ev_rw_result _ev_rw_domain_count _ev_rw_domain _ev_rw_domain_name
}

_ev_railway_deploy_server() {
    ev_core_require_cmd "railway" || return 1
    ev_core_require_var "ELAVIEW_RAILWAY_API_TOKEN" || return 1

    _ev_railway_ensure_server_domain
    ev_core_log_info "Deploying server to Railway..."
    RAILWAY_API_TOKEN="$ELAVIEW_RAILWAY_API_TOKEN" ev_core_in_backend \
        railway up --ci --project "$RAILWAY_PROJECT_ID" -s "$RAILWAY_SERVER_SERVICE_ID" -e "$(_ev_railway_environment_id)"
}

ev_infra_deploy() {
    ev_core_log_info "Initializing OpenTofu..."
    ev_core_in_infra tofu init || return 1

    ev_core_log_info "Applying OpenTofu changes..."
    ev_core_in_infra tofu apply -auto-approve || return 1

    if [ -z "$RAILWAY_PROJECT_ID" ]; then
        _ev_railway_provision || return 1
    fi

    _ev_railway_sync_database_vars "$(_ev_railway_environment_id)" || return 1
    _ev_railway_deploy_server || return 1
    _ev_railway_sync_server_vars || return 1

    ev_core_log_info "Deploying to Vercel..."
    ev_core_in_web bunx vercel --prod "$@" --token "$ELAVIEW_VERCEL_API_TOKEN"
}

ev_infra_destroy() {
    ev_core_log_info "Destroying OpenTofu resources..."
    ev_core_in_infra tofu destroy "$@"
}

ev_infra_dispatch() {
    if [ "$ELAVIEW_ENVIRONMENT" != "staging" ] && [ "$ELAVIEW_ENVIRONMENT" != "production" ]; then
        ev_core_log_error "Infra commands are only allowed in staging or production (current: $ELAVIEW_ENVIRONMENT)"
        return 1
    fi

    cmd="$1"
    shift

    case "$cmd" in
        deploy)  ev_infra_deploy "$@" ;;
        destroy) ev_infra_destroy "$@" ;;
        *)
            ev_core_log_error "Unknown infra command: $cmd"
            echo "Available: deploy, destroy"
            return 1
            ;;
    esac
}

ev_infra_dispatch "$@"