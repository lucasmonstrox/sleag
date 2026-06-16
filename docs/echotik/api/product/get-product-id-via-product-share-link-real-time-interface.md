# Obter Product ID via Link de Compartilhamento (Get Product ID via Share Link - Real-time Interface)

> **Fonte:** opendoc EchoTik (https://opendocs.echotik.live/en/375088739e0) · **`GET /api/v3/realtime/extract_product_id`** · **Auth:** Basic · **Tipo:** Tempo-real

## O que faz
Recebe um **link de compartilhamento de produto do TikTok** (`share_url`, normalmente uma URL curta tipo `tiktok.com/t/...`) e resolve para o **`product_id`** canônico, retornando também a localização/região atual do produto. É um **endpoint em tempo-real**: consulta o TikTok ao vivo, então está sujeito a risk control a qualquer momento — se vier `code=500`, faça **retry** — e **não suporta QPS alto**. É a porta de entrada para, a partir de um link colado pelo usuário, puxar todo o resto (detalhes, vídeos, lives, tendência) pelos endpoints offline por `product_id`.

## Request

### Headers
| Header | Obrigatório | Valor |
|---|---|---|
| `Authorization` | Sim | `Basic base64(username:password)` (credenciais em echotik.live/platform/api-keys) |

### Query params
| Param | Tipo | Obrigatório | Valores / Default | O que faz |
|---|---|---|---|---|
| `share_url` | string | Sim | ex.: `https://www.tiktok.com/t/ZPH7PbVhQDwt7-vS8eu/` | Link de compartilhamento do produto a ser resolvido. |

### Exemplo de chamada
```bash
curl -s "https://open.echotik.live/api/v3/realtime/extract_product_id?share_url=https://www.tiktok.com/t/ZPH7PbVhQDwt7-vS8eu/" \
  -H "Authorization: Basic $TOKEN"
```

## Response

Envelope padrão: `{ code, message, data, requestId }` — `code = 0` (e HTTP 200) significa sucesso; `code != 0` ou HTTP 500 ("Usage Limit Exceeded" ou risk control) = erro/cota → **retry** no caso de 500 em endpoint tempo-real.

### Campos de `data`
Confirmado pela página renderizada (Example real abaixo). `data` é um objeto enxuto:

| Campo | Tipo | O que é |
|---|---|---|
| `productId` | string | ID canônico do produto resolvido a partir do `share_url`. Chave para os endpoints offline (detalhe, vídeos, lives, tendência). |
| `region` | string | Região/mercado atual do produto (ex.: `US`). |

### Exemplo de resposta
```json
{
    "code": 0,
    "message": "success",
    "data": {
        "productId": "1731833900198630205",
        "region": "US"
    },
    "requestId": null
}
```

## Notas & gotchas
- **Tempo-real:** sujeito a risk control; em `code=500`, **retry**. Sem QPS alto.
- `requestId` pode vir `null` neste endpoint.
- Use uma vez para resolver o ID e depois siga com os endpoints offline (mais baratos e estáveis) por `product_id`.

## Relevância para o SLEAG
- **Onboarding por colagem de link:** usuário cola um link de produto do TikTok → resolvemos o `product_id` → carregamos a página de detalhe do produto inteira (vendas, vídeos, lives, criadores, tendência).
- Ponte essencial entre o input humano (link) e a base estruturada da EchoTik.

---

<details>
<summary>Spec original (OpenAPI 3.0.1)</summary>

```yaml
openapi: 3.0.1
info:
  title: ''
  description: ''
  version: 1.0.0
paths:
  /api/v3/realtime/extract_product_id:
    get:
      summary: Get Product ID via Product Share Link - Real-time Interface
      deprecated: false
      description: >-
        Get the product ID through the product sharing link and return the
        current product's location
      tags:
        - Product
      parameters:
        - name: share_url
          in: query
          description: ''
          required: true
          example: https://www.tiktok.com/t/ZPH7PbVhQDwt7-vS8eu/
          schema:
            type: string
      responses:
        '200':
          description: ''
          content:
            application/json:
              schema:
                type: object
                properties: {}
          headers: {}
          x-apifox-name: 成功
      security:
        - basic: []
      x-apifox-folder: Product
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/7319100/apis/api-375088739-run
components:
  schemas: {}
  securitySchemes:
    basic:
      type: http
      scheme: basic
servers:
  - url: ''
    description: 正式环境
security: []
```

</details>
