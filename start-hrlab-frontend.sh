#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)

export HR_DEV_SERVER_HOST="${HR_DEV_SERVER_HOST:-0.0.0.0}"
export HR_DEV_SERVER_PORT="${HR_DEV_SERVER_PORT:-5182}"
export HR_PREVIEW_HOST="${HR_PREVIEW_HOST:-0.0.0.0}"
export HR_PREVIEW_PORT="${HR_PREVIEW_PORT:-5182}"
export HR_API_PROXY_TARGET="${HR_API_PROXY_TARGET:-http://127.0.0.1:18082}"
export HR_ALLOWED_HOSTS="${HR_ALLOWED_HOSTS:-*}"

cd "${SCRIPT_DIR}/frontend"
exec npm run dev
