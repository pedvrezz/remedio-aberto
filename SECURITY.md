# Segurança

## Reporte

Use um GitHub Security Advisory privado no repositório quando o remoto existir. Não publique vulnerabilidades exploráveis em issues. Nenhum email ou domínio dedicado é afirmado nesta fase.

## Controles atuais

- bind em 127.0.0.1 para web e API;
- SQLite local e `.env` ignorado;
- validação Pydantic de configuração;
- CORS restrito às URLs locais;
- headers defensivos no Next.js;
- auditoria de dependências no CI;
- zero coleta de dados pessoais e zero telemetria.

## Escopo

API, web, scripts locais, dependências e futura ingestão. A segurança dos portais governamentais e do host do usuário está fora do controle do projeto.
