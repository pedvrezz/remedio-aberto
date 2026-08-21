# Remédio Aberto

Fundação local-first para uma futura plataforma brasileira de consulta pública de medicamentos baseada exclusivamente em fontes oficiais validadas.

Estado atual: **Fase 0**. Não há datasets integrados, busca de medicamentos ou recomendações médicas. O que existe é uma web mínima, API FastAPI com healthchecks, SQLite local, testes e automação de qualidade.

## Requisitos

- Node.js 20.9+ e npm 10+
- Python 3.12+
- `make`

Nada é instalado globalmente.

## Início rápido (Lite)

```bash
make setup
make dev
```

- Web: http://127.0.0.1:3000
- API: http://127.0.0.1:8000
- OpenAPI: http://127.0.0.1:8000/docs

Pare com `Ctrl+C` ou, em outro terminal, `make stop`.

## Qualidade

```bash
make lint
make typecheck
make test
make build
make check
```

## Escopo e limites

- SQLite é o único banco da Fase 0.
- Não há PostgreSQL, Redis, worker, scheduler, SDK ou coletor fictício.
- Não há Docker nesta Fase 0; o modo Full está planejado somente após existir necessidade real.
- Não há telemetria, analytics ou bind externo.
- A aplicação é informativa. Não diagnostica, prescreve, recomenda tratamento, sugere dose ou infere equivalência terapêutica.

## Estrutura

```text
apps/web/                 Next.js + TypeScript
apps/api/remedio_aberto/  FastAPI + SQLAlchemy async
apps/api/tests/           testes da API
scripts/                  iniciar/parar modo Lite
docs/                     arquitetura, segurança e método futuro
migrations/               reservado; vazio até existir schema persistente
```

## Documentação

- [Arquitetura](ARCHITECTURE.md)
- [Roadmap](ROADMAP.md)
- [Backlog](BACKLOG.md)
- [Fontes candidatas](docs/data-sources.md)
- [Threat model](docs/THREAT_MODEL.md)
- [Ingestão planejada](docs/ingestion.md)
- [Segurança](SECURITY.md)
- [Contribuição](CONTRIBUTING.md)

## Licença

Código sob licença Apache-2.0. Dados de terceiros não são relicenciados pelo projeto; cada fonte deverá ter condições de uso verificadas e registradas antes de integração.
