#!/bin/sh

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SCRIPTS_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

. "$SCRIPTS_DIR/core/dir.sh"

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
        *)
            ev_core_log_error "Unknown web command: $cmd"
            echo "Available: install, lint, typecheck, build, test, test:coverage, test:e2e, format, format:check, audit, reset"
            return 1
            ;;
    esac
}

ev_web_dispatch "$@"