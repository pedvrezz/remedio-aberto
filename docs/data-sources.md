# Fontes de dados

## ANVISA — Medicamentos Registrados no Brasil

**Verificação:** 2026-08-21 (UTC)
**Escopo desta etapa:** somente `DADOS_ABERTOS_MEDICAMENTOS.csv`.

### Evidências oficiais verificadas

| Item | Evidência observada | Situação |
|---|---|---|
| Órgão | Agência Nacional de Vigilância Sanitária (Anvisa) | Confirmado |
| Página institucional de dados abertos | https://www.gov.br/anvisa/pt-br/acessoainformacao/dadosabertos | Confirmado, HTTP 200 em 2026-08-21 |
| Catálogo federal | https://dados.gov.br/dataset/medicamentos-registrados-no-brasil | O índice de busca oficial identifica o conjunto; a página respondeu HTTP 401 a cliente não autenticado durante esta verificação |
| Nome do conjunto | `Medicamentos Registrados no Brasil` | Confirmado no índice oficial de `dados.gov.br` e no PDA da Anvisa |
| Recurso | https://dados.anvisa.gov.br/dados/DADOS_ABERTOS_MEDICAMENTOS.csv | Confirmado, HTTP 200 |
| Domínio do recurso | `dados.anvisa.gov.br` | Subdomínio oficial de `anvisa.gov.br`; certificado TLS cobre `*.anvisa.gov.br` |
| Formato real | CSV textual, delimitado por ponto e vírgula, com campos entre aspas quando necessário | Confirmado por inspeção do artefato |
| Encoding real | ISO-8859-1/Latin-1; a amostra real não é UTF-8 válida | Confirmado por decodificação estrita |
| Content-Type | `application/octet-stream` | Confirmado; o servidor não declara `text/csv` |
| Periodicidade | Diária | Declarada no PDA 2019–2021 da Anvisa para este conjunto. Não foi encontrada declaração equivalente específica no PDA 2023–2025; portanto, a vigência atual dessa periodicidade é **não confirmada** |
| Origem declarada | Base do sistema Datavisa; área responsável GGMED | Declarado no PDA 2019–2021 |
| Política aplicável | Decreto nº 8.777/2016 e Plano de Dados Abertos da Anvisa | Confirmado nas páginas/PDA oficiais |
| PDA atual encontrado | Plano de Dados Abertos da Anvisa 2023–2025: https://www.gov.br/anvisa/pt-br/acessoainformacao/dadosabertos/arquivos/PlanodeDadosAbertosAnvisa20232025.pdf/@@display-file/file | Confirmado, PDF oficial de 40 páginas acessível em 2026-08-21 |
| Licença específica do recurso | Nenhuma licença específica foi localizada na resposta do arquivo ou nas páginas oficiais acessíveis durante a verificação | **Não confirmado**; não se presume licença |

A página institucional descreve dados abertos como dados livremente utilizáveis, reutilizáveis e redistribuíveis, no máximo com exigência de atribuição e compartilhamento pela mesma licença. Essa descrição geral **não foi tratada como licença específica do recurso**.

### Comportamento HTTP e TLS observado

Coleta real em `2026-08-21T19:09:05.091958+00:00`:

- URL solicitada e final: `https://dados.anvisa.gov.br/dados/DADOS_ABERTOS_MEDICAMENTOS.csv`
- status: `200`
- redirecionamentos: nenhum
- tamanho anunciado e recebido: `8.313.535 bytes` (~7,93 MiB)
- `Content-Type`: `application/octet-stream`
- `ETag`: `"7edabf-6598c7585f24c"`
- `Last-Modified`: `Fri, 21 Aug 2026 10:54:22 GMT`
- SHA-256: `45489d557d04c5d4e2e00647f65362be658988fc2838511f36ee9caddacf3b99`
- `Accept-Ranges: bytes`
- limite local escolhido: `25 MiB` (`26.214.400 bytes`), mais de três vezes o tamanho observado e ainda suficientemente restritivo para detectar crescimento inesperado.

