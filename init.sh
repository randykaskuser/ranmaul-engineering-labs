#!/usr/bin/env bash
# Standard startup and verification path (see AGENTS.md "Startup Workflow").
# Installs dependencies, then runs the same checks CI and Cloudflare Pages rely on.

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

INSTALL_CMD=(npm install)
LINT_CMD=(npm run lint)
VERIFY_CMD=(npm run build) # next build + postbuild (sets lang="id" on out/id/**)
START_CMD=(npm run dev)

# Next.js 16 needs Node 20.9 or newer.
NODE_MAJOR="$(node -p 'process.versions.node.split(".")[0]')"
if [ "$NODE_MAJOR" -lt 20 ]; then
  echo "Node $(node -v) is too old. Use Node 20 or newer." >&2
  exit 1
fi

echo "==> Working directory: $PWD"
echo "==> Node $(node -v)"
echo "==> Syncing dependencies"
"${INSTALL_CMD[@]}"

echo "==> Lint"
"${LINT_CMD[@]}"

echo "==> Running baseline verification (static export to out/)"
"${VERIFY_CMD[@]}"

echo "==> Startup command"
printf '    %q' "${START_CMD[@]}"
printf '\n'

if [ "${RUN_START_COMMAND:-0}" = "1" ]; then
  echo "==> Starting the app"
  exec "${START_CMD[@]}"
fi

echo "Set RUN_START_COMMAND=1 if you want init.sh to launch the app directly."
echo "Preview the static build with: npm run preview"
