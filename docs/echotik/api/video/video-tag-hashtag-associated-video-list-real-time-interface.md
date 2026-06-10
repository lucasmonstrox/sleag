# Video Tag Hashtag Associated Video List - Real-Time Interface

> **Fonte:** opendoc EchoTik (https://opendocs.echotik.live/en/375331043e0) · **`GET /api/v3/realtime/hashtag/video/list`** · **Auth:** Basic · **Tipo:** Tempo-real

## O que faz
Lista **ao vivo** os vídeos associados a uma hashtag (`hashtag_id`) numa região. Use para explorar o que está sendo postado sob uma tag específica em tempo real (cobertura além da base offline). Paginação por cursor (`offset`), não por número de página. Por ser real-time, vai ao TikTok no momento e está sujeita a **risk control**: se vier `code=500`, **repita (retry)**. Não dispare com QPS alto.

## Request

### Headers
| Header | Obrigatório | Valor |
|---|---|---|
| `Authorization` | Sim | `Basic base64(username:password)` |

### Query params
| Param | Tipo | Obrigatório | O que faz |
|---|---|---|---|
| `hashtag_id` | string | Sim | ID da hashtag cujos vídeos se quer listar (ex.: `37644733`). |
| `region` | string | Sim | Região/mercado da consulta (ex.: `US`). |
| `offset` | string | Não | Cursor de paginação: quando o retorno traz `has_more=1`, use o valor de cursor devolvido para a próxima página (ex.: `0`). |
| `count` | string | Não | Quantidade de itens por página (ex.: `20`). |

### Exemplo de chamada
```bash
curl -s "https://open.echotik.live/api/v3/realtime/hashtag/video/list?hashtag_id=37644733&region=US&offset=0&count=20" \
  -H "Authorization: Basic $TOKEN"
```

## Response

Envelope real: `{ code, message, data }` — `code = 0` = sucesso; `code = 500` = risk control → **retry**. `data` é um objeto que contém `aweme_list`.

### Campos de `data`
A página declara o schema apenas como `object`; pelo **Example**, `data` traz:

| Campo | Tipo | O que é |
|---|---|---|
| `data.aweme_list` | array[object] | Lista de vídeos (objetos `aweme` **brutos** do TikTok), não normalizados pela EchoTik. |
| `aweme_list[].added_sound_music_info` | object | Música/áudio do vídeo: `album`, `author`, `audition_duration`, `artists[]`, flags (`can_be_stitched`, `commercial_right_type`, etc.) e imagens (`avatar_medium`, `avatar_thumb`, `cover_large/medium/thumb`), cada uma `{ height, width, uri, url_list[], url_prefix }`. |

> O Example vem **truncado**; cada item de `aweme_list` é o objeto aweme completo do TikTok (autor, estatísticas, vídeo, música, produtos). Os controles de cursor (`has_more`/cursor) mencionados na descrição de `offset` não aparecem na porção visível do Example — confirme num retorno real onde vêm.

### Exemplo de resposta
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "aweme_list": [
      {
        "added_sound_music_info": {
          "album": "",
          "allow_offline_music_to_detail_page": false,
          "artists": [],
          "audition_duration": 79,
          "author": "user8142822454816",
          "author_deleted": false,
          "avatar_medium": {
            "height": 720,
            "uri": "tos-useast5-avt-0068-tx/c3528f7fd1fee773f37162de739efaa9",
            "url_list": ["https://p16-common-sign.tiktokcdn-us.com/.../...webp?...&x-expires=1762999200&x-signature=..."],
            "url_prefix": null,
            "width": 720
          },
          "binded_challenge_id": 0,
          "can_be_stitched": true,
          "commercial_right_type": 2
        }
      }
    ]
  }
}
```
> (Resposta truncada — cada item de `aweme_list` continua com o objeto aweme completo.)

## Notas & gotchas
- Envelope `{ code, message, data }` (sem `requestId`); `data` aninha `aweme_list` (objetos aweme **brutos** do TikTok, não normalizados).
- Paginação por **cursor**: leia `has_more` e reenvie o cursor em `offset`; `offset` e `count` são **string**.
- URLs de mídia trazem assinatura `x-expires`/`x-signature` e **expiram**.
- `code=500` = risk control → retry com backoff. Sem QPS alto.
- Requer descobrir o `hashtag_id` antes (não aceita o texto da hashtag diretamente).

## Relevância para o TIKSPY
- Permite explorar criativos por hashtag/tendência de tema em tempo real, complementando os rankings offline por região.
- Útil para monitorar campanhas/tags específicas e descobrir criadores que aderiram a uma trend.

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
  /api/v3/realtime/hashtag/video/list:
    get:
      summary: Video Tag Hashtag Associated Video List - Real-Time Interface
      deprecated: false
      description: >-
        Retrieve related video list through video tag hashtag_id


        Note: Real-time interfaces may encounter risk control detection at any
        time. If code=500 is returned, please retry.
      tags:
        - Video
      parameters:
        - name: hashtag_id
          in: query
          description: ''
          required: true
          example: '37644733'
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
          description: When has_more=1, use the cursor value for the next pagination
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
      x-apifox-folder: Video
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/7319100/apis/api-375331043-run
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
