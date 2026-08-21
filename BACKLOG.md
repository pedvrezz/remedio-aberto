# Backlog

Este backlog contém apenas trabalho real, ordenado e verificável. Cada item deve ser executado como unidade coesa; itens marcados `HUMAN` exigem decisão humana antes de implementação.

## P0 — sequência ativa da Fase 1

- [ ] `RA-001` [data-quality] Medir qualidade do snapshot ANVISA: padrões de registro/processo, datas, cardinalidades, nulidade e duplicidades. Entrega: relatório reproduzível, sem alterar schema ou interpretar significado regulatório.
- [ ] `RA-002` [architecture] Propor unidade documental e contrato de leitura com base no relatório de qualidade. `HUMAN` se a proposta mudar identidade, deduplicação persistida ou interpretação de campo oficial.
- [ ] `RA-003` [api] Implementar camada interna de leitura somente após contrato aceito, preservando provenance e valores brutos.
- [ ] `RA-004` [api] Expor endpoints versionados de busca e detalhe, com paginação, limites, erros PT-BR e testes offline.
- [ ] `RA-005` [frontend] Conectar busca da home aos endpoints reais, com estados vazio/erro/carregando e acessibilidade.
- [ ] `RA-006` [frontend] Criar página de medicamento apenas com campos comprovados e provenance visível.
- [ ] `RA-007` [frontend] Avaliar tabela e filtros sobre dados reais; implementar apenas filtros suportados por cardinalidade e índices medidos.

## P1 — robustez do fluxo atual

- [ ] `RA-008` [ingestion] Versionar explicitamente parser e schema na provenance do artefato.
- [ ] `RA-009` [database] Definir estratégia de migration/rollback antes da primeira alteração do schema persistido. `HUMAN` para aprovar alteração de modelo.
- [ ] `RA-010` [data-quality] Tornar a análise reproduzível por comando local determinístico usando apenas SQLite/stdlib.
- [ ] `RA-011` [testing] Adicionar caso de falha transacional durante persistência para comprovar rollback sem estado parcial.
- [ ] `RA-012` [security] Documentar e testar orçamento operacional dos endpoints locais (limite de consulta, paginação e tamanho de resposta).

## P2 — segunda fonte oficial

- [ ] `RA-013` [data-sources] Pesquisar e validar somente em fontes oficiais a CMED: URLs, provenance, formato, periodicidade, licença/condições e limitações.
- [ ] `RA-014` [architecture] Definir relacionamento ANVISA–CMED com critérios explícitos e taxa de casamento medida. `HUMAN` antes de persistir identidade ou relacionamento regulatório.
- [ ] `RA-015` [ingestion] Integrar CMED como provenance independente, idempotente e testada.

## P3 — somente quando dados reais justificarem

- [ ] `RA-016` [history] Avaliar snapshots e diff por campo; preços sempre em centavos/Decimal.
- [ ] `RA-017` [frontend] Avaliar timeline e gráficos somente após existência de histórico material.
- [ ] `RA-018` [operations] Avaliar scheduler local somente após frequência oficial atual ser confirmada e existir necessidade operacional.
- [ ] `RA-019` [developer-experience] Avaliar área técnica e CLI ampliada com base em fluxos reais.

## Concluído

- [x] `RA-000` [ingestion] Validar e ingerir `DADOS_ABERTOS_MEDICAMENTOS.csv` com checksum, cache, validação estrutural, persistência idempotente, testes e documentação. Commit `e99045a`; CI verde.
