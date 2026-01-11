#!/bin/sh

EV_CORE_DIR="$ELAVIEW_DEVBOX_ROOT/scripts/core"
. "$EV_CORE_DIR/log.sh"

ev_core_require_var() {
    eval "ev_core_require_var_value=\"\$$1\""
    if [ -z "$ev_core_require_var_value" ]; then
        ev_core_log_error "Required variable $1 is not set"
        unset ev_core_require_var_value
        return 1
    fi
    unset ev_core_require_var_value
}

ev_core_require_file() {
    if [ ! -f "$1" ]; then
        ev_core_log_error "Required file not found: $1"
        return 1
    fi
}

ev_core_require_dir() {
    if [ ! -d "$1" ]; then
        ev_core_log_error "Required directory not found: $1"
        return 1
    fi
}

ev_core_require_cmd() {
    if ! command -v "$1" >/dev/null 2>&1; then
        ev_core_log_error "Required command not found: $1"
        return 1
    fi
}