#!/bin/sh

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SCRIPTS_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

. "$SCRIPTS_DIR/core/dir.sh"

ev_backend_start() {
    ev_core_require_cmd "docker" || return 1
    ev_core_log_info "Starting backend services..."
    ev_core_in_backend docker compose up --build -d
    ev_backend_exit=$?
    [ $ev_backend_exit -eq 0 ] && ev_core_log_success "Backend services started."
    return $ev_backend_exit
}

ev_backend_stop() {
    ev_core_require_cmd "docker" || return 1
    ev_core_log_info "Stopping backend services..."
    ev_core_in_backend docker compose down --remove-orphans
    ev_backend_exit=$?
    [ $ev_backend_exit -eq 0 ] && ev_core_log_success "Backend services stopped."
    return $ev_backend_exit
}

ev_backend_restart() {
    ev_backend_stop && ev_backend_start
}

ev_backend_logs() {
    ev_core_require_cmd "docker" || return 1
    ev_core_in_backend docker compose logs -f "$@"
}

ev_backend_status() {
    ev_core_require_cmd "docker" || return 1
    ev_core_in_backend docker compose ps
}

ev_backend_exec() {
    ev_core_require_cmd "docker" || return 1
    ev_core_in_backend docker compose exec "$@"
}

ev_backend_dispatch() {
    cmd="$1"
    shift

    case "$cmd" in
        start)   ev_backend_start ;;
        stop)    ev_backend_stop ;;
        restart) ev_backend_restart ;;
        logs)    ev_backend_logs "$@" ;;
        status)  ev_backend_status ;;
        exec)    ev_backend_exec "$@" ;;
        *)
            ev_core_log_error "Unknown backend command: $cmd"
            echo "Available: start, stop, restart, logs, status, exec"
            return 1
            ;;
    esac
}

ev_backend_dispatch "$@"