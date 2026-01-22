#!/bin/sh

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SCRIPTS_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

. "$SCRIPTS_DIR/core/dir.sh"

ev_mobile_reset() {
    ev_core_require_cmd "bun" || return 1
    ev_core_log_info "Cleaning mobile artifacts..."
    ev_core_in_mobile rm -rf node_modules .expo ios android package-lock.json pnpm-lock.yaml yarn.lock
    ev_core_log_info "Installing dependencies..."
    ev_core_in_mobile bun install
    ev_mobile_exit=$?
    [ $ev_mobile_exit -eq 0 ] && ev_core_log_success "Mobile reset complete."
    return $ev_mobile_exit
}

ev_mobile_dispatch() {
    cmd="$1"
    shift

    case "$cmd" in
        reset) ev_mobile_reset ;;
        *)
            ev_core_log_error "Unknown mobile command: $cmd"
            echo "Available: reset"
            return 1
            ;;
    esac
}

ev_mobile_dispatch "$@"