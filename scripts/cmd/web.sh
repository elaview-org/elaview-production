#!/bin/sh

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SCRIPTS_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

. "$SCRIPTS_DIR/core/dir.sh"
. "$SCRIPTS_DIR/core/auth.sh"

ev_web_reset() {
    ev_core_require_cmd "bun" || return 1
    ev_core_log_info "Cleaning web artifacts..."
    ev_core_in_web rm -rf node_modules .next .turbo package-lock.json pnpm-lock.yaml yarn.lock
    ev_core_log_info "Installing dependencies..."
    ev_core_in_web bun install
    ev_web_exit=$?
    [ $ev_web_exit -eq 0 ] && ev_core_log_success "Web reset complete."
    return $ev_web_exit
}

ev_web_install() {
    ev_core_require_cmd "bun" || return 1
    ev_core_log_info "Installing web dependencies..."
    ev_core_in_web bun install --frozen-lockfile
    ev_web_exit=$?
    [ $ev_web_exit -ne 0 ] && return $ev_web_exit
    ev_core_log_info "Installing Playwright browsers..."
    ev_core_in_web bunx playwright install
    ev_web_exit=$?
    [ $ev_web_exit -eq 0 ] && ev_core_log_success "Web dependencies installed."
    return $ev_web_exit
}

ev_web_lint() {
    ev_core_require_cmd "bun" || return 1
    ev_core_log_info "Linting web client..."
    ev_core_in_web bun lint
    ev_web_exit=$?
    [ $ev_web_exit -eq 0 ] && ev_core_log_success "Lint check passed."
    return $ev_web_exit
}

ev_web_typecheck() {
    ev_core_require_cmd "bun" || return 1
    ev_core_log_info "Type-checking web client..."
    ev_core_in_web bun typecheck
    ev_web_exit=$?
    [ $ev_web_exit -eq 0 ] && ev_core_log_success "Type check passed."
    return $ev_web_exit
}

ev_web_build() {
    ev_core_require_cmd "bun" || return 1
    ev_core_log_info "Building web client..."
    ev_core_in_web bun compile
    ev_web_exit=$?
    [ $ev_web_exit -eq 0 ] && ev_core_log_success "Web client built successfully."
    return $ev_web_exit
}

ev_web_test() {
    ev_core_require_cmd "bun" || return 1
    ev_core_log_info "Running web tests..."
    ev_core_in_web bun test
    ev_web_exit=$?
    [ $ev_web_exit -eq 0 ] && ev_core_log_success "All web tests passed."
    return $ev_web_exit
}

ev_web_test_coverage() {
    ev_core_require_cmd "bun" || return 1
    ev_core_log_info "Running web tests with coverage..."
    ev_core_in_web bun test:coverage
    ev_web_exit=$?
    [ $ev_web_exit -eq 0 ] && ev_core_log_success "Coverage report generated."
    return $ev_web_exit
}

ev_web_format() {
    ev_core_require_cmd "bun" || return 1
    ev_core_log_info "Formatting web client..."
    ev_core_in_web bun format
    ev_web_exit=$?
    [ $ev_web_exit -eq 0 ] && ev_core_log_success "Formatting completed."
    return $ev_web_exit
}

ev_web_format_check() {
    ev_core_require_cmd "bun" || return 1
    ev_core_log_info "Checking code format in web client..."
    ev_core_in_web bun format:check
    ev_web_exit=$?
    [ $ev_web_exit -eq 0 ] && ev_core_log_success "Formatting check completed."
    return $ev_web_exit
}

ev_web_audit() {
    ev_core_require_cmd "bun" || return 1
    ev_core_log_info "Auditing web dependencies..."
    ev_core_in_web bun pm audit
    ev_web_exit=$?
    [ $ev_web_exit -eq 0 ] && ev_core_log_success "Dependency audit passed."
    return $ev_web_exit
}

ev_web_test_e2e() {
    ev_core_require_cmd "bun" || return 1
    ev_core_log_info "Running web E2E tests..."
    ev_core_in_web bun test:e2e
    ev_web_exit=$?
    [ $ev_web_exit -eq 0 ] && ev_core_log_success "All E2E tests passed."
    return $ev_web_exit
}

