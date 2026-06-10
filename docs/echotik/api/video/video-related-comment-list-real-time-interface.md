# Video-related comment list - Real-time interface

> **Fonte:** opendoc EchoTik (https://opendocs.echotik.live/en/375352388e0) · **`GET /api/v3/realtime/video/comments`** · **Auth:** Basic · **Tipo:** Tempo-real

## O que faz
Lista **ao vivo** os comentários de um vídeo do TikTok a partir do `video_id`. Use para ler a recepção do público de um criativo (sentimento, dúvidas, objeções). Paginação por cursor (`offset`). Por ser real-time, vai ao TikTok no momento e está sujeita a **risk control**: se vier `code=500`, **repita (retry)**. Não dispare com QPS alto.

## Request

### Headers
| Header | Obrigatório | Valor |
|---|---|---|
| `Authorization` | Sim | `Basic base64(username:password)` |

### Query params
| Param | Tipo | Obrigatório | O que faz |
|---|---|---|---|
| `video_id` | string | Sim | ID do vídeo cujos comentários se quer listar (ex.: `7560802497552567582`). |
| `offset` | string | Não | Cursor de paginação: quando o retorno traz `has_more=1`, reenvie o `cursor` devolvido em `offset` para a próxima página (ex.: `0`). |
| `count` | string | Não | Quantidade de comentários por página (ex.: `20`). |

### Exemplo de chamada
```bash
curl -s "https://open.echotik.live/api/v3/realtime/video/comments?video_id=7560802497552567582&offset=0&count=20" \
  -H "Authorization: Basic $TOKEN"
```

## Response

Envelope real: `{ code, message, data, requestId }` — `code = 0` = sucesso; `code = 500` = risk control → **retry**. `data` é o objeto bruto de comentários do TikTok.

### Campos de `data`
A página declara o schema apenas como `object`; pelo **Example**, `data` traz:

| Campo | Tipo | O que é |
|---|---|---|
| `data.status_code` | integer | Código de status interno do TikTok (`0` = ok). |
| `data.comments` | array[object] | Lista de comentários (objetos brutos do TikTok). |
| `data.cursor` | integer | Cursor para a próxima página (reenviar em `offset`). |
| `data.has_more` | integer | `1` = há mais páginas, `0` = fim. |
| `data.total` | integer | Total de comentários do vídeo. |
| `data.reply_style` | integer | Estilo de exibição de respostas. |
| `data.extra` | object | Metadados: `now` (epoch ms), `fatal_item_ids`, `api_debug_info`. |
| `data.log_pb` | object | `{ impr_id }` — id de impressão/log do TikTok. |
| `data.has_filtered_comments` | integer | Se há comentários filtrados (`0`/`1`). |
| `data.alias_comment_deleted` | boolean | Se o comentário-alias foi deletado. |
| `data.status_msg` | string | Mensagem de status. |
| `data.top_gifts` | array \| null | Gifts em destaque (quando aplicável). |

**Cada item de `comments[]`** (campos principais):

| Campo | Tipo | O que é |
|---|---|---|
| `cid` | string | ID do comentário (é o `comment_id` usado no endpoint de respostas). |
| `text` | string | Texto do comentário. |
| `aweme_id` | string | ID do vídeo ao qual o comentário pertence. |
| `create_time` | integer | Timestamp Unix (segundos) do comentário. |
| `digg_count` | integer | Curtidas do comentário. |
| `status` | integer | Status do comentário (`1` = visível). |
| `user` | object | Objeto bruto do autor do comentário (TikTok): `uid`, `nickname`, `unique_id`, `sec_uid`, `avatar_thumb`, `region`, `follower_count`, etc. |
| `reply_id` | string | ID do comentário-pai (`"0"` se for comentário de topo). |
| `reply_comment` | array \| null | Respostas embutidas (mesmos campos de comentário); `null` quando não há. |
| `reply_comment_total` | integer | Total de respostas ao comentário. |
| `label_text` / `label_list` | string / array | Rótulo (ex.: `"Creator"` quando o autor do vídeo responde). |
| `comment_language` | string | Idioma detectado do comentário (ex.: `en`). |
| `is_high_purchase_intent` | boolean | Sinal de intenção de compra detectado pelo TikTok. |

> A página mostra dezenas de outros campos por comentário/usuário (objeto bruto do TikTok). Acima estão os úteis; inspecione um retorno real para os demais.

### Exemplo de resposta
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "status_code": 0,
    "comments": [
      {
        "cid": "7571269780301513502",
        "text": "My anxiety",
        "aweme_id": "7560802497552567582",
        "create_time": 1762823639,
        "digg_count": 0,
        "status": 1,
        "user": {
          "uid": "7324932749109888042",
          "nickname": "Lynzee",
          "unique_id": "lynzee539",
          "region": "US",
          "sec_uid": "MS4wLjABAAAAudeAhq4so7UHKT1H6bS484pynD2Quy6zWMotOFXZiD-3_9CNXG9lhkpADy0SuAjB"
        },
        "reply_id": "0",
        "reply_comment": [
          {
            "cid": "7571283919682585375",
            "text": "Haha sorry about that. But atleast it works! ☺️",
            "create_time": 1762826944,
            "label_text": "Creator",
            "label_list": [{ "type": 1, "text": "Creator" }]
          }
        ],
        "reply_comment_total": 1,
        "comment_language": "en",
        "is_high_purchase_intent": false
      }
    ],
    "cursor": 1,
    "has_more": 1,
    "reply_style": 2,
    "total": 7102,
    "extra": { "now": 1762917047000, "fatal_item_ids": null, "api_debug_info": null },
    "log_pb": { "impr_id": "202511120310475A0766D788E9F89C583A" },
    "has_filtered_comments": 0,
    "alias_comment_deleted": false,
    "status_msg": ""
  },
  "requestId": "aac551b2-7a94-4cef-aa23-a6463c64643a"
}
```
> (Resposta resumida — o `user` de cada comentário traz dezenas de campos brutos do TikTok.)

## Notas & gotchas
- `data` é o **objeto bruto de comentários do TikTok**, não normalizado. `comments[].user` é o objeto de usuário completo do TikTok.
- Paginação por **cursor**: leia `has_more` e reenvie `cursor` em `offset`; `offset` e `count` são **string**.
- `cid` é o `comment_id` que se passa ao endpoint de respostas de comentário.
- `create_time` aqui é **integer** (segundos), não string como nos endpoints offline.
- URLs de avatar (`avatar_thumb.url_list`) trazem assinatura `x-expires`/`x-signature` e **expiram**.
- `code=500` = risk control → retry com backoff. Sem QPS alto.

## Relevância para o TIKSPY
- Análise de sentimento e feedback do público sobre um criativo em alta (o que funciona, objeções comuns).
- Fornece os `comment_id` usados pelo endpoint de respostas para explorar threads completos.

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
  /api/v3/realtime/video/comments:
    get:
      summary: Video-related comment list - Real-time interface
      deprecated: false
      description: >-
        Get the comment list information of this video through video_id


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
        - name: offset
          in: query
          description: When has_more=1, use cursor for the next pagination
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
      x-run-in-apifox: https://app.apifox.com/web/project/7319100/apis/api-375352388-run
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
