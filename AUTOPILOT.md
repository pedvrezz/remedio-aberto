# Política de Evolução Autônoma Controlada — Remédio Aberto

> **Versão:** 1.0.0
> **Status:** Ativo
> **Aplicável a:** `/home/hermes/remedio-aberto`
> **Última atualização:** 2026-08-21

---

## 1. Objetivo e Escopo

Esta política define o ciclo autônomo para evolução do projeto Remédio Aberto sem necessidade de instrução humana a cada tarefa rotineira. O objetivo é maximizar trabalho **útil e seguro** — não quantidade de commits.

O agente deve operar exclusivamente dentro do repositório `/home/hermes/remedio-aberto`, usando apenas ferramentas e permissões já disponíveis no ambiente. Não há autorização para:
- `sudo` ou alteração de sistema operacional
- Configuração global, DNS, domínios, cloud, túneis públicos
- Acesso a outros repositórios, secrets externos
- Criação/alteração de serviços pagos de terceiros
- Execução de scripts remotos arbitrários
- Contorno de autenticação/CAPTCHA/limites de fontes
- Coleta de dados pessoais ou sensíveis de saúde
- Desabilitação de TLS, redução de controles de segurança
- Force push, reescrita de histórico, exclusão de repositório/dados
- Deploy público automático (site, VPS, Cloudflare, domínio)

---

## 2. Ciclo Autônomo

O agente deve executar repetidamente as seguintes etapas enquanto houver trabalho seguro e claramente definido:

### 2.1 Verificação de Contexto
1. Confirmar execução exclusiva em `/home/hermes/remedio-aberto`
2. Executar `git status` — árvore limpa ou compreensão integral de alterações existentes
3. Ler obrigatoriamente: `AUTOPILOT.md`, `STATE.md`, `ROADMAP.md`, `BACKLOG.md`, `ARCHITECTURE.md`, `SECURITY.md`, `AGENTS.md` e documentação relevante

### 2.2 Seleção de Tarefa
4. Escolher a próxima tarefa **NÃO CONCLUÍDA** de maior prioridade que seja:
   - Pequena e coesa (uma unidade verificável)
   - Segura (sem decisão humana pendente)
   - Útil (entrega valor real ao roadmap)
   - Independente de aprovação não tomada
5. Registrar a tarefa escolhida em `STATE.md` (campo `current_task`)

### 2.3 Execução
6. Criar branch curta e descritiva quando apropriado (`feat/...`, `fix/...`, `refactor/...`)
7. Implementar **somente** essa unidade de trabalho — não expandir escopo
8. Executar **todos** os gates relevantes:
   - `make check` (lint, typecheck, test, build)
   - `npm audit --audit-level=high`
   - Secret scan (repositório)
   - Verificação de arquivos ignorados (`git check-ignore -v data/...`)
   - Cobertura de testes ≥ 85% (Python) / testes frontend passados

### 2.4 Validação e Correção
9. Corrigir **todas** as regressões encontradas antes de continuar
10. Atualizar documentação, ADRs, schema, CHANGELOG, ROADMAP, BACKLOG, STATE.md **apenas quando houver mudança real**

