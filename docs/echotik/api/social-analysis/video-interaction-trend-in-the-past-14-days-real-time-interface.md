# Tendência de Interação do Vídeo nos Últimos 14 Dias (Video Interaction Trend – 14d)

> **Fonte:** opendoc EchoTik (https://opendocs.echotik.live/en/375084674e0) · **`GET /api/v3/realtime/video/trend_insight`** · **Auth:** Basic · **Tipo:** Tempo-real

## O que faz
Retorna, para um `video_id`, três blocos: (1) um resumo textual (`video_summary`), (2) os totais atuais de interação (`current_interaction`: salvos, comentários, views, curtidas) e (3) a **série dos últimos 14 dias** (`14d_interaction`) com um ponto por dia para favorites/comments/views/likes. Os valores diários parecem ser **deltas** (incremento do dia — podem vir **negativos**, ex. comentários removidos), não acumulados. Serve para ver a curva de crescimento de um criativo. É **Tempo-real**: a EchoTik consulta o TikTok na hora; sujeito a risk control: `code=500` → retry. Evite QPS alto.

## Request

### Headers
| Header | Obrigatório | Valor |
|---|---|---|
| `Authorization` | Sim | `Basic base64(username:password)` |

### Query params
| Param | Tipo | Obrigatório | O que faz |
|---|---|---|---|
| `video_id` | string | Sim | ID do vídeo no TikTok. Ex: `7561644792577363221`. |

### Exemplo de chamada
```bash
curl -s "https://open.echotik.live/api/v3/realtime/video/trend_insight?video_id=7561644792577363221" \
  -H "Authorization: Basic $TOKEN"
```

## Response

Envelope: `{ code, message, data, requestId }` — `code = 0` (HTTP 200) = sucesso. `code=500` = risk control → retry.

> Os pontos das séries de `14d_interaction` vêm no wrapper `{ message: { data_source, status, timestamp }, value }`: `value` é o número do dia, `message.timestamp` é a data do ponto (epoch segundos, 00:00 UTC).

### Campos de `data`
| Campo | Tipo | O que é |
|---|---|---|
| `video_summary` | objeto | Resumo do vídeo: `title` (ex: `Overview`) + `content` (texto explicativo gerado). |
| `current_interaction` | objeto | Totais atuais do vídeo: `favorites` (salvos), `comments`, `views`, `likes`. |
| `14d_interaction` | objeto | Séries temporais de 14 dias, uma por métrica. Cada série é um array de pontos diários (wrapper `message`/`value`). |
| `14d_interaction.favorites` | array | Série diária de salvos (favoritos). `value` = valor do dia. |
| `14d_interaction.comments` | array | Série diária de comentários. `value` pode ser **negativo** (ex: comentários removidos). |
| `14d_interaction.views` | array | Série diária de visualizações/plays. |
| `14d_interaction.likes` | array | Série diária de curtidas. |
| `…[].value` | número | Valor do ponto (incremento do dia; pode ser negativo). |
| `…[].message.timestamp` | inteiro | Data do ponto (epoch segundos). |
| `…[].message.data_source` | inteiro | Origem do dado (ex: `3`). |
| `…[].message.status` | inteiro | Status do ponto (`1` = ok). |

### Exemplo de resposta
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "video_summary": {
      "title": "Overview",
      "content": "This is the creator's most-viewed post. Study the content, style, and techniques used and apply them in your posts to gain more reach or engagement."
    },
    "current_interaction": {
      "favorites": 71869,
      "comments": 3847,
      "views": 56008699,
      "likes": 282729
    },
    "14d_interaction": {
      "favorites": [
        { "message": { "data_source": 3, "status": 1, "timestamp": 1760572800 }, "value": 12061 },
        { "message": { "data_source": 3, "status": 1, "timestamp": 1760659200 }, "value": 6698 },
        { "message": { "data_source": 3, "status": 1, "timestamp": 1761782400 }, "value": 466 }
      ],
      "comments": [
        { "message": { "data_source": 3, "status": 1, "timestamp": 1760572800 }, "value": 339 },
        { "message": { "data_source": 3, "status": 1, "timestamp": 1760659200 }, "value": -337 },
        { "message": { "data_source": 3, "status": 1, "timestamp": 1761696000 }, "value": -3018 },
        { "message": { "data_source": 3, "status": 1, "timestamp": 1761782400 }, "value": 3200 }
      ],
      "views": [
        { "message": { "data_source": 3, "status": 1, "timestamp": 1760572800 }, "value": 5729489 },
        { "message": { "data_source": 3, "status": 1, "timestamp": 1761782400 }, "value": 696926 }
      ],
      "likes": [
        { "message": { "data_source": 3, "status": 1, "timestamp": 1760572800 }, "value": 35916 },
        { "message": { "data_source": 3, "status": 1, "timestamp": 1761782400 }, "value": 2044 }
      ]
    }
  },
  "requestId": "6706d230-2707-4c9d-ae83-6517ee7c0be6"
}
```

## Notas & gotchas
- Tempo-real: `code=500` → retry; sem QPS alto.
- **Valores diários são deltas** (incremento do dia), podem ser **negativos** (ex: `comments: -337`). Para acumulado, some os pontos ou use `current_interaction`.
- Cada série tem 15 pontos no exemplo (dias). `message.timestamp` em epoch segundos (00:00 UTC) ordena cronologicamente.
- Janela fixa de 14 dias; sem parâmetro para ajustar o período.
- `current_interaction` traz os totais "ao vivo" (snapshot), enquanto `14d_interaction` é a série; os nomes diferem (`favorites` vs salvos).

## Relevância para o TIKSPY
- **Enriquecimento de criativo:** sparkline/gráfico de crescimento mostra *quando* e *quão rápido* um vídeo viralizou — base para destacar "criativos em alta", métrica nº 1 do dashboard.
- Insumo direto para gráfico de tendência na ficha/detalhe de um vídeo.

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
  /api/v3/realtime/video/trend_insight:
    get:
      summary: Video interaction trend in the past 14 days - Real-time interface
      deprecated: false
      description: >-
        Retrieve the collection, comment, like, and play data for this video and
        the recent 14 days via video_id.

        Real-time data without field descriptions, the interfaces are all native
        TikTok return content.


        Note: Real-time interfaces may encounter risk control detection at any
        time. If code=500 is returned, please retry.
      tags:
        - Social media analysis
      parameters:
        - name: video_id
          in: query
          description: Video ID
          required: true
          example: '7561644792577363221'
          schema:
            type: string
      responses:
        '200':
          description: ''
          content:
            application/json:
              schema:
                type: object
                properties: {}
                x-apifox-orders: []
                description: >-
                  Real-time data without field descriptions, interfaces are all
                  native TikTok return content
          headers: {}
          x-apifox-name: 成功
      security:
        - basic: []
      x-apifox-folder: Social media analysis
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/7319100/apis/api-375084674-run
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
