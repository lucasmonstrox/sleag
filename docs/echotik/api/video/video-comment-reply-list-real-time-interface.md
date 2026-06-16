# Video comment reply list - Real-time interface

> **Fonte:** opendoc EchoTik (https://opendocs.echotik.live/en/375354858e0) · **`GET /api/v3/realtime/video/comments/replies`** · **Auth:** Basic · **Tipo:** Tempo-real

## O que faz
Lista **ao vivo** as respostas (replies) de um comentário específico de um vídeo, identificado por `video_id` + `comment_id`. É o segundo nível do thread de comentários: primeiro lista-se os comentários (endpoint `video/comments`), depois aprofunda-se num comentário para ver suas respostas. Paginação por cursor (`offset`). Por ser real-time, está sujeita a **risk control**: se vier `code=500`, **repita (retry)**. Não dispare com QPS alto.

## Request

### Headers
| Header | Obrigatório | Valor |
|---|---|---|
| `Authorization` | Sim | `Basic base64(username:password)` |

### Query params
| Param | Tipo | Obrigatório | O que faz |
|---|---|---|---|
| `video_id` | string | Sim | ID do vídeo dono do comentário (ex.: `7560802497552567582`). |
| `comment_id` | string | Sim | ID do comentário pai cujas respostas se quer (o `cid`/`comment_id` obtido em `video/comments`; ex.: `7571269780301513502`). |
| `offset` | string | Não | Cursor de paginação: quando o retorno traz `has_more=1`, reenvie o cursor devolvido em `offset` (ex.: `0`). |

### Exemplo de chamada
```bash
curl -s "https://open.echotik.live/api/v3/realtime/video/comments/replies?video_id=7560802497552567582&comment_id=7571269780301513502&offset=0" \
  -H "Authorization: Basic $TOKEN"
```

## Response

Envelope real: `{ msg, code, data }` (note: `msg`/`code`, **diferente** do `video/comments` que usa `{ code, message, data, requestId }`). `code = 0` = sucesso; `code = 500` = risk control → **retry**.

### Campos de `data`
A página declara o schema apenas como `object`; pelo **Example**, `data` traz `comments[]` — a lista de respostas, com a mesma estrutura de comentário do endpoint `video/comments`.

**Cada item de `comments[]`** (campos principais):

| Campo | Tipo | O que é |
|---|---|---|
| `cid` | string | ID da resposta (comentário). |
| `text` | string | Texto da resposta. |
| `aweme_id` | string | ID do vídeo. |
| `create_time` | integer | Timestamp Unix (segundos) da resposta. |
| `digg_count` | integer | Curtidas da resposta. |
| `status` | integer | Status (`1` = visível). |
| `reply_id` | string | ID do comentário pai (o `comment_id` consultado). |
| `reply_to_reply_id` | string | ID da resposta à qual esta responde (`"0"` se responde direto ao comentário pai). |
| `reply_comment` | array \| null | Sub-respostas; geralmente `null` neste nível. |
| `user` | object | Objeto bruto do autor (TikTok): `uid`, `nickname`, `unique_id`, `sec_uid`, `avatar_thumb`, `region`, etc. |
| `label_text` / `label_list` | string / array | Rótulo (ex.: `"Creator"` quando é o autor do vídeo). |
| `comment_language` | string | Idioma detectado (ex.: `en`). |
| `is_high_purchase_intent` | boolean | Sinal de intenção de compra. |
| `share_info` | object | `{ acl, desc_tpl, need_confirm }` — info de compartilhamento. |

> O `data` também pode trazer controles de paginação (`cursor`/`has_more`) conforme a descrição de `offset`, mas eles não aparecem na porção visível do Example — confirme num retorno real. O objeto `user` traz dezenas de campos brutos do TikTok.

### Exemplo de resposta
```json
{
  "msg": "success",
  "code": 0,
  "data": {
    "comments": [
      {
        "aweme_id": "7560802497552567582",
        "cid": "7571283919682585375",
        "comment_language": "en",
        "create_time": 1762826944,
        "digg_count": 0,
        "is_high_purchase_intent": false,
        "label_list": [{ "text": "Creator", "type": 1 }],
        "label_text": "Creator",
        "label_type": 1,
        "reply_comment": null,
        "reply_id": "7571269780301513502",
        "reply_to_reply_id": "0",
        "share_info": { "acl": { "code": 0, "extra": "{}" }, "desc_tpl": "'s comment", "need_confirm": true },
        "status": 1,
        "text": "Haha sorry about that. But atleast it works! ☺️",
        "user": {
          "nickname": "Tiff's Affordable Trends",
          "unique_id": "tiff.picks",
          "avatar_uri": "tos-maliva-avt-0068/542004caaec33b2c4bdbc6b672dcbeeb"
        }
      }
    ]
  }
}
```
> (Resposta resumida — o `user` de cada resposta traz dezenas de campos brutos do TikTok.)

## Notas & gotchas
- Envelope `{ msg, code, data }` — **diferente** do `video/comments` (`{ code, message, data, requestId }`). Atenção ao parsear.
- `data.comments[]` usa a mesma estrutura de comentário do `video/comments` (objeto bruto do TikTok).
- Não há parâmetro `count` neste endpoint — só `offset` controla a paginação (por cursor, `has_more`). `offset` é **string**.
- `create_time` é **integer** (segundos). Avatares (`avatar_thumb.url_list`) trazem `x-expires`/`x-signature` e **expiram**.
- `code=500` = risk control → retry com backoff. Sem QPS alto.

## Relevância para o SLEAG
- Completa a análise de comentários de um criativo: além do comentário-topo, ler o sub-thread (dúvidas respondidas, interações do criador com a audiência).
- Útil para entender objeções de compra e respostas do vendedor em criativos de TikTok Shop.

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
  /api/v3/realtime/video/comments/replies:
    get:
      summary: Video comment reply list - Real-time interface
      deprecated: false
      description: >-
        Retrieve the list of specific replies under a video comment using
        video_id + comment_id


        Note: Real-time interfaces may encounter risk control detection at any
        time. If code=500 is returned, please retry.
      tags:
        - Video
      parameters:
        - name: video_id
          in: query
          description: ''
          required: true
          example: '7560802497552567582'
          schema:
            type: string
        - name: comment_id
          in: query
          description: ''
          required: true
          example: '7571269780301513502'
          schema:
            type: string
        - name: offset
          in: query
          description: When has_more=1, use cursor for the next pagination
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
      x-apifox-folder: Video
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/7319100/apis/api-375354858-run
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
