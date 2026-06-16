# Influencer Trends (Snapshot) - EchoTik

> **Fonte:** opendoc EchoTik (https://opendocs.echotik.live/en/368746551e0) · **`GET /api/v3/echotik/influencer/trend`** · **Auth:** Basic · **Tipo:** Offline (T+1)

## O que faz

Retorna a série histórica diária (snapshot) de um criador identificado por `user_id`, suportando até os últimos 180 dias. Cada linha de `data` representa um dia (`dt`) com os contadores acumulados e os incrementos diários. Use para montar gráficos de evolução de seguidores, curtidas, vendas e GMV de um criador específico — base das telas de "tendência/crescimento" de um perfil. Dados offline (T+1), então o dia corrente costuma não estar presente.

## Request

### Headers
| Header | Obrigatório | Valor |
|---|---|---|
| `Authorization` | Sim | `Basic base64(username:password)` (credenciais em echotik.live/platform/api-keys) |

### Query params
| Param | Tipo | Obrigatório | Valores / Default | O que faz |
|---|---|---|---|---|
| `user_id` | string | **Sim** | ID interno do criador | Define de qual criador buscar o histórico. |
| `start_date` | string | **Sim** | `yyyy-MM-dd` | Início do intervalo (até 180 dias atrás). |
| `end_date` | string | **Sim** | `yyyy-MM-dd` | Fim do intervalo. |
| `page_num` | integer | **Sim** | `1`..`100000` | Número da página (começa em 1). |
| `page_size` | integer | **Sim** | máx. `10` | Itens (dias) por página. Limite máximo de 10. |

### Exemplo de chamada
```bash
curl -s "https://open.echotik.live/api/v3/echotik/influencer/trend?user_id=104962950695723008&start_date=2026-01-01&end_date=2026-01-10&page_num=1&page_size=10" \
  -H "Authorization: Basic $TOKEN"
```

## Response

Envelope real: `{ code, message, data, requestId }` — `code = 0` significa sucesso. `data` é um array, uma linha por dia.

### Campos de `data` (uma linha por dia)
| Campo | Tipo | Obrig. | O que é |
|---|---|---|---|
| `dt` | string | Não | Data do snapshot (`yyyy-MM-dd`, ex.: `2025-08-02`). |
| `total_comments_cnt` | integer | Não | Total de comentários acumulados até a data. |
| `total_digg_1d_cnt` | integer | Não | Incremento de curtidas naquele dia (último 1 dia). |
| `total_digg_cnt` | integer | Não | Total de curtidas acumuladas até a data. |
| `total_followers_1d_cnt` | integer | Não | Variação de seguidores naquele dia (pode ser **negativa**, ex.: `-11`). |
| `total_followers_cnt` | integer | Não | Total de seguidores na data. |
| `total_live_cnt` | integer | Não | Total de sessões de live acumuladas. |
| `total_post_video_cnt` | integer | Não | Total de vídeos publicados acumulados. |
| `total_sale_1d_cnt` | integer | Não | Vendas naquele dia (estimado). |
| `total_sale_gmv_1d_amt` | integer | Não | GMV daquele dia (estimado). |
| `total_shares_cnt` | integer | Não | Total de compartilhamentos acumulados até a data. |
| `total_views_cnt` | integer | Não | Total de visualizações acumuladas até a data. |
| `user_id` | string | Não | ID interno do criador (eco do parâmetro). |

### Exemplo de resposta
```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "dt": "2025-08-02",
      "total_comments_cnt": 301218,
      "total_digg_1d_cnt": 2,
      "total_digg_cnt": 10922916,
      "total_followers_1d_cnt": -11,
      "total_followers_cnt": 181667,
      "total_live_cnt": 2,
      "total_post_video_cnt": 11210,
      "total_sale_1d_cnt": 0,
      "total_sale_gmv_1d_amt": 0,
      "total_shares_cnt": 26660,
      "total_views_cnt": 169385317,
      "user_id": "3993047"
    }
  ],
  "requestId": "bca6d3f8-54b9-455a-bd30-fef73969698c"
}
```

## Notas & gotchas
- Há mistura de **acumulados** (`total_*_cnt` sem sufixo de período) e **incrementos diários** (`*_1d_*`). Cuidado ao plotar para não somar duas naturezas.
- Janela máxima de **180 dias**; intervalos maiores provavelmente são truncados ou rejeitados.
- `page_size` máximo é **10** — para 180 dias serão ~18 páginas.
- Valores de venda/GMV são **estimados**.
- IDs vêm como **strings numéricas**.

## Relevância para o SLEAG
- Alimenta o gráfico de **evolução de um criador** dentro da ficha de criador (seguidores, curtidas, vendas ao longo do tempo).
- Secundário em relação ao ranking; é o drill-down temporal de um perfil já selecionado.

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
  /api/v3/echotik/influencer/trend:
    get:
      summary: Influencer Trends (Snapshot) - EchoTik
      deprecated: false
      description: >-
        Get a snapshot of an influencer's historical trends using their user_id,
        supporting up to the past 180 days.
      tags:
        - Influencer
      parameters:
        - name: user_id
          in: query
          description: ''
          required: true
          schema:
            type: string
        - name: start_date
          in: query
          description: Filter by time range, in yyyy-MM-dd format
          required: true
          schema:
            type: string
        - name: end_date
          in: query
          description: Filter by time range, in yyyy-MM-dd format
          required: true
          schema:
            type: string
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
                        dt:
                          type: string
                          title: date
                        total_comments_cnt:
                          type: integer
                        total_digg_1d_cnt:
                          type: integer
                          title: Likes increase in the past 1 day
                        total_digg_cnt:
                          type: integer
                        total_followers_1d_cnt:
                          type: integer
                        total_followers_cnt:
                          type: integer
                        total_live_cnt:
                          type: integer
                          title: Total live stream sessions
                        total_post_video_cnt:
                          type: integer
                          title: Total number of published videos
                        total_sale_1d_cnt:
                          type: integer
                          title: Sales in the past 1 day (estimated)
                        total_sale_gmv_1d_amt:
                          type: integer
                          title: GMV (estimated) in the past 1 day
                        total_shares_cnt:
                          type: integer
                        total_views_cnt:
                          type: integer
                        user_id:
                          type: string
                      x-apifox-orders:
                        - dt
                        - total_comments_cnt
                        - total_digg_1d_cnt
                        - total_digg_cnt
                        - total_followers_1d_cnt
                        - total_followers_cnt
                        - total_live_cnt
                        - total_post_video_cnt
                        - total_sale_1d_cnt
                        - total_sale_gmv_1d_amt
                        - total_shares_cnt
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
      x-apifox-folder: Influencer
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/7319100/apis/api-368746551-run
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
