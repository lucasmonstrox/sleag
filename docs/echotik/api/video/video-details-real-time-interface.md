# Video Details - Real-time Interface

> **Fonte:** opendoc EchoTik (https://opendocs.echotik.live/en/375104192e0) · **`GET /api/v3/realtime/video/detail`** · **Auth:** Basic · **Tipo:** Tempo-real

## O que faz
Busca os detalhes de um vídeo **ao vivo** no TikTok a partir do `video_id`, sem depender da biblioteca offline da EchoTik. Use quando o vídeo não está na base offline (cobertura parcial) ou quando você precisa do estado mais recente em vez do snapshot T+1. Por ser real-time, a chamada vai ao TikTok no momento e está sujeita a **risk control**: se vier `code=500`, **repita a requisição (retry)**. Não dispare com QPS alto.

## Request

### Headers
| Header | Obrigatório | Valor |
|---|---|---|
| `Authorization` | Sim | `Basic base64(username:password)` |

### Query params
| Param | Tipo | Obrigatório | O que faz |
|---|---|---|---|
| `video_id` | string | Sim | ID do vídeo no TikTok a detalhar em tempo real (ex.: `7560175324038728973`). |

### Exemplo de chamada
```bash
curl -s "https://open.echotik.live/api/v3/realtime/video/detail?video_id=7560175324038728973" \
  -H "Authorization: Basic $TOKEN"
```

## Response

Envelope real: `{ msg, code, data }` (diferente dos endpoints offline — aqui é `msg`/`code`, sem `message`/`requestId`). `code = 0` = sucesso; `code = 500` = bloqueio de risk control → **retry**.

### Campos de `data`
A página declara o schema da resposta apenas como `object` (sem lista de propriedades). Pelo **Example**, `data` contém um único objeto `aweme_detail` — o payload bruto do vídeo (aweme) do TikTok, não o formato normalizado da EchoTik. Estrutura observada no Example:

| Campo | Tipo | O que é |
|---|---|---|
| `data.aweme_detail` | object | Objeto bruto de detalhe do vídeo do TikTok (aweme). |
| `aweme_detail.ad_aweme_source` | integer | Origem/flag de anúncio do aweme. |
| `aweme_detail.added_sound_music_info` | object | Música/áudio associado: `album`, `author`, `audition_duration`, `artists[]`, `binded_challenge_id`, `can_be_stitched`, `commercial_right_type`, e imagens (`avatar_medium`, `avatar_thumb`, `cover_large`, `cover_medium`, `cover_thumb`) — cada imagem é `{ data_size, height, width, uri, url_list[], url_prefix }`. |

> O Example é muito grande e vem **truncado** na página renderizada; a estrutura segue o schema oficial do objeto `aweme` do TikTok (centenas de campos aninhados: autor, estatísticas, vídeo/playAddr, música, produtos, etc.). Inspecione um retorno real para mapear os campos exatos que o TIKSPY precisa.

### Exemplo de resposta
```json
{
  "msg": "success",
  "code": 0,
  "data": {
    "aweme_detail": {
      "ad_aweme_source": 1,
      "added_sound_music_info": {
        "album": "",
        "allow_offline_music_to_detail_page": false,
        "artists": [],
        "audition_duration": 10,
        "author": "The Simple Life of Cheyenne ❤️",
        "author_deleted": false,
        "author_position": null,
        "avatar_medium": {
          "data_size": 0,
          "height": 720,
          "uri": "tos-maliva-avt-0068/db78a84d1e0965ecd580a097fc977588",
          "url_list": ["https://p16-sign-va.tiktokcdn.com/.../...heic?...&x-expires=1762941600&x-signature=..."],
          "url_prefix": null,
          "width": 720
        },
        "binded_challenge_id": 0,
        "can_be_stitched": true,
        "can_not_reuse": false,
        "collect_stat": 0,
        "commercial_right_type": 2
      }
    }
  }
}
```
> (Resposta truncada — o objeto real continua com `avatar_thumb`, `cover_large/medium/thumb` e centenas de campos do aweme.)

## Notas & gotchas
- Envelope é `{ msg, code, data }` — **não** o `{ code, message, data, requestId }` dos endpoints offline. `data` aninha `aweme_detail`.
- A resposta é o **payload bruto do TikTok** (objeto aweme), não normalizada pela EchoTik; URLs de mídia trazem assinatura `x-expires`/`x-signature` e **expiram**.
- `code=500` = risk control → faça retry com backoff. Não use QPS alto.
- Por ser ao vivo, custa mais/conta diferente na cota do que os endpoints offline.

## Relevância para o TIKSPY
- Fallback quando um `video_id` pesquisado não existe na base offline da EchoTik, garantindo que a página de detalhe do vídeo nunca fique vazia.
- Estado mais fresco que o T+1 para um vídeo específico em foco.

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
  /api/v3/realtime/video/detail:
    get:
      summary: Video Details - Real-time Interface
      deprecated: false
      description: >-
        Retrieve video detail data in real-time via video_id through video


        Note: Real-time interfaces may encounter risk control detection at any
        time. If code=500 is returned, please retry.
      tags:
        - Video
      parameters:
        - name: video_id
          in: query
          description: ''
          required: true
          example: '7560175324038728973'
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
      x-run-in-apifox: https://app.apifox.com/web/project/7319100/apis/api-375104192-run
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
