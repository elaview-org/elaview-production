#!/bin/sh

EV_CORE_DIR="$ELAVIEW_DEVBOX_ROOT/scripts/core"
. "$EV_CORE_DIR/log.sh"

ev_core_prompt_token() {
    eval "ev_core_prompt_token_existing=\"\$$1\""
    if [ -n "$ev_core_prompt_token_existing" ]; then
        unset ev_core_prompt_token_existing
        return 0
    fi
    unset ev_core_prompt_token_existing

    printf '[Auth] Enter %s: ' "$1" >&2
    stty -echo 2>/dev/null
    read -r ev_core_prompt_token_value
    stty echo 2>/dev/null
    printf '\n' >&2

    if [ -z "$ev_core_prompt_token_value" ]; then
        ev_core_log_error "Token cannot be empty"
        unset ev_core_prompt_token_value
        return 1
    fi

    export "$1=$ev_core_prompt_token_value"
    unset ev_core_prompt_token_value
}
