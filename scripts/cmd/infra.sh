#!/bin/sh

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SCRIPTS_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

. "$SCRIPTS_DIR/core/dir.sh"

ev_infra_deploy() {
    ev_core_log_info "Initializing OpenTofu..."
    ev_core_in_infra tofu init || return 1

    ev_core_log_info "Applying OpenTofu changes..."
    ev_core_in_infra tofu apply -auto-approve || return 1

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

    _ev_branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null)
    if [ "$_ev_branch" != "main" ]; then
        ev_core_log_error "Infra commands are only allowed on the main branch (current: $_ev_branch)"
        unset _ev_branch
        return 1
    fi
    unset _ev_branch

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