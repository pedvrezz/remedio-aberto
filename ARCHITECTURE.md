# Arquitetura

## Estado implementado

O Remédio Aberto é um monorepo mínimo com dois processos locais:

```text
Browser ──127.0.0.1:3000──> Next.js
Browser ──127.0.0.1:8000──> FastAPI ──> SQLite local
```

- `apps/web`: interface institucional da Fase 0.
- `apps/api`: API, configuração, conexão SQLite e ingestão ANVISA.
- `scripts/dev.sh`: inicia ambos em loopback e encerra os filhos ao receber sinal.
- `data/`: banco e artefatos locais ignorados pelo Git.

## Decisões

1. Lite é o modo padrão e único implementado.
2. SQLite com driver assíncrono e WAL reduz atrito local.
3. Frontend e API são processos separados para preservar limites claros.
4. Não há pacote de schemas compartilhados: ainda não existe contrato público estável de medicamentos.
5. Não há Docker Full, PostgreSQL, Redis, filas ou scheduler antes de uso real.
6. A API publica OpenAPI e mantém apenas healthchecks; a ingestão é acionada por CLI local.
7. A primeira fonte implementada é o CSV oficial de medicamentos registrados da ANVISA, com cache por SHA-256 e persistência idempotente.

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

O SQLite contém `source_artifacts` e `anvisa_medicines`, criadas transacionalmente pelo fluxo local de ingestão. O artefato bruto e o banco ficam em `data/`, ignorado pelo Git. Ainda não existe migration de domínio nem contrato público de medicamentos; qualquer mudança de identidade, unidade documental ou interpretação de campo exige análise e, quando material, decisão humana registrada.
