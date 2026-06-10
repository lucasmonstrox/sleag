# Lista de Vídeos Relacionados à Loja — EchoTik

> **Fonte:** opendoc EchoTik (https://opendocs.echotik.live/en/372619673e0) · **`GET /api/v3/echotik/seller/video/list`** · **Auth:** Basic · **Tipo:** Offline (T+1)

## O que faz

Lista os **vídeos promocionais** associados a uma loja (`seller_id`) — os vídeos de criadores que divulgam/vendem produtos daquela loja — com métricas de engajamento (views, likes, comentários, shares) e vendas/GMV estimados por vídeo, ordenável por views/vendas/GMV. Serve para mapear o conteúdo orgânico que gera vendas para a loja.

## Request

### Headers
| Header | Obrigatório | Valor |
|---|---|---|
| `Authorization` | Sim | `Basic base64(username:password)` (credenciais em echotik.live/platform/api-keys) |

### Query params
| Param | Tipo | Obrigatório | Valores / Default | O que faz |
|---|---|---|---|---|
| `seller_id` | string | **Sim** | id da loja | Loja-alvo. |
| `seller_video_sort_field` | integer | Não | `1` = total_views_cnt · `2` = total_video_sale_cnt · `3` = total_video_sale_gmv_amt | Campo de ordenação. |
| `sort_type` | integer | Não | `0` = ascendente · `1` = descendente | Direção da ordenação. |
| `page_num` | integer | **Sim** | 1 … 100000 | Número da página (começa em 1). |
| `page_size` | integer | **Sim** | máx **10** | Itens por página. |

### Exemplo de chamada
```bash
curl -s "https://open.echotik.live/api/v3/echotik/seller/video/list?seller_id=7495539486134995508&seller_video_sort_field=3&sort_type=1&page_num=1&page_size=10" \
  -H "Authorization: Basic $TOKEN"
```

## Response

Envelope padrão: `{ code, message, data, requestId }` — `code = 0` + HTTP 200 = sucesso; `code != 0` ou HTTP 500 "Usage Limit Exceeded" = erro/cota.

### Campos de `data[]`
| Campo | Tipo | O que é |
|---|---|---|
| `avatar` | string | URL da foto de perfil do criador autor do vídeo. EchoTik recomenda baixar via interface de download. |
| `create_time` | string | Data/hora de publicação do vídeo. (formato não documentado — provavelmente timestamp ou data ISO como string.) |
| `nick_name` | string | Apelido/nome de exibição do criador autor. (sem descrição.) |
| `reflow_cover` | string | URL da capa/thumbnail do vídeo. EchoTik recomenda baixar via interface de download. |
| `region` | string | Região do vídeo/criador (ex.: `BR`). (sem descrição.) |
| `seller_id` | string | Id da loja associada (eco do parâmetro). (sem descrição.) |
| `total_comments_cnt` | integer | Total de comentários do vídeo. (sem descrição.) |
| `total_digg_cnt` | integer | Total de curtidas (likes) do vídeo. (sem descrição — "digg" = like no TikTok.) |
| `total_shares_cnt` | integer | Total de compartilhamentos do vídeo. (sem descrição.) |
| `total_video_sale_cnt` | integer | Vendas (unid.) atribuídas ao vídeo (estimado). |
| `total_video_sale_gmv_amt` | number | GMV atribuído ao vídeo (estimado). |
| `total_views_cnt` | integer | Total de visualizações do vídeo. (sem descrição.) |
| `user_id` | string | Id de usuário do criador autor. (sem descrição.) |
| `video_desc` | string | Descrição/legenda do vídeo. (sem descrição.) |
| `video_id` | string | Id do vídeo no TikTok. (sem descrição — chave do vídeo.) |

## Notas & gotchas
- **Strings numéricas**: `seller_id`, `user_id`, `video_id` como string.
- Vendas/GMV por vídeo são **estimados** e atribuídos à loja consultada.
- `avatar` e `reflow_cover` exigem o fluxo de download da EchoTik (links diretos podem expirar/ter controle de acesso).
- Dado **offline T+1**.

## Relevância para o TIKSPY
- Alimenta a aba **Vídeos por loja** na área de Concorrência: descobrir quais criativos em vídeo geram vendas para um concorrente.
- Cruzado com a memória "criativos em alta" do dashboard, ajuda a identificar formatos/ângulos vencedores por loja.

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
  /api/v3/echotik/seller/video/list:
    get:
      summary: Shop Related Video List - EchoTik
      deprecated: false
      description: >-
        Retrieve the list data of promotional videos associated with the store
        using the store's seller_id.
      tags:
        - Shop
      parameters:
        - name: seller_id
          in: query
          description: Shop ID
          required: true
          schema:
            type: string
        - name: seller_video_sort_field
          in: query
          description: >-
            List sorting enumeration.1=total_views_cnt 2=total_video_sale_cnt
            3=total_video_sale_gmv_amt
          required: false
          schema:
            type: integer
        - name: sort_type
          in: query
          description: Sort order. 0=asc 1=desc
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
                        avatar:
                          type: string
                          title: >-
                            For the profile picture/cover address of the
                            influencer, please use the download interface to
                            access it.
                        create_time:
                          type: string
                        nick_name:
                          type: string
                        reflow_cover:
                          type: string
                          title: >-
                            Video cover image URL. Please use the download
                            interface to access.
                        region:
                          type: string
                        seller_id:
                          type: string
                        total_comments_cnt:
                          type: integer
                        total_digg_cnt:
                          type: integer
                        total_shares_cnt:
                          type: integer
                        total_video_sale_cnt:
                          type: integer
                          title: Video sales (estimated)
                        total_video_sale_gmv_amt:
                          type: number
                          title: Video GMV (estimated)
                        total_views_cnt:
                          type: integer
                        user_id:
                          type: string
                        video_desc:
                          type: string
                        video_id:
                          type: string
                      x-apifox-orders:
                        - avatar
                        - create_time
                        - nick_name
                        - reflow_cover
                        - region
                        - seller_id
                        - total_comments_cnt
                        - total_digg_cnt
                        - total_shares_cnt
                        - total_video_sale_cnt
                        - total_video_sale_gmv_amt
                        - total_views_cnt
                        - user_id
                        - video_desc
                        - video_id
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
      x-apifox-folder: Shop
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/7319100/apis/api-372619673-run
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
