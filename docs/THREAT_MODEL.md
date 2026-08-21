# Threat model

## Ativos
Código, configuração local, banco SQLite, cache futuro de arquivos oficiais e provenance.

## Ameaças prioritárias

| Ameaça | Mitigação atual ou exigida |
|---|---|
| Exposição acidental | bind em loopback por padrão |
| Secret no Git | `.gitignore`, scan antes de commit |
| Dependência vulnerável | lockfile, `npm audit`, atualização revisada |
| Arquivo malicioso/corrompido | futuro limite de tamanho, checksum e validação antes do parse |
| Source spoofing/MITM | HTTPS oficial, allowlist de hosts e provenance |
| SQL injection | SQLAlchemy parametrizado e validação de entrada |
| DoS local | limites de consulta e parsing em streaming na Fase 1 |
| Conselho médico indevido | linguagem regulatória e disclaimer explícito |

Não há autenticação, upload, telemetria ou exposição web na Fase 0.
