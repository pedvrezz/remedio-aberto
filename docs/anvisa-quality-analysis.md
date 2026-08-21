# Análise de qualidade — snapshot ANVISA de medicamentos

Esta análise descreve o snapshot coletado em 2026-08-21. Ela não define identidade regulatória, não corrige valores oficiais e não altera o schema persistido.

## Reprodução

```bash
make data-analyze
```

O comando lê `data/remedio-aberto.sqlite` e o artefato referenciado em `source_artifacts`, recalcula as métricas e grava o relatório completo em `data/reports/anvisa-quality.json`. O relatório local contém apenas agregados e fica ignorado pelo Git junto com `data/`.

Artefato analisado:

- SHA-256: `45489d557d04c5d4e2e00647f65362be658988fc2838511f36ee9caddacf3b99`
- coleta: `2026-08-21T19:09:05.091958+00:00`
- linhas físicas: 43.436
- linhas estruturais únicas após normalização conservadora: 39.991

Todas as contagens abaixo usam as 39.991 linhas estruturais únicas, exceto a seção de duplicidades físicas.

## Identificadores observados

### `NUMERO_REGISTRO_PRODUTO`

- preenchidos: 32.666
- ausentes: 7.325
- distintos entre preenchidos: 32.666
- todos os preenchidos contêm somente dígitos
- comprimento 9: 32.642
- outros comprimentos: 24 valores distribuídos entre 1, 2, 3, 5, 6, 7, 8 e 10 caracteres

O campo é único quando presente neste snapshot, mas a ausência em 7.325 registros impede tratá-lo como chave universal. Comprimentos discrepantes são preservados; não foram completados com zeros nem classificados como erro regulatório.

### `NUMERO_PROCESSO`

- preenchidos: 32.757
- ausentes: 7.234
- distintos entre preenchidos: 32.757
- todos os preenchidos contêm somente dígitos
- comprimentos: 12 (2), 13 (4.289), 14 (3), 15 (9.101), 17 (19.362)

Coocorrência:

- registro e processo presentes: 32.666
- somente registro: 0
- somente processo: 91
- ambos ausentes: 7.234

A unicidade observada é propriedade deste snapshot, não garantia normativa ou histórica. Nenhum dos campos deve ser convertido para inteiro, pois zeros à esquerda podem ser significativos e o dataset os fornece como identificadores textuais.

## Datas observadas

### `DATA_FINALIZACAO_PROCESSO`

- preenchidas: 39.900
- ausentes: 91
- 39.900 têm comprimento 10 e são datas de calendário válidas em `DD/MM/AAAA`
- valores distintos: 5.337

A consistência sintática permite uma futura representação de leitura como data, mantendo o valor bruto para provenance. Isso não atribui significado adicional à data.

### `DATA_VENCIMENTO_REGISTRO`

- preenchidas: 36.118
- ausentes: 3.873
- 36.100 seguem `MMAAAA` com mês entre 01 e 12
- 8 seguem `MM/AAAA`
- 10 não seguem nenhum desses dois formatos: `03200`, `05200`, `06200`, `08200`, `09200` (2 ocorrências), `1001`, `10200` e `12200`

Não existe dia no formato predominante. Portanto, o campo deve continuar bruto; não se deve inventar primeiro/último dia do mês, corrigir ano incompleto ou calcular automaticamente situação de validade.

## Domínios e cardinalidades

### `TIPO_PRODUTO`

- 1 valor: `MEDICAMENTO` (39.991)

### `SITUACAO_REGISTRO`

- `Inativo`: 25.551
- `Ativo`: 14.440

Esses rótulos podem ser expostos literalmente em leitura, mas não autorizam calcular eficácia, segurança, disponibilidade comercial ou validade atual.

### `CATEGORIA_REGULATORIA`

- 13 valores preenchidos distintos; 1.824 ausentes
- maiores grupos: `Similar` (15.385), `Genérico` (8.155), `BAIXO RISCO` (6.504), `Novo` (3.229)
- existem variações de caixa (`DINAMIZADO`/`Dinamizado`) e valores aparentemente truncados ou com problema de representação (`Gases Medici`, `Produto de T`, `FITOTER?PICO`)

Esses valores não devem virar enum nem ser fundidos automaticamente. A análise não consegue provar se as diferenças são categorias distintas, truncamento na origem ou problema de codificação anterior à publicação.

### `CLASSE_TERAPEUTICA`

- 500 valores preenchidos distintos
- 8.021 ausentes

A cardinalidade e a terminologia oficial desaconselham enum prematuro. O campo deve permanecer texto literal.

## Nulidade nas linhas estruturais únicas

| Campo | Ausentes |
|---|---:|
| `TIPO_PRODUTO` | 0 |
| `NOME_PRODUTO` | 0 |
| `DATA_FINALIZACAO_PROCESSO` | 91 |
| `CATEGORIA_REGULATORIA` | 1.824 |
| `NUMERO_REGISTRO_PRODUTO` | 7.325 |
| `DATA_VENCIMENTO_REGISTRO` | 3.873 |
| `NUMERO_PROCESSO` | 7.234 |
| `CLASSE_TERAPEUTICA` | 8.021 |
| `EMPRESA_DETENTORA_REGISTRO` | 0 |
| `SITUACAO_REGISTRO` | 0 |
| `PRINCIPIO_ATIVO` | 10.748 |

Os números diferem das contagens sobre as 43.436 linhas físicas porque as duplicatas exatas foram colapsadas na persistência. Ausência é representada como `NULL`; nenhum significado regulatório é atribuído à ausência.

## Duplicidades físicas

- grupos com repetição exata: 647
- ocorrências adicionais além da primeira: 3.445
- maior multiplicidade: 177

A repetição exata comprova apenas igualdade dos 11 campos publicados depois do trim conservador. Ela não comprova que múltiplas apresentações, registros ou eventos regulatórios sejam equivalentes. A tabela atual preserva uma ocorrência estrutural por artefato e o relatório mantém a contagem física.

## Conclusão de modelagem

Evidências suficientes para uma camada interna de leitura:

- usar `row_hash` + `artifact_sha256` somente como identidade técnica;
- devolver identificadores oficiais como texto opcional;
- preservar os dois campos de data em formato bruto;
- devolver categorias e classes literalmente, sem enum/normalização semântica;
- incluir provenance do artefato em toda leitura;
- tornar ausências explícitas.

Decisão ainda não suportada pelos dados:

- escolher `NUMERO_REGISTRO_PRODUTO` como identidade universal;
- fundir linhas por nome, princípio ativo, empresa ou processo;
- corrigir datas e categorias discrepantes;
- derivar validade, disponibilidade ou qualquer conclusão clínica/regulatória;
- afirmar que linha estrutural única corresponde a uma apresentação comercial.

Assim, a próxima unidade segura é especificar uma camada de leitura que exponha cada linha estrutural importada como **registro documental do snapshot**, sem afirmar que ela seja a identidade regulatória canônica do medicamento.
