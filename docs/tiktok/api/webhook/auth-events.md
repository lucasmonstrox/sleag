# Webhooks: Eventos de Autorização

> **Fonte:** TikTok Shop Partner Center · Eventos: `SELLER_DEAUTHORIZATION`, `UPCOMING_AUTHORIZATION_EXPIRATION`

## SELLER_DEAUTHORIZATION

Disparado quando um seller **desautoriza** o app (remove a conexão entre a loja e o seu serviço). Isso significa que o `access_token` e `shop_cipher` daquela loja **deixam de funcionar imediatamente**.

### Payload `data`

| Campo | Tipo | O que é |
|---|---|---|
| `shop_cipher` | string | Cipher da loja que desautorizou. |
| `seller_id` | string | ID do seller. |
| `deauth_time` | integer | Timestamp da desautorização. |
| `reason` | string | `SELLER_INITIATED` (seller removeu) ou `TIKTOK_INITIATED` (TikTok revogou). |

### Exemplo

```json
{
  "event_type": "SELLER_DEAUTHORIZATION",
  "event_id": "evt_deauth_001",
  "shop_cipher": "ROW_abc123...",
  "timestamp": 1713000000,
  "data": {
    "shop_cipher": "ROW_abc123...",
    "seller_id": "7494818275540568755",
    "deauth_time": 1713000000,
    "reason": "SELLER_INITIATED"
  },
  "signature": "..."
}
```

### Ações obrigatórias

- ⚠️ **Crítico:** parar imediatamente todas as chamadas de API para esta loja. Chamadas subsequentes retornarão `401`.
- Marcar a loja como `DEAUTHORIZED` no seu banco.
- Notificar o seller (email, dashboard) de que a integração foi desligada.
- Se o motivo for `TIKTOK_INITIATED`, investigar possível violação de política.
- **Não** tentar refresh de token — o refresh_token também é invalidado.

---

## UPCOMING_AUTHORIZATION_EXPIRATION

Disparado **30 dias antes** da expiração do `refresh_token` e depois **diariamente** até que um novo refresh seja feito. É um alerta preventivo para evitar que a autorização expire silenciosamente.

### Payload `data`

| Campo | Tipo | O que é |
|---|---|---|
| `shop_cipher` | string | Loja afetada. |
| `expiration_time` | integer | Timestamp Unix da expiração do `refresh_token`. |
| `days_remaining` | integer | Dias até expirar (30 → 1). |
| `warning_type` | string | `FIRST_WARNING` (primeiro alerta, 30d) ou `DAILY_REMINDER`. |

### Exemplo

```json
{
  "event_type": "UPCOMING_AUTHORIZATION_EXPIRATION",
  "event_id": "evt_auth_warn_001",
  "shop_cipher": "ROW_abc123...",
  "timestamp": 1713000000,
  "data": {
    "shop_cipher": "ROW_abc123...",
    "expiration_time": 1715600000,
    "days_remaining": 30,
    "warning_type": "FIRST_WARNING"
  },
  "signature": "..."
}
```

### Ações recomendadas

- **Refrescar `refresh_token`** para renovar o ciclo de 365 dias.
- Notificar o seller com instruções se o refresh automático falhar.
- Se `days_remaining` chegar a 1, escalar (SMS/notificação push). Após expiração, o seller precisa refazer o fluxo OAuth completo.

---

## Ciclo de vida da autorização

```
Seller autoriza app
       │
       ▼
┌─────────────────┐
│ access_token    │──► Refresh a cada ~24h (via cron job)
│ (7 dias)        │
│ refresh_token   │──► Evitar chegar perto dos 365 dias
│ (365 dias)      │
└─────────────────┘
       │
       │ ⚠️ UPCOMING_AUTHORIZATION_EXPIRATION (30 dias antes)
       │ ⚠️ DAILY_REMINDER (diário nos últimos 30 dias)
       ▼
  Se expirar → Seller precisa reautorizar (OAuth do zero)
       
       │
       │ ⚠️ SELLER_DEAUTHORIZATION (a qualquer momento)
       ▼
┌─────────────────┐
│ App desautorizado│──► Parar todas as chamadas imediatamente
│ Token inválido  │    Marcar loja como DEAUTHORIZED
└─────────────────┘
```

## Relevância para o SLEAG

- **Cron de refresh:** implementar refresh diário de `access_token` + refresh do `refresh_token` a cada ~300 dias (muito antes dos 365).
- **`UPCOMING_AUTHORIZATION_EXPIRATION`:** alerta no dashboard e email para o seller reautorizar.
- **`SELLER_DEAUTHORIZATION`:** webhook crítico — desligar sincronização da loja, liberar recursos e notificar o seller.
