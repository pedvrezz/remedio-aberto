# Configuração persistente — Hermes Kanban + Gateway

Data: 2026-08-21 UTC

## Componentes oficiais

- board isolado: `remedio-aberto`;
- projeto Hermes: `remedio-aberto`, raiz `/home/hermes/remedio-aberto`;
- profile instalado utilizado: `default`;
- Gateway: serviço systemd de usuário instalado pelo comando oficial `hermes gateway install --start-now --start-on-login`, sem `--system` e sem sudo;
- dispatcher: exclusivamente no Gateway (`kanban.dispatch_in_gateway=true`); `hermes kanban daemon` não foi iniciado;
- tasks de código: workspace `worktree` e branches determinísticas.

## Limites

- concorrência global: 1;
- concorrência por profile: 1;
- spawns por tick: 1;
- intervalo: 60 segundos;
- circuit breaker: 2 falhas consecutivas;
- stale timeout: 14.400 segundos;
- runtime RA-002: 2 horas; RA-003/RA-004: 3 horas;
- auto-decompose: habilitado, no máximo 1 item de triage por tick;
- assignee/orchestrator: único profile real `default`.

A versão instalada não expõe `kanban_request_review` nem configuração `review_dispatch`; por isso review automático não foi inventado. Os cards exigem gates, push e CI antes de completar. Um profile de review não foi criado artificialmente.

## Janela inicial

- RA-002 contrato documental: ready/running;
- RA-003 camada interna: depende de RA-002;
- RA-004 endpoints read-only: depende de RA-003.

Chaves de idempotência: `remedio-aberto-ra-002`, `remedio-aberto-ra-003`, `remedio-aberto-ra-004`.

CMED, identidade regulatória, mudança destrutiva de schema, exposição pública e demais gates humanos não foram enfileirados.

## Meta estrutural

Milestone de 500 commits úteis e preservados registrado no ROADMAP. Baseline no momento da configuração: 10 commits em `main`; marcos 50/100/200/300/400/500. A meta não autoriza churn, commits vazios ou fragmentação artificial.
