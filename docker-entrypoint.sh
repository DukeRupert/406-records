#!/bin/sh
set -e

# Export environment variables for the API
export POSTMARK_TOKEN="${POSTMARK_TOKEN:-}"
export FROM_EMAIL="${FROM_EMAIL:-}"
export TO_EMAIL="${TO_EMAIL:-}"
export ALLOWED_ORIGIN="${ALLOWED_ORIGIN:-https://www.406records.com}"
export TURNSTILE_SECRET="${TURNSTILE_SECRET:-}"

exec "$@"
