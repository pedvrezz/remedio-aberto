# Contrato interno de leitura do snapshot ANVISA

Status: aceito para implementação interna a partir de `RA-003`.

Este contrato descreve como a camada interna pode ler os registros já persistidos do snapshot ANVISA. Ele não é um contrato de API pública, não define uma entidade canônica de medicamento e não altera schema, ingestão ou deduplicação.

## Unidade de leitura

Cada resultado representa um **registro documental do snapshot**: uma linha estrutural única, conforme persistida para um artefato coletado. Essa unidade descreve somente o conteúdo publicado e observado naquele snapshot.

A identidade técnica do resultado é o par:

- `artifact_sha256`: checksum SHA-256 do artefato de origem;
- `row_hash`: hash da linha após a normalização estrutural conservadora já implementada.

O par serve exclusivamente para localizar e distinguir tecnicamente o registro documental dentro do snapshot. Ele não é número de registro, identidade regulatória, identidade histórica, apresentação comercial nem evidência de equivalência entre medicamentos.

## Campos documentais

A leitura deve devolver os onze campos publicados já persistidos, sem normalização semântica adicional:

- `tipo_produto`;
- `nome_produto`;
- `data_finalizacao_processo`;
- `categoria_regulatoria`;
- `numero_registro_produto`;
- `data_vencimento_registro`;
- `numero_processo`;
- `classe_terapeutica`;
- `empresa_detentora_registro`;
- `situacao_registro`;
- `principio_ativo`.

Regras obrigatórias:

1. Identificadores, inclusive `numero_registro_produto` e `numero_processo`, permanecem textos opcionais. Não converter para inteiro, completar zeros ou validar por comprimento presumido.
2. Datas, inclusive `data_finalizacao_processo` e `data_vencimento_registro`, permanecem textos opcionais e brutos. Não corrigir formatos, inventar dia, calcular vencimento ou derivar situação atual.
3. Domínios publicados, inclusive situação, categoria, classe e tipo, são devolvidos literalmente. Não criar enum, alterar caixa, corrigir codificação, expandir truncamentos ou fundir rótulos.
4. Campo ausente é `NULL` explícito. Não substituir por string vazia, marcador, valor padrão ou inferência obtida de outro campo.
5. Valor presente, ainda que vazio ou anômalo na origem, não deve ser confundido com ausência por uma transformação da camada de leitura.

## Provenance obrigatória

Cada resultado deve carregar a provenance do artefato ao qual pertence, no mínimo com os valores já persistidos:

- URL da fonte;
- órgão de origem;
- instante de coleta em UTC;
- `artifact_sha256`;
- cabeçalhos HTTP registrados, quando presentes.

A camada não deve inventar versão de parser ou schema onde esses dados ainda não estejam persistidos. A ampliação da provenance persistida pertence a `RA-008` e exige mudança própria e testada.

## Ordenação e seleção

Uma implementação pode oferecer seleção e ordenação determinísticas para uso interno, mas deve usar somente campos persistidos e critérios explicitamente documentados. Ordem de retorno, posição física ou primeiro resultado não conferem prioridade, atualidade ou autoridade regulatória.

Não é permitido fundir resultados por nome, princípio ativo, empresa, processo, registro ou qualquer combinação desses campos. A deduplicação estrutural atual permanece inalterada: repetições físicas exatas já colapsadas não são recriadas nem reinterpretadas pela leitura.

## Ausência de interpretações derivadas

Este contrato não autoriza:

- eleger qualquer campo ou hash como identidade regulatória canônica;
- afirmar que o registro documental corresponde a uma apresentação comercial;
- inferir eficácia, segurança, disponibilidade, validade atual ou equivalência;
- reconciliar registros entre snapshots ou fontes;
- corrigir ou enriquecer valores oficiais;
- expor endpoints públicos.

Qualquer necessidade de alterar identidade, deduplicação persistida, schema ou significado de campo oficial interrompe a implementação e exige decisão humana registrada.

## Critérios de aceitação para `RA-003`

A futura camada interna deve ser testada para comprovar que:

- a identidade retornada contém exatamente `artifact_sha256` e `row_hash` com significado apenas técnico;
- identificadores e datas continuam textos opcionais e brutos;
- domínios são preservados literalmente;
- ausências continuam `NULL` e não se confundem com valores presentes;
- provenance acompanha cada registro;
- nenhuma consulta funde linhas ou altera a deduplicação persistida;
- não há alteração de schema nem exposição pública.

A implementação deve permanecer interna até que um contrato de API separado, versionado e testado seja aprovado em `RA-004`.
