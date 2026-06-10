# Influencer Video List - EchoTik

> **Fonte:** opendoc EchoTik (https://opendocs.echotik.live/en/368754151e0) · **`GET /api/v3/echotik/influencer/video/list`** · **Auth:** Basic · **Tipo:** Offline (T+1)

## O que faz

Retorna a lista de vídeos de um criador, identificado por `user_id` ou `unique_id` (um dos dois obrigatório). Permite ordenar por views, vendas e GMV, e filtrar por produto. Inclui métricas de engajamento por vídeo e incrementos em janelas de 1/7/30 dias. Use para analisar os criativos de um criador — quais vídeos performam, quais geram venda, formato/duração. Dados offline (T+1).

## Request

### Headers
| Header | Obrigatório | Valor |
|---|---|---|
| `Authorization` | Sim | `Basic base64(username:password)` (credenciais em echotik.live/platform/api-keys) |

### Query params
| Param | Tipo | Obrigatório | Valores / Default | O que faz |
|---|---|---|---|---|
| `user_id` | string | Condicional | ID interno do criador | Identifica o criador. **Obrigatório se `unique_id` não for enviado.** |
| `unique_id` | string | Condicional | @handle do TikTok | Identifica o criador. **Obrigatório se `user_id` não for enviado.** |
| `product_id` | string | Não | ID de produto | Filtra apenas os vídeos que promovem o produto informado. |
| `influencer_video_sort_field` | integer | Não | `1`=total_views_cnt, `2`=total_video_sale_cnt, `3`=total_video_sale_gmv_amt, `4`=create_time | Campo de ordenação. |
| `sort_type` | integer | Não | `0`=asc, `1`=desc | Direção da ordenação. |
| `page_num` | integer | **Sim** | `1`..`100000` | Número da página (começa em 1). |
| `page_size` | integer | **Sim** | máx. `10` | Itens por página. Limite máximo de 10. |

### Exemplo de chamada
```bash
curl -s "https://open.echotik.live/api/v3/echotik/influencer/video/list?unique_id=victoriassecret&influencer_video_sort_field=1&sort_type=1&page_num=1&page_size=10" \
  -H "Authorization: Basic $TOKEN"
```

## Response

Envelope padrão: `{ code, message, data, requestId }` — `code = 0` + HTTP 200 = sucesso; `code != 0` ou HTTP 500 "Usage Limit Exceeded" = erro/cota.

### Campos de `data[]` (uma linha por vídeo)
| Campo | Tipo | O que é |
|---|---|---|
| `create_time` | string | Timestamp Unix (segundos, em string) da publicação do vídeo. |
| `created_by_ai` | string | Flag se o vídeo foi gerado por IA (`"true"`/`"false"` como string). |
| `data_size` | string | Tamanho do arquivo de vídeo em bytes (string). |
| `duration` | integer | Duração do vídeo em segundos. |
| `height` | string | Altura do vídeo em pixels (string). |
| `ratio` | string | Resolução/qualidade do vídeo (ex.: `720p`). |
| `reflow_cover` | string | URL da capa (thumbnail). Se sem permissão de acesso, use o download API (URLs expiram). |
| `region` | string | País/região do vídeo. |
| `sales_flag` | integer | Vende produto: `1`=sim, `0`=não. |
| `total_comments_cnt` | integer | Total de comentários. |
| `total_digg_1d_cnt` | integer | Incremento de curtidas no último 1 dia. |
| `total_digg_30d_cnt` | integer | Incremento de curtidas em 30 dias. |
| `total_digg_7d_cnt` | integer | Incremento de curtidas em 7 dias. |
| `total_digg_cnt` | integer | Total de curtidas. |
| `total_favorites_cnt` | integer | Total de favoritos/salvamentos. |
| `total_shares_cnt` | integer | Total de compartilhamentos. |
| `total_video_sale_cnt` | integer | Total de vendas atribuídas ao vídeo (estimado). |
| `total_video_sale_gmv_amt` | integer | GMV total de vendas do vídeo (estimado). |
| `total_views_1d_cnt` | integer | Incremento de visualizações no último 1 dia. |
| `total_views_30d_cnt` | integer | Incremento de visualizações em 30 dias. |
| `total_views_7d_cnt` | integer | Incremento de visualizações em 7 dias. |
| `total_views_cnt` | integer | Total de visualizações. |
| `unique_id` | string | @handle do criador. |
| `user_id` | string | ID interno do criador. |
| `video_desc` | string | Legenda/descrição do vídeo (inclui hashtags). |
| `video_id` | string | ID do vídeo no TikTok. |
| `width` | string | Largura do vídeo em pixels (string). |

> **Campos extras no Example** (fora da lista de campos do schema): `is_ad` (integer; flag se é anúncio pago, `0`=orgânico) e `video_products` (string JSON-array de IDs de produto vinculados ao vídeo, ex.: `"[1732322694475518433]"`).

### Exemplo de resposta
```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "create_time": "1779728612",
      "created_by_ai": "false",
      "data_size": "2595127",
      "duration": 29,
      "height": "1280",
      "is_ad": 0,
      "ratio": "720p",
      "reflow_cover": "https://echosell-images.tos-ap-southeast-1.volces.com/video-cover/830/7643876071212944654.jpg",
      "region": "US",
      "sales_flag": 1,
      "total_comments_cnt": 32,
      "total_digg_1d_cnt": 877,
      "total_digg_30d_cnt": 877,
      "total_digg_7d_cnt": 877,
      "total_digg_cnt": 877,
      "total_favorites_cnt": 48,
      "total_shares_cnt": 22,
      "total_video_sale_cnt": 0,
      "total_video_sale_gmv_amt": 0,
      "total_views_1d_cnt": 31640,
      "total_views_30d_cnt": 31640,
      "total_views_7d_cnt": 31640,
      "total_views_cnt": 31640,
      "unique_id": "victoriassecret",
      "user_id": "6761507140245292038",
      "video_desc": "Falls down? Uncomfortable? Not for you? The *new* Invisible by VS Bandeau Strapless Bra fixes that. #victoriassecret #summerlooks ",
      "video_id": "7643876071212944654",
      "video_products": "[1732322694475518433]",
      "width": "720"
    }
  ],
  "requestId": "1c3a14cd-ff12-4df4-b3ac-66084c4cca33"
}
```

## Notas & gotchas
- `create_time` é **Unix timestamp em segundos como string** — converta antes de formatar data.
- Dimensões (`height`/`width`/`data_size`) e flags (`created_by_ai`) vêm como **string**, não number/boolean.
- `reflow_cover` **expira**; use download API se necessário.
- GMV e vendas por vídeo são **estimados**.
- `video_products` no exemplo é array dentro de string — precisa de parse.

## Relevância para o TIKSPY
- Alimenta a análise de **criativos por criador** ("criativos em alta" no nível do perfil) e o cruzamento vídeo→produto.
- Apoia a métrica nº 1 do dashboard (criativos em alta) quando aplicada a um criador específico.

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
  /api/v3/echotik/influencer/video/list:
    get:
      summary: Influencer Video List - EchoTik
      deprecated: false
      description: >-
        Retrieve the list of videos from the influencer using either user_id or
        unique_id. One of user_id or unique_id is required.
      tags:
        - Influencer
      parameters:
        - name: user_id
          in: query
          description: ''
          required: false
          schema:
            type: string
        - name: unique_id
          in: query
          description: ''
          required: false
          schema:
            type: string
        - name: product_id
          in: query
          description: Filter by Product ID
          required: false
          schema:
            type: string
        - name: influencer_video_sort_field
          in: query
          description: >-
            Video list sorting field 1=total_views_cnt 2=total_video_sale_cnt
            3=total_video_sale_gmv_amt 4=create_time
          required: false
          schema:
            type: integer
        - name: sort_type
          in: query
          description: Sort order, 0=asc 1=desc
          required: false
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
                        create_time:
                          type: string
                        created_by_ai:
                          type: string
                        data_size:
                          type: string
                        duration:
                          type: integer
                        height:
                          type: string
                        ratio:
                          type: string
                        reflow_cover:
                          type: string
                          title: >-
                            Cover image URL; if you do not have permission to
                            request it, please use the download API.
                        region:
                          type: string
                        sales_flag:
                          type: integer
                          title: >-
                            Whether to sell goods, sold goods = 1, non-sold
                            goods = 0
                        total_comments_cnt:
                          type: integer
                        total_digg_1d_cnt:
                          type: integer
                          title: Likes increase in the past 1 day
                        total_digg_30d_cnt:
                          type: integer
                          title: Likes increase in the past 30 day
                        total_digg_7d_cnt:
                          type: integer
                          title: Likes increase in the past 7 day
                        total_digg_cnt:
                          type: integer
                        total_favorites_cnt:
                          type: integer
                        total_shares_cnt:
                          type: integer
                        total_video_sale_cnt:
                          type: integer
                          title: Total video sales (estimated)
                        total_video_sale_gmv_amt:
                          type: integer
                          title: Total video sales GMV (estimated)
                        total_views_1d_cnt:
                          type: integer
                          title: Increment in playback volume over the past 1 day
                        total_views_30d_cnt:
                          type: integer
                          title: Increment in playback volume over the past 30 day
                        total_views_7d_cnt:
                          type: integer
                          title: Increment in playback volume over the past 7 day
                        total_views_cnt:
                          type: integer
                        unique_id:
                          type: string
                        user_id:
                          type: string
                        video_desc:
                          type: string
                        video_id:
                          type: string
                        width:
                          type: string
                      x-apifox-orders:
                        - create_time
                        - created_by_ai
                        - data_size
                        - duration
                        - height
                        - ratio
                        - reflow_cover
                        - region
                        - sales_flag
                        - total_comments_cnt
                        - total_digg_1d_cnt
                        - total_digg_30d_cnt
                        - total_digg_7d_cnt
                        - total_digg_cnt
                        - total_favorites_cnt
                        - total_shares_cnt
                        - total_video_sale_cnt
                        - total_video_sale_gmv_amt
                        - total_views_1d_cnt
                        - total_views_30d_cnt
                        - total_views_7d_cnt
                        - total_views_cnt
                        - unique_id
                        - user_id
                        - video_desc
                        - video_id
                        - width
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
                  - create_time: '1779728612'
                    created_by_ai: 'false'
                    data_size: '2595127'
                    duration: 29
                    height: '1280'
                    is_ad: 0
                    ratio: 720p
                    reflow_cover: >-
                      https://echosell-images.tos-ap-southeast-1.volces.com/video-cover/830/7643876071212944654.jpg
                    region: US
                    sales_flag: 1
                    total_comments_cnt: 32
                    total_digg_1d_cnt: 877
                    total_digg_30d_cnt: 877
                    total_digg_7d_cnt: 877
                    total_digg_cnt: 877
                    total_favorites_cnt: 48
                    total_shares_cnt: 22
                    total_video_sale_cnt: 0
                    total_video_sale_gmv_amt: 0
                    total_views_1d_cnt: 31640
                    total_views_30d_cnt: 31640
                    total_views_7d_cnt: 31640
                    total_views_cnt: 31640
                    unique_id: victoriassecret
                    user_id: '6761507140245292038'
                    video_desc: >-
                      Falls down? Uncomfortable? Not for you? The *new*
                      Invisible by VS Bandeau Strapless Bra fixes that.
                      #victoriassecret #summerlooks 
                    video_id: '7643876071212944654'
                    video_products: '[1732322694475518433]'
                    width: '720'
                requestId: 1c3a14cd-ff12-4df4-b3ac-66084c4cca33
          headers: {}
          x-apifox-name: 成功
      security:
        - basic: []
      x-apifox-folder: Influencer
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/7319100/apis/api-368754151-run
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
