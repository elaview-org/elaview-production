ev is a Devbox-contained DevOps & Environment CLI for internal usage in Elaview.

Usage:
ev <command> [arguments]

General:

    help                    show this help text

Environment management:

    env:list                list all Elaview environment variables
    env:list:mobile         list all Elaview mobile environment variables
    env:list:web            list all Elaview web environment variables
    env:list:backend        list all Elaview backend environment variables

Backend:

    backend:start           start backend services via Docker Compose
    backend:stop            stop backend services and remove orphans
    backend:logs            follow logs of backend services

Mobile:

    [no commands yet]

Web:

    [no commands yet]

Additional help topics:
