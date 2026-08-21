# Estado Atual do Projeto — Remédio Aberto

> **Última atualização:** 2026-08-21 (UTC)
> **Versão do schema:** 1
> **Ciclo autopilot:** 0 (política criada, primeira execução)

---

## Última Tarefa Concluída

**Fase 1 — Etapa 1:** Ingestão da fonte oficial ANVISA "Medicamentos Registrados no Brasil" (`DADOS_ABERTOS_MEDICAMENTOS.csv`)

- Validação oficial de URLs, domínio, certificado TLS, formato, encoding, periodicidade, licença
- Coleta real com HTTPS verificado, timeout, limite de redirects, User-Agent, SHA-256 streaming
- 43.436 linhas processadas → 39.991 registros estruturais únicos
- Schema SQLite: `source_artifacts` + `anvisa_medicines`
- Idempotência validada (segunda execução: 0 inserções, banco inalterado)
- 16 testes Python + 2 frontend; cobertura 92%
- CI verde: https://github.com/pedvrezz/remedio-aberto/actions/runs/32517485791
- Commit: `e99045a` — `feat: ingest official ANVISA medicines dataset`

---

## Branch / Commit Atual

| Item | Valor |
|---|---|
| **Branch** | `main` |
| **HEAD** | `e99045a8b008d614d3f69fe68f5f5ccbb2a1e5f5` |
| **Mensagem** | `feat: ingest official ANVISA medicines dataset` |
| **Tree status** | Limpa (`git status` sem alterações) |
| **Arquivos ignorados confirmados** | `data/cache/...`, `data/remedio-aberto.sqlite` |

---

## Gates Conhecidos (Todos Verdes)

| Gate | Status | Última execução |
|---|---|---|
| `make check` | ✅ Passou | 2026-08-21 |
| Ruff (lint) | ✅ Passou | 2026-08-21 |
| MyPy strict | ✅ Passou | 2026-08-21 |
| Pytest (Python) | ✅ 16 passed | 2026-08-21 |
| Cobertura Python | ✅ 92% | 2026-08-21 |
| ESLint (web) | ✅ Passou | 2026-08-21 |
| TypeScript (web) | ✅ Passou | 2026-08-21 |
| Testes frontend | ✅ 2 passed | 2026-08-21 |
| Next.js build | ✅ Passou | 2026-08-21 |
| `npm audit --audit-level=high` | ✅ 0 vulns | 2026-08-21 |
| Secret scan | ✅ 0 hits | 2026-08-21 |
| `git diff --check` | ✅ Passou | 2026-08-21 |
| CI GitHub Actions | ✅ Success | Run 32517485791 |

---

## Próxima Tarefa Recomendada (Prioridade Máxima)

**Análise de qualidade e modelagem do dataset ANVISA já importado**

Escopo pequeno, coeso, seguro, baseado apenas em evidência dos dados reais:

1. **Padrões de identificadores**
   - `NUMERO_REGISTRO_PRODUTO`: preenchimento, formato, unicidade
   - `NUMERO_PROCESSO`: preenchimento, formato, relação com registro

2. **Datas**
   - `DATA_FINALIZACAO_PROCESSO`: padrão `DD/MM/AAAA` confirmado; validade
   - `DATA_VENCIMENTO_REGISTRO`: observado como `MMAAAA` (6 dígitos); sem dia; não inferir

3. **Cardinalidades e domínios**
   - `SITUACAO_REGISTRO`: valores distintos, frequência
   - `CATEGORIA_REGULATORIA`: valores distintos, frequência
   - `CLASSE_TERAPEUTICA`: valores distintos, nulos
   - `TIPO_PRODUTO`: valores distintos

4. **Duplicidades estruturais**
   - 3.445 ocorrências duplicadas em 647 grupos (max 177×)
   - Critério: decidir unidade documental (linha física vs. registro lógico único)

