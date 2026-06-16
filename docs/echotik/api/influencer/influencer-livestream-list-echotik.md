# Influencer Livestream List - EchoTik

> **Fonte:** opendoc EchoTik (https://opendocs.echotik.live/en/368755623e0) · **`GET /api/v3/echotik/influencer/live/list`** · **Auth:** Basic · **Tipo:** Offline (T+1)

## O que faz

Retorna a lista de transmissões ao vivo (lives) de um criador, identificado por `user_id`. Cada item traz dados de uma sessão de live: capa, horários de início/fim, audiência, engajamento, número de produtos e GMV estimado. Use para analisar a performance de lives de um criador (recorrência, duração, conversão). Dados offline (T+1).

## Request

### Headers
| Header | Obrigatório | Valor |
|---|---|---|
| `Authorization` | Sim | `Basic base64(username:password)` (credenciais em echotik.live/platform/api-keys) |

### Query params
| Param | Tipo | Obrigatório | Valores / Default | O que faz |
|---|---|---|---|---|
| `user_id` | string | **Sim** | ID interno do criador | Identifica o criador. Aqui só `user_id` é aceito (sem `unique_id`). |
| `page_num` | integer | **Sim** | `1`..`100000` | Número da página (começa em 1). |
| `page_size` | integer | **Sim** | máx. `10` | Itens por página. Limite máximo de 10. |

### Exemplo de chamada
```bash
curl -s "https://open.echotik.live/api/v3/echotik/influencer/live/list?user_id=6761507140245292038&page_num=1&page_size=10" \
  -H "Authorization: Basic $TOKEN"
```

## Response

Envelope padrão: `{ code, message, data, requestId }` — `code = 0` + HTTP 200 = sucesso; `code != 0` ou HTTP 500 "Usage Limit Exceeded" = erro/cota.

### Campos de `data` (uma linha por live)
| Campo | Tipo | Obrig. | O que é |
|---|---|---|---|
| `cover_url` | string | Não | URL da capa da live (expira; use download API se der erro). |
| `create_time` | integer | Não | Horário de início da transmissão (timestamp Unix). |
| `duration` | integer | Não | Duração da live (em segundos; confere com `finish_time - create_time`). |
| `finish_time` | integer | Não | Horário de término da transmissão (timestamp Unix). |
| `nick_name` | string | Não | Nome de exibição do criador. |
| `region` | string | Não | País/região da live. |
| `room_id` | string | Não | ID da sala/sessão de live. |
| `title` | string | Não | Título da live. |
| `total_comments_cnt` | integer | Não | Total de comentários durante a live. |
| `total_digg_cnt` | integer | Não | Total de curtidas na live. |
| `total_followers_cnt` | integer | Não | Seguidores ganhos durante a live (no exemplo, `6`). |
| `total_joins_cnt` | integer | Não | Total de espectadores que entraram na live. |
| `total_product_cnt` | integer | Não | Número de produtos apresentados na live. |
| `total_sale_cnt` | integer | Não | Total de vendas da live (estimado). |
| `total_sale_gmv_amt` | number | Não | GMV total da live (estimado, admite decimais). |
| `total_views_cnt` | integer | Não | Total de visualizações da live. |
| `user_id` | string | Não | ID interno do criador. |

### Exemplo de resposta
```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "cover_url": "https://echosell-images.tos-ap-southeast-1.volces.com/live-cover/36/7321509771910417194.jpeg",
      "create_time": 1704672004,
      "duration": 18009,
      "finish_time": 1704690013,
      "nick_name": "POP MART US SHOP",
      "region": "US",
      "room_id": "7321509771910417194",
      "title": "NEW FREEBIES!!!",
      "total_comments_cnt": 0,
      "total_digg_cnt": 0,
      "total_followers_cnt": 6,
      "total_joins_cnt": 7506,
      "total_product_cnt": 97,
      "total_sale_cnt": 121,
      "total_sale_gmv_amt": 2627.73,
      "total_views_cnt": 9335,
      "user_id": "7288986759428588590"
    }
  ],
  "requestId": "ec8e5830-2766-4199-a054-f5e5b8708b91"
}
```

## Notas & gotchas
- `create_time` e `finish_time` são **timestamps Unix** (integer); `duration` provavelmente em segundos — confirme contra `finish_time - create_time`.
- `cover_url` **expira**.
- `total_sale_gmv_amt` é **number** (pode ter decimais); `total_sale_cnt` é integer. Ambos **estimados**.
- `room_id` e `user_id` vêm como **string**.

## Relevância para o SLEAG
- Alimenta a aba de **lives por criador** dentro da ficha de criador (histórico de transmissões e conversão).
- Secundário frente a vídeos/produtos, mas relevante para nichos fortes em live commerce.

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
  /api/v3/echotik/influencer/live/list:
    get:
      summary: Influencer Livestream List - EchoTik
      deprecated: false
      description: >
        Retrieve the live stream list information of the influencer using
        user_id.
      tags:
        - Influencer
      parameters:
        - name: user_id
          in: query
          description: ''
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
                        cover_url:
                          type: string
                          title: Live stream cover address
                        create_time:
                          type: integer
                          title: Live broadcast start time
                        duration:
                          type: integer
                        finish_time:
                          type: integer
                          title: Live broadcast end time
                        nick_name:
                          type: string
                        region:
                          type: string
                        room_id:
                          type: string
                        title:
                          type: string
                        total_comments_cnt:
                          type: integer
                        total_digg_cnt:
                          type: integer
                          title: Total likes
                        total_followers_cnt:
                          type: integer
                        total_joins_cnt:
                          type: integer
                        total_product_cnt:
                          type: integer
                        total_sale_cnt:
                          type: integer
                          title: Total sales (estimated)
                        total_sale_gmv_amt:
                          type: number
                          title: Total GMV (estimated)
                        total_views_cnt:
                          type: integer
                        user_id:
                          type: string
                      x-apifox-orders:
                        - cover_url
                        - create_time
                        - duration
                        - finish_time
                        - nick_name
                        - region
                        - room_id
                        - title
                        - total_comments_cnt
                        - total_digg_cnt
                        - total_followers_cnt
                        - total_joins_cnt
                        - total_product_cnt
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
      x-apifox-folder: Influencer
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/7319100/apis/api-368755623-run
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
