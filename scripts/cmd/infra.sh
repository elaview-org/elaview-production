#!/bin/sh

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SCRIPTS_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

. "$SCRIPTS_DIR/core/dir.sh"

ev_infra_init() {
    ev_core_log_info "Initializing OpenTofu..."
    ev_core_in_infra tofu init "$@"
}

ev_infra_plan() {
    ev_core_log_info "Running OpenTofu plan..."
    ev_core_in_infra tofu plan "$@"
}

ev_infra_apply() {
    ev_core_log_info "Applying OpenTofu changes..."
    ev_core_in_infra tofu apply "$@"
}

ev_infra_destroy() {
    ev_core_log_info "Destroying OpenTofu resources..."
    ev_core_in_infra tofu destroy "$@"
}

ev_infra_output() {
    ev_core_in_infra tofu output "$@"
}

ev_infra_validate() {
    ev_core_log_info "Validating OpenTofu configuration..."
    ev_core_in_infra tofu validate "$@"
}

ev_infra_fmt() {
    ev_core_log_info "Formatting OpenTofu files..."
    ev_core_in_infra tofu fmt "$@"
}

ev_infra_dispatch() {
    cmd="$1"
    shift

    case "$cmd" in
        init)     ev_infra_init "$@" ;;
        plan)     ev_infra_plan "$@" ;;
        apply)    ev_infra_apply "$@" ;;
        destroy)  ev_infra_destroy "$@" ;;
        output)   ev_infra_output "$@" ;;
        validate) ev_infra_validate "$@" ;;
        fmt)      ev_infra_fmt "$@" ;;
        *)
            ev_core_log_error "Unknown infra command: $cmd"
            echo "Available: init, plan, apply, destroy, output, validate, fmt"
            return 1
            ;;
    esac
}

ev_infra_dispatch "$@"