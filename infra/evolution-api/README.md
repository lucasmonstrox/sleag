# Evolution API — WhatsApp (alertas TIKSPY)

Gateway WhatsApp ([Evolution API](https://doc.evolution-api.com)) em Docker para
**entregar alertas** da TIKSPY aos assinantes. Embrulha o Baileys numa REST API + manager web.

> **Modelo:** UM número TIKSPY (instância `tikspy-alerts`) dispara alertas para muitos
> assinantes — broadcast **outbound**. O assinante **não pareia nada**: só informa o número
> + consentimento (LGPD). Inbound é mínimo (só `SIM`/`PARAR`). Nada de agente conversacional.

> ⚠️ **Risco conhecido.** Evolution é uma API **não-oficial** do WhatsApp (`docs/infra.md §9.2`
> desaconselha por risco de ToS/ban). É escolha consciente para o MVP, atrás de um adapter de
> canal (`packages/notifications`) que torna a troca pelo WhatsApp Cloud API oficial uma mudança
> de env. Mitigações obrigatórias: número **dedicado**, **warmup**, **throttle**, **opt-in only**,
> **STOP** respeitado, monitoramento de `connection.update`.

## Subir (dev)

```bash
cd infra/evolution-api
cp .env.example .env          # 1ª vez — depois edite AUTHENTICATION_API_KEY (openssl rand -hex 24)
docker compose up -d
docker compose ps             # postgres/redis devem ficar "healthy"
docker compose logs -f evolution-api   # acompanhar boot (Prisma roda as migrations)
```

- **Manager (UI):** http://localhost:8081/manager
- **API base:** http://localhost:8081
- **Auth:** header `apikey: <AUTHENTICATION_API_KEY do .env>` em toda request.
- Porta **8081** no host (8080 dentro do container) para não colidir com o Evolution do
  menupiloto (8080) nem com a `apps/api` da TIKSPY (3333).

## Parear o número TIKSPY (ação única de ops)

O pareamento é feito **uma vez**, pela equipe — não é fluxo de produto.

**Pela UI (mais fácil):** abra o `/manager`, cole a apikey, **Create Instance** →
nome `tikspy-alerts` → leia o **QR** no celular do número TIKSPY
(WhatsApp ▸ Aparelhos conectados ▸ Conectar aparelho).

**Pela API:**

```bash
# cria a instância já pedindo o QR
curl -X POST http://localhost:8081/instance/create \
  -H "apikey: <SUA_APIKEY>" -H "Content-Type: application/json" \
  -d '{"instanceName":"tikspy-alerts","integration":"WHATSAPP-BAILEYS","qrcode":true}'

# rega o QR de novo / estado da conexão
curl http://localhost:8081/instance/connect/tikspy-alerts -H "apikey: <SUA_APIKEY>"
curl http://localhost:8081/instance/connectionState/tikspy-alerts -H "apikey: <SUA_APIKEY>"
```

O QR vem em base64 no campo `qrcode.base64` — cole num viewer de data-URL, ou use a UI.

## Enviar uma mensagem de teste

```bash
curl -X POST http://localhost:8081/message/sendText/tikspy-alerts \
  -H "apikey: <SUA_APIKEY>" -H "Content-Type: application/json" \
  -d '{"number":"5599999999999","text":"TIKSPY: alerta de teste no ar 🚀"}'
```

`number` = DDI+DDD+número, só dígitos (ex.: `55` + `11` + `9XXXXXXXX`).

## Webhook (recibos + opt-out)

O `.env` já configura o **webhook global** apontando para o receiver da TIKSPY
(`WEBHOOK_GLOBAL_URL`). Em dev, o gateway roda em container e a `apps/api` no host —
por isso o default usa `host.docker.internal:3333`. Eventos tratados:

- `messages.update` → recibo de entrega/leitura (avança o status em `notification_deliveries`).
- `connection.update` → saúde do número (`close` dispara alerta de ops).
- `messages.upsert` → **só** para captar `SIM` (confirma opt-in) e `PARAR/STOP` (opt-out).

## Parar / limpar

```bash
docker compose down            # para (mantém os volumes/sessão)
docker compose down -v         # zera tudo (apaga sessão, banco, cache) — exige re-parear
```

## Produção (VPS)

O motor de alertas roda no **Trigger.dev (nuvem pública)**, então a instância Evolution
**precisa ser alcançável pela internet** — `127.0.0.1:8081` é só dev.

- **1 VPS pequeno** (Hetzner CX22 / DigitalOcean, ~€4–6/mês) rodando este mesmo compose.
- **Caddy** na frente para TLS automático; Evolution segue em `127.0.0.1:8080`, só o Caddy
  escuta publicamente. Defina `SERVER_URL=https://evolution.tikspy.com`.
- **Volume persistente** para `evolution_instances` (a sessão pareada vive aí — perder = re-parear).
  Faça backup. Evite plataformas que recriam container (scale-to-zero / redeploy) — derrubam a
  sessão e geram sinal de ban; IP de egress **estável** (de preferência no BR) protege o número.
- `EVOLUTION_API_URL` (= URL https pública), `EVOLUTION_API_KEY` e `EVOLUTION_INSTANCE=tikspy-alerts`
  viram env do **Trigger.dev** e da **apps/api**; re-aponte `WEBHOOK_GLOBAL_URL` para a api de prod.
