#!/bin/bash

prefix="ELAVIEW_"
env_file="$ELAVIEW_DEVBOX_ROOT/.env"

printf "\033[33mInfo:\033[0m Loading Elaview environment variables.\n"

[[ ! -f "$env_file" ]] && {
    echo ".env file not found at $env_file" >&2
    return 1
}

count=0
while IFS='=' read -r key value; do
    [[ -z "$key" || "$key" =~ ^[[:space:]]*# ]] && continue
    key="${key#"${key%%[![:space:]]*}"}"
    key="${key%"${key##*[![:space:]]}"}"
    [[ -z "$key" ]] && continue
    export "${prefix}${key}"="$value"
    ((count++))
done < "$env_file"

printf "\033[32m✓\033[0m Loaded %s Elaview environment variables. Run \"ev env:list\" to verify.\n" "$count"
