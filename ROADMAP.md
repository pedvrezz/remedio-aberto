# Roadmap

## Milestone estrutural — histórico técnico sustentável

O projeto deve atingir pelo menos 500 commits legítimos e preservados em `main` por meio da execução do roadmap real. Marcos: 50, 100, 200, 300, 400 e 500 commits. A contagem é secundária à segurança e qualidade: commits vazios, churn, fragmentação artificial e mudanças sem valor continuam proibidos. O Kanban deve manter unidades técnicas coesas e usar merge que preserve commits legítimos quando seguro.

## Fase 0 — fundação local

- Monorepo mínimo com web e API.
- Execução Lite em loopback.
- SQLite local, healthchecks e OpenAPI.
- Lint, tipos, testes, build e CI.
- Documentação de segurança, arquitetura e fontes candidatas.

## Fase 1 — uma fonte, um fluxo ponta a ponta

1. [x] Validar oficialmente uma única fonte pequena ou recorte controlado.
2. [x] Registrar condições de uso e evidências de legitimidade, preservando ambiguidades.
3. [x] Implementar aquisição responsável, checksum e cache.
4. [x] Criar schema, parser e fixtures públicas pequenas.
5. [x] Normalizar conservadoramente, deduplicar estruturalmente e persistir de modo idempotente.
6. [x] Analisar qualidade, identidade candidata e unidade documental sem inferência regulatória.
7. [ ] Implementar camada interna de leitura baseada em evidência.
8. [ ] Expor busca simples e detalhe versionados com provenance.
9. [ ] Mostrar o dado no frontend, deixando ausências explícitas.

## Fase 2 — pesquisa e qualidade

Busca por nome, princípio ativo, fabricante, registro e apresentação; correspondência aproximada claramente identificada; filtros; indicadores de completude.

## Fase 3 — histórico

Snapshots materiais, diff por campo, preços em centavos/Decimal e timeline de alterações com fonte.

## Fase 4 — novas fontes

Adicionar uma fonte por vez. Bulário somente após validação de acesso e condições de uso, sem contornar CAPTCHA ou bloqueios.

## Fase 5 — ferramentas para desenvolvedores

CLI madura, SDKs somente após estabilização da API, métricas exclusivamente locais e documentação avançada.

## Fase 6 — distribuição

Empacotamento simples, avaliação de Tauri e documentação opt-in para exposição web. Docker Full apenas se houver serviços reais que justifiquem PostgreSQL, Redis, worker ou scheduler.
