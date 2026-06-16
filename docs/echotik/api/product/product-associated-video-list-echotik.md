# Vídeos Associados ao Produto (Product Associated Video List - EchoTik)

> **Fonte:** opendoc EchoTik (https://opendocs.echotik.live/en/369171936e0) · **`GET /api/v3/echotik/product/video/list`** · **Auth:** Basic · **Tipo:** Offline (T+1)

## O que faz
Lista os **vídeos promocionais associados a um produto** (`product_id`) — os criativos do TikTok que promoveram/venderam aquele item. Biblioteca offline T+1. Retorna metadados do vídeo (capa, duração, hashtags, descrição, URL de playback), métricas de engajamento (views, likes, comentários, shares, salvamentos) e a venda/GMV estimados atribuídos ao vídeo. Dá pra filtrar por criador (`user_id`), faixa de data de publicação e ordenar por views/likes/shares/vendas/GMV/data. É a base de telas de **criativos em alta** (métrica nº 1 do dashboard).

## Request

### Headers
| Header | Obrigatório | Valor |
|---|---|---|
| `Authorization` | Sim | `Basic base64(username:password)` (credenciais em echotik.live/platform/api-keys) |

### Query params
| Param | Tipo | Obrigatório | Valores / Default | O que faz |
|---|---|---|---|---|
| `product_id` | string | Sim | — | Produto cujos vídeos associados se quer. |
| `user_id` | string | Não | — | Filtra os vídeos por criador específico. |
| `min_create_time` | int | Não | timestamp | Início da faixa de data de publicação do vídeo (provavelmente epoch em segundos — ver `create_time` no response). |
| `max_create_time` | int | Não | timestamp | Fim da faixa de data de publicação. |
| `product_video_sort_field` | int | Não | `1`=total_views_cnt, `2`=total_digg_cnt, `3`=total_shares_cnt, `4`=total_video_sale_cnt, `5`=total_video_sale_gmv_amt, `6`=create_time | Campo de ordenação. |
| `sort_type` | int | Não | `0`=asc, `1`=desc | Direção da ordenação. |
| `page_num` | int | Sim | 1..100000 | Página (começa em 1). |
| `page_size` | int | Sim | **máx. 10** | Itens por página. |

### Exemplo de chamada
```bash
curl -s "https://open.echotik.live/api/v3/echotik/product/video/list?product_id=1729382310407603945&product_video_sort_field=1&sort_type=1&page_num=1&page_size=10" \
  -H "Authorization: Basic $TOKEN"
```

## Response

Envelope padrão: `{ code, message, data, requestId }` — `code = 0` (e HTTP 200) significa sucesso; `code != 0` ou HTTP 500 com "Usage Limit Exceeded" = erro/cota.

### Campos de `data[]` (uma linha por vídeo)
| Campo | Tipo | O que é |
|---|---|---|
| `create_time` | string | Momento de publicação do vídeo. No exemplo (`"1628504241"`) é **epoch em segundos** (string). |
| `data_size` | string | Tamanho do arquivo de vídeo em bytes (não documentado pela EchoTik — provavelmente o peso do arquivo; ex.: `"3307751"`). |
| `duration` | int | Duração do vídeo em segundos (ex.: `38`). |
| `hash_tag` | string | Hashtags usadas no vídeo (texto com `#tags`). |
| `height` | string | Altura do vídeo em pixels (ex.: `"1024"`). |
| `play_addr` | string | URL de playback do vídeo. **Expira**; se vencida, use o endpoint de vídeo em tempo-real para obter um novo link. |
| `product_id` | string | ID do produto (ecoa o parâmetro). |
| `ratio` | string | Resolução/qualidade do vídeo (ex.: `"540p"`). |
| `reflow_cover` | string | URL da thumbnail/capa do vídeo (expira; usar endpoint de download se necessário). |
| `region` | string | Região do vídeo (código tipo `ID`, `US`). |
| `total_comments_cnt` | int | Total de comentários no vídeo. |
| `total_digg_cnt` | int | Total de curtidas (likes) no vídeo. |
| `total_favorites_cnt` | int | Total de salvamentos/favoritos do vídeo. |
| `total_shares_cnt` | int | Total de compartilhamentos do vídeo. |
| `total_video_sale_cnt` | int | Vendas totais **estimadas** atribuídas a este vídeo. |
| `total_video_sale_gmv_amt` | int | GMV total **estimado** atribuído a este vídeo. |
| `total_views_cnt` | int | Total de visualizações (views) do vídeo. |
| `user_id` | string | ID do criador autor do vídeo. |
| `video_desc` | string | Legenda/descrição do vídeo. |
| `video_id` | string | ID único do vídeo. |
| `width` | string | Largura do vídeo em pixels (ex.: `"576"`). |

### Exemplo de resposta
```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "create_time": "1628504241",
      "data_size": "3307751",
      "duration": 38,
      "hash_tag": "#TTshopsHome #lipstik #shade #beauty #wanita #makeup #YOU #FYP #VIRAL #ikatancinta",
      "height": "1024",
      "play_addr": "https://v9-id.tiktokcdn.com/.../?mime_type=video_mp4...",
      "product_id": "1729382310407603945",
      "ratio": "540p",
      "reflow_cover": "https://d304ly0se1sg9m.cloudfront.net/video-cover/594/6994372454948900122.jpeg",
      "region": "ID",
      "total_comments_cnt": 2,
      "total_digg_cnt": 20,
      "total_favorites_cnt": 1,
      "total_shares_cnt": 0,
      "total_video_sale_cnt": 0,
      "total_video_sale_gmv_amt": 0,
      "total_views_cnt": 2560,
      "user_id": "6788316924469380097",
      "video_desc": "Harga masih Promo Gaesss... Yakin gak mau ngoleksi? #TTshopsHome #lipstik ...",
      "video_id": "6994372454948900122",
      "width": "576"
    }
  ],
  "requestId": "bda9f054-17c9-4a1d-ab54-058626e545fa"
}
```

## Notas & gotchas
- `create_time` vem como **string** e em **epoch segundos** (não ms) — diferente do `review_timestamp` (ms) do endpoint de reviews.
- `play_addr` e `reflow_cover` **expiram** — não cacheie a URL por muito tempo; regenere via interface de vídeo em tempo-real / download de imagem.
- `data_size`, `height`, `width` vêm como **string** mas representam números.
- Vendas/GMV do vídeo são **ESTIMATIVAS**; unidade do GMV não documentada.
- `page_size` máx. 10; dado T+1.

## Relevância para o SLEAG
- **Criativos em alta** (métrica nº 1 do dashboard, junto com produtos mais vendidos): ranquear vídeos por views/vendas/GMV.
- Engenharia reversa de criativos vencedores: hashtags, descrição, duração, formato.
- Página de detalhe do produto (aba "vídeos") e descoberta de criadores via `user_id`.

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
  /api/v3/echotik/product/video/list:
    get:
      summary: Product Associated Video List - EchoTik
      deprecated: false
      description: >
        Retrieve the list data of promotional videos associated with the product
        by using the product's product_id.
      tags:
        - Product
      parameters:
        - name: product_id
          in: query
          description: ''
          required: true
          schema:
            type: string
        - name: user_id
          in: query
          description: ''
          required: false
          schema:
            type: string
        - name: min_create_time
          in: query
          description: ''
          required: false
          schema:
            type: integer
        - name: max_create_time
          in: query
          description: ''
          required: false
          schema:
            type: integer
        - name: product_video_sort_field
          in: query
          description: >-
            List sort field enumeration.1=total_views_cnt 2=total_digg_cnt
            3=total_shares_cnt 4=total_video_sale_cnt 5=total_video_sale_gmv_amt
            6=create_time
          required: false
          schema:
            type: integer
        - name: sort_type
          in: query
          description: Sort order 0=asc 1=desc
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
                          title: Video release time
                        data_size:
                          type: string
                        duration:
                          type: integer
                        hash_tag:
                          type: string
                        height:
                          type: string
                        play_addr:
                          type: string
                          title: >-
                            If the video playback address has expired, please
                            use the real-time video interface to obtain the
                            video playback address.
                        product_id:
                          type: string
                        ratio:
                          type: string
                        reflow_cover:
                          type: string
                          title: Video cover URL
                        region:
                          type: string
                        total_comments_cnt:
                          type: integer
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
                          title: Video total sales GMV (estimated)
                        total_views_cnt:
                          type: integer
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
                        - data_size
                        - duration
                        - hash_tag
                        - height
                        - play_addr
                        - product_id
                        - ratio
                        - reflow_cover
                        - region
                        - total_comments_cnt
                        - total_digg_cnt
                        - total_favorites_cnt
                        - total_shares_cnt
                        - total_video_sale_cnt
                        - total_video_sale_gmv_amt
                        - total_views_cnt
                        - user_id
                        - video_desc
                        - video_id
                        - width
                      x-apifox-ignore-properties: []
                  requestId:
                    type: string
                x-apifox-orders:
                  - 01K8T1Z7AFP3TFM7QDWJN9A0SP
                required:
                  - code
                  - message
                  - data
                  - requestId
                x-apifox-refs:
                  01K8T1Z7AFP3TFM7QDWJN9A0SP:
                    $ref: >-
                      #/components/schemas/%E5%95%86%E5%93%81%E5%85%B3%E8%81%94%E8%A7%86%E9%A2%91%E5%88%97%E8%A1%A8
                x-apifox-ignore-properties:
                  - code
                  - message
                  - data
                  - requestId
              example:
                code: 0
                message: success
                data:
                  - create_time: '1628504241'
                    data_size: '3307751'
                    duration: 38
                    hash_tag: >-
                      #TTshopsHome #lipstik #shade #beauty #wanita #makeup #YOU
                      #FYP #VIRAL #ikatancinta
                    height: '1024'
                    play_addr: >-
                      https://v9-id.tiktokcdn.com/20d1a5abf54218b96da3b349f39b5f2b/64a86f83/video/tos/useast2a/tos-useast2a-pve-0037-aiso/3845f2c4baa84c56acac7e45a3689042/?a=1233&ch=0&cr=13&dr=0&lr=all&cd=0%7C0%7C0%7C&cv=1&br=3334&bt=1667&cs=0&ds=6&ft=iusdqy54Zfc0PD1XC43Xg9wiaE~xvEeC~&mime_type=video_mp4&qs=0&rc=ZmQ8PDo2NTxpZWUzOTgzNEBpM3BlNzk6ZjhpNzMzZjgzM0BgLmMwYC8vXjIxLzAvYTE2YSNyL2tzcjRncTVgLS1kL2Nzcw%3D%3D&l=202307071402364D21C04E909C881CD895&btag=e00080000&cc=1c
                    product_id: '1729382310407603945'
                    ratio: 540p
                    reflow_cover: >-
                      https://d304ly0se1sg9m.cloudfront.net/video-cover/594/6994372454948900122.jpeg
                    region: ID
                    total_comments_cnt: 2
                    total_digg_cnt: 20
                    total_favorites_cnt: 1
                    total_shares_cnt: 0
                    total_video_sale_cnt: 0
                    total_video_sale_gmv_amt: 0
                    total_views_cnt: 2560
                    user_id: '6788316924469380097'
                    video_desc: >-
                      Harga masih Promo Gaesss... Yakin gak mau ngoleksi? ☺
                      #TTshopsHome #lipstik #shade #beauty #wanita #makeup #YOU
                      #FYP #VIRAL #ikatancinta
                    video_id: '6994372454948900122'
                    width: '576'
                requestId: bda9f054-17c9-4a1d-ab54-058626e545fa
          headers: {}
          x-apifox-name: 成功
      security:
        - basic: []
      x-apifox-folder: Product
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/7319100/apis/api-369171936-run
components:
  schemas:
    商品关联视频列表:
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
                title: Video release time
              data_size:
                type: string
              duration:
                type: integer
              hash_tag:
                type: string
              height:
                type: string
              play_addr:
                type: string
                title: >-
                  If the video playback address has expired, please use the
                  real-time video interface to obtain the video playback
                  address.
              product_id:
                type: string
              ratio:
                type: string
              reflow_cover:
                type: string
                title: Video cover URL
              region:
                type: string
              total_comments_cnt:
                type: integer
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
                title: Video total sales GMV (estimated)
              total_views_cnt:
                type: integer
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
              - data_size
              - duration
              - hash_tag
              - height
              - play_addr
              - product_id
              - ratio
              - reflow_cover
              - region
              - total_comments_cnt
              - total_digg_cnt
              - total_favorites_cnt
              - total_shares_cnt
              - total_video_sale_cnt
              - total_video_sale_gmv_amt
              - total_views_cnt
              - user_id
              - video_desc
              - video_id
              - width
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
