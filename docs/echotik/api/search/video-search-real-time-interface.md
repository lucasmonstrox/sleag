# Busca de Vídeos — Interface em Tempo-real

> **Fonte:** opendoc EchoTik (https://opendocs.echotik.live/en/375367402e0) · **`GET /api/v3/realtime/video/search`** · **Auth:** Basic · **Tipo:** Tempo-real

## O que faz

Busca, ao vivo, a lista de vídeos do TikTok a partir de uma palavra-chave. Consulta o índice da EchoTik em tempo-real, sujeita a risk control (`code=500` → retry). Permite filtrar por janela de publicação e ordenar por relevância ou curtidas. Paginação por `offset` (cursor). Evite QPS alto.

## Request

### Headers
| Header | Obrigatório | Valor |
|---|---|---|
| `Authorization` | Sim | `Basic base64(username:password)` |

### Query params
| Param | Tipo | Obrigatório | O que faz |
|---|---|---|---|
| `keyword` | string | Sim | Termo de busca dos vídeos. Ex: `baby`. |
| `region` | string | Sim | Código do país/mercado. Ex: `US`. |
| `publish_time` | string | Não | Filtro por janela de publicação: `0`=todos, `1`=ontem, `7`=últimos 7 dias, `30`=últimos 30 dias, `90`=últimos 3 meses, `180`=últimos 6 meses. |
| `sort_type` | string | Não | Ordenação: `0`=relevância da busca, `1`=mais curtidos. |
| `offset` | string | Não | Campo de paginação: quando `has_more=1`, use o cursor para a próxima página. Ex: `0`. |

### Exemplo de chamada
```bash
curl -s "https://open.echotik.live/api/v3/realtime/video/search?keyword=baby&region=US&publish_time=7&sort_type=1&offset=0" \
  -H "Authorization: Basic $TOKEN"
```

## Response

Envelope: `{ msg, code, data }` — `code = 0` (HTTP 200) = sucesso. `code=500` = risk control → retry.

### Campos de `data`
A resposta é o payload bruto da busca de vídeos do TikTok (canal `musically_video`). Campos de topo:

| Campo | Tipo | O que é |
|---|---|---|
| `search_item_list` | array | Lista de vídeos encontrados. Cada item tem `aweme_info` (objeto com os dados completos do vídeo). |
| `search_item_list[].aweme_info` | objeto | Dados do vídeo: `added_sound_music_info` (música usada — autor, capas, duração), info de autor, estatísticas, capa, descrição etc. (schema padrão `aweme` do TikTok). |
| `aweme_list` | array | Lista de vídeos no formato `aweme` legado (normalmente vazia quando `search_item_list` é usado). |
| `cursor` | inteiro | Cursor da próxima página (reenviar como `offset`). |
| `has_more` | inteiro | `1` = há mais páginas, `0` = fim. |
| `backtrace` | string | Token de rastreamento de busca (normalmente vazio). |
| `components` | array/null | Componentes de UI de busca (normalmente `null`). |
| `log_pb` | objeto | Telemetria: `{ impr_id }`. |
| `extra` | objeto | Metadados: `logid`, `now` (epoch ms), `server_stream_time`, `search_request_id`, `fatal_item_ids`, `api_debug_info`. |
| `feedback_type` | string | Tipo de feedback (ex: `video`). |
| `global_doodle_config` | objeto | Config de UI/AB do TikTok: `display_filter_bar`, `feedback_survey` (opções de feedback), `keyword`, `search_channel` (`musically_video`), `search_intent`, `tns_search_result`, `hide_results`, `hit_dolphin`, `hit_shark`, `new_source`. |

> O Example oficial vem truncado na página (`aweme_info` é extenso). Os campos detalhados de vídeo (id, descrição, estatísticas, autor) seguem o schema padrão `aweme` do TikTok dentro de `search_item_list[].aweme_info`.

### Exemplo de resposta
```json
{
  "msg": "success",
  "code": 0,
  "data": {
    "aweme_list": [],
    "backtrace": "",
    "components": null,
    "cursor": 10,
    "extra": {
      "api_debug_info": null,
      "fatal_item_ids": [],
      "logid": "202511120320525BFEE892C7343F0026C7",
      "now": 1762917653000,
      "search_request_id": "",
      "server_stream_time": 936
    },
    "feedback_type": "video",
    "global_doodle_config": {
      "display_filter_bar": 1,
      "feedback_survey": [
        {
          "feedback_type": "video",
          "long_stress_info": null,
          "multiple_choices": [
            { "key": "Dislike", "value": "Dislike" },
            { "key": "Unrelated content", "value": "Unrelated content" },
            { "key": "Not my language", "value": "Not my language" },
            { "key": "Outdated content", "value": "Outdated content" },
            { "key": "Culturally insensitive", "value": "Culturally insensitive" },
            { "key": "Inappropriate content", "value": "Inappropriate content" },
            { "key": "Misinformation", "value": "Misinformation" },
            { "key": "Others", "value": "Others" }
          ],
          "send_us_multiple_choices": null
        }
      ],
      "hide_results": false,
      "hit_dolphin": false,
      "hit_shark": false,
      "keyword": "baby",
      "new_source": "switch_tab",
      "search_channel": "musically_video",
      "search_intent": {},
      "tns_search_result": "Pass"
    },
    "has_more": 1,
    "log_pb": { "impr_id": "202511120320525BFEE892C7343F0026C7" },
    "search_item_list": [
      {
        "aweme_info": {
          "added_sound_music_info": {
            "album": "",
            "allow_offline_music_to_detail_page": false,
            "artists": [],
            "audition_duration": 10,
            "author": "Neep Fam",
            "author_deleted": false,
            "author_position": null,
            "avatar_medium": {
              "height": 720,
              "uri": "tos-useast5-avt-0068-tx/04245319054c9bfa2fa8703f0dab0132",
              "url_list": ["https://p16-common-sign.tiktokcdn-us.com/.../cropcenter:720:720.webp?..."],
              "url_prefix": null,
              "width": 720
            },
            "avatar_thumb": {
              "height": 720,
              "uri": "tos-useast5-avt-0068-tx/04245319054c9bfa2fa8703f0dab0132",
              "url_list": ["https://p16-common-sign.tiktokcdn-us.com/.../cropcenter:100:100.webp?..."],
              "url_prefix": null,
              "width": 720
            }
          }
        }
      }
    ]
  }
}
```

## Notas & gotchas
- Tempo-real: `code=500` → retry; sem QPS alto.
- Envelope é `{ msg, code, data }` (sem `requestId`).
- `offset` é cursor, **não** `page_num`.
- `publish_time` usa códigos numéricos com semântica de janela (`7`=7 dias), não um timestamp.
- A lista útil é `search_item_list[].aweme_info` (não `aweme_list`, que costuma vir vazia).
- URLs de avatar/capa são assinadas e expiram (`x-expires`); não cacheie a URL crua.
- Muito campo de UI/AB (`global_doodle_config`, `feedback_survey`) ignorável.

## Relevância para o SLEAG
- Alimenta pesquisa de vídeos e, combinado com `sort_type=1` + `publish_time` curto, ajuda a achar "criativos em alta" — uma das métricas-chave do dashboard.
- Ponto de entrada para depois cruzar com produtos/criadores associados a cada vídeo.

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
  /api/v3/realtime/video/search:
    get:
      summary: Video Search - Real-time Interface
      deprecated: false
      description: >-
        Search video lists in real-time using keywords, and use offset for the
        next pagination


        Note: Real-time interfaces may encounter risk control detection at any
        time. If code=500 is returned, please retry.
      tags:
        - Search
      parameters:
        - name: keyword
          in: query
          description: ''
          required: true
          example: baby
          schema:
            type: string
        - name: region
          in: query
          description: ''
          required: true
          example: US
          schema:
            type: string
        - name: publish_time
          in: query
          description: >-
            Publish time filter, 0=All, 1=Yesterday, 7=Last 7 days, 30=Last 30
            days, 90=Last 3 months, 180=Last 6 months
          required: false
          example: '0'
          schema:
            type: string
        - name: sort_type
          in: query
          description: 'Sorting type: 0 = Search relevance sorting, 1 = Most likes'
          required: false
          example: '1'
          schema:
            type: string
        - name: offset
          in: query
          description: >-
            For pagination fields, when has_more=1, use a cursor for the next
            pagination.
          required: false
          example: '0'
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
          headers: {}
          x-apifox-name: 成功
      security:
        - basic: []
      x-apifox-folder: Search
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/7319100/apis/api-375367402-run
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
