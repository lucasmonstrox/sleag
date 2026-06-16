# Lista de Lives Relacionadas à Loja — EchoTik

> **Fonte:** opendoc EchoTik (https://opendocs.echotik.live/en/372633248e0) · **`GET /api/v3/echotik/seller/live/list`** · **Auth:** Basic · **Tipo:** Offline (T+1)

## O que faz

Lista as **transmissões ao vivo (lives)** associadas a uma loja (`seller_id`) que venderam produtos dela, com métricas de audiência (pico de espectadores, total de views, entradas), duração e vendas/GMV estimados por live, ordenável por views/vendas/GMV. Serve para analisar a operação de live commerce de uma loja.

## Request

### Headers
| Header | Obrigatório | Valor |
|---|---|---|
| `Authorization` | Sim | `Basic base64(username:password)` (credenciais em echotik.live/platform/api-keys) |

### Query params
| Param | Tipo | Obrigatório | Valores / Default | O que faz |
|---|---|---|---|---|
| `seller_id` | string | **Sim** | id da loja | Loja-alvo. |
| `seller_live_sort_field` | integer | Não | `1` = total_views_cnt · `2` = total_sale_cnt · `3` = total_sale_gmv_amt | Campo de ordenação. |
| `sort_type` | integer | Não | `0` = ascendente · `1` = descendente | Direção da ordenação. |
| `page_num` | integer | **Sim** | 1 … 100000 | Número da página (começa em 1). |
| `page_size` | integer | **Sim** | máx **10** | Itens por página. |

### Exemplo de chamada
```bash
curl -s "https://open.echotik.live/api/v3/echotik/seller/live/list?seller_id=7495539486134995508&seller_live_sort_field=3&sort_type=1&page_num=1&page_size=10" \
  -H "Authorization: Basic $TOKEN"
```

## Response

Envelope padrão: `{ code, message, data, requestId }` — `code = 0` + HTTP 200 = sucesso; `code != 0` ou HTTP 500 "Usage Limit Exceeded" = erro/cota.

### Campos de `data[]`
| Campo | Tipo | O que é |
|---|---|---|
| `avatar` | string | URL da foto de perfil do criador que conduziu a live. EchoTik recomenda baixar via interface de download. |
| `cover_url` | string | URL da capa/thumbnail da live. EchoTik recomenda baixar via interface de download. |
| `create_time` | integer | Horário de início da transmissão. (timestamp epoch — tipo `integer`.) |
| `duration` | integer | Duração da live em **segundos**. |
| `finish_time` | integer | Horário de término da transmissão. (timestamp epoch — tipo `integer`.) |
| `max_views_cnt` | integer | Pico de espectadores simultâneos durante a live. |
| `nick_name` | string | Apelido/nome de exibição do criador. (sem descrição.) |
| `region` | string | Região da live/criador (ex.: `BR`). (sem descrição.) |
| `room_id` | string | Id da sala da live (Live Stream ID). |
| `seller_id` | string | Id da loja associada (eco do parâmetro). (sem descrição.) |
| `title` | string | Título da live. (sem descrição.) |
| `total_joins_cnt` | integer | Nº de espectadores que entraram na live (audiência total de entradas). |
| `total_sale_cnt` | integer | Vendas (unid.) atribuídas à live (estimado). |
| `total_sale_gmv_amt` | integer | GMV atribuído à live (estimado). |
| `total_views_cnt` | integer | Total de visualizações da live. |
| `user_id` | string | Id de usuário do criador que conduziu a live. (sem descrição.) |

## Notas & gotchas
- **Strings numéricas**: `seller_id`, `user_id`, `room_id` como string.
- `create_time`/`finish_time` são **timestamps inteiros** (epoch); `duration` em **segundos**. Atenção ao converter (provável epoch em segundos ou ms — validar contra um caso real).
- `total_joins_cnt` (entradas) ≠ `max_views_cnt` (pico simultâneo) ≠ `total_views_cnt` (views totais) — três métricas distintas de audiência.
- Vendas/GMV **estimados**.
- Dado **offline T+1**.

## Relevância para o SLEAG
- Alimenta a aba **Lives por loja** na área de Concorrência: identificar quais transmissões geram mais GMV para um concorrente e a cadência de lives.
- Cruzado com `seller/influencer/list`, mostra quais criadores fazem as lives mais lucrativas de uma loja.

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
  /api/v3/echotik/seller/live/list:
    get:
      summary: Shop Related Live Stream List - EchoTik
      deprecated: false
      description: >-
        Retrieve the live stream list data associated with the store using the
        store's seller_id.
      tags:
        - Shop
      parameters:
        - name: seller_id
          in: query
          description: Shop Id
          required: true
          schema:
            type: string
        - name: seller_live_sort_field
          in: query
          description: >-
            List sorting enumeration.1=total_views_cnt 2=total_sale_cnt
            3=total_sale_gmv_amt
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
                        avatar:
                          type: string
                          title: >-
                            For the profile picture of the influencer, please
                            use the download interface to access it.
                        cover_url:
                          type: string
                          title: >-
                            Live stream cover image URL. Please use the download
                            interface to access.
                        create_time:
                          type: integer
                          title: Live broadcast start time
                        duration:
                          type: integer
                          title: Live stream duration (seconds)
                        finish_time:
                          type: integer
                          title: Live broadcast end time
                        max_views_cnt:
                          type: integer
                          title: Peak number of people
                        nick_name:
                          type: string
                        region:
                          type: string
                        room_id:
                          type: string
                          title: Live Stream ID
                        seller_id:
                          type: string
                        title:
                          type: string
                        total_joins_cnt:
                          type: integer
                          title: Number of viewers
                        total_sale_cnt:
                          type: integer
                          title: Livestream sales (estimated)
                        total_sale_gmv_amt:
                          type: integer
                          title: Live streaming GMV (estimated)
                        total_views_cnt:
                          type: integer
                          title: Total number of views
                        user_id:
                          type: string
                      x-apifox-orders:
                        - avatar
                        - cover_url
                        - create_time
                        - duration
                        - finish_time
                        - max_views_cnt
                        - nick_name
                        - region
                        - room_id
                        - seller_id
                        - title
                        - total_joins_cnt
                        - total_sale_cnt
                        - total_sale_gmv_amt
                        - total_views_cnt
                        - user_id
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
      x-run-in-apifox: https://app.apifox.com/web/project/7319100/apis/api-372633248-run
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
