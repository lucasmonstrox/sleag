# Busca de Criadores — Interface em Tempo-real

> **Fonte:** opendoc EchoTik (https://opendocs.echotik.live/en/375358093e0) · **`GET /api/v3/realtime/influencer/search`** · **Auth:** Basic · **Tipo:** Tempo-real

## O que faz

Busca criadores (usuários) do TikTok ao vivo a partir de uma palavra-chave (`keyword`), consultando o índice da EchoTik em tempo-real. Cada chamada dispara uma consulta ao vivo do TikTok, sujeita a risk control: se vier `code=500`, basta repetir (retry). Não use QPS alto. Paginação por cursor (`offset` → `cursor`/`has_more` na resposta).

## Request

### Headers
| Header | Obrigatório | Valor |
|---|---|---|
| `Authorization` | Sim | `Basic base64(username:password)` |

### Query params
| Param | Tipo | Obrigatório | O que faz |
|---|---|---|---|
| `keyword` | string | Sim | Termo de busca (nome, apelido ou handle). Ex: `baby`. |
| `region` | string | Sim | Código do país/mercado (ISO 3166-1 alpha-2). Ex: `US`. |
| `offset` | string | Não | Cursor de paginação. Ex: `0`. Reenvie o `cursor` retornado quando `has_more=1`. |

> A página da EchoTik lista os três params (keyword, region, offset) sem texto de descrição; as descrições acima são traduções do uso evidenciado pelo Example e pela spec.

### Exemplo de chamada
```bash
curl -s "https://open.echotik.live/api/v3/realtime/influencer/search?keyword=baby&region=US&offset=0" \
  -H "Authorization: Basic $TOKEN"
```

## Response

Envelope: `{ msg, code, data }` — `code = 0` (HTTP 200) = sucesso. `code=500` = risk control acionado → retry.

### Campos de `data`
A resposta é o payload bruto da busca do TikTok (estrutura `musically_user`). Campos de topo de `data`:

| Campo | Tipo | O que é |
|---|---|---|
| `user_list` | array | Lista de criadores encontrados. Cada item tem `user_info` (objeto com dados do perfil) + arrays auxiliares (`challenges`, `effects`, `items`, `mix_list`, `musics`, `position`, `uniqid_position`), normalmente `null`. |
| `user_list[].user_info` | objeto | Dados do perfil: avatares (`avatar_168x168`, `avatar_300x300` com `uri`/`url_list`/`width`/`height`), `authority_status`, `account_labels`, `accept_private_policy`, e demais campos de perfil TikTok (handle, nick, contadores) — ver Example. |
| `cursor` | inteiro | Cursor da próxima página (reenviar como `offset`). |
| `has_more` | inteiro | `1` = há mais páginas, `0` = fim. |
| `input_keyword` | string | Keyword normalizada da requisição. Ex: `baby`. |
| `qc` | string | Query correction (correção de busca), normalmente vazio. |
| `rid` | string | Request ID da busca. |
| `status_code` | inteiro | Código de status interno do TikTok (`0` = ok). |
| `type` | inteiro | Tipo de resultado da busca (ex: `1` = usuários). |
| `challenge_list` | array/null | Lista de hashtags relacionadas (normalmente `null` nesta busca). |
| `music_list` | array/null | Lista de músicas relacionadas (normalmente `null`). |
| `log_pb` | objeto | Log/telemetria: `{ impr_id }`. |
| `extra` | objeto | Metadados da consulta: `logid`, `now` (epoch ms), `server_stream_time`, `search_request_id`, `fatal_item_ids`, `api_debug_info`. |
| `feedback_type` | string | Tipo de feedback (ex: `user`). |
| `global_doodle_config` | objeto | Config de UI/AB do TikTok: `ab_params`, `display_filter_bar`, `feedback_survey` (opções de feedback), `keyword`, `search_channel` (ex: `musically_user`), `tns_search_result`, `hide_results`, `hit_dolphin`, `hit_shark`, `new_source`. |

> O Example oficial vem truncado na página (o `user_info` é extenso); os campos de perfil detalhados (handle, follower count etc.) seguem o schema padrão TikTok dentro de `user_info`.

### Exemplo de resposta
```json
{
  "msg": "success",
  "code": 0,
  "data": {
    "challenge_list": null,
    "cursor": 10,
    "extra": {
      "api_debug_info": null,
      "fatal_item_ids": [],
      "logid": "20251112031432E3D82E91141CC3019255",
      "now": 1762917273000,
      "search_request_id": "",
      "server_stream_time": 964
    },
    "feedback_type": "user",
    "global_doodle_config": {
      "ab_params": { "user_relation_ship": "1" },
      "display_filter_bar": 1,
      "feedback_survey": [
        {
          "feedback_type": "user",
          "long_stress_info": null,
          "multiple_choices": [
            { "key": "Dislike", "value": "Dislike" },
            { "key": "Profile not found", "value": "Profile not found" },
            { "key": "Unmatched posts", "value": "Unmatched posts" },
            { "key": "Inappropriate content", "value": "Inappropriate content" },
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
      "search_channel": "musically_user",
      "tns_search_result": "Pass"
    },
    "has_more": 1,
    "input_keyword": "baby",
    "log_pb": { "impr_id": "20251112031432E3D82E91141CC3019255" },
    "music_list": null,
    "qc": "",
    "rid": "20251112031432E3D82E91141CC3019255",
    "status_code": 0,
    "type": 1,
    "user_list": [
      {
        "challenges": null,
        "effects": null,
        "items": null,
        "mix_list": null,
        "musics": null,
        "position": null,
        "uniqid_position": null,
        "user_info": {
          "accept_private_policy": false,
          "account_labels": null,
          "ad_cover_url": null,
          "advance_feature_item_order": null,
          "advanced_feature_info": null,
          "authority_status": 0,
          "avatar_168x168": {
            "height": 720,
            "uri": "tos-useast2a-avt-0068-euttp/6f0fbb79c19d1ca0daff6557b93b52eb",
            "url_list": ["https://p16-common-sign.tiktokcdn-us.com/.../q:168:168:q70.webp?..."],
            "url_prefix": null,
            "width": 720
          },
          "avatar_300x300": {
            "height": 720,
            "uri": "tos-useast2a-avt-0068-euttp/6f0fbb79c19d1ca0daff6557b93b52eb",
            "url_list": ["https://p16-common-sign.tiktokcdn-us.com/.../q:300:300:q70.webp?..."],
            "width": 720
          }
        }
      }
    ]
  }
}
```

## Notas & gotchas
- Tempo-real: `code=500` ("risk control") → faça retry; não é erro permanente. Evite QPS alto.
- Envelope é `{ msg, code, data }` (sem `requestId` neste endpoint).
- `offset` é cursor: reenvie o valor de `cursor` da resposta anterior, não calcule `page * size`.
- O `data` é o payload bruto do TikTok (search `musically_user`): muito campo de UI/AB (`global_doodle_config`, `feedback_survey`) que você pode ignorar. O que interessa é `user_list[].user_info`.
- URLs de avatar (`url_list`) são assinadas e expiram (`x-expires`); não cacheie a URL crua por muito tempo.

## Relevância para o TIKSPY
- Alimenta autocomplete/resultado de pesquisa de criadores ao digitar um handle ou nome.
- Ponto de entrada para depois puxar detalhes/métricas via endpoints de detalhe do criador.

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
  /api/v3/realtime/influencer/search:
    get:
      summary: Creator search - Real-time interface
      deprecated: false
      description: >-
        Search creators in real-time using keywords, and use offset for the next
        pagination


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
        - name: offset
          in: query
          description: ''
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
      x-run-in-apifox: https://app.apifox.com/web/project/7319100/apis/api-375358093-run
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
