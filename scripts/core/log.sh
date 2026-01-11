#!/bin/sh

EV_CORE_DIR="$ELAVIEW_DEVBOX_ROOT/scripts/core"
. "$EV_CORE_DIR/colors.sh"

ev_core_log_info() {
    printf "${EV_COLOR_YELLOW}Info:${EV_COLOR_RESET} %s\n" "$1"
}

ev_core_log_success() {
    printf "${EV_COLOR_GREEN}✓${EV_COLOR_RESET} %s\n" "$1"
}

ev_core_log_error() {
    printf "${EV_COLOR_RED}✗${EV_COLOR_RESET} %s\n" "$1" >&2
}

ev_core_log_warn() {
    printf "${EV_COLOR_YELLOW}!${EV_COLOR_RESET} %s\n" "$1"
}

ev_core_log_debug() {
    [ -n "$EV_DEBUG" ] && printf "${EV_COLOR_GRAY}[debug]${EV_COLOR_RESET} %s\n" "$1"
}