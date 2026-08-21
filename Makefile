.PHONY: setup dev stop check test lint typecheck build source-check data-fetch data-analyze

setup:
	python3 -m venv .venv
	.venv/bin/pip install -e './apps/api[dev]'
	npm install

dev:
	./scripts/dev.sh
stop:
	./scripts/stop.sh
lint:
	.venv/bin/ruff check apps/api
	npm run lint
typecheck:
	.venv/bin/mypy apps/api/remedio_aberto
	npm run typecheck
test:
	.venv/bin/pytest apps/api/tests --cov=apps/api/remedio_aberto
	npm test
build:
	npm run build
check: lint typecheck test build
	npm audit --audit-level=high
source-check:
	.venv/bin/python -m remedio_aberto.source_cli check
data-fetch:
	.venv/bin/python -m remedio_aberto.source_cli fetch
data-analyze:
	.venv/bin/python -m remedio_aberto.source_cli analyze
