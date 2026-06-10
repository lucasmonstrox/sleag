# Busca de Hashtags (Tags de Vídeo) — Interface em Tempo-real

> **Fonte:** opendoc EchoTik (https://opendocs.echotik.live/en/375322676e0) · **`GET /api/v3/realtime/hashtag/search`** · **Auth:** Basic · **Tipo:** Tempo-real

## O que faz

Busca, ao vivo, hashtags (tags/challenges) de vídeo relacionadas a uma palavra-chave, dentro de uma região. Consulta o índice da EchoTik em tempo-real, sujeita a risk control (`code=500` → retry). Retorna cada hashtag com contadores de uso e views. Paginação por `offset` (cursor), com tamanho de página via `count`. Evite QPS alto.

## Request

### Headers
| Header | Obrigatório | Valor |
|---|---|---|
| `Authorization` | Sim | `Basic base64(username:password)` |

### Query params
| Param | Tipo | Obrigatório | O que faz |
|---|---|---|---|
| `keyword` | string | Sim | Termo de busca para casar com hashtags. Ex: `fpy`. |
| `region` | string | Sim | Código do país/mercado. Ex: `US`. |
| `offset` | string | Não | Quando `has_more=1`, use o cursor para a próxima página. Ex: `0`. |
| `count` | string | Não | Quantidade de hashtags por página (tamanho da página). Ex: `20`. |

> A página da EchoTik não traz texto de descrição para `keyword`, `region` e `count`; só `offset` tem descrição. As demais foram traduzidas a partir do uso.

### Exemplo de chamada
```bash
curl -s "https://open.echotik.live/api/v3/realtime/hashtag/search?keyword=fpy&region=US&offset=0&count=20" \
  -H "Authorization: Basic $TOKEN"
```

## Response

Envelope: `{ code, message, data, requestId }` — `code = 0` (HTTP 200) = sucesso. `code=500` = risk control → retry.

### Campos de `data`
A resposta é o payload bruto da busca de challenges (hashtags) do TikTok (canal `musically_challenge`).

| Campo | Tipo | O que é |
|---|---|---|
| `challenge_list` | array | Lista de hashtags encontradas. Cada item tem `challenge_info` + `items` + `position`. |
| `challenge_list[].challenge_info` | objeto | Dados da hashtag (ver subcampos abaixo). |
| `challenge_list[].challenge_info.cid` | string | ID da hashtag/challenge. |
| `challenge_list[].challenge_info.cha_name` | string | Nome da hashtag (sem `#`). Ex: `fpy`. |
| `challenge_list[].challenge_info.search_cha_name` | string | Nome da hashtag conforme casado na busca. |
| `challenge_list[].challenge_info.desc` | string | Descrição da hashtag (pode vir vazia). |
| `challenge_list[].challenge_info.use_count` | inteiro | Quantidade de usos da hashtag. |
| `challenge_list[].challenge_info.user_count` | inteiro | Quantidade de usuários que usaram (no exemplo igual a `use_count`). |
| `challenge_list[].challenge_info.view_count` | inteiro | Total de views dos vídeos com a hashtag. |
| `challenge_list[].challenge_info.is_commerce` | boolean | Se é hashtag comercial. |
| `challenge_list[].challenge_info.is_challenge` | inteiro | Flag de challenge. |
| `challenge_list[].challenge_info.is_pgcshow` | boolean | Flag de conteúdo PGC. |
| `challenge_list[].challenge_info.type` / `sub_type` | inteiro | Tipo/subtipo da hashtag. |
| `challenge_list[].challenge_info.schema` | string | Deep link do app (`aweme://aweme/challenge/detail?cid=...`). |
| `challenge_list[].challenge_info.share_info` | objeto | Dados de compartilhamento: `share_url`, `share_title`, `share_desc` etc. |
| `challenge_list[].challenge_info.extra_attr` | objeto | Atributos extras: `{ is_live }`. |
| `challenge_list[].challenge_info.collect_stat` | inteiro | Status de coleção. |
| `challenge_list[].challenge_info.connect_music` | array | Músicas conectadas à hashtag. |
| `challenge_list[].challenge_info.banner_list` / `cha_attrs` / `show_items` | array/null | Banners/atributos/itens em destaque (normalmente `null`). |
| `challenge_list[].items` | array/null | Vídeos de exemplo da hashtag (normalmente `null`). |
| `challenge_list[].position` | array/null | Posições de highlight (normalmente `null`). |
| `has_more` | inteiro | `1` = há mais páginas, `0` = fim. |
| `is_match` | boolean | Se houve match exato com o keyword. |
| `keyword_disabled` | inteiro | `1` se o keyword foi bloqueado, `0` caso contrário. |
| `qc` | string | Query correction (correção de busca). |
| `status_code` | inteiro | Código de status interno do TikTok (`0` = ok). |
| `log_pb` | objeto | Telemetria: `{ impr_id }`. |
| `ad_info` | objeto | Info de anúncios (normalmente `{}`). |
| `global_doodle_config` | objeto | Config de UI/AB: `feedback_survey`, `keyword`, `search_channel` (`musically_challenge`), `hashtag_vertical_style_type`, `tns_search_result`, `hide_results`, `hit_dolphin`, `hit_shark`, `new_source`. |

### Exemplo de resposta
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "ad_info": {},
    "challenge_list": [
      {
        "challenge_info": {
          "banner_list": null,
          "cha_attrs": null,
          "cha_name": "fpy",
          "cid": "37644733",
          "collect_stat": 0,
          "connect_music": [],
          "desc": "",
          "extra_attr": { "is_live": false },
          "hashtag_profile": "",
          "is_challenge": 0,
          "is_commerce": false,
          "is_pgcshow": false,
          "schema": "aweme://aweme/challenge/detail?cid=37644733",
          "search_cha_name": "fpy",
          "search_highlight": null,
          "share_info": {
            "bool_persist": 0,
            "share_desc": "Check out #fpy on TikTok!",
            "share_title": "It is a becoming a big trend on TikTok now! Click here: fpy",
            "share_url": "https://www.tiktok.com/tag/fpy?_r=1&name=fpy&...&share_challenge_id=37644733&source=h5_m"
          },
          "show_items": null,
          "sub_type": 0,
          "type": 1,
          "use_count": 60230354,
          "user_count": 60230354,
          "view_count": 689794358822
        },
        "items": null,
        "position": null
      }
    ],
    "global_doodle_config": {
      "feedback_survey": [
        {
          "multiple_choices": [
            { "key": "Dislike", "value": "Dislike" },
            { "key": "Unrelated result", "value": "Unrelated result" },
            { "key": "Outdated content", "value": "Outdated content" },
            { "key": "Inappropriate content", "value": "Inappropriate content" },
            { "key": "Others", "value": "Others" }
          ],
          "send_us_multiple_choices": null
        }
      ],
      "hashtag_vertical_style_type": 1,
      "hide_results": false,
      "hit_dolphin": false,
      "hit_shark": false,
      "keyword": "fpy",
      "new_source": "normal_search",
      "search_channel": "musically_challenge",
      "tns_search_result": "Pass"
    },
    "has_more": 1,
    "is_match": false,
    "keyword_disabled": 0,
    "log_pb": { "impr_id": "2025111202513377DEC84D90406B1B6F30" },
    "qc": "",
    "status_code": 0
  },
  "requestId": "2708f385-a89a-47f5-99fc-060e1b6eb877"
}
```

## Notas & gotchas
- Tempo-real: `code=500` → retry; sem QPS alto.
- Este endpoint usa o envelope completo `{ code, message, data, requestId }` (com `requestId`), diferente de creator/music/video/live search que retornam `{ msg, code, data }`.
- `offset` é cursor, **não** `page_num`. `count` controla o tamanho da página (ex: `20`).
- `view_count`/`use_count` vêm como números grandes (int64) — pode haver perda de precisão em JS; trate como string se necessário.
- O termo aqui é `keyword` (não `sk`); há o parâmetro `count` para tamanho de página.

## Relevância para o TIKSPY
- Alimenta pesquisa/descoberta de hashtags em alta (`use_count`/`view_count`) para planejamento de conteúdo e tendências.
- Secundário em relação a produto/criador; complementa análise de criativos.

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
  /api/v3/realtime/hashtag/search:
    get:
      summary: Video tag hashtag search - Real-time interface
      deprecated: false
      description: >-
        Search for hashtag tags related to the area using keyword keywords


        Note: Real-time interfaces may encounter risk control detection at any
        time. If code=500 is returned, please retry.
      tags:
        - Search
      parameters:
        - name: keyword
          in: query
          description: ''
          required: true
          example: fpy
          schema:
            type: string
        - name: region
          in: query
          description: ''
          required: true
          example: US
          schema:
            type: string
        - name: offset
          in: query
          description: When has_more=1, use the cursor for the next pagination
          required: false
          example: '0'
          schema:
            type: string
        - name: count
          in: query
          description: ''
          required: false
          example: '20'
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
      x-run-in-apifox: https://app.apifox.com/web/project/7319100/apis/api-375322676-run
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
