# Estado Atual — Remédio Aberto

- Atualizado em: 2026-08-21 UTC
- Schema persistido: 1 (inalterado)
- Ciclos autônomos concluídos: 2
- Automação persistente: board Hermes `remedio-aberto`, dispatcher no Gateway user-scoped
- Progresso do milestone Git: 10/500 commits em `main`; próximo marco 50
- Branch: `main`
- HEAD antes desta configuração: `193706b` (`docs: record autonomous cycles`)
- Árvore atual: configuração persistente do Kanban sendo documentada

## Última tarefa concluída

`RA-001` — análise reproduzível da qualidade do snapshot ANVISA.

Entregas:

- `make data-analyze` gera `data/reports/anvisa-quality.json` local e ignorado;
- mede identificadores, coocorrência, datas, domínios, nulidade e duplicidade física;
- relatório interpretativo em `docs/anvisa-quality-analysis.md`;
- nenhuma alteração de schema, dado persistido ou significado regulatório;
- 19 testes Python e 2 frontend; cobertura Python 92%.

Commit: `a6601ae`

CI: sucesso — <https://github.com/pedvrezz/remedio-aberto/actions/runs/32519334180>

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

`RA-002` — registrar contrato interno de leitura para tratar cada linha estrutural como registro documental do snapshot, sem identidade regulatória canônica, sem alteração de schema e sem exposição pública. Depois, se o contrato mantiver esses limites, executar `RA-003` com testes.

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
4. Continuar por `RA-002`; não avançar identidade/modelo sem decisão humana.
