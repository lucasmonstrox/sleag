# Busca de Produtos por Imagem — Dados Paginados — Interface em Tempo-real

> **Fonte:** opendoc EchoTik (https://opendocs.echotik.live/en/468104760e0) · **`GET /api/v3/realtime/product/photo-search/page`** · **Auth:** Basic · **Tipo:** Tempo-real

## O que faz

É a **segunda metade do par** da busca por imagem. Enquanto a "Busca de Produtos por Imagem" (`POST /api/v3/realtime/product/photo-search`) recebe a foto e devolve ~6 produtos aleatórios + um `image_uri` e `box_detection`, **este** endpoint usa esses dois valores para paginar e trazer mais produtos semelhantes. É uma "Real-time Interface", sujeita a risk control. Paginação por `offset` (cursor) e tamanho via `count`.

Fluxo:
1. `POST .../photo-search` (envia imagem) → retorna `data.photo_search.image_uri` e `data.photo_search.box_detection`.
2. `GET .../photo-search/page` (este) passando `photo_search_image_uri` e `photo_search_box_detection` + `offset` → pagina os resultados.

## Request

### Headers
| Header | Obrigatório | Valor |
|---|---|---|
| `Authorization` | Sim | `Basic base64(username:password)` (credenciais em echotik.live/platform/api-keys) |

### Query params
| Param | Tipo | Obrigatório | Valores / Default | O que faz |
|---|---|---|---|---|
| `region` | string | Sim | ex: `MY` | Código do mercado. |
| `photo_search_image_uri` | string | Sim | ex: `202606031816212EF5CF5E0D35121685B5` | O `image_uri` retornado em `photo_search` pela "Busca de Produtos por Imagem". |
| `photo_search_box_detection` | string | Sim | ex: `0.100000,0.100000,0.900000,0.900000` | O `box_detection` retornado em `photo_search` pela "Busca de Produtos por Imagem" (caixa `x1,y1,x2,y2` normalizada). |
| `offset` | string | Não | ex: `0` (default `0`) | Cursor/offset de paginação. Quando `has_more=1`, avance o `offset` para a próxima página. |
| `count` | string | Não | ex: `10` | Tamanho da página (qtd. de produtos por chamada). |
| `sk` | string | Não | ex: `paper` | Palavra-chave opcional; refina casando o nome do produto junto da semelhança visual. |

### Exemplo de chamada
```bash
curl -s "https://open.echotik.live/api/v3/realtime/product/photo-search/page?region=MY&photo_search_image_uri=202606031816212EF5CF5E0D35121685B5&photo_search_box_detection=0.100000,0.100000,0.900000,0.900000&offset=0&count=10&sk=paper" \
  -H "Authorization: Basic $TOKEN"
```

## Response

Envelope padrão: `{ code, message, data, requestId }` — `code = 0` + HTTP 200 = sucesso; `code != 0` ou HTTP 500 "Usage Limit Exceeded" = erro/cota. `code=500` em tempo-real = risk control → faça retry.

### Campos de `data`
| Campo | Tipo | O que é |
|---|---|---|
| `status_code` | inteiro | Status interno da busca (`0` = ok). |
| `e_com_items` | array | **Página de produtos** semelhantes. Cada item replica a estrutura de card de UI do TikTok; os dados de negócio estão em `e_com_items[].shop_view_data.init_state` (`product_id`, `author_id`, `cover`/`main_image`, `currency`, `original_price`, `discount_rate`, `page_name=photo_search`, etc.). |
| `cursor` | inteiro | Cursor da página atual (ex: `10`). |
| `has_more` | inteiro | `1`=há mais páginas, `0`=fim. |
| `extra` | objeto | (não documentado — provavelmente metadados extras da resposta.) |
| `log_pb` | objeto | Bloco de logging do TikTok (`impr_id`). |
| `global_doodle_config` | objeto | Config de UI global. Irrelevante para negócio. |
| `feedback_type` | string | Tipo de feedback (`e_com`). Irrelevante para negócio. |
| `filter_groups` | null/array | (não documentado — provavelmente grupos de filtro; `null` quando ausente.) |
| `sorters` | array | Opções de ordenação disponíveis. |
| `correct_info` | objeto | (não documentado — provavelmente correção/sugestão de termo de busca.) |
| `e_com_creator_items` | null/array | (não documentado — provavelmente criadores relacionados; `null` aqui.) |
| `result_type` | inteiro | Tipo de resultado (`1`). (não documentado — provavelmente discrimina produto/criador/loja.) |
| `gs_group` | array | (não documentado — provavelmente agrupamento de "general search"; vazio aqui.) |
| `e_com_shop_card_items` | null/array | (não documentado — provavelmente cards de loja; `null` aqui.) |
| `server_perf_info` | objeto | Telemetria de performance do servidor. Irrelevante para negócio. |
| `voucher_cards` | null/array | (não documentado — provavelmente cupons/vouchers.) |
| `search_query_info` | objeto | (não documentado — metadados da query; vazio no exemplo.) |
| `e_com_style` | objeto | Estilo de exibição (`display_single_column`, `discount_label_type`). UI. |
| `suggested_search` | null/array | (não documentado — sugestões de busca.) |
| `filter_groups_v2` | null/array | (não documentado — grupos de filtro v2.) |
| `template_name_versions` | string (JSON) | Versões de template de card (ex: `["photo_search_card@4"]`). |
| `quick_filter` | null/array | (não documentado — filtros rápidos.) |
| `rule_engine_runtime` | objeto | Telemetria do motor de regras de render. Irrelevante. |
| `top_e_com_items` | null/array | (não documentado — itens em destaque; `null` aqui.) |
| `is_non_personalized_search` | inteiro | (não documentado — `1` se busca não personalizada.) |
| `search_promotion_result` | objeto/null | (não documentado — resultado de promoções.) |
| `to_next_page_param` | string | Parâmetro opaco para a próxima página (estado de paginação do servidor). |
| `last_search_pid_list` | string (JSON) | Lista (serializada) dos `product_id` desta página. |
| `filter_origin_search_id` | string | ID de busca de origem do filtro. |
| `return_to_server_content` | string (JSON) | Payload opaco a reenviar para manter estado de paginação/ordenação. |

> Os dados úteis de produto vêm de `e_com_items[].shop_view_data.init_state`. Para dados estruturados completos, use o `product_id` na interface de detalhes de produto.

## Notas & gotchas
- Tempo-real: `code=500` → retry; sem QPS alto.
- **Endpoint em par:** sem o `photo_search_image_uri`/`photo_search_box_detection` da chamada `POST .../photo-search`, este endpoint não funciona (ambos são obrigatórios).
- `offset` é cursor, **não** `page_num`; preserve também `to_next_page_param`/`return_to_server_content`/`cursor` para paginação consistente.
- Resposta no formato de UI do TikTok: `init_state` traz muitos campos de tracking/render; filtre o que interessa (id, preço, moeda, imagem).

## Relevância para o SLEAG
- Completa a feature "buscar produto por imagem", paginando além dos 6 resultados iniciais.
- O `product_id` extraído conecta com detalhes/métricas em outro endpoint; planejar parse de `e_com_items[].shop_view_data.init_state` no `services/`.

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
  /api/v3/realtime/product/photo-search/page:
    get:
      summary: Image Search Paged Product Data - Real-Time Interface
      deprecated: false
      description: >-
        This interface is used in conjunction with the "Image Search for
        Products - Real-time Interface". The image_uri and box_detection
        returned by the photo_search method of the "Image Search for Products -
        Real-time Interface" are passed into this interface to obtain more data
        by pagination.
      tags:
        - Search
      parameters:
        - name: region
          in: query
          description: ''
          required: true
          example: MY
          schema:
            type: string
        - name: photo_search_image_uri
          in: query
          description: >-
            Fill in the image_uri field in photo_search from the results of
            "Image Search for Products"
          required: true
          example: 202606031816212EF5CF5E0D35121685B5
          schema:
            type: string
        - name: photo_search_box_detection
          in: query
          description: >-
            Fill in the box_detection field in photo_search from the "Image
            Search for Products" results
          required: true
          example: 0.100000,0.100000,0.900000,0.900000
          schema:
            type: string
        - name: offset
          in: query
          description: Pagination offset, default 0
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
        - name: sk
          in: query
          description: >-
            Keywords will affect the returned results, and the SK will be
            matched against product names.
          required: false
          example: paper
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
              example:
                code: 0
                message: ok
                data:
                  status_code: 0
                  e_com_items:
                    - type: 1
                      search_result_id: '1734496551418169080'
                      item_key: 202606032027563F9882A5702266B5B4F6_1734496551418169080_1
                      shop_view_data:
                        init_state:
                          product_id: '1734496551418169080'
                          product_id_str: '1734496551418169080'
                          author_id: '7494543761526721272'
                          currency: RM
                          cover: '<url>'
                          main_image: '<url>'
                          original_price: '3.00'
                          original_price_value: '3.00'
                          discount_rate: 67%
                          page_name: photo_search
                          # ... + centenas de flags de UI/tracking
                  cursor: 10
                  has_more: 1
                  log_pb:
                    impr_id: 202606032027563F9882A5702266B5B4F6
                  sorters: []
                  result_type: 1
                  template_name_versions: '["photo_search_card@4"]'
                  is_non_personalized_search: 0
                  to_next_page_param: '<opaco>'
                  last_search_pid_list: '<json serializado de product_ids>'
                  filter_origin_search_id: 202606032027563F9882A5702266B5B4F6
                  return_to_server_content: '<opaco>'
                requestId: b38fc747-9b3c-4af9-91e0-067b00154252
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

> **Nota sobre o spec original:** o exemplo publicado pela EchoTik incluía cada item de `e_com_items` com o objeto completo de render/tracking do app TikTok (`shop_view_data.init_state` com centenas de campos de UI e a árvore de `renderInfo`/`server_perf_info`). Esses trechos foram resumidos por placeholders para manter o documento legível; a estrutura, os caminhos de campos (`data.e_com_items[].shop_view_data.init_state`, `data.cursor`, `data.has_more`) e os valores-chave de exemplo foram preservados fielmente. Para o JSON bruto completo, consulte o opendoc (`https://opendocs.echotik.live/en/468104760e0`). **Atenção:** o `x-run-in-apifox` do spec original aponta para `api-459609219-run` (que é o de Product Search) — é um erro de copy-paste no spec da EchoTik; o ID correto deste endpoint é `468104760`.

</details>
