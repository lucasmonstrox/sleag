# Supabase — TIKSPY

Projeto: **`leydusfhqhuharfecofu`** (`https://leydusfhqhuharfecofu.supabase.co`).

## Migrations

As migrations em [`migrations/`](./migrations/) são a fonte de verdade do schema. As
primeiras (`0000`–`0004`) cobrem o domínio de **alertas/regras** (multi-tenancy + RLS,
regras, eventos, watchlist, canais de notificação, consentimento LGPD, entregas, webhook).

> Estas foram aplicadas direto no banco remoto via MCP `apply_migration` durante o
> desenvolvimento; os arquivos `.sql` aqui têm o mesmo conteúdo e o mesmo prefixo de versão
> que a tabela de controle (`supabase_migrations.schema_migrations`), então um
> `supabase db push` as reconhece como já aplicadas.

### Fluxo daqui pra frente

```bash
# 1ª vez — linkar o CLI ao projeto remoto
supabase link --project-ref leydusfhqhuharfecofu

# criar nova migration
supabase migration new minha_mudanca      # gera migrations/<timestamp>_minha_mudanca.sql

# aplicar no remoto
supabase db push

# regenerar os tipos TS consumidos pelo front
supabase gen types typescript --project-id leydusfhqhuharfecofu \
  > ../apps/web/lib/supabase/database.types.ts
```

## Convenções do schema

- **Isolamento por `tenant_id`** (não `user_id`), coluna **líder** dos índices compostos.
  RLS em toda tabela tenant-scoped via `public.current_tenant_ids()` (`SECURITY DEFINER`).
- Plano de **mercado** (produtos/snapshots/scores — `docs/ingestao.md`) é **global, sem RLS**;
  o plano de **alertas** é tenant-scoped. O motor faz o join entre os dois.
- `webhook_events` tem RLS ligado **sem policy** de propósito: só o service-role acessa.
- `channel_consent_log` é **append-only** (policies só de SELECT/INSERT) — trilha LGPD imutável.
