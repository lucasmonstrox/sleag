# Busca de Produtos por Imagem — Interface em Tempo-real

> **Fonte:** opendoc EchoTik (https://opendocs.echotik.live/en/468103638e0) · **`POST /api/v3/realtime/product/photo-search`** · **Auth:** Basic · **Tipo:** Tempo-real

## O que faz

Recebe uma imagem (base64) e retorna produtos do TikTok Shop visualmente semelhantes. É uma "Real-time Interface", sujeita a risk control.

**Funciona EM PAR** com a "Busca de Produtos por Imagem — Dados Paginados" (`GET /api/v3/realtime/product/photo-search/page`). O fluxo é:

1. Você chama **este** endpoint enviando a imagem. Ele retorna **6 produtos aleatórios** em `e_com_items` (sem paginação aqui) **e**, em `data.photo_search`, dois valores-chave: `image_uri` e `box_detection`.
2. Para obter mais produtos, você guarda esse `image_uri` e `box_detection` e os passa para o endpoint paginado (`.../photo-search/page`), que então pagina os resultados via `offset`.

Ou seja: este endpoint "abre a sessão" de busca por imagem; o endpoint par a "continua/pagina".

## Request

### Headers
| Header | Obrigatório | Valor |
|---|---|---|
| `Authorization` | Sim | `Basic base64(username:password)` (credenciais em echotik.live/platform/api-keys) |
| `Content-Type` | Sim | `application/json` (corpo com `image_base64`) |

### Query params
| Param | Tipo | Obrigatório | Valores / Default | O que faz |
|---|---|---|---|---|
| `region` | string | Sim | ex: `MY` (ex. do doc: "such as US") | Código do mercado. |
| `sk` | string | Não | termo livre | Palavra-chave opcional; refina os resultados casando o nome do produto junto da semelhança visual. |

### Request body (`application/json`)
| Campo | Tipo | Obrigatório | O que é |
|---|---|---|---|
| `image_base64` | string | Sim | Imagem em base64 **sem** o prefixo `data:image/jpeg;base64,` (apenas o conteúdo). Máx. 2MB. Formatos: png, jpg, jpeg, webp. |

### Exemplo de chamada
```bash
curl -s -X POST "https://open.echotik.live/api/v3/realtime/product/photo-search?region=MY&sk=notebook" \
  -H "Authorization: Basic $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"image_base64":"<conteudo-base64-sem-prefixo>"}'
```

## Response

Envelope padrão: `{ code, message, data, requestId }` — `code = 0` + HTTP 200 = sucesso; `code != 0` ou HTTP 500 "Usage Limit Exceeded" = erro/cota. `code=500` em tempo-real = risk control → faça retry.

### Campos de `data`
| Campo | Tipo | O que é |
|---|---|---|
| `status_code` | inteiro | Código de status interno da busca (`0` = ok). |
| `e_com_items` | array | **Os ~6 produtos** retornados (aleatórios). Cada item replica a estrutura de card de UI do TikTok (ver abaixo). |
| `photo_search` | objeto | **Bloco-chave para paginar.** Contém `image_uri` e `box_detection`. |
| `photo_search.image_uri` | string | Identificador da imagem indexada (ex: `202606032021111B172141F1D85DCC3784`). Reenvie como `photo_search_image_uri` no endpoint paginado. |
| `photo_search.box_detection` | array<string> | Caixa(s) de detecção do objeto na imagem, no formato `x1,y1,x2,y2` normalizado (ex: `0.100000,0.100000,0.900000,0.900000`). Reenvie como `photo_search_box_detection` no endpoint paginado. |
| `e_com_style` | objeto | Estilo de exibição (`display_single_column`, `discount_label_type`). UI; irrelevante para negócio. |
| `voucher_cards` | null/array | (não documentado — provavelmente cards de cupom/voucher; `null` quando ausente.) |
| `search_query_info` | objeto | (não documentado — provavelmente metadados da query; vazio no exemplo.) |
| `suggested_search` | null/array | (não documentado — provavelmente sugestões de busca relacionadas.) |
| `filter_groups_v2` | null/array | (não documentado — provavelmente grupos de filtro disponíveis.) |
| `template_name_versions` | string (JSON) | Versões de template de card usadas (ex: `["photo_search_card@4"]`). |
| `quick_filter` | null/array | (não documentado — provavelmente filtros rápidos da UI.) |
| `rule_engine_runtime` | objeto | Telemetria do motor de regras de render. Irrelevante para negócio. |
| `top_e_com_items` | null/array | (não documentado — provavelmente itens em destaque no topo; `null` quando ausente.) |
| `is_non_personalized_search` | inteiro | (não documentado — provavelmente `1` se a busca não foi personalizada.) |
| `search_promotion_result` | objeto/null | (não documentado — provavelmente resultado de promoções aplicadas.) |

#### Cada item de `e_com_items[]`
| Campo | Tipo | O que é |
|---|---|---|
| `type` | inteiro | Tipo do item (`1` = produto). |
| `search_result_id` | string | ID do resultado = `product_id` do produto. |
| `item_key` | string | Chave única do item (combina impr_id + product_id). |
| `shop_view_data` | objeto | Dados de render do card. O essencial está em `shop_view_data.init_state`. |
| `shop_view_data.init_state` | objeto | Campos de negócio do produto: `product_id`/`product_id_str`, `author_id` (loja), `cover`/`main_image` (URL), `currency` (ex: `RM`), `original_price`/`original_price_value`, `discount_rate`, `entrance_form`, `impr_id`, `page_name` (= `photo_search`), além de dezenas de flags de UI/tracking. É daqui que se extrai produto, preço e imagem. |

> Os dados úteis de produto estão em `e_com_items[].shop_view_data.init_state` (id, preço, moeda, imagem). Para dados estruturados completos, use o `product_id` na interface de detalhes de produto.

## Notas & gotchas
- Tempo-real: `code=500` → retry; sem QPS alto.
- **Endpoint em par:** guarde sempre `photo_search.image_uri` e `photo_search.box_detection` — são obrigatórios no endpoint paginado para ver mais que os 6 produtos iniciais.
- `image_base64` **sem** prefixo `data:...;base64,`. Limite 2MB; png/jpg/jpeg/webp.
- Os 6 itens retornados são aleatórios; não espere ordenação estável aqui.
- `box_detection` é um array (pode haver mais de uma caixa); ao paginar, normalmente reenvia-se a string da caixa escolhida.

## Relevância para o TIKSPY
- Habilita a feature "buscar produto por imagem" (upload de foto → produtos semelhantes no TikTok Shop). Provável feature futura.
- Em par com o endpoint paginado para listar muitos resultados; o `product_id` extraído conecta com detalhes/métricas.

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
  /api/v3/realtime/product/photo-search:
    post:
      summary: Image Search for Products - Real-time Interface
      deprecated: false
      description: >-
        This interface is used together with the "Image Search Paged Product
        Data - Real-Time Interface". The current interface does not support
        pagination parameters, and six distinct commodities are randomly
        returned each time in e_com_items. To retrieve more commodity data,
        record the image_uri and box_detection returned by photo_search of this
        interface for subsequent data acquisition.
      tags:
        - Search
      parameters:
        - name: region
          in: query
          description: regions, such as the US
          required: true
          example: MY
          schema:
            type: string
        - name: sk
          in: query
          description: >-
            Optional field. This keyword affects the returned results and
            enables product name matching based on image similarity.
          required: false
          schema:
            type: string
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                image_base64:
                  type: string
                  description: >-
                    There is no need to pass in data:image/jpeg;base64,. Refer
                    to the examples for details.

                    Base64 image. Max size 2MB. Supported formats: png, jpg,
                    jpeg, webp
              required:
                - image_base64
              x-apifox-orders:
                - image_base64
            example:
              image_base64: '<conteudo-base64-sem-prefixo; truncado neste doc>'
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
                      item_key: 202606032021111B172141F1D85DCC3784_1734496551418169080_1
                      shop_view_data:
                        init_state:
                          product_id: '1734496551418169080'
                          author_id: '<shop_id>'
                          currency: RM
                          cover: '<url>'
                          main_image: '<url>'
                          original_price: '3.00'
                          page_name: photo_search
                          # ... + dezenas de flags de UI/tracking
                  e_com_style:
                    display_single_column: false
                    discount_label_type: 2
                  photo_search:
                    image_uri: 202606032021111B172141F1D85DCC3784
                    box_detection:
                      - 0.100000,0.100000,0.900000,0.900000
                  suggested_search: null
                  filter_groups_v2: null
                  template_name_versions: '["photo_search_card@4"]'
                  quick_filter: null
                  top_e_com_items: null
                  is_non_personalized_search: 0
                requestId: '<uuid>'
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

> **Nota sobre o spec original:** o exemplo publicado pela EchoTik incluía (a) o `image_base64` de exemplo com ~150 mil caracteres e (b) cada item de `e_com_items` com o objeto completo de render/tracking do app TikTok (`shop_view_data.init_state` com centenas de campos de UI e a árvore de `renderInfo`). Esses trechos foram resumidos por placeholders para manter o documento legível; a estrutura, os caminhos de campos (`data.e_com_items[].shop_view_data.init_state`, `data.photo_search.image_uri`, `data.photo_search.box_detection`) e os valores-chave de exemplo foram preservados fielmente. Para o JSON bruto completo, consulte o opendoc (`https://opendocs.echotik.live/en/468103638e0`). **Atenção:** o `x-run-in-apifox` do spec original aponta para `api-459609219-run` (que é o de Product Search) — é um erro de copy-paste no spec da EchoTik; o ID correto deste endpoint é `468103638`.

</details>