ev_web_deploy() {
    ev_core_prompt_token "ELAVIEW_VERCEL_API_TOKEN" || return 1
    export VERCEL_API_TOKEN="$ELAVIEW_VERCEL_API_TOKEN"

    if [ "$ELAVIEW_ENVIRONMENT" != "staging" ] && [ "$ELAVIEW_ENVIRONMENT" != "production" ]; then
        ev_core_log_error "Deploy is only allowed in staging or production (current: $ELAVIEW_ENVIRONMENT)"
        return 1
    fi

    ev_core_log_info "Initializing OpenTofu..."
    ev_core_in_infra tofu init || return 1

    ev_core_log_info "Selecting '$ELAVIEW_ENVIRONMENT' workspace..."
    ev_core_in_infra tofu workspace select -or-create "$ELAVIEW_ENVIRONMENT" || return 1

    ev_core_log_info "Applying OpenTofu changes..."
    ev_core_in_infra tofu apply -auto-approve || return 1

    _ev_web_project_id=$(ev_core_in_infra tofu output -raw vercel_project_id) || { ev_core_log_error "Failed to read Vercel project ID from OpenTofu"; return 1; }
    _ev_web_org_id=$(ev_core_in_infra tofu output -raw vercel_org_id) || { ev_core_log_error "Failed to read Vercel org ID from OpenTofu"; return 1; }

    ev_core_log_info "Deploying to Vercel..."
    VERCEL_ORG_ID="$_ev_web_org_id" \
    VERCEL_PROJECT_ID="$_ev_web_project_id" \
    ev_core_in_web bunx vercel --prod --yes "$@" --token "$ELAVIEW_VERCEL_API_TOKEN"
    _ev_web_exit=$?
    unset _ev_web_project_id _ev_web_org_id
    return $_ev_web_exit
}

ev_web_destroy() {
    ev_core_prompt_token "ELAVIEW_VERCEL_API_TOKEN" || return 1
    export VERCEL_API_TOKEN="$ELAVIEW_VERCEL_API_TOKEN"

    if [ "$ELAVIEW_ENVIRONMENT" != "staging" ] && [ "$ELAVIEW_ENVIRONMENT" != "production" ]; then
        ev_core_log_error "Destroy is only allowed in staging or production (current: $ELAVIEW_ENVIRONMENT)"
        return 1
    fi

    ev_core_log_info "Initializing OpenTofu..."
    ev_core_in_infra tofu init || return 1

    ev_core_log_info "Selecting '$ELAVIEW_ENVIRONMENT' workspace..."
    ev_core_in_infra tofu workspace select "$ELAVIEW_ENVIRONMENT" || { ev_core_log_error "Workspace '$ELAVIEW_ENVIRONMENT' does not exist"; return 1; }

    ev_core_log_info "Destroying OpenTofu resources for '$ELAVIEW_ENVIRONMENT'..."
    ev_core_in_infra tofu destroy -auto-approve || return 1
    ev_core_log_success "OpenTofu resources for '$ELAVIEW_ENVIRONMENT' destroyed."
}

ev_web_destroy_all() {
    ev_core_prompt_token "ELAVIEW_VERCEL_API_TOKEN" || return 1
    export VERCEL_API_TOKEN="$ELAVIEW_VERCEL_API_TOKEN"

    if [ "$ELAVIEW_ENVIRONMENT" != "staging" ] && [ "$ELAVIEW_ENVIRONMENT" != "production" ]; then
        ev_core_log_error "Destroy is only allowed in staging or production (current: $ELAVIEW_ENVIRONMENT)"
        return 1
    fi

    ev_core_log_info "Destroying all OpenTofu resources..."
    ev_core_in_infra tofu destroy -auto-approve "$@" || return 1
    ev_core_log_success "All OpenTofu resources destroyed."
}

ev_web_dispatch() {
    cmd="$1"
    shift

    case "$cmd" in
        install)            ev_web_install ;;
        lint)               ev_web_lint ;;
        typecheck)          ev_web_typecheck ;;
        build)              ev_web_build ;;
        test)               ev_web_test ;;
        test:coverage)      ev_web_test_coverage ;;
        test:e2e)           ev_web_test_e2e ;;
        format)             ev_web_format ;;
        format:check)       ev_web_format_check ;;
        audit)              ev_web_audit ;;
        reset)              ev_web_reset ;;
        deploy)             ev_web_deploy "$@" ;;
        destroy)            ev_web_destroy "$@" ;;
        destroy:all)        ev_web_destroy_all "$@" ;;
        *)
            ev_core_log_error "Unknown web command: $cmd"
            echo "Available: install, lint, typecheck, build, test, test:coverage, test:e2e, format, format:check, audit, reset, deploy, destroy, destroy:all"
            return 1
            ;;
    esac
}

ev_web_dispatch "$@"