# Influencer Ranking List - EchoTik

> **Fonte:** opendoc EchoTik (https://opendocs.echotik.live/en/368760808e0) · **`GET /api/v3/echotik/influencer/ranklist`** · **Auth:** Basic · **Tipo:** Offline (T+1)

## O que faz

Retorna o ranking de criadores de um período (diário, semanal ou mensal) por região. Os valores principais (`total_*` sem sufixo `history`) são **incrementos do período** corrente; os campos `*_history_*` trazem o acumulado total. O ranking pode ser de seguidores (`influencer_rank_field=1`) ou de vendas (`influencer_rank_field=2`). Use para alimentar diretamente as telas de "criadores em alta" / "ranking de criadores" do mercado. Dados offline (T+1).

## Request

### Headers
| Header | Obrigatório | Valor |
|---|---|---|
| `Authorization` | Sim | `Basic base64(username:password)` (credenciais em echotik.live/platform/api-keys) |

### Query params
| Param | Tipo | Obrigatório | Valores / Default | O que faz |
|---|---|---|---|---|
| `date` | string | **Sim** | `yyyy-MM-dd` | Data do ranking. Semanal: usar a segunda-feira; mensal: usar o dia 1º do mês. |
| `region` | string | **Sim** | Ex.: `US`, `BR` | Código de região/país. |
| `rank_type` | integer | **Sim** | `1`=dia, `2`=semana, `3`=mês | Granularidade do ranking. |
| `influencer_rank_field` | integer | **Sim** | `1`=total_followers_cnt (ranking de fãs), `2`=total_sale_cnt (ranking de vendas) | Critério/tipo do ranking. |
| `page_num` | integer | **Sim** | `1`..`100000` | Número da página (começa em 1). |
| `page_size` | integer | **Sim** | máx. `10` | Itens por página. Limite máximo de 10. |
| `influencer_category_name` | string | Não | Nome da categoria | Filtra por nicho/categoria do criador. |
| `product_category_id` | string | Não | ID(s) de categoria de produto | Filtra por categoria de produto (`product_category_list`). |

### Exemplo de chamada
```bash
curl -s "https://open.echotik.live/api/v3/echotik/influencer/ranklist?date=2026-06-08&region=BR&rank_type=2&influencer_rank_field=2&page_num=1&page_size=10" \
  -H "Authorization: Basic $TOKEN"
```

## Response

Envelope padrão: `{ code, message, data, requestId }` — `code = 0` + HTTP 200 = sucesso; `code != 0` ou HTTP 500 "Usage Limit Exceeded" = erro/cota.

### Campos de `data[]` (uma linha por criador no ranking)
| Campo | Tipo | O que é |
|---|---|---|
| `avatar` | string | URL da foto de perfil. Se inacessível, use o download API (expira). |
| `category` | string | Nicho/categoria principal do criador. |
| `ec_score` | number | Rating EchoTik. |
| `nick_name` | string | Nome de exibição do criador. |
| `region` | string | País/região do criador. |
| `sales_flag` | integer | Tipo de venda: `>0` vende; `1`=vídeo, `2`=live, `3`=vídeo+live, `4`=vitrine. |
| `total_digg_cnt` | integer | Curtidas durante o período do ranking (incremento). |
| `total_digg_history_cnt` | integer | Total acumulado de curtidas. |
| `total_followers_cnt` | integer | Crescimento de seguidores no período (incremento). |
| `total_followers_history_cnt` | integer | Total acumulado de seguidores. |
| `total_live_cnt` | integer | Lives no período (incremento). |
| `total_live_history_cnt` | integer | Total acumulado de lives. |
| `total_post_video_cnt` | integer | Vídeos publicados no período (incremento). |
| `total_post_video_history_cnt` | integer | Total acumulado de vídeos publicados. |
| `total_product_cnt` | integer | Produtos promovidos no período (incremento). |
| `total_product_history_cnt` | integer | Total acumulado de produtos promovidos. |
| `total_sale_cnt` | integer | Vendas no período (estimado, incremento). |
| `total_sale_gmv_amt` | number | GMV no período (estimado, incremento). |
| `total_sale_gmv_history_amt` | number | GMV total acumulado (estimado). |
| `total_sale_history_cnt` | integer | Total acumulado de vendas (estimado). |
| `user_id` | string | ID interno do criador. |
| `unique_id` | string | @handle do TikTok (`handle_id`). |
| `product_category_list` | string | Todas as categorias de produto do criador, formato hierárquico L1-L2-L3 (ranqueado). |
| `most_category_id` | string | Categoria de topo (L1) com mais promoção de produtos do criador. |
| `most_category_l2_id` | string | Subcategoria L2 com mais promoção (não documentada — provavelmente o L2 da categoria dominante). |
| `most_category_l3_id` | string | Subcategoria L3 com mais promoção (a página não traz descrição — provavelmente o L3 da categoria dominante). |

> Nota: a página lista `handle_id` logo após `unique_id`, mas sem tipo/descrição — parece um rótulo, não um campo real do payload (não aparece no Example).

### Exemplo de resposta
```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "avatar": "https://echosell-images.tos-ap-southeast-1.volces.com/user-avatar/853/MS4wLjABAAAAJN3v63JkTkZW72ae9hb2Wlb70uzhU8H3AZEKxIVTg38lwBGTx0tSNH7IBcrocdKd.jpg",
      "category": "Other",
      "ec_score": 7.33,
      "most_category_id": "601450",
      "most_category_l2_id": "605248",
      "most_category_l3_id": "603014",
      "nick_name": "ﾌひﾚﾉの",
      "product_category_list": "601450-849672-601690:1,601450-848776-601608:2,601450-849672-875400:3",
      "region": "US",
      "sales_flag": 4,
      "total_digg_cnt": 0,
      "total_digg_history_cnt": 9415852,
      "total_followers_cnt": 0,
      "total_followers_history_cnt": 46652,
      "total_live_cnt": 0,
      "total_live_history_cnt": 0,
      "total_post_video_cnt": 0,
      "total_post_video_history_cnt": 1716,
      "total_product_cnt": 0,
      "total_product_history_cnt": 228,
      "total_sale_cnt": 7752,
      "total_sale_gmv_amt": 73446,
      "total_sale_gmv_history_amt": 583910,
      "total_sale_history_cnt": 45720,
      "unique_id": "iamjuliocr",
      "user_id": "6633792625097490438"
    }
  ],
  "requestId": "aeaad642-956b-4431-92c2-aaf60a5c60d6"
}
```
> (Exemplo resumido — `product_category_list` real traz 104 categorias no formato `L1-L2-L3:rank`.)

## Notas & gotchas
- **Incremento vs acumulado:** os campos sem `history` são o delta do período; os `*_history_*` são o total. Não confunda ao montar o ranking.
- `date` precisa seguir a convenção do `rank_type`: semana → segunda-feira; mês → dia 1º. Datas fora do padrão podem retornar vazio.
- `product_category_list` é uma string codificada (`L1-L2-L3:rank,...`) — precisa de parse.
- GMV/vendas são **estimados**; `avatar` **expira**.
- `page_size` máximo é **10**.

## Relevância para o TIKSPY
- **Endpoint-chave do Dashboard de mercado (/):** monta direto o "ranking de criadores em alta" por seguidores ou por vendas, por região e período.
- Sustenta uma das métricas nº 1 do dashboard (criadores em alta) sem precisar varrer a Influencer List inteira.

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
  /api/v3/echotik/influencer/ranklist:
    get:
      summary: Influencer Ranking List - EchoTik
      deprecated: false
      description: >-
        1. The values returned in the ranking are the incremental data of the
        current period

        2. The date field is in yyyy-MM-dd format, and the ranking is divided
        into three types: daily/weekly/monthly. Weekly ranking: every Monday,
        monthly ranking: the first day of each month.

        3. influencer_rank_field description: influencer_rank_field=1 represents
        the fan ranking, influencer_rank_field=2 represents the sales expert
        ranking
      tags:
        - Influencer
      parameters:
        - name: date
          in: query
          description: >-
            The format is yyyy-MM-dd. The rankings are divided into three
            categories: daily, weekly, and monthly. Weekly rankings are held
            every Monday, and monthly rankings are held on the first day of each
            month.
          required: true
          schema:
            type: string
        - name: region
          in: query
          description: Region code, region, such as US
          required: true
          schema:
            type: string
        - name: influencer_category_name
          in: query
          description: Category filter
          required: false
          schema:
            type: string
        - name: product_category_id
          in: query
          description: product_category_list
          required: false
          schema:
            type: string
        - name: rank_type
          in: query
          description: 1=day 2=week 3=month
          required: true
          schema:
            type: integer
        - name: influencer_rank_field
          in: query
          description: List sorting type 1=total_followers_cnt 2=total_sale_cnt
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
                        avatar:
                          type: string
                          title: >-
                            If the profile picture/cover URL is inaccessible,
                            please use the download interface.
                        category:
                          type: string
                        ec_score:
                          type: number
                          title: echotik rating
                        nick_name:
                          type: string
                        region:
                          type: string
                        sales_flag:
                          type: integer
                          title: >-
                            Sales indicators, >0 represents sales. 1 = Video
                            sales; 2 = Live streaming sales; 3 = Video + Live
                            streaming; 4 = Open a product showcase.
                        total_digg_cnt:
                          type: integer
                          title: Likes during the ranking period
                        total_digg_history_cnt:
                          type: integer
                          title: Total number of likes
                        total_followers_cnt:
                          type: integer
                        total_followers_history_cnt:
                          type: integer
                        total_live_cnt:
                          type: integer
                        total_live_history_cnt:
                          type: integer
                        total_post_video_cnt:
                          type: integer
                        total_post_video_history_cnt:
                          type: integer
                        total_product_cnt:
                          type: integer
                        total_product_history_cnt:
                          type: integer
                        total_sale_cnt:
                          type: integer
                          title: Sales volume (estimated) during the ranking period
                        total_sale_gmv_amt:
                          type: number
                          title: >-
                            Estimated GMV (Gross Merchandise Volume) during the
                            ranking period
                        total_sale_gmv_history_amt:
                          type: number
                          title: Total sales gmv (estimated)
                        total_sale_history_cnt:
                          type: integer
                          title: Total sales (estimated)
                        user_id:
                          type: string
                        unique_id:
                          type: string
                          description: handle_id
                        product_category_list:
                          type: string
                          description: >-
                            All product categories for influencers' live
                            streaming, Level 1-2-3 categories: Ranking
                        most_category_id:
                          type: string
                          description: >-
                            The top-level category with the most influencer
                            product promotion
                        most_category_l2_id:
                          type: string
                        most_category_l3_id:
                          type: string
                      x-apifox-orders:
                        - avatar
                        - category
                        - ec_score
                        - nick_name
                        - region
                        - sales_flag
                        - total_digg_cnt
                        - total_digg_history_cnt
                        - total_followers_cnt
                        - total_followers_history_cnt
                        - total_live_cnt
                        - total_live_history_cnt
                        - total_post_video_cnt
                        - total_post_video_history_cnt
                        - total_product_cnt
                        - total_product_history_cnt
                        - total_sale_cnt
                        - total_sale_gmv_amt
                        - total_sale_gmv_history_amt
                        - total_sale_history_cnt
                        - user_id
                        - unique_id
                        - product_category_list
                        - most_category_id
                        - most_category_l2_id
                        - most_category_l3_id
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
          headers: {}
          x-apifox-name: 成功
      security:
        - basic: []
      x-apifox-folder: Influencer
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/7319100/apis/api-368760808-run
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
