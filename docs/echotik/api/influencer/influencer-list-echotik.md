# Influencer List - EchoTik

> **Fonte:** opendoc EchoTik (https://opendocs.echotik.live/en/368555684e0) · **`GET /api/v3/echotik/influencer/list`** · **Auth:** Basic · **Tipo:** Offline (T+1)

## O que faz

Lista criadores (influencers) a partir da biblioteca offline da EchoTik, atualizada em regime T+1 (dados do dia anterior). É o endpoint de descoberta/exploração em massa: serve para montar rankings, filtrar criadores por nicho, faixa de seguidores, engajamento e GMV, e alimentar telas de prospecção/concorrência. Por ser offline, suporta filtros ricos e paginação ampla sem o risk control dos endpoints em tempo-real. Use quando precisar varrer grandes volumes de criadores com critérios combinados.

## Request

### Headers
| Header | Obrigatório | Valor |
|---|---|---|
| `Authorization` | Sim | `Basic base64(username:password)` (credenciais em echotik.live/platform/api-keys) |

### Query params
| Param | Tipo | Obrigatório | Valores / Default | O que faz |
|---|---|---|---|---|
| `region` | string | **Sim** | Ex.: `US`, `BR` | Código de região/país do criador. Único parâmetro de filtro realmente obrigatório além da paginação. |
| `page_num` | string | **Sim** | `1`..`10000` (ex.: `1`) | Número da página (começa em 1). |
| `page_size` | string | **Sim** | máx. `10` (ex.: `10`) | Itens por página. Limite máximo de 10 — paginação obrigatoriamente fatiada. |
| `product_category_id` | string | Não | IDs de categoria | Filtra por IDs de categoria de produto vendidos pelo criador. |
| `influencer_category_name` | string | Não | Nome da categoria | Filtra pelo nome do nicho/categoria do criador. |
| `influencer_sort_field_v2` | integer | Não | `1`=total_followers_cnt, `2`=total_followers_30d_cnt, `3`=total_post_video_cnt, `4`=per_views_avg_cnt, `5`=interaction_rate, `6`=total_product_cnt; default `0` | Campo de ordenação da lista. |
| `sort_type` | integer | Não | `0`=asc, `1`=desc; default `0` | Direção da ordenação. |
| `seller_id` | string | Não | — | Filtra por `shop_id` (loja vinculada ao criador). |
| `min_total_followers_cnt` / `max_total_followers_cnt` | integer | Não | — | Faixa (mín/máx) de número de seguidores. |
| `min_total_digg_cnt` / `max_total_digg_cnt` | integer | Não | — | Faixa de total de curtidas (likes). |
| `min_interaction_rate` / `max_interaction_rate` | number | Não | — | Faixa de taxa de interação/engajamento. |
| `min_total_views_cnt` / `max_total_views_cnt` | integer | Não | — | Faixa de total de visualizações de vídeo. |
| `min_total_views_7d_cnt` / `max_total_views_7d_cnt` | integer | Não | — | Faixa do incremento de visualizações nos últimos 7 dias. |
| `min_per_video_product_views_avg_cnt` / `max_per_video_product_views_avg_cnt` | integer | Não | — | Faixa da média de views por vídeo de venda (vídeo de produto). |
| `min_per_video_product_views_avg_7d_cnt` / `max_per_video_product_views_avg_7d_cnt` | integer | Não | — | Faixa da média de views (incremento) de vídeos de produto nos últimos 7 dias. |
| `gender` | string | Não | — | Gênero, inferido por foto de perfil e conteúdo. **Só aplicável na região US.** |
| `influencer_language` | string | Não | — | Idioma do criador (não documentado pela EchoTik — provavelmente código ISO ex. `en`). |
| `show_case_flag` | integer | Não | `1`=Sim, `0`=Não | Filtra por vitrine de produtos (showcase) habilitada. |
| `sales_flag` | integer | Não | `>0` vende produto; `1`=venda em vídeo, `2`=venda em live, `3`=ambos (live+vídeo), `4`=vitrine habilitada | Filtra pelo tipo de venda do criador. |

### Exemplo de chamada
```bash
curl -s "https://open.echotik.live/api/v3/echotik/influencer/list?region=BR&page_num=1&page_size=10&influencer_sort_field_v2=1&sort_type=1&min_total_followers_cnt=10000" \
  -H "Authorization: Basic $TOKEN"
```

## Response

Envelope padrão: `{ code, message, data, requestId }` — `code = 0` + HTTP 200 = sucesso; `code != 0` ou HTTP 500 "Usage Limit Exceeded" = erro/cota.

### Campos de `data[]`
| Campo | Tipo | O que é |
|---|---|---|
| `avatar` | string | URL da foto de perfil do criador. Em caso de erro de acesso, baixe via download API (URLs expiram). |
| `avg_30d_price` | integer | Preço médio de venda nos últimos 30 dias. |
| `category` | string | Nicho/categoria principal do criador (ex.: `Other`, `Beauty & Personal Care`). |
| `contact_email` | string | E-mail de contato do criador (pode vir vazio). |
| `ec_score` | number | Rating EchoTik (score proprietário de qualidade/relevância do criador). |
| `first_crawl_dt` | integer | Data do primeiro crawl, formato `yyyyMMdd` (ex.: `20260305`). |
| `gender` | string | Gênero inferido (só preenchido na região US). |
| `influencer_video_duration_level` | string | JSON-string com distribuição de duração dos vídeos (ex.: `{"2m":0,"30s-60s":16,...}`). |
| `influencer_video_publish_hour` | string | JSON-string com distribuição de horários de publicação (chaves `"00".."23"`). |
| `influencer_video_publish_week` | string | JSON-string com distribuição por dia da semana (chaves `"1".."7"`). |
| `interaction_rate` | integer/number | Taxa de interação/engajamento (no exemplo vem como decimal `0.01`; declarado integer no schema da lista, number no de detalhes). |
| `language` | string | Idioma do criador (ex.: `en`). |
| `most_category_product` | string | JSON-string com a categoria de produto mais vendida (ex.: `[{"category_name":"Beauty & Personal Care","category_id":"601450"}]`). |
| `most_views_video` | string | ID do vídeo com mais visualizações do criador. |
| `nick_name` | string | Nome de exibição do criador. |
| `off_mark` | integer | Conta cancelada/desativada: `0`=ativa; `>0`=possivelmente cancelada. |
| `per_video_product_views_avg_7d_cnt` | integer | Média de visualizações de vídeos de produto nos últimos 7 dias. |
| `region` | string | País/região do criador (ex.: `US`). |
| `sales_flag` | integer | Tipo de venda: `>0` vende; `1`=vídeo, `2`=live, `3`=vídeo+live, `4`=vitrine habilitada. |
| `seller_id` | string | ID da loja vinculada (`shop_id`). Pode vir `null`. |
| `show_case_flag` | integer | Vitrine de produtos habilitada: `1`=sim, `0`=não. |
| `signature` | string | Bio/assinatura do perfil. |
| `total_comments_cnt` | integer | Total de comentários recebidos. |
| `total_digg_1d_cnt` | integer | Incremento de curtidas no último 1 dia. |
| `total_digg_30d_cnt` | integer | Incremento de curtidas nos últimos 30 dias. |
| `total_digg_7d_cnt` | integer | Incremento de curtidas nos últimos 7 dias. |
| `total_digg_90d_cnt` | integer | Incremento de curtidas nos últimos 90 dias. |
| `total_digg_cnt` | integer | Total de curtidas (likes). |
| `total_followers_1d_cnt` | integer | Crescimento de seguidores no último 1 dia. |
| `total_followers_30d_cnt` | integer | Crescimento de seguidores nos últimos 30 dias. |
| `total_followers_7d_cnt` | integer | Crescimento de seguidores nos últimos 7 dias. |
| `total_followers_90d_cnt` | integer | Crescimento de seguidores nos últimos 90 dias. |
| `total_followers_cnt` | integer | Total de seguidores. |
| `total_following_cnt` | integer | Total de contas que o criador segue. |
| `total_live_cnt` | integer | Total de lives realizadas. |
| `total_live_sale_gmv_30d_amt` | integer | GMV de lives nos últimos 30 dias (estimado). |
| `total_post_video_cnt` | integer | Total de vídeos publicados. |
| `total_product_30d_cnt` | integer | Número de produtos vendidos nos últimos 30 dias. |
| `total_product_cnt` | integer | Total de produtos promovidos. |
| `total_sale_cnt` | integer | Total de vendas (estimado). |
| `total_sale_gmv_30d_amt` | integer | GMV nos últimos 30 dias (estimado). |
| `total_sale_gmv_amt` | integer | GMV total acumulado (estimado). |
| `total_shares_cnt` | integer | Total de compartilhamentos. |
| `total_video_product_30d_cnt` | integer | Produtos vendidos via vídeo nos últimos 30 dias. |
| `total_video_sale_30d_cnt` | integer | Vendas via vídeo nos últimos 30 dias (estimado). |
| `total_video_sale_gmv_30d_amt` | integer | GMV de vendas via vídeo nos últimos 30 dias (estimado). |
| `total_views_cnt` | integer | Total de visualizações de vídeos. |
| `unique_id` | string | @handle do TikTok (identificador público, ex.: `cchan590`). |
| `user_id` | string | ID interno do usuário no TikTok/EchoTik (numérico em string). |

> **Campos extras observados no Example** (presentes na resposta real mas fora do `x-apifox-orders`): `per_video_product_views_avg_30d_cnt` (média de views de vídeo de produto em 30 dias), `per_views_avg_30d_cnt` (média de views por vídeo em 30 dias), `product_category_list` (lista codificada `L1-L2-L3:rank` das categorias do criador) e `total_likes_cnt` (total de curtidas acumuladas — provavelmente sinônimo prático de `total_digg_cnt`).

### Exemplo de resposta
```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "avatar": "https://echosell-images.tos-ap-southeast-1.volces.com/user-avatar/252/MS4wLjABAAAAy5s11Qf2mzfNI54PWhh8-QncauRN9BJ1vC8cQywr13QlLh1LiN9Te9gg765ZFLfx.jpg",
      "avg_30d_price": 0,
      "category": "Other",
      "contact_email": "",
      "ec_score": 5.03,
      "first_crawl_dt": 20260305,
      "gender": "",
      "influencer_video_duration_level": "{\"2m\":0,\"1m-2m\":0,\"30s-60s\":16,\"15s-30s\":0,\"15s\":0}",
      "influencer_video_publish_hour": "{\"00\":0,\"01\":0,\"04\":2,\"05\":3,\"06\":1,\"07\":4,\"08\":3,\"10\":2,\"11\":1}",
      "influencer_video_publish_week": "{\"1\":0,\"2\":0,\"3\":0,\"4\":0,\"5\":0,\"6\":15,\"7\":1}",
      "interaction_rate": 0.01,
      "language": "en",
      "most_category_product": "[{ \"category_name\":\"Beauty & Personal Care\",\"category_id\":\"601450\"}]",
      "most_views_video": "7611821797465541918",
      "nick_name": "cchan590",
      "off_mark": 0,
      "per_video_product_views_avg_30d_cnt": 20439,
      "per_video_product_views_avg_7d_cnt": 20439,
      "per_views_avg_30d_cnt": 20439,
      "product_category_list": "600154-809992-810504:1,604968-873352-979976:2,601450-849672-601696:3",
      "region": "US",
      "sales_flag": 1,
      "seller_id": null,
      "show_case_flag": 0,
      "signature": "🌎:biv6888",
      "total_comments_cnt": 57,
      "total_digg_cnt": 14045,
      "total_followers_cnt": 4173,
      "total_following_cnt": 663,
      "total_likes_cnt": 81474,
      "total_live_cnt": 0,
      "total_post_video_cnt": 18,
      "total_product_cnt": 6,
      "total_sale_cnt": 47,
      "total_sale_gmv_amt": 466,
      "total_shares_cnt": 223,
      "total_views_cnt": 217835,
      "unique_id": "cchan590",
      "user_id": "104962950695723008"
    }
  ],
  "requestId": "0e0b5e10-2c7e-4f84-90e6-52e569e8bc36"
}
```
> (Exemplo resumido — campos `_1d/_7d/_30d/_90d` de digg/followers e os GMV de 30d omitidos por brevidade; todos vêm com valor `0` no exemplo da página.)

## Notas & gotchas
- IDs (`user_id`, `seller_id`, `video_id`) e contadores como `create_time` vêm como **strings numéricas** — não assuma number.
- Vários campos são **JSON serializado dentro de string** (`influencer_video_duration_level`, `influencer_video_publish_hour`, `most_category_product`) — precisam de parse extra.
- Todos os valores de GMV/vendas são **estimados** pela EchoTik, não números oficiais da loja.
- URLs de `avatar` **expiram** (x-expires); recaie no download API se der erro.
- `page_size` máximo é **10**; para varrer muitos criadores, itere `page_num`.
- `gender` só é confiável na região US.

## Relevância para o SLEAG
- É o motor da área de **Criadores/concorrência**: alimenta ranking de criadores, filtros por nicho/seguidores/GMV e prospecção em massa.
- Combinado com `region=BR` e `influencer_sort_field_v2`, monta as listas de "criadores em alta" do mercado brasileiro.

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
  /api/v3/echotik/influencer/list:
    get:
      summary: Influencer List - EchoTik
      deprecated: false
      description: >-
        It provides influencer data from an offline (T+1 update) EchoTik
        library, suitable for scenarios that require acquiring large amounts of
        influencer data.
      tags:
        - Influencer
      parameters:
        - name: product_category_id
          in: query
          description: Product Category IDs Sold by Influencers
          required: false
          example: ''
          schema:
            type: string
        - name: influencer_category_name
          in: query
          description: Category Name
          required: false
          example: ''
          schema:
            type: string
        - name: influencer_sort_field_v2
          in: query
          description: >-
            List sorting field, 1=total_followers_cnt 2=total_followers_30d_cnt
            3=total_post_video_cnt 4=per_views_avg_cnt 5=interaction_rate
            6=total_product_cnt
          required: false
          example: 0
          schema:
            type: integer
        - name: sort_type
          in: query
          description: Sort order, 0=asc 1=desc
          required: false
          example: 0
          schema:
            type: integer
        - name: seller_id
          in: query
          description: shop_id
          required: false
          schema:
            type: string
        - name: min_total_followers_cnt
          in: query
          description: Follower count range filter
          required: false
          schema:
            type: integer
        - name: max_total_followers_cnt
          in: query
          description: Follower count range filter
          required: false
          schema:
            type: integer
        - name: min_total_digg_cnt
          in: query
          description: Like count range filter
          required: false
          schema:
            type: integer
        - name: max_total_digg_cnt
          in: query
          description: Like count range filter
          required: false
          schema:
            type: integer
        - name: min_interaction_rate
          in: query
          description: Interaction range filtering
          required: false
          schema:
            type: number
        - name: max_interaction_rate
          in: query
          description: Interaction range filtering
          required: false
          schema:
            type: number
        - name: min_total_views_cnt
          in: query
          description: Filtering by total video views
          required: false
          example: 0
          schema:
            type: integer
        - name: max_total_views_cnt
          in: query
          description: Filtering by total video views
          required: false
          schema:
            type: integer
        - name: min_total_views_7d_cnt
          in: query
          description: Playback volume (increment) range filter for the last 7 days
          required: false
          schema:
            type: integer
        - name: max_total_views_7d_cnt
          in: query
          description: Playback volume (increment) range filter for the last 7 days
          required: false
          schema:
            type: integer
        - name: min_per_video_product_views_avg_cnt
          in: query
          description: Average sales video view range filtering
          required: false
          schema:
            type: integer
        - name: max_per_video_product_views_avg_cnt
          in: query
          description: Average sales video view range filtering
          required: false
          schema:
            type: integer
        - name: min_per_video_product_views_avg_7d_cnt
          in: query
          description: >-
            Average number of views (increase) of product promotion videos in
            the past 7 days (filtered)
          required: false
          schema:
            type: integer
        - name: max_per_video_product_views_avg_7d_cnt
          in: query
          description: >-
            Average number of views (increase) of product promotion videos in
            the past 7 days (filtered)
          required: false
          schema:
            type: integer
        - name: gender
          in: query
          description: >-
            Gender, based on profile picture and video content, only applicable
            in the US region.
          required: false
          example: ''
          schema:
            type: string
        - name: influencer_language
          in: query
          description: ''
          required: false
          schema:
            type: string
        - name: show_case_flag
          in: query
          description: Is the showcase enabled, 1=Yes 0=No
          required: false
          schema:
            type: integer
        - name: sales_flag
          in: query
          description: >-
            Whether or not product sales are involved: >0 indicates product
            sales, 1 = video product sales, 2 = live streaming product sales, 3
            = both live streaming and video product sales, 4 = product showcase
            enabled.
          required: false
          schema:
            type: integer
        - name: region
          in: query
          description: Region code, region, such as US
          required: true
          example: US
          schema:
            type: string
        - name: page_num
          in: query
          description: Page numbers start from 1 and go up to 10000.
          required: true
          example: '1'
          schema:
            type: string
        - name: page_size
          in: query
          description: The maximum number of pages is 10.
          required: true
          example: '10'
          schema:
            type: string
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
                          title: Influencer avatar address
                          description: >-
                            If you encounter an error, please use the download
                            interface to download the image.
                        avg_30d_price:
                          type: integer
                          title: Average sales price in the past 30 days
                        category:
                          type: string
                        contact_email:
                          type: string
                        ec_score:
                          type: number
                          title: echotik rating
                        first_crawl_dt:
                          type: integer
                          title: First crawl time
                        gender:
                          type: string
                        influencer_video_duration_level:
                          type: string
                          title: Video duration distribution
                        influencer_video_publish_hour:
                          type: string
                          title: Video release time distribution
                        influencer_video_publish_week:
                          type: string
                          title: Video release weekly distribution
                        interaction_rate:
                          type: integer
                        language:
                          type: string
                        most_category_product:
                          type: string
                          title: Best-selling product category information
                        most_views_video:
                          type: string
                        nick_name:
                          type: string
                        off_mark:
                          type: integer
                          title: Whether to cancel the account
                          description: >-
                            0 indicates not cancelled; >0 may indicate
                            cancelled.
                        per_video_product_views_avg_7d_cnt:
                          type: integer
                          title: Average 7-day video views
                        region:
                          type: string
                        sales_flag:
                          type: integer
                          title: Is the identifier for sale
                          description: >-
                            >0 represents product sales, 1 = video sales, 2 =
                            live streaming sales, 3 = video + live streaming, 4
                            = opening a product showcase.
                        seller_id:
                          type: string
                          title: Link Shop ID
                        show_case_flag:
                          type: integer
                          title: Is the showcase enabled
                          description: 1=Enabled 0=Disabled
                        signature:
                          type: string
                        total_comments_cnt:
                          type: integer
                        total_digg_1d_cnt:
                          type: integer
                          title: The increase in likes in the last 1 day
                        total_digg_30d_cnt:
                          type: integer
                          title: The increase in likes in the last 30 day
                        total_digg_7d_cnt:
                          type: integer
                          title: The increase in likes in the last 7 day
                        total_digg_90d_cnt:
                          type: integer
                          title: The increase in likes in the last 90 day
                        total_digg_cnt:
                          type: integer
                          title: Total likes
                        total_followers_1d_cnt:
                          type: integer
                          title: Recent 1-day follower increase
                        total_followers_30d_cnt:
                          type: integer
                          title: Recent 30-day follower increase
                        total_followers_7d_cnt:
                          type: integer
                          title: Recent 7-day follower increase
                        total_followers_90d_cnt:
                          type: integer
                          title: Recent 90-day follower increase
                        total_followers_cnt:
                          type: integer
                        total_following_cnt:
                          type: integer
                        total_live_cnt:
                          type: integer
                          title: Total live streams
                        total_live_sale_gmv_30d_amt:
                          type: integer
                          title: Livestream GMV in the last 30 days
                        total_post_video_cnt:
                          type: integer
                          title: Total number of published videos
                        total_product_30d_cnt:
                          type: integer
                          title: Number of products sold in the last 30 days
                        total_product_cnt:
                          type: integer
                          title: Total number of products promoted
                        total_sale_cnt:
                          type: integer
                          title: Total sales (estimated)
                        total_sale_gmv_30d_amt:
                          type: integer
                          title: GMV (estimated) in the last 30 days
                        total_sale_gmv_amt:
                          type: integer
                          title: Total GMV (estimated)
                        total_shares_cnt:
                          type: integer
                        total_video_product_30d_cnt:
                          type: integer
                          title: >-
                            Number of products sold via video in the last 30
                            days
                        total_video_sale_30d_cnt:
                          type: integer
                          title: Video sales in the last 30 days (estimated)
                        total_video_sale_gmv_30d_amt:
                          type: integer
                          title: >-
                            GMV from video marketing in the last 30 days
                            (estimated)
                        total_views_cnt:
                          type: integer
                        unique_id:
                          type: string
                        user_id:
                          type: string
                      x-apifox-orders:
                        - avatar
                        - avg_30d_price
                        - category
                        - contact_email
                        - ec_score
                        - first_crawl_dt
                        - gender
                        - influencer_video_duration_level
                        - influencer_video_publish_hour
                        - influencer_video_publish_week
                        - interaction_rate
                        - language
                        - most_category_product
                        - most_views_video
                        - nick_name
                        - off_mark
                        - per_video_product_views_avg_7d_cnt
                        - region
                        - sales_flag
                        - seller_id
                        - show_case_flag
                        - signature
                        - total_comments_cnt
                        - total_digg_1d_cnt
                        - total_digg_30d_cnt
                        - total_digg_7d_cnt
                        - total_digg_90d_cnt
                        - total_digg_cnt
                        - total_followers_1d_cnt
                        - total_followers_30d_cnt
                        - total_followers_7d_cnt
                        - total_followers_90d_cnt
                        - total_followers_cnt
                        - total_following_cnt
                        - total_live_cnt
                        - total_live_sale_gmv_30d_amt
                        - total_post_video_cnt
                        - total_product_30d_cnt
                        - total_product_cnt
                        - total_sale_cnt
                        - total_sale_gmv_30d_amt
                        - total_sale_gmv_amt
                        - total_shares_cnt
                        - total_video_product_30d_cnt
                        - total_video_sale_30d_cnt
                        - total_video_sale_gmv_30d_amt
                        - total_views_cnt
                        - unique_id
                        - user_id
                      x-apifox-ignore-properties: []
                  requestId:
                    type: string
                x-apifox-orders:
                  - 01K8QMZJRC9FWYSFFK7ZE8N1CA
                required:
                  - code
                  - message
                  - data
                  - requestId
                x-apifox-refs:
                  01K8QMZJRC9FWYSFFK7ZE8N1CA:
                    $ref: >-
                      #/components/schemas/%E8%BE%BE%E4%BA%BA%E5%88%97%E8%A1%A8-EchoTik
                x-apifox-ignore-properties:
                  - code
                  - message
                  - data
                  - requestId
              example:
                code: 0
                message: success
                data:
                  - avatar: >-
                      https://echosell-images.tos-ap-southeast-1.volces.com/user-avatar/252/MS4wLjABAAAAy5s11Qf2mzfNI54PWhh8-QncauRN9BJ1vC8cQywr13QlLh1LiN9Te9gg765ZFLfx.jpg
                    avg_30d_price: 0
                    category: Other
                    contact_email: ''
                    ec_score: 5.03
                    first_crawl_dt: 20260305
                    gender: ''
                    influencer_video_duration_level: '{"2m":0,"1m-2m":0,"30s-60s":16,"15s-30s":0,"15s":0}'
                    influencer_video_publish_hour: >-
                      {"00":0,"01":0,"02":0,"03":0,"04":2,"05":3,"06":1,"07":4,"08":3,"09":0,"10":2,"11":1,"12":0,"13":0,"14":0,"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0}
                    influencer_video_publish_week: '{"1":0,"2":0,"3":0,"4":0,"5":0,"6":15,"7":1}'
                    interaction_rate: 0.01
                    language: en
                    most_category_product: >-
                      [{ "category_name":"Beauty & Personal
                      Care","category_id":"601450"}]
                    most_views_video: '7611821797465541918'
                    nick_name: cchan590
                    off_mark: 0
                    per_video_product_views_avg_30d_cnt: 20439
                    per_video_product_views_avg_7d_cnt: 20439
                    per_views_avg_30d_cnt: 20439
                    product_category_list: >-
                      600154-809992-810504:1,604968-873352-979976:2,601450-849672-601696:3,601450-849160-601506:4,600024-859528-600148:5,600024-859528-600135:6
                    region: US
                    sales_flag: 1
                    seller_id: null
                    show_case_flag: 0
                    signature: 🌎:biv6888
                    total_comments_cnt: 57
                    total_digg_1d_cnt: 0
                    total_digg_30d_cnt: 0
                    total_digg_7d_cnt: 0
                    total_digg_90d_cnt: 0
                    total_digg_cnt: 14045
                    total_followers_1d_cnt: 0
                    total_followers_30d_cnt: 0
                    total_followers_7d_cnt: 0
                    total_followers_90d_cnt: 0
                    total_followers_cnt: 4173
                    total_following_cnt: 663
                    total_likes_cnt: 81474
                    total_live_cnt: 0
                    total_live_sale_gmv_30d_amt: 0
                    total_post_video_cnt: 18
                    total_product_30d_cnt: 0
                    total_product_cnt: 6
                    total_sale_cnt: 47
                    total_sale_gmv_30d_amt: 0
                    total_sale_gmv_amt: 466
                    total_shares_cnt: 223
                    total_video_product_30d_cnt: 0
                    total_video_sale_30d_cnt: 0
                    total_video_sale_gmv_30d_amt: 0
                    total_views_cnt: 217835
                    unique_id: cchan590
                    user_id: '104962950695723008'
                requestId: 0e0b5e10-2c7e-4f84-90e6-52e569e8bc36
          headers: {}
          x-apifox-name: 成功
      security:
        - basic: []
      x-apifox-folder: Influencer
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/7319100/apis/api-368555684-run
components:
  schemas:
    达人列表-EchoTik:
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
                title: Influencer avatar address
                description: >-
                  If you encounter an error, please use the download interface
                  to download the image.
              avg_30d_price:
                type: integer
                title: Average sales price in the past 30 days
              category:
                type: string
              contact_email:
                type: string
              ec_score:
                type: number
                title: echotik rating
              first_crawl_dt:
                type: integer
                title: First crawl time
              gender:
                type: string
              influencer_video_duration_level:
                type: string
                title: Video duration distribution
              influencer_video_publish_hour:
                type: string
                title: Video release time distribution
              influencer_video_publish_week:
                type: string
                title: Video release weekly distribution
              interaction_rate:
                type: integer
              language:
                type: string
              most_category_product:
                type: string
                title: Best-selling product category information
              most_views_video:
                type: string
              nick_name:
                type: string
              off_mark:
                type: integer
                title: Whether to cancel the account
                description: 0 indicates not cancelled; >0 may indicate cancelled.
              per_video_product_views_avg_7d_cnt:
                type: integer
                title: Average 7-day video views
              region:
                type: string
              sales_flag:
                type: integer
                title: Is the identifier for sale
                description: >-
                  >0 represents product sales, 1 = video sales, 2 = live
                  streaming sales, 3 = video + live streaming, 4 = opening a
                  product showcase.
              seller_id:
                type: string
                title: Link Shop ID
              show_case_flag:
                type: integer
                title: Is the showcase enabled
                description: 1=Enabled 0=Disabled
              signature:
                type: string
              total_comments_cnt:
                type: integer
              total_digg_1d_cnt:
                type: integer
                title: The increase in likes in the last 1 day
              total_digg_30d_cnt:
                type: integer
                title: The increase in likes in the last 30 day
              total_digg_7d_cnt:
                type: integer
                title: The increase in likes in the last 7 day
              total_digg_90d_cnt:
                type: integer
                title: The increase in likes in the last 90 day
              total_digg_cnt:
                type: integer
                title: Total likes
              total_followers_1d_cnt:
                type: integer
                title: Recent 1-day follower increase
              total_followers_30d_cnt:
                type: integer
                title: Recent 30-day follower increase
              total_followers_7d_cnt:
                type: integer
                title: Recent 7-day follower increase
              total_followers_90d_cnt:
                type: integer
                title: Recent 90-day follower increase
              total_followers_cnt:
                type: integer
              total_following_cnt:
                type: integer
              total_live_cnt:
                type: integer
                title: Total live streams
              total_live_sale_gmv_30d_amt:
                type: integer
                title: Livestream GMV in the last 30 days
              total_post_video_cnt:
                type: integer
                title: Total number of published videos
              total_product_30d_cnt:
                type: integer
                title: Number of products sold in the last 30 days
              total_product_cnt:
                type: integer
                title: Total number of products promoted
              total_sale_cnt:
                type: integer
                title: Total sales (estimated)
              total_sale_gmv_30d_amt:
                type: integer
                title: GMV (estimated) in the last 30 days
              total_sale_gmv_amt:
                type: integer
                title: Total GMV (estimated)
              total_shares_cnt:
                type: integer
              total_video_product_30d_cnt:
                type: integer
                title: Number of products sold via video in the last 30 days
              total_video_sale_30d_cnt:
                type: integer
                title: Video sales in the last 30 days (estimated)
              total_video_sale_gmv_30d_amt:
                type: integer
                title: GMV from video marketing in the last 30 days (estimated)
              total_views_cnt:
                type: integer
              unique_id:
                type: string
              user_id:
                type: string
            x-apifox-orders:
              - avatar
              - avg_30d_price
              - category
              - contact_email
              - ec_score
              - first_crawl_dt
              - gender
              - influencer_video_duration_level
              - influencer_video_publish_hour
              - influencer_video_publish_week
              - interaction_rate
              - language
              - most_category_product
              - most_views_video
              - nick_name
              - off_mark
              - per_video_product_views_avg_7d_cnt
              - region
              - sales_flag
              - seller_id
              - show_case_flag
              - signature
              - total_comments_cnt
              - total_digg_1d_cnt
              - total_digg_30d_cnt
              - total_digg_7d_cnt
              - total_digg_90d_cnt
              - total_digg_cnt
              - total_followers_1d_cnt
              - total_followers_30d_cnt
              - total_followers_7d_cnt
              - total_followers_90d_cnt
              - total_followers_cnt
              - total_following_cnt
              - total_live_cnt
              - total_live_sale_gmv_30d_amt
              - total_post_video_cnt
              - total_product_30d_cnt
              - total_product_cnt
              - total_sale_cnt
              - total_sale_gmv_30d_amt
              - total_sale_gmv_amt
              - total_shares_cnt
              - total_video_product_30d_cnt
              - total_video_sale_30d_cnt
              - total_video_sale_gmv_30d_amt
              - total_views_cnt
              - unique_id
              - user_id
            x-apifox-ignore-properties: []
        requestId:
          type: string
      required:
        - code
        - message
        - data
        - requestId
      x-apifox-orders:
        - code
        - message
        - data
        - requestId
      x-apifox-ignore-properties: []
      x-apifox-folder: ''
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
