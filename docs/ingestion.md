# Ingestão planejada

Não implementada na Fase 0. Contrato futuro:

`fetch → checksum → validate → normalize → deduplicate → diff → persist → analyze → publish`

Requisitos: timeout explícito, rate limit, retry com backoff exponencial e jitter, lock por fonte, cache local, SHA-256 do original, schema e parser versionados, transação idempotente e reprodutibilidade. Fonte inalterada não dispara persistência material nem commit.
