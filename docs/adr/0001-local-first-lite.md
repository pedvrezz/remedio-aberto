# ADR 0001: Lite local-first como padrão

Status: aceito.

A Fase 0 usa Next.js, FastAPI e SQLite, todos em loopback. PostgreSQL, Redis, workers, scheduler e Docker são adiados até haver requisito funcional real. Isso reduz superfície de ataque e torna o primeiro uso reproduzível sem infraestrutura externa.
