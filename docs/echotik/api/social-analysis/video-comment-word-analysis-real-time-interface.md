# Análise de Palavras dos Comentários do Vídeo (Video Comment Word Analysis)

> **Fonte:** opendoc EchoTik (https://opendocs.echotik.live/en/375080030e0) · **`GET /api/v3/realtime/video/comment_keywords_insight`** · **Auth:** Basic · **Tipo:** Tempo-real

## O que faz
Retorna as **palavras-chave em destaque dos comentários** de um vídeo a partir do `video_id` e, para cada palavra-chave, a **lista de comentários** que a contêm (texto, autor, data, curtidas). Serve para entender *o que* a audiência fala num vídeo — dúvidas recorrentes ("anti tumpah?"), objeções, menções a produto — e analisar por que um criativo bombou. É **Tempo-real**: a EchoTik busca direto no TikTok no momento da chamada; sujeito a risk control: se vier `code=500`, faça retry. Evite QPS alto.

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
curl -s "https://open.echotik.live/api/v3/realtime/video/comment_keywords_insight?video_id=7561644792577363221" \
  -H "Authorization: Basic $TOKEN"
```

## Response

Envelope: `{ code, message, data, requestId }` — `code = 0` (HTTP 200) = sucesso. `code=500` = risk control → retry.

### Campos de `data`
| Campo | Tipo | O que é |
|---|---|---|
| `key_words` | array | Lista de palavras-chave em destaque nos comentários do vídeo. |
| `key_words[].key_word` | string | A palavra-chave/termo (ex: `anti tumpah`). |
| `key_words[].comments` | array | Comentários do vídeo que contêm essa palavra-chave. |
| `key_words[].comments[].cid` | string | ID do comentário. |
| `key_words[].comments[].text` | string | Texto do comentário. |
| `key_words[].comments[].digg_count` | inteiro | Curtidas no comentário. |
| `key_words[].comments[].create_date` | inteiro | Data do comentário (epoch segundos). |
| `key_words[].comments[].comment_type` | inteiro | Tipo do comentário (`0` = comum). |
| `key_words[].comments[].channel_id` | inteiro | ID do canal/contexto do comentário (`0` normalmente). |
| `key_words[].comments[].comment_author` | objeto | Autor do comentário: `uid`, `nick_name`, `cover` (`url_list` com avatares). |

### Exemplo de resposta
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "key_words": [
      {
        "key_word": "anti tumpah",
        "comments": [
          {
            "channel_id": 0,
            "cid": "7562169780528513810",
            "comment_author": {
              "cover": { "url_list": ["https://p16-common-sign.tiktokcdn-us.com/tos-alisg-avt-0068/...COMMENT_LIST...q70.webp?..."] },
              "nick_name": "🏡 baca_naufal",
              "uid": "7418911958814557185"
            },
            "comment_type": 0,
            "create_date": 1760704866,
            "digg_count": 9,
            "text": "anti tumpah ngk kak?"
          },
          {
            "channel_id": 0,
            "cid": "7562084536864391944",
            "comment_author": {
              "cover": { "url_list": ["https://p16-common-sign.tiktokcdn-us.com/tos-alisg-avt-0068/...COMMENT_LIST...q70.webp?..."] },
              "nick_name": "azalea  Wulandari",
              "uid": "7317401443371271174"
            },
            "comment_type": 0,
            "create_date": 1760685018,
            "digg_count": 1,
            "text": "saya udah punya ini, puas banget,bagus🥰\nbahan stainless nya tebaL,udah saya pakai untuk lauk, pudding anti tumpah juga inii🥰"
          }
        ]
      }
    ]
  },
  "requestId": "9af33d69-49f3-43c7-830e-74328f965023"
}
```

## Notas & gotchas
- Tempo-real: `code=500` → retry; sem QPS alto.
- A estrutura é "termo → comentários": cada `key_word` agrupa os comentários onde ele aparece (não há contagem agregada explícita; o tamanho de `comments` aproxima a frequência).
- `create_date` em epoch **segundos**. IDs (`cid`, `uid`, `video_id`) são int64 em string — trate como string.
- Idioma dos termos depende do público do vídeo (no exemplo, indonésio) — pode exigir normalização antes de virar word cloud.
- URLs de avatar (`comment_author.cover.url_list`) são assinadas e expiram (`x-expires`).

## Relevância para o TIKSPY
- **Enriquecimento de criativo:** responde "por que esse vídeo bombou?" — termos recorrentes revelam gancho, objeções e demanda real.
- Insumo para painel de análise de criativo/comentários na página de detalhe de um vídeo. Recurso de segunda onda, depois do mercado/ranking de produtos.

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
  /api/v3/realtime/video/comment_keywords_insight:
    get:
      summary: Video comment word analysis - Real-time interface
      deprecated: false
      description: >-
        Retrieve the header comment keywords for the video through video_id and
        provide specific comment detail data.

        Real-time data has no field descriptions, and all interfaces return
        native TikTok content.


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
      x-run-in-apifox: https://app.apifox.com/web/project/7319100/apis/api-375080030-run
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
