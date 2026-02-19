#!/usr/bin/env bash

set -euo pipefail
doppler secrets download --no-file --format json --config "$ELAVIEW_ENVIRONMENT"