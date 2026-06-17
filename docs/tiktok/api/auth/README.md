# Autenticação — TikTok Shop API

> **Auth:** OAuth 2.0 Authorization Code Grant · **Token:** `x-tts-access-token` header · **Assinatura:** HMAC-SHA256 (`sign` param)

## Visão geral

A API do TikTok Shop usa **OAuth 2.0** com grant do tipo **Authorization Code**. Todo request à API de negócio requer:

1. **`x-tts-access-token`** — header HTTP com o access token
2. **`sign`** — query param com assinatura HMAC-SHA256 do request
3. **`shop_cipher`** — query param que identifica a loja (cross-border); obtido via `/authorization/202309/shops`

## Fluxo completo

```
┌──────────────┐     ┌──────────────────┐     ┌─────────────────────┐
│   Seller     │────▶│  TikTok Auth     │────▶│  Sua Aplicação      │
│  (Browser)   │     │  /oauth/authorize│     │  (Backend)          │
└──────────────┘     └──────────────────┘     └─────────────────────┘
       │                                              │
       │  1. Redirect p/ authorize                    │
       │     ?app_key=...&state=...                   │
       │                                              │
       │  2. Seller aprova scopes                     │
       │                                              │
       │  3. Callback com auth_code                   │
       │     /callback?code=...&state=...             │
       │                                              │
       │                              4. Troca auth_code por tokens
       │                                 GET /api/v2/token/get
       │                                 → access_token (7d)
       │                                 → refresh_token (365d)
       │                                              │
       │                              5. Obtém shop_cipher
       │                                 GET /authorization/202309/shops
       │                                              │
       │                              6. Faz chamadas de negócio
       │                                 header: x-tts-access-token
       │                                 param: sign, shop_cipher
```

## Credenciais

| Credencial | Onde obter | Vida útil |
|---|---|---|
| `app_key` | Partner Center → App | Permanente |
| `app_secret` | Partner Center → App (privado!) | Permanente |
| `auth_code` | Callback OAuth | ~30 minutos |
| `access_token` | `GET /api/v2/token/get` | **7 dias** |
| `refresh_token` | `GET /api/v2/token/get` | **365 dias** |
| `shop_cipher` | `GET /authorization/202309/shops` | Permanente por loja |

## Escopos (Scopes)

Os escopos são definidos na criação do app no Partner Center. Categorias típicas:

| Escopo | Descrição |
|---|---|
| `product.read` | Ler produtos, categorias, marcas |
| `product.write` | Criar, editar, deletar produtos |
| `order.read` | Ler pedidos |
| `order.write` | Cancelar pedidos, gerenciar fulfillment |
| `logistics.read` | Consultar tracking, transportadoras |
| `logistics.write` | Criar pacotes, etiquetas |
| `finance.read` | Consultar settlements, transações |
| `shop.read` | Ler perfil e performance da loja |
| `promotion.read` | Ver promoções e cupons |
| `promotion.write` | Criar/editar promoções |
| `affiliate.read` | Ver programa de afiliados |
| `affiliate.write` | Configurar afiliados e comissões |
| `return.read` | Ver devoluções/reembolsos |
| `return.write` | Aprovar/rejeitar devoluções |

## Assinatura de Request (HMAC-SHA256)

Todo request precisa do parâmetro `sign`. O algoritmo:

```
1. Coletar todos os query params (exceto sign e access_token)
2. Ordenar alfabeticamente por chave
3. Concatenar como: key1value1key2value2...
4. Prepend o path do request (ex: /product/202309/products)
5. Append o body (se houver; se GET, vazio)
6. Envelopar com app_secret: app_secret + input + app_secret
7. HMAC-SHA256 → hex encode
```

### Exemplo em JavaScript

```js
const crypto = require('crypto');

function signRequest(path, params, body, appSecret) {
  // 1. Ordenar params (exclui sign, access_token)
  const sorted = Object.keys(params)
    .filter(k => k !== 'sign' && k !== 'access_token')
    .sort();

  // 2. Concatenar key+value
  let input = path;
  for (const k of sorted) {
    input += k + params[k];
  }
  // 3. Append body se houver
  if (body) input += JSON.stringify(body);

  // 4. Envelopar com secret
  const wrapped = appSecret + input + appSecret;

  // 5. HMAC-SHA256 → hex
  return crypto.createHmac('sha256', appSecret).update(wrapped).digest('hex');
}
```

### Exemplo em Python

```python
import hmac, hashlib

def sign_request(path, params, body, app_secret):
    # Ordenar params, excluir sign e access_token
    sorted_keys = sorted(k for k in params if k not in ('sign', 'access_token'))
    # Concatenar key+value
    input_str = path + ''.join(f'{k}{params[k]}' for k in sorted_keys)
    # Append body se houver
    if body:
        input_str += json.dumps(body)
    # Envelopar com secret e HMAC-SHA256
    wrapped = app_secret + input_str + app_secret
    return hmac.new(app_secret.encode(), wrapped.encode(), hashlib.sha256).hexdigest()
```

## Refresh de Token

- `access_token` expira em **7 dias**
- `refresh_token` expira em **365 dias**
- Ao refrescar, um **novo** `refresh_token` é emitido — o anterior é invalidado
- **Recomendação:** refrescar diariamente (não esperar expirar) para evitar race conditions

```bash
curl -s "https://auth.tiktok-shops.com/api/v2/token/refresh?app_key=$APP_KEY&app_secret=$APP_SECRET&refresh_token=$REFRESH_TOKEN&grant_type=refresh_token"
```

## Shop Cipher

Para vendedores cross-border, cada loja tem um `shop_cipher` único — obrigatório nos requests de negócio:

```bash
# Obter shop_cipher
curl -s "https://open-api.tiktokglobalshop.com/authorization/202309/shops?app_key=$APP_KEY&sign=$SIGN" \
  -H "x-tts-access-token: $ACCESS_TOKEN"

# Usar em chamadas de negócio
curl -s "https://open-api.tiktokglobalshop.com/product/202309/products?shop_cipher=$SHOP_CIPHER&sign=$SIGN" \
  -H "x-tts-access-token: $ACCESS_TOKEN"
```

## Endpoints de Auth

| Endpoint | Descrição |
|---|---|
| [/api/v2/token/get](get-access-token.md) | Troca `auth_code` por tokens |
| [/api/v2/token/refresh](refresh-access-token.md) | Renova `access_token` |
| [/authorization/202309/shops](list-authorized-shops.md) | Lista lojas autorizadas |