O servidor apresentou o certificado final válido para `*.anvisa.gov.br`, emitido por `Sectigo Public Server Authentication CA OV R36`, com validade observada de 2026-06-22 a 2027-01-06, mas não enviou a cadeia intermediária completa. Clientes usando somente o bundle local falharam com `unable to get local issuer certificate`. O projeto inclui apenas o certificado **público intermediário** da Sectigo, validado criptograficamente contra o bundle raiz do sistema, para completar a cadeia. A validação de hostname e certificado permanece habilitada; não há modo inseguro ou opção para desabilitar TLS no comando de coleta.

### Estrutura real observada

- 11 colunas;
- 43.436 linhas de dados, além do cabeçalho;
- 39.991 linhas estruturais únicas após apenas `trim` e conversão de vazio para `NULL`;
- 3.445 ocorrências duplicadas além da primeira, distribuídas em 647 grupos;
- maior multiplicidade idêntica observada: 177;
- datas de finalização observadas no padrão `DD/MM/AAAA`;
- vencimento observado como `MMAAAA` (por exemplo, seis dígitos), mas é persistido como texto bruto porque o arquivo não traz documentação de precisão/dia;
- não se deduz validade ou situação a partir das datas.

Cabeçalho, na ordem recebida:

1. `TIPO_PRODUTO`
2. `NOME_PRODUTO`
3. `DATA_FINALIZACAO_PROCESSO`
4. `CATEGORIA_REGULATORIA`
5. `NUMERO_REGISTRO_PRODUTO`
6. `DATA_VENCIMENTO_REGISTRO`
7. `NUMERO_PROCESSO`
8. `CLASSE_TERAPEUTICA`
9. `EMPRESA_DETENTORA_REGISTRO`
10. `SITUACAO_REGISTRO`
11. `PRINCIPIO_ATIVO`

Campos vazios encontrados na coleta:

| Campo | Vazios |
|---|---:|
| `TIPO_PRODUTO` | 0 |
| `NOME_PRODUTO` | 0 |
| `DATA_FINALIZACAO_PROCESSO` | 91 |
| `CATEGORIA_REGULATORIA` | 1.824 |
| `NUMERO_REGISTRO_PRODUTO` | 10.767 |
| `DATA_VENCIMENTO_REGISTRO` | 6.101 |
| `NUMERO_PROCESSO` | 10.676 |
| `CLASSE_TERAPEUTICA` | 11.463 |
| `EMPRESA_DETENTORA_REGISTRO` | 0 |
| `SITUACAO_REGISTRO` | 0 |
| `PRINCIPIO_ATIVO` | 14.190 |

Não há identificador natural preenchido em todas as linhas. O pipeline usa hash SHA-256 determinístico dos 11 campos normalizados como **chave técnica de linha**, sem afirmar que ele seja registro ou identificador regulatório. Valores sem conteúdo viram `NULL`; os demais recebem somente remoção de espaço periférico. Nomes, princípios ativos, empresas, categorias e situação não são semanticamente alterados.

### Fixture de teste

`apps/api/tests/fixtures/anvisa_medicamentos_sample.csv` contém o cabeçalho e três linhas do recurso público, preservadas em Latin-1. Ela existe apenas para testar estrutura, encoding, vazios e parser; não é base para resultados da aplicação nem dado demonstrativo exibido ao usuário.

### Controles de coleta

O comando `make data-fetch`:

- usa apenas HTTPS e aceita somente `dados.anvisa.gov.br` como origem e destino de redirect;
- limita redirects a 3;
- usa timeout de 30 segundos;
- envia User-Agent identificável, sem cookies ou autenticação;
- limita o artefato a 25 MiB antes e durante streaming;
- calcula SHA-256 durante o download;
- grava primeiro em arquivo temporário e faz promoção atômica;
- não executa o conteúdo;
- valida cabeçalho, delimitador, encoding e número de colunas antes de abrir transação;
- não duplica artefato ou registros quando o SHA-256 já existe.

Arquivos completos e banco permanecem sob `data/`, ignorado pelo Git.