### 2.5 Commit e Integração
11. Commit atômico usando **Conventional Commits** (`feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `chore:`) somente quando:
    - Unidade concluída e funcional
    - Gates verdes
    - Sem churn artificial (whitespace, timestamps, version bumps sem motivo)
12. Push normal (`git push`), **nunca force push**
13. Verificar CI remota (GitHub Actions)
14. Se CI falhar: diagnosticar e corrigir em nova alteração legítima — **nunca mascarar ou desabilitar testes**
15. Integrar em `main` somente quando fluxo permitir de forma segura e checks obrigatórios estiverem verdes

### 2.6 Atualização de Estado
16. Atualizar `STATE.md` com:
    - SHA do commit
    - Resultado da CI
    - O que foi concluído
    - Próxima tarefa segura recomendada
17. Registrar ciclo em `docs/autopilot-log/` (resumo conciso: tarefa, decisões, testes, commit, CI)
18. Repetir ciclo desde 2.1

---

## 3. Critérios de Seleção de Tarefas

| Critério | Requisito |
|---|---|
| **Tamanho** | ≤ 400 linhas de mudança no total (código + testes + docs) |
| **Cohesão** | Um único objetivo verificável |
| **Segurança** | Nenhuma decisão humana pendente; sem alteração de modelo de dados, identidade regulatória, política de segurança, licença, arquitetura fundamental, autenticação, infraestrutura externa |
| **Utilidade** | Avança roadmap real; não trabalho para gerar commit |
| **Testabilidade** | Adiciona/atualiza testes; cobertura não diminui |
| **Reversibilidade** | Pode ser revertido sem perda de dados |

### Prioridade implícita (baseada no ROADMAP atual)
1. Análise de qualidade/modelagem do dataset ANVISA importado
2. Camada de leitura interna baseada em evidência
3. Endpoints de leitura versionados e testados
4. Conexão da busca da home aos dados reais
5. Página de medicamento baseada no schema comprovado
6. Tabelas/filtros
7. Integração CMED (segunda fonte) — **somente após validação oficial**
8. Histórico de preços, gráficos, timeline, área técnica, scheduler — **somente com dados reais**

---

## 4. Critérios de Conclusão de Tarefa

Uma tarefa é considerada **concluída** quando:

- [ ] Implementação funcional e testada
- [ ] `make check` passa integralmente
- [ ] `npm audit --audit-level=high` → 0 vulnerabilidades
- [ ] Secret scan → 0 ocorrências potenciais
- [ ] Arquivos de cache/banco continuam ignorados pelo Git
- [ ] Documentação atualizada se houver mudança real
- [ ] Commit atômico com Conventional Commits
- [ ] Push normal realizado
- [ ] CI remota verde
- [ ] `STATE.md` atualizado
- [ ] Log em `docs/autopilot-log/` criado

---

## 5. Critérios de Parada (PARE IMEDIATAMENTE)

O ciclo autônomo deve **parar** e registrar em `STATE.md` (campo `blocked_reason`) se qualquer uma das condições abaixo ocorrer:

| Condição | Ação |
|---|---|
| Tarefa altera modelo de dados, identidade regulatória, interpretação de campos oficiais | Parar — decisão humana necessária |
| Tarefa altera política de segurança, licença, arquitetura fundamental, autenticação, infraestrutura externa | Parar — decisão humana necessária |
| Descoberta de credencial necessária não disponível | Parar — registrar credencial faltante |
| Ação destrutiva identificada (ex: `rm -rf`, `DROP TABLE`, force push) | Parar — registrar risco |
| Conflito Git não compreendido | Parar — registrar detalhes |
| Possível exposição de segredo (secret scan positivo) | Parar — investigar e registrar |
| Alteração legal/licença ambígua de fonte oficial | Parar — registrar ambiguidade |
| Fonte oficial cujo uso não pode ser razoavelmente validado | Parar — registrar limitação |
| Vulnerabilidade crítica sem correção segura conhecida | Parar — registrar CVE/mitigação |
| Falhas repetidas (≥ 3) que indicam incerteza arquitetural | Parar — registrar padrão de falha |
| Qualquer situação onde continuar exija adivinhação | Parar — registrar incerteza |

**Não** continue "tentando" quando houver incerteza. Pare e aguarde direção.

---

## 6. Limites de Segurança

| Domínio | Limite |
|---|---|
| **Rede** | Apenas fontes oficiais/públicas já documentadas; timeouts obrigatórios; User-Agent identificável; sem cookies/auth; validação de host após redirects |
| **Arquivos de fonte** | Tratados como não confiáveis até validação estrutural completa; limites de tamanho; checksum SHA-256 obrigatório |
| **API local** | Entrada não confiável; validação Pydantic; limites de taxa; bind 127.0.0.1 |
| **Banco local** | Integridade verificável; usuário controla host; migrações versionadas |
| **Dependências** | Nova dependência só se necessidade técnica real; verificar origem, versão, manutenção, vulnerabilidades; preferir stdlib/código simples |
| **Dados** | Zero PII, prontuários, prescrições; provenance obrigatória; distinção explícita de campo ausente vs vazio |
| **Git** | Branch protections respeitadas; main protegida; force push proibido; histórico preservado |

---

## 7. Política Git

- **Branches**: curtas, descritivas (`feat/anvisa-quality-analysis`, `fix/api-validation`, `docs/update-roadmap`)
- **Commits**: atômicos, Conventional Commits, mensagem imperativa clara
- **Push**: normal, com upstream tracking
- **Merge**: fast-forward em main quando possível; PR apenas se revisão humana necessária
- **Tags**: somente para releases significativos (decisão humana)
- **Ignorados**: `data/`, `.venv/`, `.next/`, `node_modules/`, `*.db`, `*.sqlite`, `*.log`, fixtures pequenas de teste permitidas versionadas

---

## 8. Política de Fontes Externas

| Requisito | Detalhe |
|---|---|
| **Oficialidade** | Apenas domínios `.gov.br`, `.anvisa.gov.br`, portais oficiais identificados |
| **Verificação** | HTTPS válido; certificado verificado; cabeçalhos HTTP documentados; provenance registrada |
| **Formato** | Documentado (CSV, JSON, PDF); encoding, delimitador, schema real inspecionados |
| **Condições de uso** | Licença/termos documentados; se ambíguo → registrar como "não confirmado" |
| **Limitações** | Periodicidade, escopo temporal/geopolítico, campos vazios, duplicidades — todos documentados |
| **Cache** | Idempotente por SHA-256; artefatos completos em `data/` (ignorado); fixtures pequenas versionadas |
| **Proibido** | Scraping agressivo, bypass de CAPTCHA/robots.txt, contorno de limites, inferência clínica/regulatória não suportada |

---

## 9. Política de Dependências

| Critério | Ação |
|---|---|
| **Necessidade real** | Adicionar somente se stdlib ou código simples não resolvem adequadamente |
| **Origem** | Verificar repositório oficial, mantenedores, licença compatível |
| **Versão** | Fixar versão exata (`==X.Y.Z`); não usar `latest`, `*`, `^` |
| **Auditoria** | `npm audit`, `pip-audit`/`safety` antes de commit; 0 vulnerabilidades high/critical |
| **Escopo** | Instalar apenas no workspace correto (`apps/api` ou `apps/web`) |
| **Remoção** | Remover dependências não usadas periodicamente |
| **Proibido** | Adicionar dependência "para facilitar" sem justificativa técnica; pandas para CSV pequeno se `csv` stdlib suficiente |

---

## 10. Recuperação de Estado Após Interrupção

Ao retomar execução (nova sessão do Hermes):

1. Executar `git status` em `/home/hermes/remedio-aberto`
2. Ler `STATE.md` — contém último commit, tarefa, bloqueios, próxima recomendação
3. Ler `AUTOPILOT.md` — relembrar política completa
4. Verificar se há branch não integrada (`git branch -a`)
5. Se CI anterior falhou: diagnosticar antes de continuar
6. Continuar ciclo desde etapa 2.1

**Nenhum** mecanismo de autostart, daemon, loop recursivo ou processo infinito deve ser criado. A recuperação é manual (nova invocação do agente) e baseada nos arquivos de estado.

---

## 11. Registro de Ciclos (Autopilot Log)

Diretório: `docs/autopilot-log/`

Formato por arquivo: `YYYY-MM-DD-HHMMSS-<slug>.md`

Conteúdo mínimo por ciclo:
```markdown
# Ciclo <N> — <data UTC>

## Tarefa
<Descrição curta>

## Decisões Principais
- <Decisão 1>
- <Decisão 2>

## Testes Adicionados/Modificados
- <Arquivo>: <cobertura/resultado>

## Commit
- SHA: <short>
- Mensagem: <conv. commit>

## CI
- Run: <URL>
- Status: success/failure
- Duração: <tempo>
```

Não criar logs gigantes. Um arquivo por ciclo ou conjunto coeso de ciclos.

---

## 12. Deploy (Interpretação Atual)

Como o projeto é **local-first**, "deploy" significa atualmente:
- Atualização segura do repositório GitHub (push + CI verde)
- Criação de releases GitHub quando houver versão significativa
- Manutenção do código executável localmente (`make dev`)

**Não** inclui: publicação de site público, VPS, Cloudflare, domínio, ou outro serviço externo — estes exigem autorização humana explícita.

---

## 13. Execução Contínua (Kanban e Gateway)

A execução persistente autorizada usa exclusivamente os mecanismos oficiais locais:

- board isolado `remedio-aberto`, vinculado ao projeto/worktree correspondente;
- Gateway como serviço de usuário, sem sudo;
- dispatcher incorporado ao Gateway (`dispatch_in_gateway: true`), nunca em paralelo com o daemon Kanban depreciado;
- root `t_0720d5ed`, idempotency key `remedio-aberto-autonomous-root-v1`, criado em `triage` e convertido oficialmente em orquestração `todo` após decomposição;
- concorrência global e por profile igual a 1, `max_spawn: 1`, circuit breaker 2 e intervalo de 60 segundos;
- auto-decompose limitado a uma raiz por tick e janela conservadora de trabalho;
- worktrees independentes para implementação.

O root é um objetivo permanente: depois de cada grafo, deve reavaliar as fontes de verdade e reabastecer o pipeline apenas com trabalho real. Não deve concluir por um lote isolado nem fabricar trabalho para a meta de 500 commits. Hard stops bloqueiam somente o card dependente. Se apenas trabalho artificial restar, o root deve ser bloqueado com explicação objetiva.

`hermes cron` não executa ciclos completos de desenvolvimento. Só poderá ser considerado futuramente para verificações curtas e naturalmente periódicas explicitamente previstas no roadmap.

Referência oficial: <https://hermes-agent.nousresearch.com/docs/user-guide/features/kanban>.

---

## 14. Relatório Final de Parada

Quando o processo precisar parar definitivamente, entregar relatório consolidado contendo:

- Ciclos realizados (resumo por ciclo)
- Funcionalidades entregues
- Decisões tomadas (com referências a ADRs/logs)
- Arquivos principais alterados
- Novos testes e cobertura final
- Auditorias (npm, pip, secret scan)
- Commits e SHAs
- CI de cada etapa relevante
- Estado atual de `main`
- Próxima tarefa segura recomendada
- Motivo exato da parada (se bloqueio humano)

---

## 15. Princípios Norteadores

> **"Qualidade, segurança, documentação e integridade dos dados acima de velocidade."**

- Não transforme dado ambíguo em fato
- Não faça inferência clínica ou regulatória não suportada
- Não crie arquitetura ou SDK vazio para atender roadmap
- Maximize trabalho útil, não commits
- Documente o suficiente para que outro entenda *por que* cada decisão foi tomada

---

**Fim da política. O agente deve obedecer estritamente a este documento.**