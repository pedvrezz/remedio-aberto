# Estado Atual — Remédio Aberto

- Atualizado em: 2026-08-21 UTC
- Schema persistido: 1 (inalterado)
- Ciclos autônomos concluídos: 3
- Automação persistente: board Hermes `remedio-aberto`, dispatcher no Gateway user-scoped
- Progresso do milestone Git em `main`: 10/500 commits antes de `RA-002`; próximo marco 50
- Branch de trabalho: `feat/ra-002-reading-contract`
- HEAD funcional anterior em `main`: `729a0f6` (`chore: configure persistent Kanban workflow`)
- HEAD funcional da entrega: `81669fc` (inclui `708db52`, `docs: define internal ANVISA reading contract`)
- Árvore esperada: alterações apenas do registro final de estado/log

## Tarefa atual concluída localmente

`RA-002` — contrato interno de leitura do snapshot ANVISA.

Entregas:

- `docs/internal-reading-contract.md` define cada linha estrutural como registro documental do snapshot;
- `artifact_sha256 + row_hash` permanece identidade exclusivamente técnica;
- identificadores e datas permanecem textos opcionais/brutos;
- domínios literais, provenance e `NULL` explícito são obrigatórios;
- nenhuma alteração de schema, dado persistido ou significado regulatório;

Commit: `708db52` (`docs: define internal ANVISA reading contract`), integrado ao `HEAD` `81669fc` após sincronização com `main`.

CI de `RA-002`: sucesso — <https://github.com/pedvrezz/remedio-aberto/actions/runs/32524082241>

CI anterior (`RA-001`): sucesso — <https://github.com/pedvrezz/remedio-aberto/actions/runs/32519334180>

## Gates conhecidos

- `make check`: verde
- Ruff: verde
- MyPy strict: verde
- Pytest: 19 aprovados; cobertura 92%
- ESLint e TypeScript: verdes
- Testes frontend: 2 aprovados
- Next.js build: verde
- `npm audit --audit-level=high`: 0 vulnerabilidades
- Secret scan: 0 ocorrências na fundação do autopilot
- CI de `main`: verde

## Próxima tarefa segura

`RA-003` — implementar, com TDD, a camada interna de leitura conforme `docs/internal-reading-contract.md`, sem alteração de schema nem exposição pública.

## Bloqueios e decisões pendentes

- **Identidade regulatória:** decisão humana obrigatória antes de eleger registro, processo, nome ou hash como identidade canônica.
- **Unidade persistida:** o banco colapsa duplicatas estruturais por artefato; mudar essa decisão exige aprovação humana e migration/rollback.
- **Vencimento:** predominância `MMAAAA`, oito valores `MM/AAAA` e dez anômalos; proibido inventar dia ou corrigir automaticamente.
- **Categorias:** variações de caixa/truncamento aparente; proibido criar enum ou fundir valores sem evidência.
- **Licença específica e periodicidade atual:** continuam não confirmadas conforme `docs/data-sources.md`.
- **CMED e exposição pública:** fora do ciclo atual.

## Decisões vigentes

- `artifact_sha256 + row_hash` é identidade técnica, não regulatória.
- Identificadores oficiais permanecem texto opcional.
- Datas e domínios oficiais permanecem brutos.
- Toda leitura futura deve carregar provenance e representar ausência explicitamente.
- Lite/loopback continua padrão; sem scheduler, daemon ou deploy público.

## Retomada

1. Confirmar `pwd` e `git status`.
2. Ler `AUTOPILOT.md`, este arquivo e o backlog.
3. Se houver alteração não compreendida ou CI vermelha, parar.
4. Continuar por `RA-003`; não avançar identidade/modelo sem decisão humana.
