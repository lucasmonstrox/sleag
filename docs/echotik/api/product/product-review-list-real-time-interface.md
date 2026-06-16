# Avaliações do Produto em Tempo-real (Product Review List - Real-time Interface)

> **Fonte:** opendoc EchoTik (https://opendocs.echotik.live/en/401152033e0) · **`GET /api/v3/realtime/product/comment`** · **Auth:** Basic · **Tipo:** Tempo-real

## O que faz
Retorna as **avaliações/comentários de um produto buscadas ao vivo no TikTok** (não da biblioteca indexada), por `product_id` + `region`, com paginação por cursor. É a versão "fresca" do endpoint offline de reviews: pega comentários atuais que talvez ainda não tenham sido indexados pela EchoTik. **Endpoint em tempo-real**: **não suporta QPS alto** e encontra risk control com frequência — se vier `code=500`, faça **retry**.

## Request

### Headers
| Header | Obrigatório | Valor |
|---|---|---|
| `Authorization` | Sim | `Basic base64(username:password)` (credenciais em echotik.live/platform/api-keys) |

### Query params
| Param | Tipo | Obrigatório | Valores / Default | O que faz |
|---|---|---|---|---|
| `product_id` | string | Sim | ex.: `1729679758111249333` | Produto cujas avaliações se quer ao vivo. |
| `region` | string | Sim | `US`, `GB`, `DE`, `FR`, `IT`, `ID`, `MY`, `MX`, `PH`, `SG`, `ES`, `TH`, `VN`, `BR`, `JP`, `IE` | Mercado/região do produto. |
| `offset` | string | Sim | começa em `1` | Cursor de paginação. Começa em `1`; quando o response trouxer `has_more=true`, use o `next_cursor` retornado como `offset` da próxima chamada. |

### Exemplo de chamada
```bash
curl -s "https://open.echotik.live/api/v3/realtime/product/comment?product_id=1729679758111249333&region=US&offset=1" \
  -H "Authorization: Basic $TOKEN"
```

## Response

Envelope padrão: `{ code, message, data, requestId }` — `code = 0` (e HTTP 200) significa sucesso; `code = 500` em endpoint tempo-real geralmente é risk control → **retry**. `code != 0` ou "Usage Limit Exceeded" = erro/cota.

### Campos de `data`
Confirmado pela página renderizada (Example real abaixo). `data` é um objeto com a lista de reviews + metadados agregados:

| Campo | Tipo | O que é |
|---|---|---|
| `review_items` | array | Lista de avaliações (ver estrutura de cada item abaixo). |
| `has_more` | bool | Se há mais páginas. |
| `next_cursor` | int | Cursor da próxima página; passe como `offset` na chamada seguinte. |
| `product_rating` | number | Nota média do produto (ex.: `4.9`). |
| `product_rating_v2` | objeto | `{ total_rating, non_incentivised_rating_text }` — versão detalhada da nota. |
| `review_count` | int | Total de avaliações (ex.: `26134`). |
| `review_count_str` | string | Total formatado curto (ex.: `"(26.1K)"`). |
| `review_count_str_v2` | string | Total formatado com separador (ex.: `"26,134"`). |
| `third_party_review_cnt` | int | Nº de reviews de terceiros. |
| `top_text` | string | Texto de cabeçalho da seção (ex.: "Pick authentic and helpful reviews for you"). |
| `ratings_link` | string | Deep-link `aweme://` para a página de notas no app. |
| `sort_type_sheet` | objeto | Opções de ordenação disponíveis (`sort_type_items[]`). |
| `platform_link_info` | objeto | `{ is_platform_product, biz_type }`. |
| `review_card_ui_ab` | objeto | Flags de A/B test da UI de review. |
| `show_global_text` | bool | Flag de UI. |

**Cada item de `review_items[]`:**

| Campo | Tipo | O que é |
|---|---|---|
| `review` | objeto | A avaliação: `review_id`, `rating` (1–5), `display_text`, `images[]` (com `thumb_url_list`/`url_list`), `media[]`, `review_timestamp` (ms, string), `review_timestamp_fmt` (ex.: "December 19, 2025"), `display_review_text[]`, `review_country`, `main_review_title`, `has_origin_text`, `strike_through_required`. |
| `sku_id` | string | SKU avaliado. |
| `sku_specification` | string | Descrição do SKU (ex.: "Item: Bahama Mama…"). |
| `review_user` | objeto | Autor: `name`, `avatar.url_list`, `link` (deep-link `aweme://`), `user_id`. |
| `digg_count` | int | Curtidas na avaliação. |
| `is_digged` / `is_owner` / `is_anonymous` / `is_updated` / `is_local` | bool | Flags de estado da avaliação. |
| `product_id` | string | Produto avaliado. |
| `review_source_type` | int | Código da origem da avaliação. |
| `review_source_name` | string | Origem legível (ex.: "Verified purchase"). |
| `review_source_info` | objeto | Texto explicativo da origem (ex.: review incentivada) com formatação rica. |
| `review_incentive_name` | string | Rótulo de incentivo (ex.: "Incentivized review"). |

### Exemplo de resposta (truncado)
```json
{
    "code": 0,
    "message": "ok",
    "data": {
        "review_items": [
            {
                "review": {
                    "review_id": "7585673214710253325",
                    "rating": 5,
                    "display_text": "I cannot express how happy I am that I found CCC teas...",
                    "review_timestamp": "1766177180886",
                    "review_timestamp_fmt": "December 19, 2025",
                    "review_country": "United States"
                },
                "sku_id": "1730048994859324341",
                "sku_specification": "Item: Bahama Mama-orange pine/t. punch/tropical",
                "review_user": { "name": "BondiBleu", "user_id": "7372302399707399211" },
                "digg_count": 5,
                "product_id": "1729679758111249333",
                "review_source_name": "Verified purchase",
                "review_incentive_name": "Incentivized review"
            }
        ],
        "has_more": true,
        "next_cursor": 2,
        "product_rating": 4.9,
        "review_count": 26134,
        "review_count_str": "(26.1K)",
        "third_party_review_cnt": 0
    },
    "requestId": "e8a8c592-991f-4661-b95d-3a468d256ad1"
}
```

## Notas & gotchas
- **Tempo-real:** sem QPS alto; risk control frequente; em `code=500`, **retry**.
- **Paginação por cursor** (`offset` → `next_cursor`), não por `page_num`/`page_size` como nos endpoints offline.
- `region` tem **lista fechada** de 16 valores (inclui `BR`).
- `review_timestamp` vem em **milissegundos como string**; URLs de imagem/avatar **expiram** (`x-expires`).
- Vários campos trazem deep-links `aweme://` (abrem no app TikTok), não URLs web.

## Relevância para o SLEAG
- **Reviews frescos** na página de detalhe do produto quando o offline (`product-review-list-echotik`) ainda não indexou.
- Uso secundário: o offline cobre a maioria dos casos; este é para frescor/cobertura adicional de sentimento.

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
  /api/v3/realtime/product/comment:
    get:
      summary: Product Review List - Real-time interface
      deprecated: false
      description: >-
        Provide a real-time product review interface. Note: This interface does
        not support high QPS. The real-time interface often encounters risk
        control. If a code=500 error occurs, please retry.
      tags:
        - Product
      parameters:
        - name: product_id
          in: query
          description: ''
          required: true
          example: '1729679758111249333'
          schema:
            type: string
        - name: region
          in: query
          description: >-
            Optional regions include: "US", "GB", "DE", "FR", "IT", "ID", "MY",
            "MX", "PH", "SG", "ES", "TH", "VN", "BR", "JP", "IE"
          required: true
          example: US
          schema:
            type: string
        - name: offset
          in: query
          description: >-
            The offset starts from 1. When the has_more returned by the
            interface is true, the offset for the next time should refer to the
            next_cursor value returned by the interface.
          required: true
          example: '1'
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
      x-run-in-apifox: https://app.apifox.com/web/project/7319100/apis/api-401152033-run
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
