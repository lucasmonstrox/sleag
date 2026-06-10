# Ranking de Lojas — EchoTik

> **Fonte:** opendoc EchoTik (https://opendocs.echotik.live/en/372672181e0) · **`GET /api/v3/echotik/seller/ranklist`** · **Auth:** Basic · **Tipo:** Offline (T+1)

## O que faz

Retorna o **ranking de lojas** de um período (diário/semanal/mensal) para uma região e data, com os valores sendo o **dado incremental do período corrente** (não acumulado histórico). Permite filtrar por categoria e origem (local/cross-border) e escolher o critério de ranqueamento (vendas ou nº de criadores). É o endpoint para "as lojas que mais venderam/cresceram no período X".

- As listas semanais são atualizadas toda **segunda-feira**; as mensais, no **primeiro dia de cada mês**.
- O texto original da EchoTik menciona `product_rank_field` (1 = Bestselling, 2 = Recommended), mas o parâmetro real deste endpoint de loja é **`seller_rank_field`** (ver abaixo) — provável resquício de copiar-e-colar da doc de produtos.

## Request

### Headers
| Header | Obrigatório | Valor |
|---|---|---|
| `Authorization` | Sim | `Basic base64(username:password)` (credenciais em echotik.live/platform/api-keys) |

### Query params
| Param | Tipo | Obrigatório | Valores / Default | O que faz |
|---|---|---|---|---|
| `date` | string | **Sim** | `yyyy-MM-dd` | Data de referência do ranking. Para semanal/mensal, deve cair no período desejado. |
| `region` | string | **Sim** | código de região, ex.: `BR`, `US` | Região do ranking. (sem descrição na spec.) |
| `category_id` | string | Não | id de categoria nível 1 | Filtra o ranking pela categoria primária. (sem descrição na spec.) |
| `category_l2_id` | string | Não | id de categoria nível 2 | Filtra pela subcategoria secundária. (sem descrição na spec.) |
| `category_l3_id` | string | Não | id de categoria nível 3 | Filtra pela subcategoria de terceiro nível. (sem descrição na spec.) |
| `from_flag` | integer | Não | `1` = local · `2` = cross-border | Filtra por origem da loja. |
| `seller_rank_field` | integer | **Sim** | `1` = total_sale_cnt · `2` = total_ifl_cnt | Critério de ranqueamento (por vendas ou por nº de criadores). |
| `rank_type` | integer | **Sim** | `1` = diário · `2` = semanal · `3` = mensal | Ciclo do ranking. |
| `page_num` | integer | **Sim** | 1 … 100000 | Número da página (começa em 1). |
| `page_size` | integer | **Sim** | máx **10** | Itens por página. |

### Exemplo de chamada
```bash
curl -s "https://open.echotik.live/api/v3/echotik/seller/ranklist?date=2026-06-09&region=BR&seller_rank_field=1&rank_type=1&page_num=1&page_size=10" \
  -H "Authorization: Basic $TOKEN"
```

## Response

Envelope padrão: `{ code, message, data, requestId }` — `code = 0` + HTTP 200 = sucesso; `code != 0` ou HTTP 500 "Usage Limit Exceeded" = erro/cota.

### Campos de `data[]`
| Campo | Tipo | O que é |
|---|---|---|
| `category_id` | string | Id da categoria primária da loja. (sem descrição — resolve via `category/l1`.) |
| `category_l2_id` | string | Id da categoria secundária. (sem descrição.) |
| `category_l3_id` | string | Id da categoria de terceiro nível. (sem descrição.) |
| `cover_url` | string | URL da capa da loja. EchoTik recomenda baixar via interface de download. |
| `most_product_category_list` | string | Categorias de produto mais populares da loja. **String JSON** (ex.: `[{"category_name":"Beauty & Personal Care","category_id":"601450"}]`), precisa de parse. |
| `rating` | number | Nota/avaliação média da loja (ex.: `4.5`). |
| `region` | string | Região da loja (ex.: `US`). (sem descrição.) |
| `seller_id` | string | Id da loja. (sem descrição — chave para drill-down.) |
| `seller_name` | string | Nome da loja (ex.: `Curvlife`). (sem descrição.) |
| `total_ifl_cnt` | integer | Nº de criadores vendedores no período. |
| `total_live_cnt` | integer | Nº de sessões de live no período. |
| `total_product_cnt` | integer | Nº de produtos da loja. (no exemplo vem `0`, pode não estar populado para todas as lojas.) |
| `total_sale_cnt` | integer | Vendas (unid.) no período — **incremental** do período corrente. (sem descrição.) |
| `total_sale_gmv_amt` | number | GMV no período — incremental, estimado (ex.: `37184.73`). (sem descrição.) |
| `total_video_cnt` | integer | Nº total de vídeos de venda no período. |
| `user_id` | string | Id de usuário associado à loja. (sem descrição.) |
| `from_flag` | integer | Origem: `1` = local · `2` = cross-border. |

### Exemplo de response (da própria spec)
```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "category_id": "601450",
      "category_l2_id": "1086856",
      "category_l3_id": "824336",
      "cover_url": "https://echosell-images.tos-ap-southeast-1.volces.com/seller-cover/938/7495539486134995508.png",
      "from_flag": 2,
      "most_product_category_list": "[{ \"category_name\":\"Beauty & Personal Care\",\"category_id\":\"601450\"}]",
      "rating": 4.5,
      "region": "US",
      "seller_id": "7495539486134995508",
      "seller_name": "Curvlife",
      "total_ifl_cnt": 174,
      "total_live_cnt": 37,
      "total_product_cnt": 0,
      "total_sale_cnt": 2603,
      "total_sale_gmv_amt": 37184.73,
      "total_video_cnt": 83,
      "user_id": "7468951587187000366"
    }
  ],
  "requestId": "54f91db1-5f45-43f1-b0b8-2b7421a0e2f7"
}
```

## Notas & gotchas
- **Valores são incrementais do período** (não acumulado histórico) — diferente de `seller/list`/`seller/detail`, onde `total_sale_cnt` é acumulado.
- **Strings numéricas**: `seller_id`, `user_id`, ids de categoria como string.
- `most_product_category_list` é **string JSON** — precisa de `JSON.parse`.
- `total_product_cnt` pode vir `0` (não populado no ranking).
- Calendário de atualização: semanal toda segunda, mensal no dia 1.
- Discrepância da doc: ignore `product_rank_field` mencionado na descrição; use **`seller_rank_field`**.
- **GMV estimado**. Dado **offline T+1**.

## Relevância para o TIKSPY
- É a fonte direta do **ranking de lojas** (Top lojas por vendas/GMV) na área de Lojas/Concorrência, com recortes diário/semanal/mensal por categoria e região.
- O critério `seller_rank_field=2` (nº de criadores) destaca lojas com forte rede de afiliados — útil para benchmark de estratégia de creator marketing.
- `seller_id` liga ao detalhe, tendência, produtos, criadores, vídeos e lives da loja.

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
  /api/v3/echotik/seller/ranklist:
    get:
      summary: Shop Ranking List - EchoTik
      deprecated: false
      description: >-
        1. The values returned in the list are the incremental data of the
        current period


        3. seller_rank_field = 1 represents the Bestselling List,
        product_rank_field = 2 represents the Recommended List


        2. The date field is in yyyy-MM-dd format, and the list is divided into
        three types: daily/weekly/monthly. The weekly list is updated every
        Monday, and the monthly list is updated on the first day of each month.
      tags:
        - Shop
      parameters:
        - name: date
          in: query
          description: Date, yyyy-MM-dd format
          required: true
          schema:
            type: string
        - name: region
          in: query
          description: ''
          required: true
          schema:
            type: string
        - name: category_id
          in: query
          description: ''
          required: false
          schema:
            type: string
        - name: category_l2_id
          in: query
          description: ''
          required: false
          schema:
            type: string
        - name: category_l3_id
          in: query
          description: ''
          required: false
          schema:
            type: string
        - name: from_flag
          in: query
          description: >-
            Cross-border or local stores indicate that from_flag=1 represents
            local and from_flag=2 represents cross-border.
          required: false
          schema:
            type: integer
        - name: seller_rank_field
          in: query
          description: Ranking field 1=total_sale_cnt 2=total_ifl_cnt
          required: true
          schema:
            type: integer
        - name: rank_type
          in: query
          description: >-
            The ranking cycle is as follows: 1 = Daily Ranking, 2 = Weekly
            Ranking, 3 = Monthly Ranking.
          required: true
          schema:
            type: integer
        - name: page_num
          in: query
          description: Page numbers start from 1 and go up to a maximum of 100,000.
          required: true
          schema:
            type: integer
        - name: page_size
          in: query
          description: The maximum number of pages is 10.
          required: true
          schema:
            type: integer
      responses:
        '200':
          description: ''
          content:
            application/json:
              schema:
                type: object
                properties:
                  code:
                    type: integer
                  message:
                    type: string
                  data:
                    type: array
                    items:
                      type: object
                      properties:
                        category_id:
                          type: string
                        category_l2_id:
                          type: string
                        category_l3_id:
                          type: string
                        cover_url:
                          type: string
                          title: >-
                            Store cover image address, please use the download
                            interface to access.
                        most_product_category_list:
                          type: string
                          title: Most popular product categories in the store
                        rating:
                          type: number
                        region:
                          type: string
                        seller_id:
                          type: string
                        seller_name:
                          type: string
                        total_ifl_cnt:
                          type: integer
                          title: Number of selling creators
                        total_live_cnt:
                          type: integer
                          title: Live broadcast sessions
                        total_product_cnt:
                          type: integer
                          title: Number of products
                        total_sale_cnt:
                          type: integer
                        total_sale_gmv_amt:
                          type: number
                        total_video_cnt:
                          type: integer
                          title: Total number of videos sold
                        user_id:
                          type: string
                        from_flag:
                          type: integer
                      x-apifox-orders:
                        - category_id
                        - category_l2_id
                        - category_l3_id
                        - cover_url
                        - most_product_category_list
                        - rating
                        - region
                        - seller_id
                        - seller_name
                        - total_ifl_cnt
                        - total_live_cnt
                        - total_product_cnt
                        - total_sale_cnt
                        - total_sale_gmv_amt
                        - total_video_cnt
                        - user_id
                        - from_flag
                  requestId:
                    type: string
                x-apifox-orders:
                  - code
                  - message
                  - data
                  - requestId
                x-apifox-refs: {}
                required:
                  - code
                  - message
                  - data
                  - requestId
              example:
                code: 0
                message: success
                data:
                  - category_id: '601450'
                    category_l2_id: '1086856'
                    category_l3_id: '824336'
                    cover_url: >-
                      https://echosell-images.tos-ap-southeast-1.volces.com/seller-cover/938/7495539486134995508.png
                    from_flag: 2
                    most_product_category_list: >-
                      [{ "category_name":"Beauty & Personal
                      Care","category_id":"601450"}]
                    rating: 4.5
                    region: US
                    seller_id: '7495539486134995508'
                    seller_name: Curvlife
                    total_ifl_cnt: 174
                    total_live_cnt: 37
                    total_product_cnt: 0
                    total_sale_cnt: 2603
                    total_sale_gmv_amt: 37184.73
                    total_video_cnt: 83
                    user_id: '7468951587187000366'
                requestId: 54f91db1-5f45-43f1-b0b8-2b7421a0e2f7
          headers: {}
          x-apifox-name: 成功
      security:
        - basic: []
      x-apifox-folder: Shop
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/7319100/apis/api-372672181-run
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
