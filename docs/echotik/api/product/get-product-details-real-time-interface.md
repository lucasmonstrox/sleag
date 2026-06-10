# Detalhes do Produto em Tempo-real (Get Product Details - Real-time Interface)

> **Fonte:** opendoc EchoTik (https://opendocs.echotik.live/en/375121182e0) · **`GET /api/v3/realtime/product/detail`** · **Auth:** Basic · **Tipo:** Tempo-real

## O que faz
Retorna os **detalhes de um produto buscados ao vivo no TikTok** (não da biblioteca offline), identificado por `product_id` + `region`. É a versão "fresca" do detalhe de produto: use quando precisar do estado atual (preço, disponibilidade) em vez do snapshot T+1. **Endpoint em tempo-real**: sujeito a risk control a qualquer momento — se vier `code=500`, faça **retry** — e não deve ser martelado com QPS alto.

## Request

### Headers
| Header | Obrigatório | Valor |
|---|---|---|
| `Authorization` | Sim | `Basic base64(username:password)` (credenciais em echotik.live/platform/api-keys) |

### Query params
| Param | Tipo | Obrigatório | Valores / Default | O que faz |
|---|---|---|---|---|
| `product_id` | string | Sim | ex.: `1731687611898499152` | ID do produto a detalhar ao vivo. |
| `region` | string | Sim | ex.: `US` | Mercado/região do produto (código tipo `US`, `BR`). |

### Exemplo de chamada
```bash
curl -s "https://open.echotik.live/api/v3/realtime/product/detail?product_id=1731687611898499152&region=US" \
  -H "Authorization: Basic $TOKEN"
```

## Response

Envelope: `{ code, message, data }` — `code = 0` + `message = "ok"` = sucesso; `code = 500` em tempo-real geralmente é risk control → **retry**.

### Campos de `data` — ⚠️ passthrough bruto do TikTok
Confirmado pela página: este endpoint **não retorna um schema normalizado pela EchoTik**. O `data` é o **estado bruto da página de detalhe do produto (PDP) do TikTok** — o mesmo objeto de render que o site do TikTok usa. Estrutura observada:

| Caminho | Tipo | O que é |
|---|---|---|
| `data.layout` | null | Layout da página (vem `null` no exemplo). |
| `data["shop/pdp/(product_name_slug$)/(product_id)/page"]` | objeto | Bloco principal: o estado da rota PDP do TikTok. Contém as chaves abaixo. |
| `…page.basic_info` | objeto | Contexto da requisição: `lang`, `device_system`, `is_mobile`, `user_agent`, `is_login`, `web_id`. |
| `…page.waf_decision` | objeto | Anti-bot/WAF do TikTok: `waf_type`, `dkms_token`. |
| `…page.region_info` | objeto | Região resolvida: `path_region`, `real_region`, `current_v_region`, `mssdk_region` + dicionário `vRegions`. |
| `…page.route_info` | objeto | Roteamento: `enter_method`, `first_entrance` (ex.: `product_detail`), etc. |
| `…page.*` (demais) | objeto | O restante do estado da PDP (dados do produto, SKUs, preço, avaliações) vive aninhado mais fundo nesse mesmo objeto — **não normalizado**, sujeito a mudar conforme o TikTok mudar a página. |

> **Não é uma API limpa.** Os campos comerciais do produto estão enterrados no estado da página do TikTok e podem mudar sem aviso. Para detalhe estruturado e estável, prefira o offline `batch-fetch-product-details`. Use este só quando precisar do estado ao vivo e estiver disposto a fazer parsing do page-state.

### Exemplo de resposta (truncado)
```json
{
    "code": 0,
    "message": "ok",
    "data": {
        "layout": null,
        "shop/pdp/(product_name_slug$)/(product_id)/page": {
            "basic_info": { "lang": "en-US", "is_mobile": false, "is_login": false, "web_id": "7571425464209393166" },
            "waf_decision": { "waf_type": 2, "dkms_token": "MIIBCwQM…" },
            "region_info": { "path_region": "US", "real_region": "US", "current_v_region": "US-TTP", "mssdk_region": "ttp" },
            "route_info": { "first_entrance": "product_detail" }
        }
    }
}
```

## Notas & gotchas
- **Tempo-real:** risk control frequente; em `code=500`, **retry**. Sem QPS alto.
- **`data` é passthrough do page-state do TikTok**, não um schema EchoTik — exige parsing e é frágil a mudanças do TikTok.
- Mais caro/instável que o detalhe offline (`batch-fetch-product-details`); use só quando precisar de frescor (preço/estoque atuais).

## Relevância para o TIKSPY
- **Frescor sob demanda** na página de detalhe do produto: preço/disponibilidade atuais quando o T+1 não basta.
- Uso secundário/pontual — o grosso da análise vem dos endpoints offline; este é fallback "ao vivo".

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
  /api/v3/realtime/product/detail:
    get:
      summary: Get product details - Real-time interface
      deprecated: false
      description: >-
        Real-time product detail data can be obtained by using the product_id
        and region.


        Note: Real-time APIs may encounter risk control checks at any time. If a
        code=500 is returned, please retry.
      tags:
        - Product
      parameters:
        - name: product_id
          in: query
          description: ''
          required: true
          example: '1731687611898499152'
          schema:
            type: string
        - name: region
          in: query
          description: ''
          required: true
          example: US
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
      x-run-in-apifox: https://app.apifox.com/web/project/7319100/apis/api-375121182-run
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
