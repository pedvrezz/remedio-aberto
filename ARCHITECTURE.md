# Arquitetura

## Estado implementado

O Remédio Aberto é um monorepo mínimo com dois processos locais:

```text
Browser ──127.0.0.1:3000──> Next.js
Browser ──127.0.0.1:8000──> FastAPI ──> SQLite local
```

- `apps/web`: interface institucional da Fase 0.
- `apps/api`: API, configuração e conexão SQLite.
- `scripts/dev.sh`: inicia ambos em loopback e encerra os filhos ao receber sinal.
- `data/`: banco e futuros artefatos locais, ignorados pelo Git.

## Decisões

1. Lite é o modo padrão e único implementado.
2. SQLite com driver assíncrono e WAL reduz atrito local.
3. Frontend e API são processos separados para preservar limites claros.
4. Não há pacote de schemas compartilhados: ainda não existe contrato de medicamentos estável.
5. Não há Docker Full, PostgreSQL, Redis, filas ou scheduler antes de uso real.
6. A API publica OpenAPI, mas só contém healthchecks e metadados honestos da fundação.

## Próxima arquitetura, condicionada à Fase 1

A primeira integração seguirá um recorte vertical:

`fetch → checksum → validate → normalize → deduplicate → diff → persist → analyze → publish`

Cada etapa será introduzida com testes e somente após validação jurídica/técnica de uma fonte oficial. Provenance mínima: URL oficial, órgão, instante de coleta UTC, checksum SHA-256, versão do parser e versão do schema.

## Limites de confiança

- Rede externa: não confiável; timeouts e limites serão obrigatórios.
- Arquivos de fonte: não confiáveis até validação estrutural.
- API pública local: entrada não confiável; validação e limites obrigatórios.
- Banco local: integridade verificável, mas usuário local controla o host.

## Persistência

Na Fase 0 o SQLite serve apenas ao readiness check. Não existe schema de domínio nem migration. A primeira migration será criada junto com o primeiro modelo real, não antecipadamente.
