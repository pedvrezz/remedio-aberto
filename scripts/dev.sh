#!/usr/bin/env bash
set -Eeuo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PID_DIR="$ROOT/.run"
mkdir -p "$PID_DIR" "$ROOT/data"

if [[ ! -x "$ROOT/.venv/bin/uvicorn" || ! -d "$ROOT/node_modules" ]]; then
  echo "Dependências ausentes. Execute: make setup" >&2
  exit 1
fi

terminate_tree() {
  local pid="${1:-}"
  [[ -n "$pid" ]] || return 0
  while read -r child; do
    [[ -n "$child" ]] && terminate_tree "$child"
  done < <(pgrep -P "$pid" 2>/dev/null || true)
  kill "$pid" 2>/dev/null || true
}

cleanup() {
  terminate_tree "${API_PID:-}"
  terminate_tree "${WEB_PID:-}"
  rm -f "$PID_DIR/api.pid" "$PID_DIR/web.pid"
}
trap cleanup INT TERM EXIT

cd "$ROOT/apps/api"
"$ROOT/.venv/bin/uvicorn" remedio_aberto.main:app --host 127.0.0.1 --port 8000 &
API_PID=$!
cd "$ROOT"
npm run dev:web &
WEB_PID=$!
printf '%s\n' "$API_PID" > "$PID_DIR/api.pid"
printf '%s\n' "$WEB_PID" > "$PID_DIR/web.pid"

echo "Web: http://127.0.0.1:3000"
echo "API: http://127.0.0.1:8000/docs"
wait -n "$API_PID" "$WEB_PID"
