ev is a Devbox-contained DevOps & Environment CLI for internal usage in Elaview.

Usage:
ev <group>:<command> [arguments]

General:

    help                    show this help text

Environment (env:*):

    env:list                list all Elaview environment variables
    env:list:mobile         list all Elaview mobile environment variables
    env:list:web            list all Elaview web environment variables
    env:list:backend        list all Elaview backend environment variables

Secrets (secrets:*):

    secrets:list                    show all secrets
    secrets:get <name>              get a secret value
    secrets:set <name> <value>      set a secret
    secrets:notes <name> <note>     set a note on a secret

Backend (backend:*):

    backend:start               start backend services via Docker Compose
    backend:stop                stop backend services and remove orphans
    backend:restart             restart backend services
    backend:logs                follow logs of backend services
    backend:status              show status of backend services
    backend:exec                execute command in a backend container
    backend:install             restore .NET dependencies
    backend:build               build backend in Release mode
    backend:format              format code
    backend:format:check        check code formatting
    backend:test                run all tests
    backend:test:unit           run unit tests only
    backend:test:integration    run integration tests only
    backend:publish             publish backend to ./publish
    backend:reset               clean artifacts (bin, obj, publish) and restore dependencies
    backend:deploy              deploy backend to Railway (staging/production only)
    backend:destroy             destroy current environment on Railway (staging/production only)
    backend:destroy:all         destroy entire Railway project and all environments

Web (web:*):

    web:install             install dependencies (frozen lockfile)
    web:lint                lint web client
    web:typecheck           type-check web client
    web:build               build web client
    web:test                run web tests
    web:test:coverage       run web tests with coverage
    web:test:e2e            run web E2E tests (Playwright)
    web:format              format web client code
    web:format:check        check code formatting
    web:reset               clean artifacts and reinstall dependencies
    web:deploy              deploy web client via OpenTofu + Vercel (staging/production only)
    web:destroy             destroy OpenTofu resources for current environment (staging/production only)
    web:destroy:all         destroy all OpenTofu resources across all environments

Mobile (mobile:*):

    mobile:reset            clean artifacts (node_modules, .expo, ios, android) and reinstall dependencies
    mobile:deploy           deploy mobile app (not yet implemented)
    mobile:destroy          tear down mobile infrastructure for current environment (not yet implemented)
    mobile:destroy:all      tear down all mobile infrastructure (not yet implemented)

Repository (repo:*):

    repo:loc                lines of code (source only, excludes docs/config)
    repo:loc:all            lines of code (all files)
    repo:info               repository summary
    repo:size               analyze repo size and bloat
    repo:contributors       contributor statistics
    repo:activity           commit activity patterns
    repo:languages          language breakdown (GitHub-accurate)
    repo:ui                 interactive git UI (lazygit)
    repo:secrets            scan working directory for secrets
    repo:secrets:history    scan git history for secrets
    repo:secrets:deep       deep scan with verification
