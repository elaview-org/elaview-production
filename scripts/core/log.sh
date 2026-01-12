#!/bin/sh

EV_CORE_DIR="$ELAVIEW_DEVBOX_ROOT/scripts/core"
. "$EV_CORE_DIR/colors.sh"

ev_core_log_info() {
    printf "${EV_COLOR_GREEN}[Info]${EV_COLOR_RESET} %s\n" "$1"
}

ev_core_log_success() {
    printf "${EV_COLOR_GREEN}[Success]${EV_COLOR_RESET} %s\n" "$1"
}

ev_core_log_error() {
    printf "${EV_COLOR_RED}[Error]${EV_COLOR_RESET} %s\n" "$1" >&2
}

ev_core_log_warn() {
    printf "${EV_COLOR_YELLOW}[Warn]${EV_COLOR_RESET} %s\n" "$1"
}

ev_core_log_debug() {
    [ -n "$EV_DEBUG" ] && printf "${EV_COLOR_GRAY}[Debug]${EV_COLOR_RESET} %s\n" "$1"
}