5. **Campos vazios** (já mapeados)
   - `PRINCIPIO_ATIVO`: 14.190 nulos — o que significa?

6. **Proposta de camada de leitura interna**
   - Baseada *apenas* no que os dados reais mostram
   - Sem enums prematuros, sem inferência regulatória
   - Hash técnico mantido; campos brutos preservados

**Por que esta tarefa:** É o passo lógico seguinte no roadmap (ROADMAP.md Fase 1 item 6→7), não requer decisão humana nova, usa apenas o banco já existente, e prepara groundwork para endpoints de leitura e busca real.

---

## Bloqueios e Decisões Pendentes

| Item | Status | Detalhes |
|---|---|---|
| Identidade regulatória de registros | **Pendente decisão** | `NUMERO_REGISTRO_PRODUTO` tem 10.767 nulos; não é chave universal. Hash técnico atual não afirma ser identificador oficial. Precisa análise de padrões antes de propor modelo. |
| Unidade documental | **Em análise** | Duplicatas estruturais existem. Decidir se app expõe cada linha física ou agregação lógica requer evidência dos dados. |
| Licença específica do recurso ANVISA | **Não confirmada** | Páginas institucionais descrevem "dados abertos" genericamente; nenhum termo específico vinculado ao CSV. Registrado em `docs/data-sources.md`. |
| Periodicidade diária atual | **Não confirmada** | PDA 2019–2021 declarou diária; PDA 2023–2025 não menciona explicitamente este conjunto. Registrado como ambíguo. |
| Segunda fonte (CMED) | **Aguardando** | Só iniciar após validação oficial completa, provenance independente e relacionamento explícito testado. |

---

## Decisões Arquiteturais Registradas

| ADR | Título | Status |
|---|---|---|
| 0001 | Local-first Lite (SQLite + loopback) | ✅ Aceito |
| — | Sem pandas para CSV pequeno | ✅ Aplicado |
| — | Hash SHA-256 determinístico como chave técnica de linha | ✅ Implementado |
| — | Campos de data preservados como `_raw` (texto) | ✅ Implementado |
| — | Cache idempotente por SHA-256 do artefato | ✅ Implementado |

---

## Métricas do Dataset Atual

| Métrica | Valor |
|---|---|
| Linhas brutas (CSV) | 43.436 |
| Registros únicos (pós-trim) | 39.991 |
| Duplicatas exatas adicionais | 3.445 |
| Grupos de duplicidade | 647 |
| Multiplicidade máxima | 177 |
| Colunas | 11 |
| Encoding | Latin-1 |
| Delimitador | `;` |
| SHA-256 do artefato | `45489d557d04c5d4e2e00647f65362be658988fc2838511f36ee9caddacf3b99` |
| Tamanho do artefato | 8.313.535 bytes |
| Banco SQLite | `data/remedio-aberto.sqlite` (ignorado) |

---

## Próximos Passos do Roadmap (Visão)

1. Análise de qualidade/modelagem ANVISA (tarefa atual)
2. Camada de leitura interna (`apps/api/remedio_aberto/medicines_read.py`)
3. Endpoints de leitura versionados (`/api/v1/medicines/...`)
4. Conexão busca home → dados reais
5. Página de medicamento (schema comprovado)
6. Tabelas/filtros frontend
7. Validação e ingestão CMED (nova fonte, provenance independente)
8. Histórico de preços, timeline, gráficos (com dados reais)
9. Área técnica, scheduler (justificados por uso real)

---

## Observações para Próxima Sessão

- Ler `AUTOPILOT.md` completo antes de iniciar
- Confirmar `git status` limpo
- Executar `make check` para confirmar baseline
- Iniciar análise com queries SQL diretas no banco existente
- Documentar descobertas em `docs/anvisa-quality-analysis.md`
- Propor modelo de leitura em ADR novo se houver mudança real

---

**Fim do estado. Próximo ciclo autônomo deve iniciar pela análise de qualidade ANVISA.**