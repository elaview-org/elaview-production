#!/bin/sh

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SCRIPTS_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

. "$SCRIPTS_DIR/core/log.sh"

ev_web_dispatch() {
    cmd="$1"
    shift

    case "$cmd" in
        *)
            ev_core_log_error "Unknown web command: $cmd"
            echo "No commands available yet."
            return 1
            ;;
    esac
}

ev_web_dispatch "$@"