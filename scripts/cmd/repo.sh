#!/bin/sh

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SCRIPTS_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

. "$SCRIPTS_DIR/core/dir.sh"

ev_repo_loc() {
    ev_core_require_cmd "scc" || return 1
    ev_core_in_root scc \
        --exclude-dir=node_modules,.git,.devbox,dist,build,.next,.expo \
        --not-match='\.md$|\.json$|\.yaml$|\.yml$|\.lock$' \
        "$@"
}

ev_repo_loc_all() {
    ev_core_require_cmd "scc" || return 1
    ev_core_in_root scc "$@"
}

ev_repo_info() {
    ev_core_require_cmd "onefetch" || return 1
    ev_core_in_root onefetch "$@"
}

ev_repo_size() {
    ev_core_require_cmd "git-sizer" || return 1
    ev_core_in_root git-sizer "$@"
}

ev_repo_contributors() {
    ev_core_require_cmd "git-fame" || return 1
    ev_core_in_root git-fame "$@"
}

ev_repo_activity() {
    ev_core_require_cmd "git-quick-stats" || return 1
    ev_core_in_root git-quick-stats "$@"
}

ev_repo_languages() {
    ev_core_require_cmd "github-linguist" || return 1
    ev_core_in_root github-linguist "$@"
}

ev_repo_ui() {
    ev_core_require_cmd "lazygit" || return 1
    ev_core_in_root lazygit "$@"
}

ev_repo_secrets() {
    ev_core_require_cmd "gitleaks" || return 1
    ev_core_log_info "Scanning for secrets..."
    ev_core_in_root gitleaks detect --source . --no-git "$@"
}

ev_repo_secrets_history() {
    ev_core_require_cmd "gitleaks" || return 1
    ev_core_log_info "Scanning git history for secrets..."
    ev_core_in_root gitleaks detect --source . "$@"
}

ev_repo_secrets_deep() {
    ev_core_require_cmd "trufflehog" || return 1
    ev_core_log_info "Deep scanning for secrets..."
    ev_core_in_root trufflehog git file://. --only-verified "$@"
}

ev_repo_dispatch() {
    cmd="$1"
    shift

    case "$cmd" in
        loc)          ev_repo_loc "$@" ;;
        loc:all)      ev_repo_loc_all "$@" ;;
        info)         ev_repo_info "$@" ;;
        size)         ev_repo_size "$@" ;;
        contributors) ev_repo_contributors "$@" ;;
        activity)     ev_repo_activity "$@" ;;
        languages)    ev_repo_languages "$@" ;;
        ui)              ev_repo_ui "$@" ;;
        secrets)         ev_repo_secrets "$@" ;;
        secrets:history) ev_repo_secrets_history "$@" ;;
        secrets:deep)    ev_repo_secrets_deep "$@" ;;
        *)
            ev_core_log_error "Unknown repo command: $cmd"
            echo "Available: loc, loc:all, info, size, contributors, activity, languages, ui, secrets, secrets:history, secrets:deep"
            return 1
            ;;
    esac
}

ev_repo_dispatch "$@"