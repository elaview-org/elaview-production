#!/bin/sh

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SCRIPTS_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

. "$SCRIPTS_DIR/core/dir.sh"

ev_web_reset() {
    ev_core_require_cmd "bun" || return 1
    ev_core_log_info "Cleaning web artifacts..."
    ev_core_in_web rm -rf node_modules .next .turbo package-lock.json pnpm-lock.yaml yarn.lock
    ev_core_log_info "Installing dependencies..."
    ev_core_in_web bun install
    ev_web_exit=$?
    [ $ev_web_exit -eq 0 ] && ev_core_log_success "Web reset complete."
    return $ev_web_exit
}

ev_web_dispatch() {
    cmd="$1"
    shift

    case "$cmd" in
        reset) ev_web_reset ;;
        *)
            ev_core_log_error "Unknown web command: $cmd"
            echo "Available: reset"
            return 1
            ;;
    esac
}

ev_web_dispatch "$@"