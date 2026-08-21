#!/usr/bin/env bash
set -Eeuo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

terminate_tree() {
  local pid="${1:-}"
  [[ -n "$pid" ]] || return 0
  while read -r child; do
    [[ -n "$child" ]] && terminate_tree "$child"
  done < <(pgrep -P "$pid" 2>/dev/null || true)
  kill "$pid" 2>/dev/null || true
}

for service in api web; do
  pid_file="$ROOT/.run/$service.pid"
  if [[ -f "$pid_file" ]]; then
    terminate_tree "$(<"$pid_file")"
    rm -f "$pid_file"
  fi
done
