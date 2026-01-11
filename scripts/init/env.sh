#!/bin/sh

_ev_prefix="ELAVIEW_"
_ev_env_file="$ELAVIEW_DEVBOX_ROOT/.env"

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
            printf "\033[31m✗\033[0m Unknown command group: %s\n" "$_ev_group" >&2
            echo "Run 'ev help' for usage."
            return 1
            ;;
    esac
}

if [ -f "$_ev_env_file" ]; then
    printf "\033[33mInfo:\033[0m Loading environment variables from .env\n"
    _ev_count=0
    while IFS='=' read -r key value; do
        case "$key" in
            ''|\#*) continue ;;
        esac
        key="${key#"${key%%[![:space:]]*}"}"
        key="${key%"${key##*[![:space:]]}"}"
        [ -z "$key" ] && continue
        export "${_ev_prefix}${key}"="$value"
        _ev_count=$((_ev_count + 1))
    done < "$_ev_env_file"
    printf "\033[32m✓\033[0m Loaded %s variables from .env\n" "$_ev_count"
    unset _ev_count
fi

unset _ev_prefix _ev_env_file