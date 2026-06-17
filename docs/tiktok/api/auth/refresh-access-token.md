# Refrescar Access Token

> **Fonte:** TikTok Shop Partner Center · **`GET /api/v2/token/refresh`** · **Auth:** Nenhuma (não requer access token)

## O que faz

Renova o `access_token` antes ou após expirar. O `access_token` tem vida útil de 7 dias; o `refresh_token`, 365 dias. Cada chamada bem-sucedida emite um **novo** `refresh_token` e invalida o anterior — armazene o novo imediatamente.

## Request

### Base URL
```
https://auth.tiktok-shops.com
```

### Query params

| Param | Tipo | Obrigatório | O que faz |
|---|---|---|---|
| `app_key` | string | Sim | App Key do Partner Center |
| `app_secret` | string | Sim | App Secret do Partner Center |
| `refresh_token` | string | Sim | O refresh_token atual (será invalidado após o refresh) |
| `grant_type` | string | Sim | `refresh_token` (valor fixo) |

### Exemplo de chamada

```bash
curl -s "https://auth.tiktok-shops.com/api/v2/token/refresh?app_key=$APP_KEY&app_secret=$APP_SECRET&refresh_token=$REFRESH_TOKEN&grant_type=refresh_token"
```

## Response

Mesmo envelope de `GET /api/v2/token/get`.

### Campos de `data`

| Campo | Tipo | O que é |
|---|---|---|
| `access_token` | string | **Novo** access token (7 dias) |
| `access_token_expire_in` | integer | Segundos até expirar |
| `refresh_token` | string | **Novo** refresh token (365 dias). O refresh_token usado na chamada é invalidado. |
| `refresh_token_expire_in` | integer | Segundos até expirar o novo refresh_token |
| `open_id` | string | ID do seller |
| `scope` | string | Escopos mantidos |

### Exemplo de resposta

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "access_token": "ROW-...",
    "access_token_expire_in": 604800,
    "refresh_token": "ROW-...",
    "refresh_token_expire_in": 31536000,
    "open_id": "7494818275540568755",
    "scope": "product.read,product.write,order.read,order.write"
  }
}
```

## Notas & gotchas

- **Race condition:** se 2 processos refrescarem simultaneamente, um deles usará um `refresh_token` já invalidado e receberá erro. Implementar lock distribuído ou renovar com folga (ex.: a cada 24h, não no último minuto).
- O `refresh_token` antigo **morre** na hora do refresh bem-sucedido — atualize o banco atomicamente.
- Se o `refresh_token` expirar (365 dias sem refresh), o seller precisa reautorizar via OAuth do zero.
- Resposta de erro comum: `{ "code": 1100001, "message": "invalid refresh_token" }` — significa que o token já expirou ou foi revogado.

## Relevância para o SLEAG

- Cron job diário (`@daily` ou `0 3 * * *`) por loja: refresca tokens cujo `access_token_expire_in` < 86400 (1 dia).
- Em caso de falha no refresh (refresh_token expirado): notificar o seller para reautorizar.
