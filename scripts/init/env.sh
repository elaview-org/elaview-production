#!/bin/sh

. "$ELAVIEW_DEVBOX_ROOT/scripts/core/log.sh"

_ev_load_secrets() {
    doppler secrets download --no-file --format env-no-quotes 2>/dev/null
}

ev() {
    _ev_group="$1"
    shift
    case "$_ev_group" in
        help)      sh "$ELAVIEW_EV_CMD/global.sh" help ;;
        env:*)     sh "$ELAVIEW_EV_CMD/env.sh" "${_ev_group#env:}" "$@" ;;
        backend:*) sh "$ELAVIEW_EV_CMD/backend.sh" "${_ev_group#backend:}" "$@" ;;
        infra:*)   sh "$ELAVIEW_EV_CMD/infra.sh" "${_ev_group#infra:}" "$@" ;;
        repo:*)    sh "$ELAVIEW_EV_CMD/repo.sh" "${_ev_group#repo:}" "$@" ;;
        web:*)     sh "$ELAVIEW_EV_CMD/web.sh" "${_ev_group#web:}" "$@" ;;
        mobile:*)  sh "$ELAVIEW_EV_CMD/mobile.sh" "${_ev_group#mobile:}" "$@" ;;
        *)
            ev_core_log_error "Unknown command group: $_ev_group"
            echo "Run 'ev help' for usage."
            return 1
            ;;
    esac
}

ev_core_log_info "Loading environment variables from Doppler"

if ! _ev_secrets=$(_ev_load_secrets); then
    ev_core_log_warn "Doppler not configured. Logging in..."
    if ! doppler login; then
        ev_core_log_error "Doppler login failed"
        unset _ev_secrets
        unset -f _ev_load_secrets
        return 1
    fi
    doppler setup --project elaview --config development --no-interactive
    if ! _ev_secrets=$(_ev_load_secrets); then
        ev_core_log_error "Failed to load Doppler secrets"
        unset _ev_secrets
        unset -f _ev_load_secrets
        return 1
    fi
fi

eval "$(printf '%s' "$_ev_secrets" | sed 's/^/export ELAVIEW_/')"
unset _ev_secrets
unset -f _ev_load_secrets
ev_core_log_success "Loaded secrets from Doppler"