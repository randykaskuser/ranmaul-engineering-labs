#!/usr/bin/env bash
# Standard startup and verification path (see AGENTS.md "Startup Workflow").
# Installs dependencies, then runs the same checks CI and Cloudflare Pages rely on.

set -euo pipefail

if [ "${1:-}" = "--setup-ai-memory" ] || [ "${AUTO_SETUP_AI_MEMORY:-0}" = "1" ]; then
  if ! command -v ai-memory >/dev/null 2>&1; then
    command -v brew >/dev/null 2>&1 && brew install akitaonrails/tap/ai-memory || (curl -fsSL https://github.com/akitaonrails/ai-memory/releases/latest/download/install.sh | sh)
    export PATH="$HOME/.local/bin:$PATH"
  fi
  ai-memory setup --yes || ai-memory setup
fi

if [ -z "${CI:-}" ]; then
  if command -v ai-memory >/dev/null 2>&1; then
    ai-memory status >/dev/null 2>&1 && echo "==> ai-memory: active" || echo "!!  WARNING: ai-memory daemon not active (run ./init.sh --setup-ai-memory)"
    WIKI_SYNC="${AI_MEMORY_DATA_DIR:-$HOME/Library/Application Support/ai-memory}/wiki-sync.sh"
    [ ! -x "$WIKI_SYNC" ] && WIKI_SYNC="${XDG_DATA_HOME:-$HOME/.local/share}/ai-memory/wiki-sync.sh"
    [ -x "$WIKI_SYNC" ] && "$WIKI_SYNC" && echo "==> ai-memory wiki: synced"
  else
    echo "!!  WARNING: 'ai-memory' belum terinstal di PC ini! Jalankan: ./init.sh --setup-ai-memory"
  fi
  if command -v graphify >/dev/null 2>&1; then
    [ ! -f "graphify-out/graph.json" ] && GRAPHIFY_BACKEND=none graphify extract . --code-only --global --as "website" >/dev/null 2>&1 || true
    graphify update . >/dev/null 2>&1 || true
    graphify global add "graphify-out/graph.json" --as "website" >/dev/null 2>&1 || true
    echo "==> graphify: updated local & global graph (website)"
  fi
fi


ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

INSTALL_CMD=(npm install)
LINT_CMD=(npm run lint)
VERIFY_CMD=(npm run build) # next build (incl. TypeScript) + postbuild (sets lang="id" on out/id/**)
SMOKE_CMD=(node scripts/smoke.mjs) # key routes, internal links, lang="id" on out/
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

echo "==> Smoke check on out/"
"${SMOKE_CMD[@]}"

echo "==> Startup command"
printf '    %q' "${START_CMD[@]}"
printf '\n'

if [ "${RUN_START_COMMAND:-0}" = "1" ]; then
  echo "==> Starting the app"
  exec "${START_CMD[@]}"
fi

echo "Set RUN_START_COMMAND=1 if you want init.sh to launch the app directly."
echo "Preview the static build with: npm run preview"
