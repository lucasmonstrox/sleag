# Obter Access Token

> **Fonte:** TikTok Shop Partner Center · **`GET /api/v2/token/get`** · **Auth:** Nenhuma (não requer access token)

## O que faz

Troca o `auth_code` temporário (obtido no callback OAuth) por um par `access_token` + `refresh_token`. Este é o passo 4 do fluxo OAuth 2.0. O `auth_code` expira em ~30 minutos após emissão — troque-o imediatamente.

## Request

### Base URL
```
https://auth.tiktok-shops.com
```

### Query params

| Param | Tipo | Obrigatório | O que faz |
|---|---|---|---|
| `app_key` | string | Sim | App Key obtida no Partner Center |
| `app_secret` | string | Sim | App Secret do Partner Center |
| `auth_code` | string | Sim | Código temporário recebido no callback OAuth |
| `grant_type` | string | Sim | `authorization_code` (valor fixo) |

### Exemplo de chamada

```bash
curl -s "https://auth.tiktok-shops.com/api/v2/token/get?app_key=$APP_KEY&app_secret=$APP_SECRET&auth_code=$AUTH_CODE&grant_type=authorization_code"
```

## Response

Envelope padrão: `{ code, message, data }`. `code = 0` = sucesso.

### Campos de `data`

| Campo | Tipo | O que é |
|---|---|---|
| `access_token` | string | Token de acesso (válido por 7 dias). Usar no header `x-tts-access-token`. |
| `access_token_expire_in` | integer | Segundos até expirar o `access_token` (604800 = 7 dias). |
| `refresh_token` | string | Token de refresh (válido por 365 dias). Guardar com segurança. |
| `refresh_token_expire_in` | integer | Segundos até expirar o `refresh_token` (31536000 ≈ 365 dias). |
| `open_id` | string | ID único do usuário/seller que autorizou. |
| `seller_name` | string | Nome do seller. |
| `seller_base_region` | string | Região base do seller (ex.: `US`, `BR`). |
| `scope` | string | Lista de escopos autorizados, separados por vírgula. |

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
    "seller_name": "My Shop",
    "seller_base_region": "US",
    "scope": "product.read,product.write,order.read,order.write"
  }
}
```

## Notas & gotchas

- O `auth_code` expira **rapidamente** (~30 min) — troque imediatamente após receber no callback.
- O `access_token` tem prefixo `ROW-` (rest of world). Guarde-o inteiro.
- **NÃO** faça esta chamada do frontend — o `app_secret` jamais deve ser exposto ao browser.
- Em sandbox, use `https://auth-sandbox.tiktok-shops.com` como base.
- Um novo `refresh_token` é emitido a cada refresh — o anterior é invalidado.

## Relevância para o SLEAG

- Ponto de entrada do fluxo OAuth. O backend do SLEAG deve armazenar `access_token`, `refresh_token` e `access_token_expire_in` por loja.
- Implementar cron de refresh diário (antes dos 7 dias) usando o `refresh_token`.
