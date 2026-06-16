# Lista de Produtos da Loja — Interface em Tempo-real

> **Fonte:** opendoc EchoTik (https://opendocs.echotik.live/en/401153368e0) · **`GET /api/v3/realtime/seller/product/list`** · **Auth:** Basic · **Tipo:** Tempo-real

## O que faz

Retorna a lista de produtos de uma loja **em tempo real**, espelhando o feed nativo do TikTok Shop (estrutura "Store.Top_Product_Subpage_Feeds"). Diferente do endpoint offline (`echotik/seller/product/list`), os dados vêm direto da fonte e incluem preço atual, descontos/promoções, labels (frete grátis, flash sale, cupom), botões de compra e ratings. Usa **paginação por cursor** (`offset`/`next_scroll_param`), não por número de página.

⚠️ **Atenção (interface de tempo real):** não suporta QPS alto. Interfaces de tempo real frequentemente sofrem **risk control** do TikTok — ao receber **`code=500`**, faça **retry**. Evite chamadas em rajada; serialize/limite a taxa.

## Request

### Headers
| Header | Obrigatório | Valor |
|---|---|---|
| `Authorization` | Sim | `Basic base64(username:password)` (credenciais em echotik.live/platform/api-keys) |

### Query params
| Param | Tipo | Obrigatório | Valores / Default | O que faz |
|---|---|---|---|---|
| `seller_id` | string | **Sim** | id da loja (ex.: `7495045046260173699`) | Loja-alvo. |
| `offset` | string | Não | vazio na 1ª chamada; depois `next_scroll_param` | Cursor de paginação. Deixe em branco na primeira chamada; quando `data.has_more=true`, use o `data.next_scroll_param` retornado para buscar a próxima página. |
| `region` | string | **Sim** | `US`, `GB`, `DE`, `FR`, `IT`, `ID`, `MY`, `MX`, `PH`, `SG`, `ES`, `TH`, `VN`, `BR`, `JP`, `IE` | Região do mercado. Para o SLEAG: `BR`. |

### Exemplo de chamada
```bash
curl -s "https://open.echotik.live/api/v3/realtime/seller/product/list?seller_id=7495045046260173699&region=US" \
  -H "Authorization: Basic $TOKEN"

# próxima página:
curl -s "https://open.echotik.live/api/v3/realtime/seller/product/list?seller_id=7495045046260173699&region=US&offset=WzcwNzM5LCIxNzI5NTQ5NjE5NjE5NjY0NzcxIl0=" \
  -H "Authorization: Basic $TOKEN"
```

## Response

Envelope padrão: `{ code, message, data, requestId }` — `code = 0` + HTTP 200 = sucesso; `code != 0` ou HTTP 500 = erro/cota/risk control (neste endpoint, **`code=500` → retry**).

> A spec **não define o schema** (`properties: {}`); só há um exemplo. A estrutura abaixo foi inferida do exemplo da própria spec — campos podem variar conforme o que o TikTok devolve.

### Campos de `data`
| Campo | Tipo | O que é |
|---|---|---|
| `has_more` | boolean | Indica se há mais páginas. Se `true`, use `next_scroll_param` como `offset` na próxima chamada. |
| `next_scroll_param` | string | Cursor (base64) para a próxima página. |
| `product_list_map` | object | Mapa de listas de produtos por "cena" (scene). A chave observada é `Store.Top_Product_Subpage_Feeds.Common`, cujo valor tem `product_list` (array de produtos). |

### Campos de cada produto em `product_list[]`
| Campo | Tipo | O que é |
|---|---|---|
| `product_id` | string | Id do produto no TikTok Shop. |
| `status` | integer | Status do produto (provável `1` = ativo). (inferido do exemplo.) |
| `pdp_schema` | string | Deep link `aweme://ec/pdp?…` para abrir a página do produto (PDP) no app TikTok. |
| `cover.image` | object | Imagem de capa: `height`, `width`, `uri`, `url_list[]` (URLs CDN), `ratio`. |
| `title.title` | string | Título do produto (ex.: "Comfrt | Oversized Minimalist Hoodie"). |
| `price` | object | Bloco de preço: `sku_id`, `currency_name`/`currency_symbol`/`symbol_position`, `sale_price_decimal`/`origin_price_decimal`, `sale_price_format`/`origin_price_format`, `discount_format` (ex.: `59%`)/`discount_decimal`, e campos de formatação (`*_integer_part_format`, `*_decimal_part_format`, `decimal_point_symbol`). |
| `add_to_cart_button` | object | Botão "adicionar ao carrinho": `status`, `click_hint`, `button_text`. |
| `sku_ids` | string[] | Lista de ids de SKU (variações) do produto. |
| `seller_id` | string | Id da loja (eco do parâmetro). |
| `official_creator_id` | string | Id do criador/conta oficial vinculado ao produto. (inferido.) |
| `biz_type` | integer | Tipo de negócio do item. (inferido — provável segmentação interna do TikTok Shop.) |
| `source` | integer | Origem/fonte do item no feed. (inferido.) |
| `now_buy_button` | object | Botão "comprar agora": `status`, `jump_schema` (deep link), `button_text`. |
| `placement_labels` | array | Labels por posição (`placement`): selos como frete grátis (`type:8`), flash sale/"Limited time deal" (`type:4`), cupom "Extra X% off" (`type:6`), cada um com `icon` (light/dark), `da_info` (JSON com metadados de promoção), e `feature[]` (ex.: contadores de flash sale, `countdown_*`). |
| `tag_list` | array | Tags exibidas: rating (`tag_type:302`, ex.: `4.7` + `extra_text` "16.8K"), volume vendido (`tag_type:301`, ex.: "196.5K sold"), e outros. |
| `log_extra` | string | **String JSON** com metadados de tracking/estratégia (review_cnt, seller_product_id, sold_count_strategy etc.). Precisa de parse. |
| `bcm_standard_track` | object | Parâmetros de rastreamento (`track_param`/`chain_param` com `bcm_multiverse_id`). |
| `author_id` | string | Id do autor/criador associado. (inferido.) |
| `selling_point` | array | Pontos de venda (ex.: "9.2K+ repurchased") com `augment_code`, `count_val` e metadados para algoritmo. |
| `property_map` | object | Configuração de UI do card (irmão de `product_list`, no nível da cena): `add_cart_property`, `busines_config`, `buy_now_property`, `price_property`, `promotion_label_property`, `rate_property`, `tag_property`, `title_property` — todos **strings JSON** de estilização do feed nativo. |

## Notas & gotchas
- **Tempo real + risk control**: `code=500` → **retry** (com backoff). Não fazer QPS alto nem rajadas.
- **Paginação por cursor**: ignore `page_num`/`page_size` (não existem aqui); use `offset` = `next_scroll_param` enquanto `has_more=true`.
- **Schema não tipado** na spec — a forma do payload espelha o feed do TikTok e pode mudar sem aviso. Programe defensivamente (campos opcionais).
- Muitos campos são **strings JSON aninhadas** (`log_extra`, `da_info`, `property_map.*`) — exigem parse adicional.
- Ids (`product_id`, `seller_id`, `sku_id`s) sempre como **string**.
- URLs de imagem em `url_list` são **CDN com query assinada** — podem expirar.
- `region` aceita lista fixa de 16 mercados, incluindo `BR`.

## Relevância para o SLEAG
- Permite mostrar o **catálogo ao vivo** de uma loja (preço atual, desconto, flash sale, frete grátis, rating, "X sold") — ideal para a página de loja em tempo real, validando o que o cliente vê no app.
- Complementa o endpoint offline `echotik/seller/product/list`: offline traz métricas históricas de GMV/vendas; este traz o **estado de venda agora** (preço/promo/selos).
- `pdp_schema`/`now_buy_button.jump_schema` dão links diretos para o produto no TikTok.

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
  /api/v3/realtime/seller/product/list:
    get:
      summary: Shop's product list - Real-time interface
      deprecated: false
      description: >-
        Provide a real-time store product list interface. Note: This interface
        does not support high QPS. Real-time interfaces often encounter risk
        control. If a code=500 error is encountered, please retry.
      tags:
        - Shop
      parameters:
        - name: seller_id
          in: query
          description: ''
          required: true
          example: '7495045046260173699'
          schema:
            type: string
        - name: offset
          in: query
          description: >-
            Pagination parameters. For the first time, you can leave it blank
            without passing. When the returned has_more=true, use
            next_scroll_param for the next pagination.
          required: false
          schema:
            type: string
        - name: region
          in: query
          description: >-
            Supported regions: "US", "GB", "DE", "FR", "IT", "ID", "MY", "MX",
            "PH", "SG", "ES", "TH", "VN", "BR", "JP", "IE"
          required: true
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
                  has_more: true
                  next_scroll_param: WzcwNzM5LCIxNzI5NTQ5NjE5NjE5NjY0NzcxIl0=
                  product_list_map:
                    Store.Top_Product_Subpage_Feeds.Common:
                      product_list:
                        - product_id: '1729505773514822531'
                          status: 1
                          pdp_schema: >-
                            aweme://ec/pdp?biz_type=0&fullScreen=true&orderRequestParams=%7B%7D&requestParams=%7B%22product_id%22%3A%5B%221729505773514822531%22%5D%2C%22ab_img%22%3Afalse%2C%22traffic_signature%22%3A%22%7B%5C%22scene%5C%22%3A%5C%22Default.Store.Product_Page_Feeds%5C%22%7D%22%7D&visitReportParams=%7B%22chain_key%22%3A%22%22%2C%22material_id%22%3A%221729505773514822531%22%2C%22material_type%22%3A1%2C%22seller_id%22%3A%227495045046260173699%22%7D
                          cover:
                            image:
                              height: 500
                              width: 500
                              uri: >-
                                tos-useast5-i-omjb5zjo8w-tx/62bf5e634cf146f5a127dc42a41f334b
                              url_list:
                                - >-
                                  https://p16-oec-general-useast5.ttcdn-us.com/tos-useast5-i-omjb5zjo8w-tx/62bf5e634cf146f5a127dc42a41f334b~tplv-fhlh96nyum-crop-webp:500:500.webp?dr=12190&t=555f072d&ps=933b5bde&shp=837c8b87&shcp=9b759fb9&idc=useast5&from=2205977479
                              ratio: 1
                          title:
                            title: Comfrt | Oversized Minimalist Hoodie
                          price:
                            sku_id: '1731762826984002435'
                            currency_name: USD
                            currency_symbol: $
                            symbol_position: 1
                            sale_price_decimal: '48.99'
                            origin_price_decimal: '120'
                            sale_price_format: '48.99'
                            origin_price_format: '120.00'
                            discount_format: 59%
                            discount_decimal: '0.59'
                            show_currency_space: false
                            currency_show_mode: 1
                            sale_price_integer_part_format: '48'
                            sale_price_decimal_part_format: '99'
                            decimal_point_symbol: .
                          add_to_cart_button:
                            status: 1
                            click_hint: ''
                            button_text: Add to cart
                          sku_ids:
                            - '1729505733171975043'
                            - '1729505733172040579'
                            - '1729505733172106115'
                            - '1729505733172171651'
                            - '1729505733172237187'
                            - '1729505733172302723'
                            - '1729505733172368259'
                            - '1729625823329817475'
                            - '1729625823329883011'
                            - '1729625823329948547'
                            - '1729625823330014083'
                            - '1729625823330079619'
                            - '1729625823330145155'
                            - '1729625823330210691'
                            - '1729505733172433795'
                            - '1729505733172499331'
                            - '1729505733172564867'
                            - '1729505733172630403'
                            - '1729505733172695939'
                            - '1729505733172761475'
                            - '1729505733172827011'
                            - '1729505733172892547'
                            - '1729505733172958083'
                            - '1729505733173023619'
                            - '1729505733173089155'
                            - '1729505733173154691'
                            - '1729505733173220227'
                            - '1729505733173285763'
                            - '1729505733173351299'
                            - '1729505733173416835'
                            - '1729505733173482371'
                            - '1729505733173547907'
                            - '1729505733173613443'
                            - '1729505733173678979'
                            - '1729505733173744515'
                            - '1729505733173810051'
                            - '1729505733173875587'
                            - '1729505739168650115'
                            - '1729505739168715651'
                            - '1729505739168781187'
                            - '1729505739168846723'
                            - '1729505739168912259'
                            - '1730264217989845891'
                            - '1730264217989911427'
                            - '1730264217989976963'
                            - '1730264217990042499'
                            - '1730264217990108035'
                            - '1730264217990173571'
                            - '1730264217990239107'
                            - '1730264217990304643'
                            - '1730264217990370179'
                            - '1730264217990435715'
                            - '1730264217990501251'
                            - '1730264217990566787'
                            - '1730264217990632323'
                            - '1730264217990697859'
                            - '1730264217990763395'
                            - '1730264217990828931'
                            - '1730264217990894467'
                            - '1730264217990960003'
                            - '1730264217991025539'
                            - '1730264217991091075'
                            - '1730264217991156611'
                            - '1730376424359826307'
                            - '1730376424359891843'
                            - '1730376424359957379'
                            - '1730376424360022915'
                            - '1730376424360088451'
                            - '1730376424360153987'
                            - '1730376424360219523'
                            - '1730434832387052419'
                            - '1730434832387117955'
                            - '1730434832387183491'
                            - '1730434832387249027'
                            - '1730434832387314563'
                            - '1730434832387380099'
                            - '1730434832387445635'
                            - '1730434832387511171'
                            - '1730434832387576707'
                            - '1730434832387642243'
                            - '1730434832387707779'
                            - '1730434832387773315'
                            - '1730434832387838851'
                            - '1730434832387904387'
                            - '1731018209643697027'
                            - '1731018209643762563'
                            - '1731018209643828099'
                            - '1731018209643893635'
                            - '1731018209643959171'
                            - '1731018209644024707'
                            - '1731018209644090243'
                            - '1731124566721991555'
                            - '1731124566722057091'
                            - '1731124566722122627'
                            - '1731124566722188163'
                            - '1731124566722253699'
                            - '1731124566722319235'
                            - '1731124566722384771'
                            - '1731124566722450307'
                            - '1731124566722515843'
                            - '1731124566722581379'
                            - '1731124566722646915'
                            - '1731124566722712451'
                            - '1731124566722777987'
                            - '1731124566722843523'
                            - '1731124566722909059'
                            - '1731124566722974595'
                            - '1731124566723040131'
                            - '1731124566723105667'
                            - '1731124566723171203'
                            - '1731124566723236739'
                            - '1731124566723302275'
                            - '1731257005913379715'
                            - '1731257005913445251'
                            - '1731257005913510787'
                            - '1731257005913576323'
                            - '1731257005913641859'
                            - '1731257005913707395'
                            - '1731257005913772931'
                            - '1731257005913838467'
                            - '1731257005913904003'
                            - '1731256999871550339'
                            - '1731256999871615875'
                            - '1731256999871681411'
                            - '1731256999871746947'
                            - '1731256999871812483'
                            - '1731327530024735619'
                            - '1731327530024801155'
                            - '1731327530024866691'
                            - '1731327530024932227'
                            - '1731327530024997763'
                            - '1731327530025063299'
                            - '1731327530025128835'
                            - '1731443038381970307'
                            - '1731443038382035843'
                            - '1731443038382101379'
                            - '1731443038382166915'
                            - '1731443039974757251'
                            - '1731443039974822787'
                            - '1731443039974888323'
                            - '1731443039974953859'
                            - '1731443039975019395'
                            - '1731443039975084931'
                            - '1731443039975150467'
                            - '1731443039975216003'
                            - '1731443039975281539'
                            - '1731443039975347075'
                            - '1731443039975412611'
                            - '1731443039975478147'
                            - '1731443039975543683'
                            - '1731443039975609219'
                            - '1731443039975674755'
                            - '1731443039975740291'
                            - '1731443039975805827'
                            - '1731726798583403395'
                            - '1731726798583468931'
                            - '1731726798583534467'
                            - '1731726798583600003'
                            - '1731726798583665539'
                            - '1731726798583731075'
                            - '1731726798583796611'
                            - '1731726798583862147'
                            - '1731726798583927683'
                            - '1731726798583993219'
                            - '1731726798584058755'
                            - '1731726798584124291'
                            - '1731726798584189827'
                            - '1731726798584255363'
                            - '1731762826983609219'
                            - '1731762826983674755'
                            - '1731762826983740291'
                            - '1731762826983805827'
                            - '1731762826983871363'
                            - '1731762826983936899'
                            - '1731762826984002435'
                          seller_id: '7495045046260173699'
                          official_creator_id: '108068417546379264'
                          biz_type: 0
                          source: 5
                          now_buy_button:
                            status: 1
                            jump_schema: >-
                              aweme://ec/pdp?biz_type=0&fullScreen=true&orderRequestParams=%7B%7D&requestParams=%7B%22product_id%22%3A%5B%221729505773514822531%22%5D%2C%22ab_img%22%3Afalse%2C%22traffic_signature%22%3A%22%7B%5C%22scene%5C%22%3A%5C%22Default.Store.Product_Page_Feeds%5C%22%7D%22%7D&visitReportParams=%7B%22chain_key%22%3A%22%22%2C%22material_id%22%3A%221729505773514822531%22%2C%22material_type%22%3A1%2C%22seller_id%22%3A%227495045046260173699%22%7D
                            button_text: Buy
                          placement_labels:
                            - placement: 3
                              labels:
                                - id: '8'
                                  type: 8
                                  text: Free shipping
                                  icon:
                                    light_icon:
                                      height: 800
                                      width: 800
                                      mimetype: ''
                                      uri: >-
                                        tos-maliva-i-5i1jvf5urr-us/free_shipping_strong.png
                                      url_list:
                                        - >-
                                          https://p16-oec-general.ttcdn-us.com/tos-maliva-i-5i1jvf5urr-us/free_shipping_strong.png~tplv-fhlh96nyum-resize-png:800:800.png?dr=12184&t=555f072d&ps=933b5bde&shp=cde50ccb&shcp=d9d491bf&idc=useast5&from=3454340299
                                        - >-
                                          https://p19-oec-general.ttcdn-us.com/tos-maliva-i-5i1jvf5urr-us/free_shipping_strong.png~tplv-fhlh96nyum-resize-png:800:800.png?dr=12184&t=555f072d&ps=933b5bde&shp=cde50ccb&shcp=d9d491bf&idc=useast5&from=3454340299
                                    dark_icon:
                                      height: 800
                                      width: 800
                                      mimetype: ''
                                      uri: >-
                                        tos-maliva-i-5i1jvf5urr-us/free_shipping_strong_dark.png
                                      url_list:
                                        - >-
                                          https://p16-oec-general.ttcdn-us.com/tos-maliva-i-5i1jvf5urr-us/free_shipping_strong_dark.png~tplv-fhlh96nyum-resize-png:800:800.png?dr=12184&t=555f072d&ps=933b5bde&shp=cde50ccb&shcp=d9d491bf&idc=useast5&from=3454340299
                                        - >-
                                          https://p19-oec-general.ttcdn-us.com/tos-maliva-i-5i1jvf5urr-us/free_shipping_strong_dark.png~tplv-fhlh96nyum-resize-png:800:800.png?dr=12184&t=555f072d&ps=933b5bde&shp=cde50ccb&shcp=d9d491bf&idc=useast5&from=3454340299
                                  default_style: 11
                                  status: 0
                                  claimed_status: 0
                                  is_show_icon: true
                                  da_info: >-
                                    {"label_type":"PRODUCT_FREE_SHIPPING","activity_name":"8","has_icon":"true","ranking":"1","promotion_id":"-999","is_free_shipping":"1","delivery_tag":"free_shipping","placement":"FREE_SHIPPING"}
                                  feature:
                                    - property_name: split_free_shipping
                                      property_value: '1'
                            - placement: 0
                              labels:
                                - id: '8'
                                  type: 8
                                  text: Free shipping
                                  icon:
                                    light_icon:
                                      height: 800
                                      width: 800
                                      mimetype: ''
                                      uri: >-
                                        tos-maliva-i-5i1jvf5urr-us/free_shipping_strong.png
                                      url_list:
                                        - >-
                                          https://p16-oec-general.ttcdn-us.com/tos-maliva-i-5i1jvf5urr-us/free_shipping_strong.png~tplv-fhlh96nyum-resize-png:800:800.png?dr=12184&t=555f072d&ps=933b5bde&shp=cde50ccb&shcp=d9d491bf&idc=useast5&from=3454340299
                                        - >-
                                          https://p19-oec-general.ttcdn-us.com/tos-maliva-i-5i1jvf5urr-us/free_shipping_strong.png~tplv-fhlh96nyum-resize-png:800:800.png?dr=12184&t=555f072d&ps=933b5bde&shp=cde50ccb&shcp=d9d491bf&idc=useast5&from=3454340299
                                    dark_icon:
                                      height: 800
                                      width: 800
                                      mimetype: ''
                                      uri: >-
                                        tos-maliva-i-5i1jvf5urr-us/free_shipping_strong_dark.png
                                      url_list:
                                        - >-
                                          https://p16-oec-general.ttcdn-us.com/tos-maliva-i-5i1jvf5urr-us/free_shipping_strong_dark.png~tplv-fhlh96nyum-resize-png:800:800.png?dr=12184&t=555f072d&ps=933b5bde&shp=cde50ccb&shcp=d9d491bf&idc=useast5&from=3454340299
                                        - >-
                                          https://p19-oec-general.ttcdn-us.com/tos-maliva-i-5i1jvf5urr-us/free_shipping_strong_dark.png~tplv-fhlh96nyum-resize-png:800:800.png?dr=12184&t=555f072d&ps=933b5bde&shp=cde50ccb&shcp=d9d491bf&idc=useast5&from=3454340299
                                  default_style: 11
                                  status: 0
                                  claimed_status: 0
                                  is_show_icon: true
                                  da_info: >-
                                    {"is_free_shipping":"1","label_type":"PRODUCT_FREE_SHIPPING","promotion_id":"-999","activity_name":"8","has_icon":"true","delivery_tag":"free_shipping","placement":"NOT_GROUP","ranking":"1"}
                                  feature:
                                    - property_name: split_free_shipping
                                      property_value: '1'
                                - id: '7584553234035984142'
                                  type: 4
                                  text: Limited time deal
                                  default_style: 12
                                  status: 102
                                  claimed_status: 0
                                  is_show_icon: false
                                  da_info: >-
                                    {"promotion_id":"7584553234035984142","has_icon":"false","flash_sale_cost_role":"2","limited_time_deal":"1","label_type":"FLASH_SALE","activity_name":"4","placement":"NOT_GROUP","ranking":"2"}
                                  feature:
                                    - property_name: limited_time_deal
                                      property_value: 'true'
                                    - property_name: seller_non_live_flash_sale
                                      property_value: 'true'
                                    - property_name: metric_custom
                                      property_value: seller_flash_sale
                                    - property_name: countdown
                                      property_value: '173770'
                                    - property_name: countdown_start_time
                                      property_value: '1767585660000'
                                    - property_name: countdown_end_time
                                      property_value: '1767844800000'
                                    - property_name: activity_price
                                      property_value: ''
                                    - property_name: is_seller_flash_sale
                                      property_value: '1'
                                - id: '7589319397186275085'
                                  type: 6
                                  text: Extra 5% off
                                  default_style: 8
                                  status: 0
                                  claimed_status: 0
                                  da_info: >-
                                    {"label_type":"VOUCHER","activity_name":"6","has_icon":"false","coupon_type_info":"{\"business_type\":\"min_spend_discount\"}","coupon_cost_role":"seller","shop_id":"7495045046260173699","promotion_id":"7589319397186275085","placement":"NOT_GROUP","ranking":"3"}
                                  feature:
                                    - property_name: discount_rate
                                      property_value: '3.98040416411513'
                                    - property_name: metric_custom
                                      property_value: short_text
                            - placement: 1
                              labels:
                                - id: '7584553234035984142'
                                  type: 4
                                  text: Limited time deal
                                  default_style: 12
                                  status: 102
                                  claimed_status: 0
                                  is_show_icon: false
                                  da_info: >-
                                    {"has_icon":"false","promotion_id":"7584553234035984142","placement":"DEFAULT","ranking":"1","activity_name":"4","limited_time_deal":"1","flash_sale_cost_role":"2","label_type":"FLASH_SALE"}
                                  feature:
                                    - property_name: limited_time_deal
                                      property_value: 'true'
                                    - property_name: seller_non_live_flash_sale
                                      property_value: 'true'
                                    - property_name: metric_custom
                                      property_value: seller_flash_sale
                                    - property_name: countdown
                                      property_value: '173770'
                                    - property_name: countdown_start_time
                                      property_value: '1767585660000'
                                    - property_name: countdown_end_time
                                      property_value: '1767844800000'
                                    - property_name: activity_price
                                      property_value: ''
                                    - property_name: is_seller_flash_sale
                                      property_value: '1'
                                - id: '7589319397186275085'
                                  type: 6
                                  text: Extra 5% off
                                  default_style: 8
                                  status: 0
                                  claimed_status: 0
                                  da_info: >-
                                    {"coupon_type_info":"{\"business_type\":\"min_spend_discount\"}","shop_id":"7495045046260173699","promotion_id":"7589319397186275085","ranking":"2","activity_name":"6","coupon_cost_role":"seller","placement":"DEFAULT","label_type":"VOUCHER","has_icon":"false"}
                                  feature:
                                    - property_name: discount_rate
                                      property_value: '3.98040416411513'
                                    - property_name: metric_custom
                                      property_value: short_text
                          tag_list:
                            - tag_type: 302
                              text: '4.7'
                              extra_text: 16.8K
                            - tag_type: 301
                              text: 196.5K sold
                            - tag_type: 326
                              text: '1'
                          log_extra: >-
                            {"rating_strategy":{"review_cnt":"16764"},"seller_product_id":"1729505773514822531","platform_product_id":"","seller_seller_id":"7495045046260173699","seller_shop_id":"7495045046260173699","title_strategy":{"title_tactics_type":0},"is_platform_product":0,"platform_shop_id":"","seller_sku_id":"1729505733171975043","sku_id":"1729505733171975043","platform_sku_id":"","cover_strategy":{"image_tactics_type":0,"is_smart_crop":false},"sale_modes":"[]","platform_seller_id":"","sold_count_strategy":{"volume_type":"sold","volume":"196487"}}
                          bcm_standard_track:
                            track_param:
                              bcm_multiverse_id: 202601060343502787084010020000000d443a767ef6691b
                            chain_param:
                              bcm_multiverse_id: 202601060343502787084010020000000d443a767ef6691b
                          author_id: '108068417546379264'
                          selling_point:
                            - type: 67001
                              item_list:
                                - text: 9.2K+ repurchased
                                  augment_code: repurchase_num_in_180d
                                  selling_point_extra_info_for_algo:
                                    category: statistic
                                    type: repurchase_num_in_180d
                                    count_val: 9241
                      property_map:
                        add_cart_property: >-
                          [{"button_style":"icon_round","background_color":"grey","icon_color":"black"}]
                        busines_config: >-
                          {"needAddCart":true,"needBuyNow":true,"subContainerClass":"","needTagsLineBetween":true}
                        buy_now_property: '[{"button_action":"buy_now","button_style":"normal"}]'
                        price_property: >-
                          [{"type":"UNIT","size":"P2","arrangement":"VERTICAL","salePriceColor":"TextPrimary","originalPriceShowColor":"TextQuaternary","discountShowType":"8","discountShowBesidePrice":true,"discountBorderRadius":"8px","salePriceColorWithDiscount":"","hidePricePrefix":false,"preSize":"P2","afterSize":"P5"}]
                        promotion_label_property: >-
                          {"icon_config":{"4":{"main_icon":{"dark_icon":{"url_list":["https://p16-oec-general.ttcdn-us.com/tos-maliva-i-o3syd03w52-us/flash_fill_icon_dark_20250430.png~tplv-fhlh96nyum-resize-png:800:800.png?dr=12184&t=555f072d&ps=933b5bde&shp=cde50ccb&shcp=d9d491bf&idc=useast5&from=3454340299"]},"light_icon":{"url_list":["https://p16-oec-general.ttcdn-us.com/tos-maliva-i-o3syd03w52-us/flash_fill_icon_light_20250430.png~tplv-fhlh96nyum-resize-png:800:800.png?dr=12184&t=555f072d&ps=933b5bde&shp=cde50ccb&shcp=d9d491bf&idc=useast5&from=3454340299"]}}},"8":{"main_icon":{"dark_icon":{"url_list":[""]},"light_icon":{"url_list":[""]}}},"31":{"redirect":8},"32":{"redirect":8},"34":{"redirect":8},"35":{"redirect":8},"66":{"redirect":8},"67":{"redirect":8}},"label_config":{"4":{"theme":"Primary","textFont":13,"bgColor":{"dark":"transparent","light":"transparent"},"textColor":{"dark":"#ff576f","light":"#e10543"},"countdownFont":13,"countdownTime":86400000,"countDownNumberWidth":"16px","countDownDividerWidth":"3px","countDownMarginLeft":"3px","gap":3,"padding":0,"style":100},"6":{"redirect":4},"7":{"redirect":4},"8":{"theme":"Cyan","textFont":13,"bgColor":{"dark":"transparent","light":"transparent"},"textColor":{"dark":"#007B7B","light":"#007B7B"},"gap":3,"padding":0,"style":100,"rtlIcon":true},"10":{"redirect":4},"11":{"redirect":4},"18":{"redirect":4},"23":{"redirect":4},"25":{"redirect":4},"26":{"redirect":4},"28":{"redirect":4},"29":{"redirect":4},"31":{"redirect":8},"32":{"redirect":8},"34":{"redirect":8},"35":{"redirect":8},"37":{"redirect":4},"46":{"redirect":4},"55":{"redirect":4},"57":{"redirect":4},"66":{"redirect":8},"67":{"redirect":8},"70":{"redirect":4},"115":{"redirect":4},"10000":{"theme":"Primary","textFont":13,"bgColor":{"dark":"transparent","light":"transparent"},"textColor":{"dark":"#ff576f","light":"#e10543"},"countdownFont":13,"countdownTime":86400000,"gap":3,"padding":0,"style":100,"textMaxLine":3}}}
                        rate_property: >-
                          [{"rating_ui_style":"five_star","rating_text_display_type":"before_star"}]
                        tag_property: ''
                        title_property: '[{"title_lines":2}]'
                requestId: fe5af561-2232-418c-aa5a-0b4b8bda678e
          headers: {}
          x-apifox-name: 成功
      security:
        - basic: []
      x-apifox-folder: Shop
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/7319100/apis/api-401153368-run
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
