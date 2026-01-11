#!/bin/sh

EV_CORE_DIR="$ELAVIEW_DEVBOX_ROOT/scripts/core"
. "$EV_CORE_DIR/require.sh"

ev_core_in_dir() {
    ev_core_in_dir_target="$1"
    shift

    ev_core_require_dir "$ev_core_in_dir_target" || return 1

    ev_core_in_dir_original="$PWD"
    cd "$ev_core_in_dir_target" || return 1

    "$@"
    ev_core_in_dir_exit=$?

    cd "$ev_core_in_dir_original" || return 1
    unset ev_core_in_dir_target ev_core_in_dir_original
    return $ev_core_in_dir_exit
}

ev_core_in_root() {
    ev_core_require_var "ELAVIEW_DEVBOX_ROOT" || return 1
    ev_core_in_dir "$ELAVIEW_DEVBOX_ROOT" "$@"
}

ev_core_in_backend() {
    ev_core_require_var "ELAVIEW_DEVBOX_ROOT" || return 1
    ev_core_in_dir "$ELAVIEW_DEVBOX_ROOT/backend" "$@"
}

ev_core_in_mobile() {
    ev_core_require_var "ELAVIEW_DEVBOX_ROOT" || return 1
    ev_core_in_dir "$ELAVIEW_DEVBOX_ROOT/apps/mobile" "$@"
}

ev_core_in_web() {
    ev_core_require_var "ELAVIEW_DEVBOX_ROOT" || return 1
    ev_core_in_dir "$ELAVIEW_DEVBOX_ROOT/apps/web" "$@"
}

ev_core_in_infra() {
    ev_core_require_var "ELAVIEW_DEVBOX_ROOT" || return 1
    ev_core_in_dir "$ELAVIEW_DEVBOX_ROOT/infra" "$@"
}