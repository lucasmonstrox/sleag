-- Camada de entrega: canais + consentimento (LGPD) + tentativas de envio + log de webhook.

-- ── Canais de notificação (1 por tenant×canal) ───────────────────────────────
create table public.notification_channels (
  id                 uuid primary key default gen_random_uuid(),
  tenant_id          uuid not null references public.tenants(id) on delete cascade,
  channel            text not null check (channel in ('email','telegram','whatsapp','push')),
  enabled            boolean not null default false,
  address            jsonb not null default '{}'::jsonb,   -- {email} | {chat_id} | {endpoint,keys} | {phone}
  status             text not null default 'pending'
                       check (status in ('pending','confirmed','opted_out','bounced')),
  consent_text       text,                                 -- cópia exata mostrada no opt-in
  consent_at         timestamptz,
  confirmed_at       timestamptz,
  opted_out_at       timestamptz,
  confirmation_token text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  unique (tenant_id, channel)
);

create trigger notification_channels_set_updated_at
  before update on public.notification_channels
  for each row execute function public.set_updated_at();

-- ── Trilha de consentimento (append-only, exigência LGPD) ────────────────────
create table public.channel_consent_log (
  id             uuid primary key default gen_random_uuid(),
  tenant_id      uuid not null references public.tenants(id) on delete cascade,
  user_id        uuid references auth.users(id) on delete set null,
  channel        text not null,
  action         text not null check (action in
                   ('requested','granted','confirmed','revoked','opted_out','resent')),
  consent_text   text not null,                            -- cópia exata no momento da ação
  policy_version text not null default 'v1',
  ip_address     inet,
  user_agent     text,
  created_at     timestamptz not null default now()
);
create index channel_consent_log_idx on public.channel_consent_log(tenant_id, channel, created_at desc);

-- ── Tentativas de entrega (1 por evento×canal) ───────────────────────────────
create table public.notification_deliveries (
  id                  uuid primary key default gen_random_uuid(),
  tenant_id           uuid not null references public.tenants(id) on delete cascade,
  event_id            uuid not null references public.alert_events(id) on delete cascade,
  channel             text not null check (channel in ('email','telegram','whatsapp','push')),
  status              text not null default 'queued'
                        check (status in ('queued','sent','delivered','read','failed','skipped')),
  skip_reason         text,                                -- 'quiet_hours'|'consent_revoked'|'plan_gate'|'rate_limited'
  provider            text,                                -- 'evolution'|'whatsapp_cloud'|'resend'|'telegram'|'webpush'
  provider_message_id text,                                -- wamid (correlação com webhook)
  attempts            int  not null default 0,
  last_error          text,
  scheduled_for       timestamptz,                         -- quiet-hours adia (não descarta)
  sent_at             timestamptz,
  delivered_at        timestamptz,
  read_at             timestamptz,
  failed_at           timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);
-- idempotência de envio: 1 entrega por evento×canal (sobrevive retry do Trigger.dev)
create unique index nd_idempotency on public.notification_deliveries(event_id, channel);
create index nd_status_idx on public.notification_deliveries(status, scheduled_for)
  where status in ('queued','failed');
create index nd_provider_msg_idx on public.notification_deliveries(provider_message_id)
  where provider_message_id is not null;

create trigger notification_deliveries_set_updated_at
  before update on public.notification_deliveries
  for each row execute function public.set_updated_at();

-- ── Log idempotente de webhook (infra/ops; só service-role) ──────────────────
create table public.webhook_events (
  id                uuid primary key default gen_random_uuid(),
  provider          text not null default 'evolution',
  external_event_id text not null,                         -- dedup de re-entregas
  event_type        text,
  raw               jsonb not null default '{}'::jsonb,
  processed_at      timestamptz,
  created_at        timestamptz not null default now(),
  unique (provider, external_event_id)
);

-- ── RLS ──────────────────────────────────────────────────────────────────────
alter table public.notification_channels   enable row level security;
alter table public.channel_consent_log     enable row level security;
alter table public.notification_deliveries enable row level security;
alter table public.webhook_events          enable row level security;  -- sem policy: só service-role

-- canais: o membro gerencia os próprios (toggle/opt-in); webhook confirma via service-role
create policy notification_channels_member_all on public.notification_channels
  for all to authenticated
  using (tenant_id in (select public.current_tenant_ids()))
  with check (tenant_id in (select public.current_tenant_ids()));

-- consentimento: append-only -> só SELECT e INSERT (sem UPDATE/DELETE = trilha imutável)
create policy channel_consent_log_member_select on public.channel_consent_log
  for select to authenticated
  using (tenant_id in (select public.current_tenant_ids()));
create policy channel_consent_log_member_insert on public.channel_consent_log
  for insert to authenticated
  with check (tenant_id in (select public.current_tenant_ids()));

-- entregas: usuário só LÊ o status (escrita é do motor/webhook via service-role)
create policy notification_deliveries_member_select on public.notification_deliveries
  for select to authenticated
  using (tenant_id in (select public.current_tenant_ids()));
