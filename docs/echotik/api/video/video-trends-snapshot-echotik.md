# Video Trends (Snapshot) - EchoTik

> **Fonte:** opendoc EchoTik (https://opendocs.echotik.live/en/372686686e0) · **`GET /api/v3/echotik/video/trend`** · **Auth:** Basic · **Tipo:** Offline (T+1)

## O que faz
Retorna a série histórica (snapshots diários) das métricas de um vídeo identificado por `video_id`, cobrindo até os últimos **180 dias**. Cada item é a foto das métricas acumuladas numa data (`dt`). Use para montar gráficos de evolução de views/curtidas/vendas de um criativo ao longo do tempo. É a trend coletada pela EchoTik (offline, T+1); para trend interativa mais completa e recente existe a interface real-time de trend interativa (snapshot dos últimos 14 dias).

## Request

### Headers
| Header | Obrigatório | Valor |
|---|---|---|
| `Authorization` | Sim | `Basic base64(username:password)` |

### Query params
| Param | Tipo | Obrigatório | O que faz |
|---|---|---|---|
| `video_id` | string | Sim | ID do vídeo no TikTok cuja trend se quer. |
| `start_date` | string | Não | Início da janela, formato `yyyy-MM-dd` (filtro de intervalo; até 180 dias atrás). |
| `end_date` | string | Não | Fim da janela, formato `yyyy-MM-dd` (filtro de intervalo). |
| `page_num` | integer | Não | Página, começa em 1, máximo 100000. |
| `page_size` | integer | Não | Snapshots por página, máximo **10**. |

### Exemplo de chamada
```bash
curl -s "https://open.echotik.live/api/v3/echotik/video/trend?video_id=7560175324038728973&start_date=2025-10-01&end_date=2025-10-14&page_num=1&page_size=10" \
  -H "Authorization: Basic $TOKEN"
```

## Response

Envelope real: `{ code, message, data, requestId }` — `code = 0` significa sucesso. `data` é um array de snapshots diários.

### Campos de `data`
| Campo | Tipo | Obrig. | O que é |
|---|---|---|---|
| `dt` | string | Não | Data do snapshot (`yyyy-MM-dd`). Cada item é a foto das métricas naquele dia. |
| `total_comments_cnt` | integer | Não | Total de comentários acumulados na data. |
| `total_digg_cnt` | integer | Não | Total de curtidas acumuladas na data. |
| `total_favorites_cnt` | integer | Não | Total de favoritos/salvamentos acumulados na data. |
| `total_shares_cnt` | integer | Não | Total de compartilhamentos acumulados na data. |
| `total_video_sale_cnt` | string | Não | Vendas estimadas acumuladas na data (vem como string, ex.: `"1.00"`). |
| `total_video_sale_gmv_amt` | string | Não | GMV estimado acumulado na data (vem como string, ex.: `"7.99"`). |
| `total_views_cnt` | integer | Não | Total de views acumuladas na data. |
| `video_id` | string | Não | ID do vídeo (repetido em cada snapshot). |

### Exemplo de resposta
```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "dt": "2025-10-14",
      "total_comments_cnt": 0,
      "total_digg_cnt": 24,
      "total_favorites_cnt": 5,
      "total_shares_cnt": 2,
      "total_video_sale_cnt": "1.00",
      "total_video_sale_gmv_amt": "7.99",
      "total_views_cnt": 3122,
      "video_id": "7560175324038728973"
    }
  ],
  "requestId": "8a7b66ec-eb5c-447f-8f0e-4c23c6a98335"
}
```

## Notas & gotchas
- Os snapshots são **acumulados por data**, não incrementos diários; para obter o ganho diário subtraia `dt` de `dt-1` no cliente.
- `total_video_sale_cnt` e `total_video_sale_gmv_amt` vêm como **string** (e são estimativas) — parseie no cliente.
- Janela limitada a **180 dias**; datas anteriores não retornam dados.

## Relevância para o TIKSPY
- Alimenta o gráfico de evolução de um criativo na página de detalhe do vídeo (curva de views/vendas no tempo).
- Combinado com `video/list`, permite confirmar aceleração real de um "Criativo em alta" olhando a inclinação da curva nos últimos dias.

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
  /api/v3/echotik/video/trend:
    get:
      summary: Video Trends (Snapshot) - EchoTik
      deprecated: false
      description: >-
        Get historical trend snapshots of videos by video_id, supporting up to
        the past 180 days.


        Note: This is mainly the trend collected by EchoTik. For more complete
        interactive trend data, you can use the real-time video interactive
        trend interface (interactive snapshot of the last 14 days).
      tags:
        - Video
      parameters:
        - name: video_id
          in: query
          description: ''
          required: true
          schema:
            type: string
        - name: start_date
          in: query
          description: yyyy-MM-dd format, time range filter
          required: true
          schema:
            type: string
        - name: end_date
          in: query
          description: yyyy-MM-dd format, time range filter
          required: true
          schema:
            type: string
        - name: page_num
          in: query
          description: Page numbers, starting from 1, maximum 100000
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
                          title: time
                        total_comments_cnt:
                          type: integer
                        total_digg_cnt:
                          type: integer
                          title: Total likes
                        total_favorites_cnt:
                          type: integer
                        total_shares_cnt:
                          type: integer
                        total_video_sale_cnt:
                          type: string
                          title: Sales (estimated)
                        total_video_sale_gmv_amt:
                          type: string
                          title: Sales GMV (estimated)
                        total_views_cnt:
                          type: integer
                        video_id:
                          type: string
                      x-apifox-orders:
                        - dt
                        - total_comments_cnt
                        - total_digg_cnt
                        - total_favorites_cnt
                        - total_shares_cnt
                        - total_video_sale_cnt
                        - total_video_sale_gmv_amt
                        - total_views_cnt
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
      x-apifox-folder: Video
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/7319100/apis/api-372686686-run
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
