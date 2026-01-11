#!/bin/sh

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SCRIPTS_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

. "$SCRIPTS_DIR/core/log.sh"

EV_ENV_PREFIX="ELAVIEW_"

ev_env_list() {
    filter="${1:-$EV_ENV_PREFIX}"
    env | grep "^${filter}" | sort
}

ev_env_list_mobile() {
    ev_env_list "${EV_ENV_PREFIX}MOBILE_"
}

ev_env_list_web() {
    ev_env_list "${EV_ENV_PREFIX}WEB_"
}

ev_env_list_backend() {
    ev_env_list "${EV_ENV_PREFIX}BACKEND_"
}

ev_env_dispatch() {
    cmd="$1"
    shift

    case "$cmd" in
        list)         ev_env_list ;;
        list:mobile)  ev_env_list_mobile ;;
        list:web)     ev_env_list_web ;;
        list:backend) ev_env_list_backend ;;
        *)
            ev_core_log_error "Unknown env command: $cmd"
            echo "Available: list, list:mobile, list:web, list:backend"
            return 1
            ;;
    esac
}

ev_env_dispatch "$@"