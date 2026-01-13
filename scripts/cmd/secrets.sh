#!/bin/sh

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SCRIPTS_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

. "$SCRIPTS_DIR/core/dir.sh"

ev_secrets_list() {
    ev_core_require_cmd "doppler" || return 1
    doppler secrets
}

ev_secrets_get() {
    ev_core_require_cmd "doppler" || return 1
    doppler secrets get "$1" --plain
}

ev_secrets_set() {
    ev_core_require_cmd "doppler" || return 1
    doppler secrets set "$1=$2"
}

ev_secrets_notes() {
    ev_core_require_cmd "doppler" || return 1
    doppler secrets notes set "$1" "$2"
}

ev_secrets_dispatch() {
    cmd="$1"
    shift

    case "$cmd" in
        list) ev_secrets_list ;;
        get) ev_secrets_get "$@" ;;
        set) ev_secrets_set "$@" ;;
        notes) ev_secrets_notes "$@" ;;
        *)
            ev_core_log_error "Unknown secrets command: $cmd"
            echo "Available: list, get, set, notes"
            return 1
            ;;
    esac
}

ev_secrets_dispatch "$@"