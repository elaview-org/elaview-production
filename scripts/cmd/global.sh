#!/bin/sh

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SCRIPTS_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

. "$SCRIPTS_DIR/core/log.sh"

ev_global_help() {
    cat "$SCRIPT_DIR/help.md" | less
}

ev_global_dispatch() {
    cmd="$1"
    shift

    case "$cmd" in
        help) ev_global_help ;;
        *)
            ev_core_log_error "Unknown global command: $cmd"
            echo "Run 'ev help' for usage."
            return 1
            ;;
    esac
}

ev_global_dispatch "$@"