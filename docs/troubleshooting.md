# Troubleshooting

- Dependências ausentes: `make setup`.
- Porta ocupada: verifique processos em 3000/8000; não altere bind para `0.0.0.0` como atalho.
- Readiness 503: remova somente um banco de desenvolvimento descartável após preservar dados relevantes e reinicie.
- Node/Python incompatível: confira versões no README.
- Docker: não é requisito nem está implementado na Fase 0.
