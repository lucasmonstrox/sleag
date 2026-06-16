# Busca de Produtos — Interface em Tempo-real

> **Fonte:** opendoc EchoTik (https://opendocs.echotik.live/en/459609219e0) · **`GET /api/v3/realtime/product/search`** · **Auth:** Basic · **Tipo:** Tempo-real

## O que faz

Busca, ao vivo, a lista de produtos do TikTok Shop a partir de uma palavra-chave (`sk`). É uma "Real-time Interface": consulta o índice ao vivo, sujeita a risk control. Permite filtros de ordenação, faixa de preço, produtos com live e cash-on-delivery (COD). Paginação por `offset` (cursor) com tamanho de página via `count`.

Importante: a resposta espelha a estrutura do app TikTok (camada de UI). Os produtos ficam em `data.body.sections[0].items`. Esta busca **não** traz os dados completos do produto — cada item carrega o `product_id` (em `item_id`, no formato `índice;product_id`, e dentro de `raw_data`), que deve ser usado para puxar detalhes via a interface de detalhes de produto.

## Request

### Headers
| Header | Obrigatório | Valor |
|---|---|---|
| `Authorization` | Sim | `Basic base64(username:password)` (credenciais em echotik.live/platform/api-keys) |

### Query params
| Param | Tipo | Obrigatório | Valores / Default | O que faz |
|---|---|---|---|---|
| `sk` | string | Sim | ex: `Notebook` | Palavra(s)-chave de busca. |
| `region` | string | Sim | `GB, ID, IE, US, DE, JP, IT, FR, MY, MX, ES, BR, SG, TH, PH, VN` | Código do mercado (apenas os listados são suportados). |
| `sort_type` | string | Não | `1`=PRICE_ASC, `2`=PRICE_DESC, `3`=BEST_SELLERS, `4`=RELEVANCE | Ordenação dos produtos. |
| `price_range` | string | Não | ex: `0,100` | Faixa de preço no formato `min,max`. |
| `live` | string | Não | `0`=não (default), `1`=sim | Exibir apenas produtos vinculados a live. |
| `cod` | string | Não | `0`=não (default), `1`=sim | Exibir apenas produtos com pagamento na entrega (cash on delivery). |
| `count` | string | Não | ex: `10` | Tamanho da página (qtd. de produtos por chamada). |
| `offset` | string | Não | ex: `0` (default `0`) | Cursor de paginação. Quando `has_more=1`, reenvie para a próxima página. |

### Exemplo de chamada
```bash
curl -s "https://open.echotik.live/api/v3/realtime/product/search?sk=Notebook&region=MY&sort_type=1&price_range=0,100&live=0&cod=0&count=10&offset=0" \
  -H "Authorization: Basic $TOKEN"
```

## Response

Envelope padrão: `{ code, message, data, requestId }` — `code = 0` + HTTP 200 = sucesso; `code != 0` ou HTTP 500 "Usage Limit Exceeded" = erro/cota. `code=500` em tempo-real = risk control → faça retry.

### Campos de `data`
A resposta replica a estrutura de feed do app TikTok. Principais campos (ordem do exemplo oficial):

| Campo | Tipo | O que é |
|---|---|---|
| `section_cursor` | inteiro | Cursor de seção. (não documentado — provavelmente índice interno de seção para paginação.) |
| `page_state` | inteiro | (não documentado — provavelmente estado/flag de página da busca.) |
| `has_more` | inteiro | `1`=há mais resultados, `0`=fim. Use com `offset`/`cursor`. |
| `cursor` | inteiro | Cursor de paginação a reenviar. |
| `log_pb` | objeto | Bloco de logging do TikTok; contém `impr_id` (id da impressão). |
| `backtrace` | string | (não documentado — provavelmente rastro interno de ranqueamento/paginação, opaco.) |
| `is_hit_cache` | string | (não documentado — provavelmente `"1"` se a resposta veio de cache.) |
| `is_non_personalized_search` | inteiro | (não documentado — provavelmente `1` se a busca não foi personalizada.) |
| `last_search_pid_list` | string (JSON) | Lista (serializada) dos `product_id` retornados nesta página. |
| `return_to_server_content` | string (JSON) | Payload opaco do servidor a reenviar para manter o estado de paginação/ordenação (inclui `to_next_page_param`). |
| `server_perf_info` | objeto | Telemetria de performance do servidor (`server_inner_cost`, timestamps, `module_info` com contagens por tipo: `goods`, `video`, `live`, `creator`, `shop`...). Irrelevante para negócio. |
| `chunk_meta` | objeto | Metadados do chunk de resposta (`chunk_name`, `product_pack_type`). |
| `filter_origin_search_id` | string | ID de busca de origem do filtro. (não documentado — provavelmente para correlação de filtros.) |
| `body` | objeto | **Onde estão os produtos.** Contém `sections[]`. |
| `body.sections[]` | array | Seções de UI; os produtos ficam em `sections[0].items`. Cada seção tem `id`, `type`, `section_style`, `order`, etc. |
| `body.sections[].items[]` | array | **Lista de produtos.** Cada item tem `item_id` (`"índice;product_id"`), `tech_type`, `biz_type`, `style` e `data`. |
| `body.sections[].items[].data` | objeto | Render data do card: `height`, `width`, `lynx_card_key` e `raw_data`. |
| `...items[].data.raw_data` | string (JSON) | JSON serializado do card. Contém `search_result_id` (= product_id), `view_object` com `baseLog` (`product_id`, `shop_id`, `seller_name`), `cardLog` (`title_text`, `product_price`, `sales_price`, `show_price`, `currency`, `rate`, `volume`/`soldCount`, `main_image`, `discount_rate` etc.). É daqui que se extraem nome, preço, vendas e imagem de cada produto. |
| `style` | objeto | Estilo de UI da resposta (irrelevante para negócio). |
| `pendent_layer` | objeto | Camada pendente de UI (irrelevante para negócio). |

> Praticamente todos os dados úteis de produto vêm de `body.sections[0].items[].data.raw_data` (string JSON que precisa ser parseada). Os campos de negócio (título, preço, vendas, loja) estão dentro de `view_object.cardLog`/`view_object.baseLog`. Para dados estruturados e completos, use o `product_id` na interface de detalhes.

## Notas & gotchas
- Tempo-real: `code=500` → retry; sem QPS alto.
- `offset` é cursor, **não** `page_num`; mantenha também `return_to_server_content`/`cursor` para paginação consistente.
- Resposta no formato de UI do TikTok: `raw_data` vem como **string JSON** (precisa `JSON.parse`) e contém muito ruído de tracking/render.
- `region` aceita apenas a lista fixa de mercados; outros valores podem falhar.
- Para extrair produtos: caminho é `data.body.sections[0].items[]` → parse de `data.raw_data` → `view_object.cardLog`/`baseLog`.

## Relevância para o SLEAG
- Alimenta a busca de produtos do usuário (achar produto por termo) e descoberta de mais vendidos via `sort_type=3` (BEST_SELLERS) — diretamente ligado à métrica nº 1 do dashboard (produtos mais vendidos).
- O `product_id` extraído é a chave para enriquecer com detalhes/métricas em outro endpoint; planejar o parse de `raw_data` no `services/` da feature.

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
  /api/v3/realtime/product/search:
    get:
      summary: Product Search - Real-time Interface
      deprecated: false
      description: >-
        Search for product lists in real time via keywords and use offset for
        subsequent page turning. 


        Product data can be obtained from data.body.sections[0].items. The
        search interface does not return complete product data; you can retrieve
        product details using the obtained product_id. 


        Note: Real-time interfaces may encounter risk control detection at any
        time. Please retry if the returned code equals 500.
      tags:
        - Search
      parameters:
        - name: sk
          in: query
          description: Search Keywords
          required: true
          example: Notebook
          schema:
            type: string
        - name: region
          in: query
          description: >-
            Region codes, currently supported only: GB, ID, IE, US, DE, JP, IT,
            FR, MY, MX, ES, BR, SG, TH, PH, VN
          required: true
          example: MY
          schema:
            type: string
        - name: sort_type
          in: query
          description: Sort type. 1=PRICE_ASC, 2=PRICE_DESC, 3=BEST_SELLERS, 4=RELEVANCE
          required: false
          example: '1'
          schema:
            type: string
        - name: price_range
          in: query
          description: 'Price range filtering, e.g. enter: 0,100'
          required: false
          example: 0,100
          schema:
            type: string
        - name: live
          in: query
          description: Display live broadcast products, 0=No, 1=Yes
          required: false
          example: '0'
          schema:
            type: string
        - name: cod
          in: query
          description: Display goods that support cash on delivery, 0=No, 1=Yes
          required: false
          example: '0'
          schema:
            type: string
        - name: count
          in: query
          description: ''
          required: false
          example: '10'
          schema:
            type: string
        - name: offset
          in: query
          description: ''
          required: false
          example: '0'
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
              example: |-
                {
                    "code": 0,
                    "message": "ok",
                    "data": {
                        "section_cursor": 1,
                        "page_state": 0,
                        "has_more": 1,
                        "cursor": 3,
                        "log_pb": {
                            "impr_id": "202605182104464A365AF21D90564FDB9E"
                        },
                        "body": {
                            "sections": [
                                {
                                    "id": 0,
                                    "type": 4,
                                    "items": [
                                        {
                                            "item_id": "0;1735080995730523261",
                                            "tech_type": 2,
                                            "biz_type": 1,
                                            "data": {
                                                "height": 340,
                                                "lynx_card_key": "search_product_card_v2",
                                                "raw_data": "<JSON serializado do card; contém product_id, title_text, product_price, sales_price, show_price, currency, rate, volume/soldCount, main_image, etc.>",
                                                "width": 183
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        "requestId": "e621f2c1-be85-425b-8e03-d1b9d3ae6675"
                    }
                }
          headers: {}
          x-apifox-name: 成功
      security:
        - basic: []
      x-apifox-folder: Search
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/7319100/apis/api-459609219-run
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

> **Nota sobre o spec original:** o exemplo de resposta publicado pela EchoTik incluía o conteúdo integral de `raw_data` (milhares de caracteres de tracking/render do app TikTok) e o bloco `server_perf_info`. Esses trechos foram resumidos acima por placeholders para manter o documento legível; o caminho dos campos (`data.body.sections[].items[].data.raw_data`), os nomes e os valores de exemplo (`item_id`, `lynx_card_key`, `impr_id`, `requestId`) foram preservados fielmente. Para o JSON bruto completo, consulte o endpoint no Apifox (`api-459609219-run`).

</details>
