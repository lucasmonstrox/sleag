# Marco / Milestone do Criador (Creator Milestone)

> **Fonte:** opendoc EchoTik (https://opendocs.echotik.live/en/375085895e0) · **`GET /api/v3/realtime/influencer/milestones_insight`** · **Auth:** Basic · **Tipo:** Tempo-real

## O que faz
Retorna os **marcos** (milestones) na trajetória de um criador a partir do `user_id`: conquistas como "começou a postar no TikTok", "atingiu 10K/100K/500K/1M seguidores", cada uma com data (mês/dia/ano), um resumo gerado e os 3 vídeos de destaque daquele período. Também devolve um bloco `creator_info` com avatar, nickname, handle, contagem de seguidores e curtidas. Por ser **Tempo-real**, a EchoTik consulta o TikTok ao vivo (fonte de "Creation Inspiration"); sujeito a risk control: se vier `code=500`, repita a chamada (retry). Evite QPS alto.

## Request

### Headers
| Header | Obrigatório | Valor |
|---|---|---|
| `Authorization` | Sim | `Basic base64(username:password)` |

### Query params
| Param | Tipo | Obrigatório | O que faz |
|---|---|---|---|
| `user_id` | string | Sim | ID numérico do criador no TikTok (não o `@handle`). Ex: `6754281736047723521`. |

### Exemplo de chamada
```bash
curl -s "https://open.echotik.live/api/v3/realtime/influencer/milestones_insight?user_id=6754281736047723521" \
  -H "Authorization: Basic $TOKEN"
```

## Response

Envelope: `{ code, message, data, requestId }` — `code = 0` (HTTP 200) = sucesso. `code=500` = risk control → retry.

> **Padrão de wrapper:** quase todo valor de campo vem envolto em `{ message: { data_source, status, timestamp }, value: <valor> }`. O dado em si está em `value`; `message` é metadado de origem/frescor (timestamp em epoch segundos).

### Campos de `data`
| Campo | Tipo | O que é |
|---|---|---|
| `milestone_list` | array | Lista de marcos do criador (do mais recente ao mais antigo). |
| `milestone_list[].milestone` | inteiro | Código/ordem do marco (ex: `6`=1M seguidores, `5`=500K, `4`=100K, `3`=10K, `1`=começou a postar). |
| `milestone_list[].milestone_title` | wrapper→string | Título do marco em `value` (ex: `Reached 1M followers`, `Started posting on TikTok`). |
| `milestone_list[].milestone_year` | wrapper→string | Ano do marco em `value` (ex: `2022`). |
| `milestone_list[].milestone_month_day` | wrapper→string | Mês/dia do marco em `value`, formato `M/D` (ex: `3/21`). |
| `milestone_list[].creator_summary` | wrapper→string | Resumo textual do período em `value` (ex: `53 posts published, with an average of 2.2M views per post...`). Pode vir vazio ou `No public data to display`. |
| `milestone_list[].top_3_items` | array<wrapper→objeto> | Até 3 vídeos de destaque do marco. Cada item tem `value` = objeto de vídeo (ver abaixo). Ausente em marcos sem dados públicos. |
| `…top_3_items[].value.aweme_id` | string | ID do vídeo. |
| `…top_3_items[].value.aweme_type` | inteiro | Tipo do vídeo (`0`). |
| `…top_3_items[].value.create_time` | inteiro | Data de publicação (epoch segundos). |
| `…top_3_items[].value.desc` | string | Descrição/legenda do vídeo. |
| `…top_3_items[].value.statistics` | objeto | Métricas: `play_count`, `digg_count` (curtidas), `comment_count`, `share_count`, `collect_count` (salvos). |
| `…top_3_items[].value.video` | objeto | Mídia: `cover` (`url_list`), `play_addr` (`url_list` de mp4/play urls), `duration` (ms), `width`, `height`. |
| `creator_info` | objeto | Cabeçalho do criador. |
| `creator_info.nickname` | string | Nome de exibição (ex: `AA Daehoon 대훈`). |
| `creator_info.unique_id` | string | Handle (@) do criador (ex: `aadaehoon`). |
| `creator_info.sec_user_id` | string | ID seguro/secundário do usuário TikTok. |
| `creator_info.avatar_url` | string | URL do avatar (assinada). |
| `creator_info.follower_count` | inteiro | Total de seguidores. |
| `creator_info.like_count` | inteiro | Total de curtidas acumuladas. |
| `creator_info.message` | objeto | Metadado de origem (`data_source`, `status`, `timestamp`). |

### Exemplo de resposta
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "milestone_list": [
      {
        "creator_summary": {
          "message": { "data_source": 1, "status": 1, "timestamp": 1762855755 },
          "value": "53 posts published, with an average of 2.2M views per post. Top words used in titles: alhamdulillah sehat, ya gaes. Top posts you can learn from:"
        },
        "milestone": 6,
        "milestone_month_day": { "message": { "data_source": 1, "status": 1, "timestamp": 1762855755 }, "value": "3/21" },
        "milestone_title": { "message": { "data_source": 1, "status": 1, "timestamp": 1762855755 }, "value": "Reached 1M followers" },
        "milestone_year": { "message": { "data_source": 1, "status": 1, "timestamp": 1762855755 }, "value": "2022" },
        "top_3_items": [
          {
            "message": { "data_source": 1, "status": 1, "timestamp": 1762855755 },
            "value": {
              "aweme_id": "7055898539657792770",
              "aweme_type": 0,
              "create_time": 1642829401,
              "desc": "@juletrulala akhirnya BABY J udah lahir.. Alhamdulillah sehat mama dan adenya, makasih doanya ya semuanya",
              "statistics": {
                "collect_count": 23937,
                "comment_count": 21554,
                "digg_count": 1728616,
                "play_count": 11610630,
                "share_count": 6748
              },
              "video": {
                "cover": { "url_list": ["https://p16-common-sign.tiktokcdn-us.com/...cropcenter:300:400.jpeg?..."] },
                "duration": 34270,
                "height": 960,
                "play_addr": { "url_list": ["https://v16m.tiktokcdn-us.com/...video_mp4...", "https://api16-normal-useast5.tiktokv.us/aweme/v1/play/?..."] },
                "width": 540
              }
            }
          }
        ]
      },
      {
        "creator_summary": { "message": { "data_source": 1, "status": 1, "timestamp": 1762855755 }, "value": "No public data to display" },
        "milestone": 4,
        "milestone_month_day": { "message": { "data_source": 1, "status": 1, "timestamp": 1762855755 }, "value": "8/30" },
        "milestone_title": { "message": { "data_source": 1, "status": 1, "timestamp": 1762855755 }, "value": "Reached 100K followers" },
        "milestone_year": { "message": { "data_source": 1, "status": 1, "timestamp": 1762855755 }, "value": "2020" }
      },
      {
        "creator_summary": { "message": { "data_source": 1, "status": 1, "timestamp": 1762855755 }, "value": "" },
        "milestone": 1,
        "milestone_month_day": { "message": { "data_source": 1, "status": 1, "timestamp": 1762855755 }, "value": "11/7" },
        "milestone_title": { "message": { "data_source": 1, "status": 1, "timestamp": 1762855755 }, "value": "Started posting on TikTok" },
        "milestone_year": { "message": { "data_source": 1, "status": 1, "timestamp": 1762855755 }, "value": "2019" }
      }
    ],
    "creator_info": {
      "avatar_url": "https://p19-common-sign.tiktokcdn-us.com/...cropcenter:720:720.webp?...",
      "follower_count": 7315828,
      "like_count": 303955500,
      "message": { "data_source": 1, "status": 1, "timestamp": 1762855755 },
      "nickname": "AA Daehoon 대훈",
      "sec_user_id": "MS4wLjABAAAA-b6EL7JH9e1GbN1Z3HKQDV1YUsuxIEZCxAvnRiPuDPxu4CDcN41MbhuUEhH8Oq3u",
      "unique_id": "aadaehoon"
    }
  },
  "requestId": "dc2ad388-d952-4d08-b028-00f1b68a0eed"
}
```

## Notas & gotchas
- Tempo-real: `code=500` → retry; sem QPS alto.
- **Wrapper `message`/`value`:** quase todo campo é `{ message: {...}, value: ... }`. Leia sempre `.value`; `message.timestamp` é epoch segundos (frescor do dado).
- Marcos sem dados públicos não trazem `top_3_items` e o `creator_summary.value` vem `No public data to display` ou vazio.
- `create_time`/`timestamp` em epoch **segundos**; `video.duration` em **milissegundos**.
- IDs (`aweme_id`, `user_id`) são int64 em string — trate como string.
- URLs de avatar/cover/play são assinadas e expiram (`x-expires`); `play_addr` pode exigir token/headers do TikTok.
- Use o `user_id` numérico do TikTok; o `@handle` não funciona aqui.

## Relevância para o SLEAG
- **Enriquecimento de perfil de criador:** linha do tempo de conquistas (prova social/credibilidade) + 3 melhores vídeos por marco para inspirar criativos.
- `creator_info` dá um cabeçalho rápido (avatar, nick, handle, seguidores, curtidas) sem chamar outro endpoint.
- Secundário/futuro para uma página de detalhe de criador; não para os fluxos de mercado do dashboard principal.

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
  /api/v3/realtime/influencer/milestones_insight:
    get:
      summary: Creator Milestone - Real-time Interface
      deprecated: false
      description: >-
        Retrieve the creator's creative milestone data using the user_id.

        The real-time data has no field descriptions; the APIs all return
        content natively from TikTok.


        Note: Real-time APIs may encounter risk control checks at any time. If a
        code=500 is returned, please retry.
      tags:
        - Social media analysis
      parameters:
        - name: user_id
          in: query
          description: ''
          required: true
          example: '6754281736047723521'
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
      x-run-in-apifox: https://app.apifox.com/web/project/7319100/apis/api-375085895-run
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
